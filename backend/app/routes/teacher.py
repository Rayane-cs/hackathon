from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.teacher import Teacher
from app.models.event import Event
from app.models.registration import Registration

teacher_bp = Blueprint('teacher', __name__)

@teacher_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get own teacher profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'teacher':
            return jsonify({'error': 'Only teachers can access this'}), 403
        
        if not user.teacher:
            return jsonify({'error': 'Teacher profile not found'}), 404
        
        return jsonify({'profile': user.teacher.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@teacher_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update teacher profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'teacher':
            return jsonify({'error': 'Only teachers can access this'}), 403
        
        if not user.teacher:
            return jsonify({'error': 'Teacher profile not found'}), 404
        
        data = request.get_json()
        teacher = user.teacher
        
        if 'full_name' in data:
            teacher.full_name = data['full_name']
        if 'bio' in data:
            teacher.bio = data['bio']
        if 'speciality' in data:
            teacher.speciality = data['speciality']
        if 'phone' in data:
            teacher.phone = data['phone']
        
        db.session.commit()
        return jsonify({'profile': teacher.to_dict()}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@teacher_bp.route('/public/<string:teacher_id>', methods=['GET'])
def get_public_profile(teacher_id):
    """Get public teacher profile"""
    try:
        teacher = Teacher.query.get_or_404(teacher_id)
        return jsonify({'profile': teacher.to_dict(public=True)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@teacher_bp.route('/events', methods=['GET'])
@jwt_required()
def get_my_events():
    """Get teacher's events with counts"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'teacher' or not user.teacher:
            return jsonify({'error': 'Unauthorized'}), 403
        
        events = Event.query.filter_by(
            owner_type='teacher',
            owner_id=user.teacher.id
        ).all()
        
        events_data = []
        for event in events:
            event_dict = event.to_dict()
            event_dict['total_students'] = Registration.query.filter_by(
                event_id=event.id
            ).count()
            events_data.append(event_dict)
        
        return jsonify({'events': events_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@teacher_bp.route('/students', methods=['GET'])
@jwt_required()
def get_my_students():
    """Get all students across teacher's events"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'teacher' or not user.teacher:
            return jsonify({'error': 'Unauthorized'}), 403
        
        events = Event.query.filter_by(
            owner_type='teacher',
            owner_id=user.teacher.id
        ).all()
        
        event_ids = [e.id for e in events]
        registrations = Registration.query.filter(
            Registration.event_id.in_(event_ids)
        ).all()
        
        students = {}
        for reg in registrations:
            if reg.student_id not in students:
                students[reg.student_id] = {
                    'student': reg.student.to_dict() if reg.student else None,
                    'events': []
                }
            students[reg.student_id]['events'].append({
                'event_id': reg.event_id,
                'event_title': reg.event.title if reg.event else None,
                'status': reg.status
            })
        
        return jsonify({'students': list(students.values())}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
