from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql+pymysql://root:password@localhost/maktabi')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
cors = CORS(app)
mail = Mail(app)
migrate = Migrate(app, db)

# Import routes
from app.routes.auth import auth_bp
from app.routes.events import events_bp
from app.routes.registrations import registrations_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(events_bp, url_prefix='/api/events')
app.register_blueprint(registrations_bp, url_prefix='/api/registrations')

# Import new blueprints
from app.routes.follows import follows_bp
from app.routes.saved_events import saved_events_bp

app.register_blueprint(follows_bp, url_prefix='/api/follows')
app.register_blueprint(saved_events_bp, url_prefix='/api/saved')

# Import models to create tables
from app.models.user import User
from app.models.event import Event
from app.models.registration import Registration
from app.models.follow import Follow
from app.models.saved_event import SavedEvent

@app.route('/')
def index():
    return {'message': 'Scholaria API is running!'}

@app.route('/api/health')
def health_check():
    return {'status': 'healthy', 'message': 'Scholaria API is operational'}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
