from datetime import datetime
import uuid
from app import db

class Registration(db.Model):
    __tablename__ = 'registrations'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = db.Column(db.String(36), db.ForeignKey('events.id'), nullable=False)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    status = db.Column(db.Enum('pending', 'confirmed', 'cancelled', 'attended', name='registration_status'), default='pending')
    payment_status = db.Column(db.Enum('unpaid', 'paid', 'refunded', name='payment_status'), default='unpaid')
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint to prevent duplicate registrations
    __table_args__ = (db.UniqueConstraint('event_id', 'student_id', name='unique_event_student_registration'),)
    
    def confirm(self):
        """Confirm the registration"""
        self.status = 'confirmed'
    
    def mark_attended(self):
        """Mark student as attended"""
        self.status = 'attended'
    
    def cancel(self):
        """Cancel the registration"""
        self.status = 'cancelled'
    
    def to_dict(self, include_event=False, include_student=False):
        """Convert registration object to dictionary"""
        data = {
            'id': self.id,
            'event_id': self.event_id,
            'student_id': self.student_id,
            'status': self.status,
            'payment_status': self.payment_status,
            'registered_at': self.registered_at.isoformat() if self.registered_at else None,
        }
        
        if include_event and self.event:
            data['event'] = self.event.to_dict(include_academy=True)
        
        if include_student and self.student:
            data['student'] = self.student.to_dict()
        
        return data
    
    def __repr__(self):
        return f'<Registration {self.student_id} -> {self.event_id} ({self.status})>'
