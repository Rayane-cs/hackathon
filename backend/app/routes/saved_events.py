from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.saved_event import SavedEvent
from app.models.event import Event
from app.models.user import User

saved_events_bp = Blueprint('saved_events', __name__)

@saved_events_bp.route('/events', methods=['GET'])
@jwt_required()
def get_saved_events():
    """Get all events saved by the current student"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied. Students only.'}), 403
        
        saved_events = SavedEvent.query.filter_by(student_id=current_user_id).all()
        events = [saved_event.event.to_dict() for saved_event in saved_events]
        
        return jsonify({
            'events': events,
            'count': len(events)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@saved_events_bp.route('/event/<int:event_id>', methods=['POST'])
@jwt_required()
def save_event(event_id):
    """Save an event for later"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied. Students only.'}), 403
        
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Check if already saved
        existing_saved = SavedEvent.query.filter_by(
            student_id=current_user_id, 
            event_id=event_id
        ).first()
        
        if existing_saved:
            return jsonify({'error': 'Event already saved'}), 400
        
        saved_event = SavedEvent(student_id=current_user_id, event_id=event_id)
        db.session.add(saved_event)
        db.session.commit()
        
        return jsonify({
            'message': 'Event saved successfully',
            'saved_event': saved_event.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@saved_events_bp.route('/event/<int:event_id>', methods=['DELETE'])
@jwt_required()
def unsave_event(event_id):
    """Remove a saved event"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied. Students only.'}), 403
        
        saved_event = SavedEvent.query.filter_by(
            student_id=current_user_id, 
            event_id=event_id
        ).first()
        
        if not saved_event:
            return jsonify({'error': 'Event not found in saved list'}), 404
        
        db.session.delete(saved_event)
        db.session.commit()
        
        return jsonify({'message': 'Event removed from saved list'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@saved_events_bp.route('/check/<int:event_id>', methods=['GET'])
@jwt_required()
def check_saved_status(event_id):
    """Check if current user has saved an event"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied. Students only.'}), 403
        
        saved_event = SavedEvent.query.filter_by(
            student_id=current_user_id, 
            event_id=event_id
        ).first()
        
        return jsonify({
            'is_saved': saved_event is not None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@saved_events_bp.route('/events/all', methods=['GET'])
@jwt_required()
def get_all_events_with_status():
    """Get all events with saved status for current student"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied. Students only.'}), 403
        
        events = Event.query.all()
        
        # Get saved event IDs
        saved_events = SavedEvent.query.filter_by(student_id=current_user_id).all()
        saved_ids = [saved_event.event_id for saved_event in saved_events]
        
        events_data = []
        for event in events:
            event_dict = event.to_dict()
            event_dict['is_saved'] = event.id in saved_ids
            events_data.append(event_dict)
        
        return jsonify({
            'events': events_data,
            'count': len(events_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
