from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.event import Event
from app.models.user import User
from datetime import datetime

events_bp = Blueprint('events', __name__)

@events_bp.route('/', methods=['GET'])
def get_events():
    """Get all active events"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '', type=str)
        
        query = Event.query.filter_by(is_active=True)
        
        if search:
            query = query.filter(Event.title.contains(search))
        
        events = query.order_by(Event.date.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'events': [event.to_dict() for event in events.items],
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

@events_bp.route('/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """Get a specific event by ID"""
    try:
        event = Event.query.get_or_404(event_id)
        
        if not event.is_active:
            return jsonify({'error': 'Event not found'}), 404
        
        return jsonify({
            'event': event.to_dict(include_registrations=False)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch event', 'details': str(e)}), 500

@events_bp.route('/', methods=['POST'])
@jwt_required()
def create_event():
    """Create a new event (school only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'school':
            return jsonify({'error': 'Only schools can create events'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'date', 'capacity']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        title = data['title'].strip()
        description = data['description'].strip()
        date_str = data['date']
        capacity = data['capacity']
        location = data.get('location', '').strip()
        
        # Validate capacity
        if not isinstance(capacity, int) or capacity <= 0:
            return jsonify({'error': 'Capacity must be a positive integer'}), 400
        
        # Parse date
        try:
            date = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'}), 400
        
        # Create event
        event = Event(
            title=title,
            description=description,
            date=date,
            capacity=capacity,
            location=location,
            created_by=user_id
        )
        
        db.session.add(event)
        db.session.commit()
        
        return jsonify({
            'message': 'Event created successfully',
            'event': event.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create event', 'details': str(e)}), 500

@events_bp.route('/<int:event_id>', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    """Update an event (creator only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'school':
            return jsonify({'error': 'Only schools can update events'}), 403
        
        event = Event.query.get_or_404(event_id)
        
        if event.created_by != user_id:
            return jsonify({'error': 'You can only update your own events'}), 403
        
        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            event.title = data['title'].strip()
        if 'description' in data:
            event.description = data['description'].strip()
        if 'date' in data:
            try:
                event.date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid date format'}), 400
        if 'capacity' in data:
            if not isinstance(data['capacity'], int) or data['capacity'] <= 0:
                return jsonify({'error': 'Capacity must be a positive integer'}), 400
            event.capacity = data['capacity']
        if 'location' in data:
            event.location = data['location'].strip()
        if 'is_active' in data:
            event.is_active = bool(data['is_active'])
        
        event.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Event updated successfully',
            'event': event.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update event', 'details': str(e)}), 500

@events_bp.route('/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    """Delete an event (creator only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'school':
            return jsonify({'error': 'Only schools can delete events'}), 403
        
        event = Event.query.get_or_404(event_id)
        
        if event.created_by != user_id:
            return jsonify({'error': 'You can only delete your own events'}), 403
        
        # Soft delete by setting is_active to False
        event.is_active = False
        event.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Event deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete event', 'details': str(e)}), 500

@events_bp.route('/school/my-events', methods=['GET'])
@jwt_required()
def get_school_events():
    """Get events created by the current school"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'school':
            return jsonify({'error': 'Only schools can view their events'}), 403
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        events = Event.query.filter_by(created_by=user_id, is_active=True).order_by(
            Event.date.desc()
        ).paginate(page=page, per_page=per_page, error_out=False)
        
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
        return jsonify({'error': 'Failed to fetch school events', 'details': str(e)}), 500
