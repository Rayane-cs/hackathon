from datetime import datetime
import uuid
from app import db

class Subscription(db.Model):
    __tablename__ = 'subscriptions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    academy_id = db.Column(db.String(36), db.ForeignKey('academies.id'), unique=True, nullable=False)
    plan = db.Column(db.Enum('starter', 'pro', name='subscription_plan'), nullable=False)
    status = db.Column(db.Enum('active', 'expired', 'cancelled', name='subscription_status'), default='active')
    amount_da = db.Column(db.Numeric(10, 2), nullable=False)
    started_at = db.Column(db.DateTime, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    chargily_ref = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def is_active_now(self):
        """Check if subscription is currently active"""
        return self.status == 'active' and self.expires_at > datetime.utcnow()
    
    def to_dict(self):
        return {
            'id': self.id,
            'academy_id': self.academy_id,
            'plan': self.plan,
            'status': self.status,
            'amount_da': float(self.amount_da) if self.amount_da else 0,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'is_active': self.is_active_now(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
    
    def __repr__(self):
        return f'<Subscription {self.plan} for {self.academy_id}>'
