from datetime import datetime
from app import db

class Registration(db.Model):
    __tablename__ = 'registrations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    status = db.Column(db.Enum('pending', 'approved', 'rejected', name='registration_status'), default='pending')
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    notes = db.Column(db.Text, nullable=True)
    
    # Unique constraint to prevent duplicate registrations
    __table_args__ = (db.UniqueConstraint('user_id', 'event_id', name='unique_user_event_registration'),)
    
    def approve(self):
        """Approve the registration"""
        self.status = 'approved'
        self.updated_at = datetime.utcnow()
    
    def reject(self, notes=None):
        """Reject the registration"""
        self.status = 'rejected'
        self.notes = notes
        self.updated_at = datetime.utcnow()
    
    def to_dict(self):
        """Convert registration object to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.name if self.user else None,
            'user_email': self.user.email if self.user else None,
            'event_id': self.event_id,
            'event_title': self.event.title if self.event else None,
            'status': self.status,
            'registered_at': self.registered_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'notes': self.notes
        }
    
    def __repr__(self):
        return f'<Registration {self.user.name} -> {self.event.title} ({self.status})>'
