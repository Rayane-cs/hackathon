from app import db
from datetime import datetime

class SavedEvent(db.Model):
    __tablename__ = 'saved_events'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    student = db.relationship('User', foreign_keys=[student_id], backref='saved_events')
    event = db.relationship('Event', foreign_keys=[event_id], backref='saved_by')
    
    # Unique constraint to prevent duplicate saves
    __table_args__ = (db.UniqueConstraint('student_id', 'event_id', name='unique_saved_event'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'event_id': self.event_id,
            'created_at': self.created_at.isoformat(),
            'event': self.event.to_dict() if self.event else None
        }
