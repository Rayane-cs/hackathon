from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.subscription import Subscription
from datetime import datetime, timedelta

subscriptions_bp = Blueprint('subscriptions', __name__)

PLANS = {
    'starter': {'price': 3000, 'max_events': 5},
    'pro': {'price': 7000, 'max_events': float('inf')}
}

@subscriptions_bp.route('/plans', methods=['GET'])
def get_plans():
    """Get available subscription plans"""
    return jsonify({
        'plans': [
            {
                'id': 'starter',
                'name': 'Starter',
                'price_da': 3000,
                'price_per_month': 3000,
                'features': ['Up to 5 active events', 'Basic analytics', 'Email support']
            },
            {
                'id': 'pro',
                'name': 'Pro',
                'price_da': 7000,
                'price_per_month': 7000,
                'features': ['Unlimited events', 'Advanced analytics', 'AI features', 'Certificate generation', 'Priority support']
            }
        ]
    }), 200

@subscriptions_bp.route('/checkout', methods=['POST'])
@jwt_required()
def create_checkout():
    """Initiate Chargily payment"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'academy':
            return jsonify({'error': 'Only academies can subscribe'}), 403
        
        if not user.academy:
            return jsonify({'error': 'Academy profile not found'}), 404
        
        data = request.get_json()
        plan = data.get('plan')
        
        if plan not in PLANS:
            return jsonify({'error': 'Invalid plan'}), 400
        
        # TODO: Integrate with Chargily API
        # For now, return mock checkout URL
        
        return jsonify({
            'checkout_url': f'https://pay.chargily.dz/checkout/{plan}_{user.academy.id}',
            'plan': plan,
            'amount': PLANS[plan]['price']
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscriptions_bp.route('/webhook', methods=['POST'])
def chargily_webhook():
    """Handle Chargily payment webhook"""
    try:
        # TODO: Verify Chargily signature
        data = request.get_json()
        
        # TODO: Process payment and activate subscription
        
        return jsonify({'status': 'received'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscriptions_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_subscription():
    """Get current subscription status"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'academy':
            return jsonify({'error': 'Only academies can have subscriptions'}), 403
        
        if not user.academy:
            return jsonify({'error': 'Academy profile not found'}), 404
        
        subscription = Subscription.query.filter_by(academy_id=user.academy.id).first()
        
        if not subscription:
            return jsonify({'subscription': None}), 200
        
        return jsonify({'subscription': subscription.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
