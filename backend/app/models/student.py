from datetime import datetime, date
import uuid
from app import db

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), unique=True, nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(30))
    date_of_birth = db.Column(db.Date)
    place_of_birth = db.Column(db.String(100))
    school_level = db.Column(db.String(100))  # Renamed from school_year
    wilaya = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    registrations = db.relationship('Registration', backref='student', lazy=True)
    certificates = db.relationship('Certificate', backref='student', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'full_name': self.full_name,
            'phone': self.phone,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'place_of_birth': self.place_of_birth,
            'school_level': self.school_level,
            'wilaya': self.wilaya,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
    
    def __repr__(self):
        return f'<Student {self.full_name}>'
