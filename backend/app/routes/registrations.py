from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.registration import Registration
from app.models.event import Event
from app.models.user import User

registrations_bp = Blueprint('registrations', __name__)

@registrations_bp.route('/event/<int:event_id>/register', methods=['POST'])
@jwt_required()
def register_for_event(event_id):
    """Register a student for an event"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Only students can register for events'}), 403
        
        event = Event.query.get_or_404(event_id)
        
        if not event.is_active:
            return jsonify({'error': 'Event is not active'}), 400
        
        if event.is_full:
            return jsonify({'error': 'Event is full'}), 400
        
        # Check if already registered
        existing_registration = Registration.query.filter_by(
            user_id=user_id, event_id=event_id
        ).first()
        
        if existing_registration:
            return jsonify({'error': 'Already registered for this event'}), 409
        
        # Create registration
        registration = Registration(
            user_id=user_id,
            event_id=event_id,
            status='approved'  # Auto-approve for simplicity
        )
        
        db.session.add(registration)
        db.session.commit()
        
        return jsonify({
            'message': 'Registration successful',
            'registration': registration.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@registrations_bp.route('/event/<int:event_id>/participants', methods=['GET'])
@jwt_required()
def get_event_participants(event_id):
    """Get participants for an event (event creator only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'school':
            return jsonify({'error': 'Only schools can view participants'}), 403
        
        event = Event.query.get_or_404(event_id)
        
        if event.created_by != user_id:
            return jsonify({'error': 'You can only view participants for your own events'}), 403
        
        # Get registrations with status 'approved'
        registrations = Registration.query.filter_by(
            event_id=event_id, status='approved'
        ).all()
        
        return jsonify({
            'event': event.to_dict(),
            'participants': [reg.to_dict() for reg in registrations],
            'total_participants': len(registrations)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch participants', 'details': str(e)}), 500

@registrations_bp.route('/my-registrations', methods=['GET'])
@jwt_required()
def get_my_registrations():
    """Get current user's registrations"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', '', type=str)
        
        query = Registration.query.filter_by(user_id=user_id)
        
        if status:
            query = query.filter_by(status=status)
        
        registrations = query.order_by(Registration.registered_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'registrations': [reg.to_dict() for reg in registrations.items],
            'pagination': {
                'page': registrations.page,
                'pages': registrations.pages,
                'per_page': registrations.per_page,
                'total': registrations.total,
                'has_next': registrations.has_next,
                'has_prev': registrations.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch registrations', 'details': str(e)}), 500

@registrations_bp.route('/<int:registration_id>/cancel', methods=['DELETE'])
@jwt_required()
def cancel_registration(registration_id):
    """Cancel a registration"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        registration = Registration.query.get_or_404(registration_id)
        
        # Students can only cancel their own registrations
        # Schools can only cancel registrations for their events
        if user.role == 'student' and registration.user_id != user_id:
            return jsonify({'error': 'You can only cancel your own registrations'}), 403
        elif user.role == 'school' and registration.event.created_by != user_id:
            return jsonify({'error': 'You can only cancel registrations for your events'}), 403
        
        db.session.delete(registration)
        db.session.commit()
        
        return jsonify({
            'message': 'Registration cancelled successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to cancel registration', 'details': str(e)}), 500

@registrations_bp.route('/<int:registration_id>/approve', methods=['PUT'])
@jwt_required()
def approve_registration(registration_id):
    """Approve a registration (event creator only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'school':
            return jsonify({'error': 'Only schools can approve registrations'}), 403
        
        registration = Registration.query.get_or_404(registration_id)
        event = registration.event
        
        if event.created_by != user_id:
            return jsonify({'error': 'You can only approve registrations for your events'}), 403
        
        if event.is_full:
            return jsonify({'error': 'Cannot approve: event is full'}), 400
        
        registration.approve()
        db.session.commit()
        
        return jsonify({
            'message': 'Registration approved successfully',
            'registration': registration.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to approve registration', 'details': str(e)}), 500

@registrations_bp.route('/<int:registration_id>/reject', methods=['PUT'])
@jwt_required()
def reject_registration(registration_id):
    """Reject a registration (event creator only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'school':
            return jsonify({'error': 'Only schools can reject registrations'}), 403
        
        registration = Registration.query.get_or_404(registration_id)
        event = registration.event
        
        if event.created_by != user_id:
            return jsonify({'error': 'You can only reject registrations for your events'}), 403
        
        data = request.get_json()
        notes = data.get('notes', '') if data else ''
        
        registration.reject(notes)
        db.session.commit()
        
        return jsonify({
            'message': 'Registration rejected successfully',
            'registration': registration.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to reject registration', 'details': str(e)}), 500

@registrations_bp.route('/school/registrations', methods=['GET'])
@jwt_required()
def get_school_registrations():
    """Get all registrations for all events created by the current school"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'school':
            return jsonify({'error': 'Only schools can view their registrations'}), 403
        
        # Get all events created by this school
        school_events = Event.query.filter_by(created_by=user_id).all()
        event_ids = [event.id for event in school_events]
        
        # Get all registrations for these events
        registrations = Registration.query.filter(
            Registration.event_id.in_(event_ids)
        ).order_by(Registration.created_at.desc()).all()
        
        registrations_data = []
        for reg in registrations:
            reg_dict = reg.to_dict()
            # Add student and event details
            student = User.query.get(reg.user_id)
            event = Event.query.get(reg.event_id)
            reg_dict['student_name'] = student.name if student else 'Unknown'
            reg_dict['student_email'] = student.email if student else 'Unknown'
            reg_dict['event_title'] = event.title if event else 'Unknown'
            registrations_data.append(reg_dict)
        
        return jsonify({
            'registrations': registrations_data,
            'count': len(registrations_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
