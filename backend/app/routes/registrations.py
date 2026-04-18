from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db, socketio
from app.models.registration import Registration
from app.models.event import Event
from app.models.user import User
from app.models.student import Student
from datetime import datetime

registrations_bp = Blueprint('registrations', __name__)

@registrations_bp.route('/', methods=['POST'])
@jwt_required()
def create_registration():
    """Student registers for an event"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Only students can register for events'}), 403
        
        if not user.student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        data = request.get_json()
        event_id = data.get('event_id')
        
        if not event_id:
            return jsonify({'error': 'event_id is required'}), 400
        
        event = Event.query.get_or_404(event_id)
        
        # Check event status
        if event.status != 'active':
            return jsonify({'error': 'Event is not active'}), 400
        
        # Check registration deadline
        if event.registration_deadline and event.registration_deadline < datetime.utcnow():
            return jsonify({'error': 'Registration deadline has passed'}), 400
        
        # Check if event is full
        if event.is_full:
            return jsonify({'error': 'Event is full'}), 400
        
        # Check if already registered
        existing = Registration.query.filter_by(
            event_id=event_id,
            student_id=user.student.id
        ).first()
        
        if existing:
            return jsonify({'error': 'Already registered for this event'}), 409
        
        # Determine payment status
        payment_status = 'unpaid' if float(event.price) > 0 else 'paid'
        
        # Create registration
        registration = Registration(
            event_id=event_id,
            student_id=user.student.id,
            status='pending' if float(event.price) > 0 else 'confirmed',
            payment_status=payment_status
        )
        
        db.session.add(registration)
        
        # Update event registered count
        event.update_registered_count()
        
        db.session.commit()
        
        # Emit real-time update
        socketio.emit('seat_update', {
            'event_id': event.id,
            'registered_count': event.registered_count,
            'available_spots': event.available_spots,
            'is_full': event.is_full
        }, room=f'event_{event.id}')
        
        return jsonify({
            'message': 'Registration successful',
            'registration': registration.to_dict(include_event=True),
            'payment_required': float(event.price) > 0
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@registrations_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_registrations():
    """Get student's registrations"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Only students can view their registrations'}), 403
        
        if not user.student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', type=str)
        
        query = Registration.query.filter_by(student_id=user.student.id)
        
        if status:
            query = query.filter_by(status=status)
        
        registrations = query.order_by(Registration.registered_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'registrations': [reg.to_dict(include_event=True) for reg in registrations.items],
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

@registrations_bp.route('/<string:registration_id>', methods=['DELETE'])
@jwt_required()
def cancel_registration(registration_id):
    """Student cancels their registration"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Only students can cancel registrations'}), 403
        
        if not user.student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        registration = Registration.query.get_or_404(registration_id)
        
        # Verify ownership
        if registration.student_id != user.student.id:
            return jsonify({'error': 'You can only cancel your own registrations'}), 403
        
        # Get event for update
        event = registration.event
        
        # Cancel registration
        registration.cancel()
        
        # Update event count
        event.update_registered_count()
        db.session.commit()
        
        # Emit real-time update
        socketio.emit('seat_update', {
            'event_id': event.id,
            'registered_count': event.registered_count,
            'available_spots': event.available_spots,
            'is_full': event.is_full
        }, room=f'event_{event.id}')
        
        return jsonify({'message': 'Registration cancelled successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to cancel registration', 'details': str(e)}), 500

@registrations_bp.route('/<string:registration_id>/status', methods=['PATCH'])
@jwt_required()
def update_registration_status(registration_id):
    """Update registration status (academy/teacher: confirm/attended, student: cancel)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        registration = Registration.query.get_or_404(registration_id)
        event = registration.event
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({'error': 'status is required'}), 400
        
        # Students can only cancel
        if user.role == 'student':
            if not user.student or registration.student_id != user.student.id:
                return jsonify({'error': 'Unauthorized'}), 403
            if new_status != 'cancelled':
                return jsonify({'error': 'Students can only cancel registrations'}), 403
            registration.cancel()
        
        # Academy/Teacher can confirm or mark attended
        elif user.role in ['academy', 'teacher']:
            from app.routes.events import get_owner_info
            owner_type, owner_id, _ = get_owner_info(user)
            
            if event.owner_type != owner_type or event.owner_id != owner_id:
                return jsonify({'error': 'You can only manage registrations for your events'}), 403
            
            if new_status == 'confirmed':
                registration.confirm()
            elif new_status == 'attended':
                registration.mark_attended()
            else:
                return jsonify({'error': 'Invalid status for this operation'}), 400
        
        else:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Update event count
        event.update_registered_count()
        db.session.commit()
        
        # Emit real-time update
        socketio.emit('seat_update', {
            'event_id': event.id,
            'registered_count': event.registered_count,
            'available_spots': event.available_spots,
            'is_full': event.is_full
        }, room=f'event_{event.id}')
        
        return jsonify({
            'message': 'Registration status updated',
            'registration': registration.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update registration', 'details': str(e)}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
