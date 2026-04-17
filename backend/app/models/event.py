from datetime import datetime
from app import db

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    location = db.Column(db.String(200), nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    registrations = db.relationship('Registration', backref='event', lazy=True, cascade='all, delete-orphan')
    
    @property
    def registered_count(self):
        """Get the number of registered participants"""
        return len([r for r in self.registrations if r.status == 'approved'])
    
    @property
    def available_spots(self):
        """Get the number of available spots"""
        return max(0, self.capacity - self.registered_count)
    
    @property
    def is_full(self):
        """Check if the event is full"""
        return self.available_spots <= 0
    
    def to_dict(self, include_registrations=False):
        """Convert event object to dictionary"""
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'date': self.date.isoformat(),
            'capacity': self.capacity,
            'location': self.location,
            'created_by': self.created_by,
            'creator_name': self.creator.name if self.creator else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'is_active': self.is_active,
            'registered_count': self.registered_count,
            'available_spots': self.available_spots,
            'is_full': self.is_full
        }
        
        if include_registrations:
            data['registrations'] = [reg.to_dict() for reg in self.registrations]
        
        return data
    
    def __repr__(self):
        return f'<Event {self.title}>'
