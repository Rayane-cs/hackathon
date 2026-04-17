from app import db
from datetime import datetime

class Follow(db.Model):
    __tablename__ = 'follows'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    school_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    student = db.relationship('User', foreign_keys=[student_id], backref='followed_schools')
    school = db.relationship('User', foreign_keys=[school_id], backref='followers')
    
    # Unique constraint to prevent duplicate follows
    __table_args__ = (db.UniqueConstraint('student_id', 'school_id', name='unique_follow'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'school_id': self.school_id,
            'created_at': self.created_at.isoformat(),
            'school': self.school.to_dict() if self.school else None
        }
