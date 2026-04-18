from flask import Blueprint, request, jsonify, make_response, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required, 
    get_jwt_identity
)
from datetime import datetime, timedelta, date
from dateutil.relativedelta import relativedelta
import hashlib
import re
import random
from app import db
from app.models.user import User
from app.models.academy import Academy
from app.models.teacher import Teacher
from app.models.student import Student
from app.models.refresh_token import RefreshToken
from app.models.email_otp import EmailOTP

auth_bp = Blueprint('auth', __name__)

# Algeria wilayas list
ALGERIA_WILAYAS = [
    ("1", "Adrar / أدرار"), ("2", "Chlef / الشلف"), ("3", "Laghouat / الأغواط"),
    ("4", "Oum El Bouaghi / أم البواقي"), ("5", "Batna / باتنة"), ("6", "Béjaïa / بجاية"),
    ("7", "Biskra / بسكرة"), ("8", "Béchar / بشار"), ("9", "Blida / البليدة"),
    ("10", "Bouira / البويرة"), ("11", "Tamanrasset / تمنراست"), ("12", "Tébessa / تبسة"),
    ("13", "Tlemcen / تلمسان"), ("14", "Tiaret / تيارت"), ("15", "Tizi Ouzou / تيزي وزو"),
    ("16", "Algiers / الجزائر"), ("17", "Djelfa / الجلفة"), ("18", "Jijel / جيجل"),
    ("19", "Sétif / سطيف"), ("20", "Saïda / سعيدة"), ("21", "Skikda / سكيكدة"),
    ("22", "Sidi Bel Abbès / سيدي بلعباس"), ("23", "Annaba / عنابة"), ("24", "Guelma / قالمة"),
    ("25", "Constantine / قسنطينة"), ("26", "Médéa / المدية"), ("27", "Mostaganem / مستغانم"),
    ("28", "M'Sila / المسيلة"), ("29", "Mascara / معسكر"), ("30", "Ouargla / ورقلة"),
    ("31", "Oran / وهران"), ("32", "El Bayadh / البيض"), ("33", "Illizi / إليزي"),
    ("34", "Bordj Bou Arréridj / برج بوعريريج"), ("35", "Boumerdès / بومرداس"), ("36", "El Tarf / الطارف"),
    ("37", "Tindouf / تندوف"), ("38", "Tissemsilt / تيسمسيلت"), ("39", "El Oued / الوادي"),
    ("40", "Khenchela / خنشلة"), ("41", "Souk Ahras / سوق أهراس"), ("42", "Tipaza / تيبازة"),
    ("43", "Mila / ميلة"), ("44", "Aïn Defla / عين الدفلى"), ("45", "Naâma / النعامة"),
    ("46", "Aïn Témouchent / عين تموشنت"), ("47", "Ghardaïa / غرداية"), ("48", "Relizane / غليزان"),
    ("49", "Timimoun / تيميمون"), ("50", "Bordj Badji Mokhtar / برج باجي مختار"), ("51", "Ouled Djellal / أولاد جلال"),
    ("52", "Béni Abbès / بني عباس"), ("53", "In Salah / عين صالح"), ("54", "In Guezzam / عين قزام"),
    ("55", "Touggourt / تقرت"), ("56", "Djanet / جانت"), ("57", "El M'Ghair / المغير"), ("58", "El Meniaa / المنيعة")
]

# School levels
SCHOOL_LEVELS = [
    ("1ère année moyenne / السنة أولى متوسط", "Middle School"),
    ("2ème année moyenne / السنة الثانية متوسط", "Middle School"),
    ("3ème année moyenne / السنة الثالثة متوسط", "Middle School"),
    ("4ème année moyenne / السنة الرابعة متوسط", "Middle School"),
    ("1ère année secondaire / السنة أولى ثانوي", "High School"),
    ("2ème année secondaire / السنة الثانية ثانوي", "High School"),
    ("3ème année secondaire (BAC) / السنة الثالثة ثانوي (باك)", "High School"),
    ("Licence 1 / ليسانس 1", "University"),
    ("Licence 2 / ليسانس 2", "University"),
    ("Licence 3 / ليسانس 3", "University"),
    ("Master 1 / ماستر 1", "University"),
    ("Master 2 / ماستر 2", "University"),
    ("Doctorat / دكتوراه", "University"),
    ("Other / أخرى", "Other")
]

