from datetime import datetime
import uuid
import hashlib
from app import db

class EmailOTP(db.Model):
    __tablename__ = 'email_otps'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    otp_hash = db.Column(db.String(255), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    attempts = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __init__(self, user_id, otp, expires_at):
        self.user_id = user_id
        self.otp_hash = self._hash_otp(otp)
        self.expires_at = expires_at
        self.attempts = 0
    
    @staticmethod
    def _hash_otp(otp):
        """Hash the OTP using SHA256"""
        return hashlib.sha256(otp.encode()).hexdigest()
    
    def verify_otp(self, otp):
        """Verify if the provided OTP matches the stored hash"""
        return self._hash_otp(otp) == self.otp_hash
    
    def is_expired(self):
        """Check if OTP has expired"""
        return datetime.utcnow() > self.expires_at
    
    def can_attempt(self):
        """Check if user can still attempt verification (max 5 attempts)"""
        return self.attempts < 5
    
    def increment_attempt(self):
        """Increment attempt counter"""
        self.attempts += 1
        return self.attempts
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'attempts': self.attempts,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
    
    def __repr__(self):
        return f'<EmailOTP user={self.user_id} expires={self.expires_at}>'
