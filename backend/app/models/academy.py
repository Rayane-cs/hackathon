from datetime import datetime
import uuid
from app import db

class Academy(db.Model):
    __tablename__ = 'academies'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    phone = db.Column(db.String(30))
    address = db.Column(db.String(300))  # Changed from Text to String(300)
    wilaya = db.Column(db.String(100))   # Added wilaya field
    size = db.Column(db.Integer)           # Total seats capacity
    logo_base64 = db.Column(db.Text)
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    events = db.relationship('Event', backref='academy', lazy=True, foreign_keys='Event.academy_id')
    teachers = db.relationship('Teacher', backref='academy', lazy=True)
    subscription = db.relationship('Subscription', backref='academy', uselist=False, lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'description': self.description,
            'phone': self.phone,
            'address': self.address,
            'wilaya': self.wilaya,
            'size': self.size,
            'logo_base64': self.logo_base64,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
    
    def __repr__(self):
        return f'<Academy {self.name}>'