# Teacher subjects
TEACHER_SUBJECTS = [
    "Mathematics / الرياضيات",
    "Physics / الفيزياء",
    "Chemistry / الكيمياء",
    "Natural Sciences / علوم الطبيعة والحياة",
    "Computer Science / الإعلام الآلي",
    "Engineering Sciences / العلوم الهندسية",
    "Arabic Language / اللغة العربية",
    "French Language / اللغة الفرنسية",
    "English Language / اللغة الإنجليزية",
    "German Language / اللغة الألمانية",
    "Spanish Language / اللغة الإسبانية",
    "Amazigh / اللغة الأمازيغية",
    "History & Geography / التاريخ والجغرافيا",
    "Islamic Studies / التربية الإسلامية",
    "Civic Education / التربية المدنية",
    "Philosophy / الفلسفة",
    "Sociology / علم الاجتماع",
    "Psychology / علم النفس",
    "Economics / الاقتصاد",
    "Law / القانون",
    "Management / التسيير",
    "Physical Education / التربية البدنية",
    "Music / الموسيقى",
    "Fine Arts / الفنون التشكيلية",
    "Electrical Engineering / الكهرباء",
    "Mechanical Engineering / الميكانيك",
    "Civil Engineering / البناء والأشغال العمومية",
    "Accounting / المحاسبة",
    "Other / أخرى"
]

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    if not re.search(r'[^A-Za-z0-9]', password):
        return False, "Password must contain at least one special character"
    return True, "Password is valid"

def validate_algerian_phone(phone):
    pattern = r'^(05|06|07)[0-9]{8}$'
    return re.match(pattern, phone) is not None

def validate_date_of_birth(dob_str):
    try:
        dob = datetime.strptime(dob_str, '%Y-%m-%d').date()
        min_date = date(1990, 1, 1)
        max_date = date.today() - relativedelta(years=15)
        if dob < min_date or dob > max_date:
            return False, f"Date must be between 1990 and {max_date.strftime('%Y-%m-%d')}"
        return True, dob
    except ValueError:
        return False, "Invalid date format. Use YYYY-MM-DD"

def hash_refresh_token(token):
    return hashlib.sha256(token.encode()).hexdigest()

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(email, otp):
    print(f"[OTP Email to {email}]: Your verification code is: {otp}")
    return True

