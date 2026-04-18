from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db, socketio
from app.models.user import User
from app.models.notification import Notification
from datetime import datetime

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get user's notifications"""
    try:
        user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        
        query = Notification.query.filter_by(user_id=user_id)
        
        if unread_only:
            query = query.filter_by(is_read=False)
        
        notifications = query.order_by(Notification.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'notifications': [n.to_dict() for n in notifications.items],
            'unread_count': Notification.query.filter_by(user_id=user_id, is_read=False).count(),
            'pagination': {
                'page': notifications.page,
                'pages': notifications.pages,
                'per_page': notifications.per_page,
                'total': notifications.total
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/<string:notification_id>/read', methods=['PATCH'])
@jwt_required()
def mark_read(notification_id):
    """Mark notification as read"""
    try:
        user_id = get_jwt_identity()
        notification = Notification.query.get_or_404(notification_id)
        
        if notification.user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        notification.mark_read()
        db.session.commit()
        
        return jsonify({'message': 'Notification marked as read'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/read-all', methods=['PATCH'])
@jwt_required()
def mark_all_read():
    """Mark all notifications as read"""
    try:
        user_id = get_jwt_identity()
        
        Notification.query.filter_by(user_id=user_id, is_read=False).update({'is_read': True})
        db.session.commit()
        
        return jsonify({'message': 'All notifications marked as read'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def create_notification(user_id, title, body, notification_type):
    """Helper function to create notification"""
    notification = Notification(
        user_id=user_id,
        title=title,
        body=body,
        type=notification_type
    )
    db.session.add(notification)
    db.session.commit()
    
    # Emit real-time notification
    socketio.emit('new_notification', notification.to_dict(), room=f'user_{user_id}')
    
    return notification
