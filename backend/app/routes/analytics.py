from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.event import Event
from app.models.registration import Registration
from app import db
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/overview', methods=['GET'])
@jwt_required()
def get_overview():
    """Get analytics overview for academy or teacher"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in ['academy', 'teacher']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Get owner info
        from app.routes.events import get_owner_info
        owner_type, owner_id, academy_id = get_owner_info(user)
        
        if not owner_type:
            return jsonify({'error': 'Profile not found'}), 404
        
        # Get events
        events = Event.query.filter_by(owner_type=owner_type, owner_id=owner_id).all()
        event_ids = [e.id for e in events]
        
        # Calculate stats
        total_events = len(events)
        active_events = len([e for e in events if e.status == 'active'])
        
        # Get registrations
        registrations = Registration.query.filter(
            Registration.event_id.in_(event_ids)
        ).all()
        
        total_registrations = len(registrations)
        confirmed_registrations = len([r for r in registrations if r.status == 'confirmed'])
        attended_registrations = len([r for r in registrations if r.status == 'attended'])
        
        # Calculate revenue
        total_revenue = sum([
            float(e.price) * Registration.query.filter_by(event_id=e.id, payment_status='paid').count()
            for e in events
        ])
        
        return jsonify({
            'total_events': total_events,
            'active_events': active_events,
            'total_registrations': total_registrations,
            'confirmed_registrations': confirmed_registrations,
            'attended_registrations': attended_registrations,
            'total_revenue': total_revenue,
            'average_fill_rate': sum([e.registered_count / e.capacity for e in events if e.capacity > 0]) / len(events) if events else 0
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/events-performance', methods=['GET'])
@jwt_required()
def get_events_performance():
    """Get per-event performance stats"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in ['academy', 'teacher']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        from app.routes.events import get_owner_info
        owner_type, owner_id, _ = get_owner_info(user)
        
        if not owner_type:
            return jsonify({'error': 'Profile not found'}), 404
        
        events = Event.query.filter_by(owner_type=owner_type, owner_id=owner_id).all()
        
        performance = []
        for event in events:
            regs = Registration.query.filter_by(event_id=event.id).all()
            performance.append({
                'event_id': event.id,
                'title': event.title,
                'capacity': event.capacity,
                'registered': len(regs),
                'confirmed': len([r for r in regs if r.status == 'confirmed']),
                'attended': len([r for r in regs if r.status == 'attended']),
                'revenue': float(event.price) * len([r for r in regs if r.payment_status == 'paid']),
                'fill_rate': event.registered_count / event.capacity if event.capacity > 0 else 0
            })
        
        return jsonify({'events': performance}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/students-trend', methods=['GET'])
@jwt_required()
def get_students_trend():
    """Get registration trend over time"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in ['academy', 'teacher']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        from app.routes.events import get_owner_info
        owner_type, owner_id, _ = get_owner_info(user)
        
        if not owner_type:
            return jsonify({'error': 'Profile not found'}), 404
        
        events = Event.query.filter_by(owner_type=owner_type, owner_id=owner_id).all()
        event_ids = [e.id for e in events]
        
        # Get last 30 days
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=30)
        
        registrations = Registration.query.filter(
            Registration.event_id.in_(event_ids),
            Registration.registered_at >= start_date
        ).all()
        
        # Group by date
        trend = {}
        for reg in registrations:
            date_key = reg.registered_at.strftime('%Y-%m-%d')
            trend[date_key] = trend.get(date_key, 0) + 1
        
        # Fill missing dates
        current = start_date
        while current <= end_date:
            date_key = current.strftime('%Y-%m-%d')
            if date_key not in trend:
                trend[date_key] = 0
            current += timedelta(days=1)
        
        return jsonify({
            'trend': [{'date': k, 'count': v} for k, v in sorted(trend.items())]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