def create_profile_for_user(user, data):
    if user.role == 'academy':
        academy = Academy(
            user_id=user.id,
            name=data.get('name', ''),
            phone=data.get('phone', ''),
            address=data.get('address', ''),
            wilaya=data.get('wilaya', ''),
            size=data.get('size', 0),
            is_approved=False
        )
        db.session.add(academy)
    elif user.role == 'teacher':
        dob_str = data.get('date_of_birth')
        dob = None
        if dob_str:
            valid, result = validate_date_of_birth(dob_str)
            if valid:
                dob = result
        teacher = Teacher(
            user_id=user.id,
            full_name=data.get('full_name', ''),
            phone=data.get('phone', ''),
            date_of_birth=dob,
            place_of_birth=data.get('place_of_birth', ''),
            subjects=data.get('subjects', []),
            other_subject=data.get('other_subject', ''),
            is_verified=False
        )
        db.session.add(teacher)
    elif user.role == 'student':
        dob_str = data.get('date_of_birth')
        dob = None
        if dob_str:
            valid, result = validate_date_of_birth(dob_str)
            if valid:
                dob = result
        student = Student(
            user_id=user.id,
            full_name=data.get('full_name', ''),
            phone=data.get('phone', ''),
            date_of_birth=dob,
            place_of_birth=data.get('place_of_birth', ''),
            school_level=data.get('school_level', ''),
            wilaya=data.get('wilaya', '')
        )
        db.session.add(student)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        role = data.get('role', '').lower()
        
        if role not in ['student', 'academy', 'teacher']:
            return jsonify({'error': 'Role must be student, academy, or teacher'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        confirm_password = data.get('confirm_password', '')
        phone = data.get('phone', '')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        if password != confirm_password:
            return jsonify({'error': 'Passwords do not match'}), 400
        
        if not phone:
            return jsonify({'error': 'Phone number is required'}), 400
        if not validate_algerian_phone(phone):
            return jsonify({'error': 'Phone must start with 05, 06, or 07 and be 10 digits'}), 400
        
        if role == 'student':
            full_name = data.get('full_name', '').strip()
            if len(full_name) < 3 or len(full_name) > 100:
                return jsonify({'error': 'Full name must be 3-100 characters'}), 400
            dob_str = data.get('date_of_birth', '')
            if not dob_str:
                return jsonify({'error': 'Date of birth is required'}), 400
            valid, result = validate_date_of_birth(dob_str)
            if not valid:
                return jsonify({'error': result}), 400
            if not data.get('place_of_birth'):
                return jsonify({'error': 'Place of birth is required'}), 400
            if not data.get('school_level'):
                return jsonify({'error': 'School level is required'}), 400
        
        elif role == 'teacher':
            full_name = data.get('full_name', '').strip()
            if len(full_name) < 3 or len(full_name) > 100:
                return jsonify({'error': 'Full name must be 3-100 characters'}), 400
            dob_str = data.get('date_of_birth', '')
            if not dob_str:
                return jsonify({'error': 'Date of birth is required'}), 400
            valid, result = validate_date_of_birth(dob_str)
            if not valid:
                return jsonify({'error': result}), 400
            if not data.get('place_of_birth'):
                return jsonify({'error': 'Place of birth is required'}), 400
            subjects = data.get('subjects', [])
            if not subjects or len(subjects) == 0:
                return jsonify({'error': 'At least one subject is required'}), 400
            if "Other / أخرى" in subjects:
                other = data.get('other_subject', '')
                if not other or len(other) > 100:
                    return jsonify({'error': 'Other subject must be specified (max 100 chars)'}), 400
        
        elif role == 'academy':
            name = data.get('name', '').strip()
            if len(name) < 3 or len(name) > 150:
                return jsonify({'error': 'Academy name must be 3-150 characters'}), 400
            size = data.get('size')
            if size is None:
                return jsonify({'error': 'Academy size is required'}), 400
            try:
                size = int(size)
                if size < 1 or size > 10000:
                    return jsonify({'error': 'Size must be between 1 and 10000'}), 400
            except ValueError:
                return jsonify({'error': 'Size must be a valid number'}), 400
            if not data.get('wilaya'):
                return jsonify({'error': 'Wilaya is required'}), 400
            address = data.get('address', '').strip()
            if len(address) < 10 or len(address) > 300:
                return jsonify({'error': 'Address must be 10-300 characters'}), 400
        
        user = User(email=email, role=role, is_verified=False)
        user.set_password(password)
        db.session.add(user)
        db.session.flush()
        
        create_profile_for_user(user, data)
        
        otp = generate_otp()
        expires_at = datetime.utcnow() + timedelta(minutes=10)
        
        EmailOTP.query.filter_by(user_id=user.id).delete()
        
        otp_record = EmailOTP(user_id=user.id, otp=otp, expires_at=expires_at)
        db.session.add(otp_record)
        db.session.commit()
        
        send_otp_email(email, otp)
        
        return jsonify({
            'message': 'Registration successful. Please verify your email.',
            'email': email,
            'requires_verification': True
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@auth_bp.route('/verify-email', methods=['POST'])
def verify_email():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        otp = data.get('otp', '')
        
        if not email or not otp:
            return jsonify({'error': 'Email and OTP are required'}), 400
        
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        otp_record = EmailOTP.query.filter_by(user_id=user.id).first()
        if not otp_record:
            return jsonify({'error': 'No verification code found. Please request a new one.'}), 400
        
        if not otp_record.can_attempt():
            return jsonify({'error': 'Too many failed attempts. Account locked for 30 minutes.', 'locked': True}), 429
        
        if otp_record.is_expired():
            return jsonify({'error': 'Verification code expired. Please request a new one.'}), 400
        
        if not otp_record.verify_otp(otp):
            attempts_used = otp_record.increment_attempt()
            db.session.commit()
            remaining = 5 - attempts_used
            return jsonify({'error': 'Invalid verification code', 'attempts_remaining': max(0, remaining)}), 400
        
        user.is_verified = True
        db.session.delete(otp_record)
        db.session.commit()
        
        access_token = create_access_token(identity=user.id)
        
        remember_me = data.get('remember_me', False)
        refresh_days = 30 if remember_me else 1
        
        refresh_token = create_refresh_token(identity=user.id, expires_delta=timedelta(days=refresh_days))
        
        expires_at = datetime.utcnow() + timedelta(days=refresh_days)
        refresh_token_record = RefreshToken(
            user_id=user.id,
            token_hash=hash_refresh_token(refresh_token),
            expires_at=expires_at
        )
        db.session.add(refresh_token_record)
        db.session.commit()
        
        response_data = {
            'message': 'Email verified successfully',
            'user': user.to_dict(include_profile=True),
            'access_token': access_token,
            'is_approved': True
        }
        
        if user.role == 'academy' and user.academy:
            response_data['is_approved'] = user.academy.is_approved
            if not user.academy.is_approved:
                response_data['pending_message'] = 'Your academy account is pending approval. You will receive an email once approved.'
        
        response = make_response(jsonify(response_data), 200)
        
        response.set_cookie(
            'refresh_token',
            refresh_token,
            httponly=True,
            secure=True,
            samesite='Lax',
            max_age=refresh_days*24*60*60
        )
        
        return response
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Verification failed', 'details': str(e)}), 500

@auth_bp.route('/resend-otp', methods=['POST'])
def resend_otp():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.is_verified:
            return jsonify({'error': 'Email already verified'}), 400
        
        recent_otps = EmailOTP.query.filter(
            EmailOTP.user_id == user.id,
            EmailOTP.created_at > datetime.utcnow() - timedelta(hours=1)
        ).count()
        
        if recent_otps >= 3:
            return jsonify({'error': 'Too many attempts. Please try again after 1 hour.', 'retry_after': 3600}), 429
        
        otp = generate_otp()
        expires_at = datetime.utcnow() + timedelta(minutes=10)
        
        EmailOTP.query.filter_by(user_id=user.id).delete()
        
        otp_record = EmailOTP(user_id=user.id, otp=otp, expires_at=expires_at)
        db.session.add(otp_record)
        db.session.commit()
        
        send_otp_email(email, otp)
        
        return jsonify({'message': 'Verification code sent successfully', 'expires_in': 600}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to send verification code', 'details': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password are required'}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        remember_me = data.get('remember_me', False)
        
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 403
        
        if not user.is_verified:
            return jsonify({'error': 'Email not verified', 'requires_verification': True, 'email': email, 'redirect': '/verify-email'}), 403
        
        if user.role == 'academy' and user.academy and not user.academy.is_approved:
            return jsonify({'error': 'Account pending approval', 'pending_approval': True, 'message': 'Your academy account is pending approval. You will receive an email once approved.'}), 403
        
        access_token = create_access_token(identity=user.id)
        
        refresh_days = 30 if remember_me else 1
        refresh_token = create_refresh_token(identity=user.id, expires_delta=timedelta(days=refresh_days))
        
        expires_at = datetime.utcnow() + timedelta(days=refresh_days)
        refresh_token_record = RefreshToken(
            user_id=user.id,
            token_hash=hash_refresh_token(refresh_token),
            expires_at=expires_at
        )
        db.session.add(refresh_token_record)
        db.session.commit()
        
        redirect_url = f"/{user.role}/dashboard"
        
        response = make_response(jsonify({
            'message': 'Login successful',
            'user': user.to_dict(include_profile=True),
            'access_token': access_token,
            'redirect': redirect_url
        }), 200)
        
        response.set_cookie(
            'refresh_token',
            refresh_token,
            httponly=True,
            secure=True,
            samesite='Lax',
            max_age=refresh_days*24*60*60
        )
        
        return response
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    try:
        refresh_token = request.cookies.get('refresh_token')
        
        if not refresh_token:
            return jsonify({'error': 'Refresh token missing'}), 401
        
        token_hash = hash_refresh_token(refresh_token)
        token_record = RefreshToken.query.filter_by(token_hash=token_hash).first()
        
        if not token_record or not token_record.is_valid():
            return jsonify({'error': 'Invalid or expired refresh token'}), 401
        
        access_token = create_access_token(identity=token_record.user_id)
        
        new_refresh_token = create_refresh_token(identity=token_record.user_id)
        new_expires_at = datetime.utcnow() + timedelta(days=30)
        
        token_record.revoke()
        new_token_record = RefreshToken(
            user_id=token_record.user_id,
            token_hash=hash_refresh_token(new_refresh_token),
            expires_at=new_expires_at
        )
        db.session.add(new_token_record)
        db.session.commit()
        
        response = make_response(jsonify({'access_token': access_token}), 200)
        
        response.set_cookie(
            'refresh_token',
            new_refresh_token,
            httponly=True,
            secure=True,
            samesite='Lax',
            max_age=30*24*60*60
        )
        
        return response
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Token refresh failed', 'details': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    try:
        refresh_token = request.cookies.get('refresh_token')
        
        if refresh_token:
            token_hash = hash_refresh_token(refresh_token)
            token_record = RefreshToken.query.filter_by(token_hash=token_hash).first()
            if token_record:
                token_record.revoke()
                db.session.commit()
        
        response = make_response(jsonify({'message': 'Logged out successfully'}), 200)
        response.set_cookie('refresh_token', '', expires=0)
        
        return response
    except Exception as e:
        return jsonify({'error': 'Logout failed', 'details': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict(include_profile=True)}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get user information', 'details': str(e)}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({'error': 'Email is required'}), 400
        
        email = data['email'].strip().lower()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'message': 'If an account exists, password reset instructions have been sent'}), 200
        
        return jsonify({'message': 'Password reset instructions have been sent to your email'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to process password reset', 'details': str(e)}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        
        if not data or 'token' not in data or 'new_password' not in data:
            return jsonify({'error': 'Token and new password are required'}), 400
        
        return jsonify({'message': 'Password reset successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Password reset failed', 'details': str(e)}), 500

@auth_bp.route('/wilayas', methods=['GET'])
def get_wilayas():
    return jsonify({'wilayas': [{'code': code, 'name': name} for code, name in ALGERIA_WILAYAS]}), 200

@auth_bp.route('/school-levels', methods=['GET'])
def get_school_levels():
    return jsonify({'levels': [{'name': name, 'category': cat} for name, cat in SCHOOL_LEVELS]}), 200

@auth_bp.route('/subjects', methods=['GET'])
def get_subjects():
    return jsonify({'subjects': TEACHER_SUBJECTS}), 200
