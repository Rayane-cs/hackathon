from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_socketio import SocketIO
from app.config import Config

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
socketio = SocketIO(cors_allowed_origins="*")

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app)
    
    # Enable CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config.get('FRONTEND_URL', '*'),
            "supports_credentials": True,
            "allow_headers": ["Content-Type", "Authorization"],
            "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
        }
    })
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.events import events_bp
    from app.routes.registrations import registrations_bp
    from app.routes.teacher import teacher_bp
    from app.routes.academy import academy_bp
    from app.routes.analytics import analytics_bp
    from app.routes.subscriptions import subscriptions_bp
    from app.routes.notifications import notifications_bp
    from app.routes.certificates import certificates_bp
    from app.routes.ai import ai_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(events_bp, url_prefix='/api/events')
    app.register_blueprint(registrations_bp, url_prefix='/api/registrations')
    app.register_blueprint(teacher_bp, url_prefix='/api/teacher')
    app.register_blueprint(academy_bp, url_prefix='/api/academy')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(subscriptions_bp, url_prefix='/api/subscriptions')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(certificates_bp, url_prefix='/api/certificates')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {'error': 'Token has expired', 'code': 'token_expired'}, 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {'error': 'Invalid token', 'code': 'token_invalid'}, 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {'error': 'Authorization required', 'code': 'token_missing'}, 401
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app
