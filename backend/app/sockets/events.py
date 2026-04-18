"""SocketIO event handlers for real-time features"""
from app import socketio
from flask_socketio import join_room, leave_room, emit
from flask_jwt_extended import decode_token
from flask import request

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print(f'Client connected: {request.sid}')

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print(f'Client disconnected: {request.sid}')

@socketio.on('join_event_room')
def handle_join_event_room(data):
    """Join event room for live seat count updates"""
    event_id = data.get('event_id')
    if event_id:
        room = f'event_{event_id}'
        join_room(room)
        emit('joined', {'room': room, 'event_id': event_id})
        
        # Send current seat status
        from app.models.event import Event
        event = Event.query.get(event_id)
        if event:
            emit('seat_update', {
                'event_id': event.id,
                'registered_count': event.registered_count,
                'available_spots': event.available_spots,
                'is_full': event.is_full
            })

@socketio.on('leave_event_room')
def handle_leave_event_room(data):
    """Leave event room"""
    event_id = data.get('event_id')
    if event_id:
        room = f'event_{event_id}'
        leave_room(room)
        emit('left', {'room': room, 'event_id': event_id})

@socketio.on('join_user_room')
def handle_join_user_room(data):
    """Join user room for personal notifications"""
    user_id = data.get('user_id')
    # Verify token before allowing join
    token = data.get('token')
    if token and user_id:
        try:
            decoded = decode_token(token)
            if decoded and decoded.get('sub') == user_id:
                room = f'user_{user_id}'
                join_room(room)
                emit('joined', {'room': room, 'user_id': user_id})
        except Exception as e:
            emit('error', {'message': 'Invalid token'})

@socketio.on('leave_user_room')
def handle_leave_user_room(data):
    """Leave user room"""
    user_id = data.get('user_id')
    if user_id:
        room = f'user_{user_id}'
        leave_room(room)
        emit('left', {'room': room, 'user_id': user_id})

def emit_seat_update(event_id, registered_count, available_spots, is_full):
    """Emit seat update to event room"""
    socketio.emit('seat_update', {
        'event_id': event_id,
        'registered_count': registered_count,
        'available_spots': available_spots,
        'is_full': is_full
    }, room=f'event_{event_id}')

def emit_notification(user_id, notification):
    """Emit notification to user room"""
    socketio.emit('new_notification', notification, room=f'user_{user_id}')

def emit_event_status_change(event_id, status):
    """Emit event status change"""
    socketio.emit('event_status_change', {
        'event_id': event_id,
        'status': status
    }, room=f'event_{event_id}')
