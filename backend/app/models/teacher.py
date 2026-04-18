from datetime import datetime, date
import uuid
from app import db

class Teacher(db.Model):
    __tablename__ = 'teachers'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), unique=True, nullable=False)
    academy_id = db.Column(db.String(36), db.ForeignKey('academies.id'), nullable=True)
    full_name = db.Column(db.String(255), nullable=False)
    bio = db.Column(db.Text)
    speciality = db.Column(db.String(255))  # Kept for backward compatibility
    subjects = db.Column(db.JSON)  # List of subjects taught
    other_subject = db.Column(db.String(100))  # Free text for custom subject
    phone = db.Column(db.String(30))
    date_of_birth = db.Column(db.Date)
    place_of_birth = db.Column(db.String(100))
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    events = db.relationship('Event', backref='teacher', lazy=True, foreign_keys='Event.teacher_id')
    certificates_issued = db.relationship('Certificate', backref='issuer', lazy=True, foreign_keys='Certificate.issued_by')
    
    def to_dict(self, public=False):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'academy_id': self.academy_id,
            'full_name': self.full_name,
            'bio': self.bio,
            'speciality': self.speciality,
            'subjects': self.subjects,
            'other_subject': self.other_subject,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        
        if not public:
            data['phone'] = self.phone
            data['date_of_birth'] = self.date_of_birth.isoformat() if self.date_of_birth else None
            data['place_of_birth'] = self.place_of_birth
            
        return data
    
    def __repr__(self):
        return f'<Teacher {self.full_name}>'
