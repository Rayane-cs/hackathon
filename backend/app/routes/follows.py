from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.follow import Follow
from app.models.user import User

follows_bp = Blueprint('follows', __name__)

@follows_bp.route('/schools', methods=['GET'])
@jwt_required()
def get_followed_schools():
    """Get all schools followed by the current student"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied. Students only.'}), 403
        
        follows = Follow.query.filter_by(student_id=current_user_id).all()
        schools = [follow.school.to_dict() for follow in follows]
        
        return jsonify({
            'schools': schools,
            'count': len(schools)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@follows_bp.route('/school/<int:school_id>', methods=['POST'])
@jwt_required()
def follow_school(school_id):
    """Follow a school"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied. Students only.'}), 403
        
        school = User.query.get(school_id)
        if not school or school.role != 'school':
            return jsonify({'error': 'School not found'}), 404
        
        # Check if already following
        existing_follow = Follow.query.filter_by(
            student_id=current_user_id, 
            school_id=school_id
        ).first()
        
        if existing_follow:
            return jsonify({'error': 'Already following this school'}), 400
        
        follow = Follow(student_id=current_user_id, school_id=school_id)
        db.session.add(follow)
        db.session.commit()
        
        return jsonify({
            'message': 'School followed successfully',
            'follow': follow.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@follows_bp.route('/school/<int:school_id>', methods=['DELETE'])
@jwt_required()
def unfollow_school(school_id):
    """Unfollow a school"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied. Students only.'}), 403
        
        follow = Follow.query.filter_by(
            student_id=current_user_id, 
            school_id=school_id
        ).first()
        
        if not follow:
            return jsonify({'error': 'Not following this school'}), 404
        
        db.session.delete(follow)
        db.session.commit()
        
        return jsonify({'message': 'School unfollowed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@follows_bp.route('/check/<int:school_id>', methods=['GET'])
@jwt_required()
def check_follow_status(school_id):
    """Check if current user is following a school"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied. Students only.'}), 403
        
        follow = Follow.query.filter_by(
            student_id=current_user_id, 
            school_id=school_id
        ).first()
        
        return jsonify({
            'is_following': follow is not None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@follows_bp.route('/schools/all', methods=['GET'])
@jwt_required()
def get_all_schools():
    """Get all schools for students to browse and follow"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Access denied. Students only.'}), 403
        
        schools = User.query.filter_by(role='school').all()
        
        # Get followed school IDs
        followed_schools = Follow.query.filter_by(student_id=current_user_id).all()
        followed_ids = [follow.school_id for follow in followed_schools]
        
        schools_data = []
        for school in schools:
            school_dict = school.to_dict()
            school_dict['is_following'] = school.id in followed_ids
            schools_data.append(school_dict)
        
        return jsonify({
            'schools': schools_data,
            'count': len(schools_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
