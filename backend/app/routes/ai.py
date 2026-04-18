from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.event import Event
from app.models.registration import Registration
from app.models.chat_message import ChatMessage
from app import db
from datetime import datetime

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    """AI-powered event recommendations for student"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Only students can get recommendations'}), 403
        
        if not user.student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        # Get student's registration history
        registrations = Registration.query.filter_by(
            student_id=user.student.id
        ).all()
        
        # Extract subjects and levels from past registrations
        subjects = set()
        levels = set()
        
        for reg in registrations:
            if reg.event:
                if reg.event.subject:
                    subjects.add(reg.event.subject)
                if reg.event.level:
                    levels.add(reg.event.level)
        
        # Query upcoming events
        events = Event.query.filter(
            Event.status == 'active',
            Event.start_datetime > datetime.utcnow()
        ).all()
        
        # Simple recommendation algorithm
        recommendations = []
        for event in events:
            score = 0
            reasons = []
            
            # Check if already registered
            already_registered = any(r.event_id == event.id for r in registrations)
            if already_registered:
                continue
            
            # Match by subject
            if event.subject in subjects:
                score += 3
                reasons.append(f"Matches your interest in {event.subject}")
            
            # Match by level
            if event.level in levels:
                score += 2
                reasons.append(f"Suitable for {event.level} level")
            
            # Match by location (wilaya)
            if user.student.wilaya and event.academy and event.academy.city:
                if user.student.wilaya.lower() in event.academy.city.lower():
                    score += 2
                    reasons.append("Near your location")
            
            # Boost featured events
            if event.is_featured:
                score += 1
                reasons.append("Featured event")
            
            if score > 0:
                recommendations.append({
                    'event': event.to_dict(include_academy=True),
                    'score': score,
                    'reasons': reasons
                })
        
        # Sort by score
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        
        return jsonify({
            'recommendations': recommendations[:10]  # Top 10
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_bp.route('/chatbot', methods=['POST'])
@jwt_required()
def chatbot():
    """AI chatbot for event discovery and help"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        data = request.get_json()
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Store user message
        chat_message = ChatMessage(user_id=user_id, role='user', content=message)
        db.session.add(chat_message)
        db.session.commit()
        
        # Simple rule-based responses (replace with actual AI integration)
        response = generate_chatbot_response(message, user)
        
        # Store bot response
        bot_message = ChatMessage(user_id=user_id, role='assistant', content=response)
        db.session.add(bot_message)
        db.session.commit()
        
        return jsonify({
            'response': response
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def generate_chatbot_response(message, user):
    """Generate chatbot response based on message content"""
    message_lower = message.lower()
    
    # Simple keyword matching
    if any(word in message_lower for word in ['hello', 'hi', 'salam', 'bonjour']):
        return f"Hello! I'm Scholaria's AI assistant. How can I help you today?"
    
    if any(word in message_lower for word in ['event', 'workshop', 'class', 'formation']):
        return "You can browse all events on the Events page. You can filter by type, subject, and level. Would you like help finding a specific type of event?"
    
    if any(word in message_lower for word in ['register', 'inscription', 'sign up']):
        return "To register for an event, simply click on the event and then click the 'Register' button. Some events may require payment."
    
    if any(word in message_lower for word in ['payment', 'pay', 'chargily', 'prix']):
        return "We accept payments through Chargily. You can pay when registering for paid events. Your payment is secure and confirmed instantly."
    
    if any(word in message_lower for word in ['certificate', 'certificat', 'attestation']):
        return "Certificates are issued after you attend a workshop. Your teacher or academy will mark you as attended, and then you can download your certificate from your profile."
    
    if any(word in message_lower for word in ['contact', 'help', 'support', 'aide']):
        return "For support, you can contact us at support@scholaria.dz or use the contact form on our website. We're here to help!"
    
    if any(word in message_lower for word in ['teacher', 'professor', 'instructor']):
        return "You can view teacher profiles and see all events by a specific teacher. Teachers are verified by their academies."
    
    if any(word in message_lower for word in ['academy', 'school', 'ecole']):
        return "Academies on Scholaria are verified institutions. You can view academy profiles, browse their events, and follow them to get notifications about new offerings."
    
    # Default response
    return "I'm not sure I understand. You can ask me about:\n- Finding events and workshops\n- Registration process\n- Payments\n- Certificates\n- Teachers and academies\n\nHow can I assist you?"
