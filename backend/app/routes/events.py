from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db, socketio
from app.models.event import Event
from app.models.user import User
from app.models.academy import Academy
from app.models.teacher import Teacher
from datetime import datetime
import json

events_bp = Blueprint('events', __name__)

def get_owner_info(user):
    """Get owner type and ID based on user role"""
    if user.role == 'academy' and user.academy:
        return 'academy', user.academy.id, user.academy.id
    elif user.role == 'teacher' and user.teacher:
        # Teacher events belong to their academy if linked, otherwise no academy
        academy_id = user.teacher.academy_id if user.teacher.academy_id else None
        return 'teacher', user.teacher.id, academy_id
    return None, None, None

@events_bp.route('/', methods=['GET'])
def get_events():
    """Get all active events with filtering"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 12, type=int)
        
        # Filters
        event_type = request.args.get('type', type=str)
        subject = request.args.get('subject', type=str)
        level = request.args.get('level', type=str)
        city = request.args.get('city', type=str)
        search = request.args.get('search', type=str)
        
        # Base query - only active events
        query = Event.query.filter_by(status='active')
        
        # Apply filters
        if event_type:
            query = query.filter(Event.type == event_type)
        if subject:
            query = query.filter(Event.subject.ilike(f'%{subject}%'))
        if level:
            query = query.filter(Event.level.ilike(f'%{level}%'))
        if city:
            query = query.join(Academy).filter(Academy.city.ilike(f'%{city}%'))
        if search:
            query = query.filter(
                db.or_(
                    Event.title.ilike(f'%{search}%'),
                    Event.description.ilike(f'%{search}%')
                )
            )
        
        # Order by featured first, then by date
        events = query.order_by(Event.is_featured.desc(), Event.start_datetime.asc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'events': [event.to_dict(include_academy=True) for event in events.items],
            'pagination': {
                'page': events.page,
                'pages': events.pages,
                'per_page': events.per_page,
                'total': events.total,
                'has_next': events.has_next,
                'has_prev': events.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch events', 'details': str(e)}), 500

@events_bp.route('/<string:event_id>', methods=['GET'])
def get_event(event_id):
    """Get a specific event by ID with full details"""
    try:
        event = Event.query.get_or_404(event_id)
        
        if event.status not in ['active', 'completed']:
            return jsonify({'error': 'Event not found'}), 404
        
        return jsonify({
            'event': event.to_dict(include_academy=True)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch event', 'details': str(e)}), 500

@events_bp.route('/', methods=['POST'])
@jwt_required()
def create_event():
    """Create a new event (academy or teacher)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in ['academy', 'teacher']:
            return jsonify({'error': 'Only academies and teachers can create events'}), 403
        
        # Check subscription for academies
        if user.role == 'academy' and user.academy:
            from app.models.subscription import Subscription
            subscription = Subscription.query.filter_by(academy_id=user.academy.id).first()
            if not subscription or not subscription.is_active_now():
                return jsonify({'error': 'Active subscription required to create events'}), 403
            
            # Check plan limits for starter
            if subscription.plan == 'starter':
                active_events_count = Event.query.filter_by(
                    academy_id=user.academy.id,
                    status='active'
                ).count()
                if active_events_count >= 5:
                    return jsonify({'error': 'Starter plan limit: maximum 5 active events'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'type', 'start_datetime', 'capacity']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Get owner info
        owner_type, owner_id, academy_id = get_owner_info(user)
        if not owner_type:
            return jsonify({'error': 'Invalid user role or profile not found'}), 400
        
        # For teachers, academy_id is required
        if owner_type == 'teacher' and not academy_id:
            return jsonify({'error': 'Teacher must be linked to an academy to create events'}), 400
        
        # Parse datetime
        try:
            start_datetime = datetime.fromisoformat(data['start_datetime'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid start_datetime format. Use ISO format'}), 400
        
        # Parse end datetime if provided
        end_datetime = None
        if data.get('end_datetime'):
            try:
                end_datetime = datetime.fromisoformat(data['end_datetime'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid end_datetime format'}), 400
        
        # Parse registration deadline
        registration_deadline = None
        if data.get('registration_deadline'):
            try:
                registration_deadline = datetime.fromisoformat(data['registration_deadline'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid registration_deadline format'}), 400
        
        # Handle teacher assignment for academy events
        teacher_id = data.get('teacher_id')
        teacher_name = data.get('teacher_name')
        
        # If teacher is creating, auto-link to themselves
        if owner_type == 'teacher':
            teacher_id = owner_id
            teacher_name = None
        
        # Create event
        event = Event(
            owner_type=owner_type,
            owner_id=owner_id,
            academy_id=academy_id,
            teacher_id=teacher_id,
            teacher_name=teacher_name,
            title=data['title'].strip(),
            description=data.get('description', '').strip(),
            type=data['type'],
            subject=data.get('subject'),
            level=data.get('level'),
            start_datetime=start_datetime,
            end_datetime=end_datetime,
            recurrence=data.get('recurrence', 'none'),
            recurrence_days=json.dumps(data.get('recurrence_days')) if data.get('recurrence_days') else None,
            sessions_count=data.get('sessions_count', 1),
            capacity=int(data['capacity']),
            registration_deadline=registration_deadline,
            banner_base64=data.get('banner_base64'),
            location=data.get('location'),
            is_online=data.get('is_online', False),
            meeting_link=data.get('meeting_link'),
            price=data.get('price', 0),
            status=data.get('status', 'draft')
        )
        
        db.session.add(event)
        db.session.commit()
        
        return jsonify({
            'message': 'Event created successfully',
            'event': event.to_dict(include_academy=True)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create event', 'details': str(e)}), 500

@events_bp.route('/<string:event_id>', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    """Update an event (owner only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in ['academy', 'teacher']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        event = Event.query.get_or_404(event_id)
        
        # Check ownership
        owner_type, owner_id, _ = get_owner_info(user)
        if event.owner_type != owner_type or event.owner_id != owner_id:
            return jsonify({'error': 'You can only update your own events'}), 403
        
        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            event.title = data['title'].strip()
        if 'description' in data:
            event.description = data['description'].strip()
        if 'type' in data:
            event.type = data['type']
        if 'subject' in data:
            event.subject = data['subject']
        if 'level' in data:
            event.level = data['level']
        if 'start_datetime' in data:
            try:
                event.start_datetime = datetime.fromisoformat(data['start_datetime'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid start_datetime format'}), 400
        if 'end_datetime' in data:
            try:
                event.end_datetime = datetime.fromisoformat(data['end_datetime'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid end_datetime format'}), 400
        if 'capacity' in data:
            capacity = int(data['capacity'])
            if capacity <= 0:
                return jsonify({'error': 'Capacity must be positive'}), 400
            event.capacity = capacity
        if 'price' in data:
            event.price = data['price']
        if 'location' in data:
            event.location = data['location']
        if 'is_online' in data:
            event.is_online = data['is_online']
        if 'meeting_link' in data:
            event.meeting_link = data['meeting_link']
        if 'status' in data:
            event.status = data['status']
        if 'is_featured' in data and user.role == 'academy':
            event.is_featured = data['is_featured']
        
        # Academy can update teacher assignment
        if user.role == 'academy':
            if 'teacher_id' in data:
                event.teacher_id = data['teacher_id']
            if 'teacher_name' in data:
                event.teacher_name = data['teacher_name']
        
        event.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Emit status change via SocketIO
        socketio.emit('event_status_change', {
            'event_id': event.id,
            'status': event.status
        }, room=f'event_{event.id}')
        
        return jsonify({
            'message': 'Event updated successfully',
            'event': event.to_dict(include_academy=True)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update event', 'details': str(e)}), 500

@events_bp.route('/<string:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    """Cancel an event (owner only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in ['academy', 'teacher']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        event = Event.query.get_or_404(event_id)
        
        # Check ownership
        owner_type, owner_id, _ = get_owner_info(user)
        if event.owner_type != owner_type or event.owner_id != owner_id:
            return jsonify({'error': 'You can only cancel your own events'}), 403
        
        # Soft delete by setting status to cancelled
        event.status = 'cancelled'
        event.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Notify registered students via SocketIO
        socketio.emit('event_status_change', {
            'event_id': event.id,
            'status': 'cancelled'
        }, room=f'event_{event.id}')
        
        return jsonify({
            'message': 'Event cancelled successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to cancel event', 'details': str(e)}), 500

@events_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_events():
    """Get events owned by current user (academy or teacher)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in ['academy', 'teacher']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', type=str)
        
        # Get owner info
        owner_type, owner_id, _ = get_owner_info(user)
        if not owner_type:
            return jsonify({'error': 'Profile not found'}), 404
        
        query = Event.query.filter_by(owner_type=owner_type, owner_id=owner_id)
        
        if status:
            query = query.filter_by(status=status)
        
        events = query.order_by(Event.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'events': [event.to_dict(include_registrations=True) for event in events.items],
            'pagination': {
                'page': events.page,
                'pages': events.pages,
                'per_page': events.per_page,
                'total': events.total,
                'has_next': events.has_next,
                'has_prev': events.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch events', 'details': str(e)}), 500

@events_bp.route('/<string:event_id>/registrations', methods=['GET'])
@jwt_required()
def get_event_registrations(event_id):
    """Get registered students for an event (owner only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in ['academy', 'teacher']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        event = Event.query.get_or_404(event_id)
        
        # Check ownership
        owner_type, owner_id, _ = get_owner_info(user)
        if event.owner_type != owner_type or event.owner_id != owner_id:
            return jsonify({'error': 'You can only view your own event registrations'}), 403
        
        from app.models.registration import Registration
        registrations = Registration.query.filter_by(event_id=event_id).all()
        
        return jsonify({
            'registrations': [reg.to_dict(include_student=True) for reg in registrations]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch registrations', 'details': str(e)}), 500

@events_bp.route('/<string:event_id>/feature', methods=['PATCH'])
@jwt_required()
def toggle_featured(event_id):
    """Toggle featured status (academy only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'academy':
            return jsonify({'error': 'Only academies can feature events'}), 403
        
        event = Event.query.get_or_404(event_id)
        
        # Check ownership
        if event.academy_id != user.academy.id:
            return jsonify({'error': 'You can only feature your own events'}), 403
        
        data = request.get_json()
        event.is_featured = data.get('is_featured', not event.is_featured)
        db.session.commit()
        
        return jsonify({
            'message': f"Event {'featured' if event.is_featured else 'unfeatured'} successfully",
            'is_featured': event.is_featured
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update event', 'details': str(e)}), 500
