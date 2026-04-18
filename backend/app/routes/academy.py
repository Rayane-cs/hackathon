from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.academy import Academy
from app.models.teacher import Teacher
from app.models.event import Event

academy_bp = Blueprint('academy', __name__)

@academy_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get academy profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'academy':
            return jsonify({'error': 'Only academies can access this'}), 403
        
        if not user.academy:
            return jsonify({'error': 'Academy profile not found'}), 404
        
        return jsonify({'profile': user.academy.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@academy_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update academy profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'academy':
            return jsonify({'error': 'Only academies can access this'}), 403
        
        if not user.academy:
            return jsonify({'error': 'Academy profile not found'}), 404
        
        data = request.get_json()
        academy = user.academy
        
        if 'name' in data:
            academy.name = data['name']
        if 'description' in data:
            academy.description = data['description']
        if 'phone' in data:
            academy.phone = data['phone']
        if 'address' in data:
            academy.address = data['address']
        if 'city' in data:
            academy.city = data['city']
        if 'logo_base64' in data:
            academy.logo_base64 = data['logo_base64']
        
        db.session.commit()
        return jsonify({'profile': academy.to_dict()}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@academy_bp.route('/teachers', methods=['GET'])
@jwt_required()
def get_teachers():
    """Get linked teachers"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'academy' or not user.academy:
            return jsonify({'error': 'Unauthorized'}), 403
        
        teachers = Teacher.query.filter_by(academy_id=user.academy.id).all()
        return jsonify({'teachers': [t.to_dict() for t in teachers]}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@academy_bp.route('/teachers/invite', methods=['POST'])
@jwt_required()
def invite_teacher():
    """Invite teacher by email"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'academy' or not user.academy:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        # TODO: Send invitation email
        # For now, just return success
        return jsonify({'message': 'Invitation sent'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@academy_bp.route('/teachers/<string:teacher_id>', methods=['DELETE'])
@jwt_required()
def remove_teacher(teacher_id):
    """Remove teacher link"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'academy' or not user.academy:
            return jsonify({'error': 'Unauthorized'}), 403
        
        teacher = Teacher.query.get_or_404(teacher_id)
        
        if teacher.academy_id != user.academy.id:
            return jsonify({'error': 'Teacher not linked to this academy'}), 403
        
        teacher.academy_id = None
        db.session.commit()
        
        return jsonify({'message': 'Teacher removed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
