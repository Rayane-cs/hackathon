from datetime import datetime
import uuid
import json
from app import db

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Unified ownership
    owner_type = db.Column(db.Enum('academy', 'teacher', name='event_owner_type'), nullable=False)
    owner_id = db.Column(db.String(36), nullable=False)
    
    # Teacher link (smart field)
    teacher_id = db.Column(db.String(36), db.ForeignKey('teachers.id'), nullable=True)
    teacher_name = db.Column(db.String(255))  # fallback text if no teacher account
    
    # Academy context (always set - even teacher events happen at an academy)
    academy_id = db.Column(db.String(36), db.ForeignKey('academies.id'), nullable=False)
    
    # Event details
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.Enum('class', 'workshop', 'event', 'seminar', name='event_type'), nullable=False)
    subject = db.Column(db.String(100))
    level = db.Column(db.String(100))
    
    # Scheduling
    start_datetime = db.Column(db.DateTime, nullable=False)
    end_datetime = db.Column(db.DateTime)
    recurrence = db.Column(db.Enum('none', 'weekly', 'biweekly', name='event_recurrence'), default='none')
    recurrence_days = db.Column(db.Text)  # JSON array ["Mon","Wed","Fri"]
    sessions_count = db.Column(db.Integer, default=1)
    
    # Capacity & Registration
    capacity = db.Column(db.Integer, nullable=False)
    registered_count = db.Column(db.Integer, default=0)
    is_full = db.Column(db.Boolean, default=False)
    registration_deadline = db.Column(db.DateTime)
    
    # Media & Display
    banner_base64 = db.Column(db.Text)
    location = db.Column(db.String(255))
    is_online = db.Column(db.Boolean, default=False)
    meeting_link = db.Column(db.String(500))
    
    # Pricing (0 = free)
    price = db.Column(db.Numeric(10, 2), default=0.00)
    
    # Status
    status = db.Column(db.Enum('draft', 'active', 'completed', 'cancelled', name='event_status'), default='draft')
    is_featured = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    registrations = db.relationship('Registration', backref='event', lazy=True, cascade='all, delete-orphan')
    certificates = db.relationship('Certificate', backref='event', lazy=True)
    
    def update_registered_count(self):
        """Update the registered count based on confirmed registrations"""
        confirmed_count = db.session.query(Registration).filter(
            Registration.event_id == self.id,
            Registration.status.in_(['confirmed', 'attended'])
        ).count()
        self.registered_count = confirmed_count
        self.is_full = self.registered_count >= self.capacity
    
    @property
    def available_spots(self):
        """Get the number of available spots"""
        return max(0, self.capacity - self.registered_count)
    
    def to_dict(self, include_registrations=False, include_academy=False):
        """Convert event object to dictionary"""
        data = {
            'id': self.id,
            'owner_type': self.owner_type,
            'owner_id': self.owner_id,
            'teacher_id': self.teacher_id,
            'teacher_name': self.teacher_name,
            'academy_id': self.academy_id,
            'title': self.title,
            'description': self.description,
            'type': self.type,
            'subject': self.subject,
            'level': self.level,
            'start_datetime': self.start_datetime.isoformat() if self.start_datetime else None,
            'end_datetime': self.end_datetime.isoformat() if self.end_datetime else None,
            'recurrence': self.recurrence,
            'recurrence_days': json.loads(self.recurrence_days) if self.recurrence_days else None,
            'sessions_count': self.sessions_count,
            'capacity': self.capacity,
            'registered_count': self.registered_count,
            'available_spots': self.available_spots,
            'is_full': self.is_full,
            'registration_deadline': self.registration_deadline.isoformat() if self.registration_deadline else None,
            'banner_base64': self.banner_base64,
            'location': self.location,
            'is_online': self.is_online,
            'meeting_link': self.meeting_link,
            'price': float(self.price) if self.price else 0,
            'status': self.status,
            'is_featured': self.is_featured,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        
        # Include teacher info if available
        if self.teacher:
            data['teacher'] = {
                'id': self.teacher.id,
                'full_name': self.teacher.full_name,
                'speciality': self.teacher.speciality
            }
        
        if include_academy and self.academy:
            data['academy'] = {
                'id': self.academy.id,
                'name': self.academy.name,
                'city': self.academy.city,
                'logo_base64': self.academy.logo_base64
            }
        
        if include_registrations:
            data['registrations'] = [reg.to_dict() for reg in self.registrations]
        
        return data
    
    def __repr__(self):
        return f'<Event {self.title} ({self.type})>'
