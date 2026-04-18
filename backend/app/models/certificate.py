from datetime import datetime
import uuid
from app import db

class Certificate(db.Model):
    __tablename__ = 'certificates'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    event_id = db.Column(db.String(36), db.ForeignKey('events.id'), nullable=False)
    issued_by = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)
    pdf_url = db.Column(db.Text)
    unique_code = db.Column(db.String(100), unique=True, nullable=False)
    
    def to_dict(self, include_student=False, include_event=False):
        data = {
            'id': self.id,
            'student_id': self.student_id,
            'event_id': self.event_id,
            'issued_by': self.issued_by,
            'issued_at': self.issued_at.isoformat() if self.issued_at else None,
            'pdf_url': self.pdf_url,
            'unique_code': self.unique_code,
        }
        
        if include_student and self.student:
            data['student'] = self.student.to_dict()
        
        if include_event and self.event:
            data['event'] = {
                'id': self.event.id,
                'title': self.event.title,
                'type': self.event.type,
            }
        
        return data
    
    def __repr__(self):
        return f'<Certificate {self.unique_code}>'
