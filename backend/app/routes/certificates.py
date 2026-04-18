from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.certificate import Certificate
from app.models.registration import Registration
from app.models.event import Event
import uuid
from io import BytesIO
from datetime import datetime

certificates_bp = Blueprint('certificates', __name__)

@certificates_bp.route('/generate/<string:registration_id>', methods=['POST'])
@jwt_required()
def generate_certificate(registration_id):
    """Generate PDF certificate for a student (academy or teacher)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in ['academy', 'teacher']:
            return jsonify({'error': 'Only academies and teachers can generate certificates'}), 403
        
        registration = Registration.query.get_or_404(registration_id)
        event = registration.event
        
        # Verify ownership
        from app.routes.events import get_owner_info
        owner_type, owner_id, _ = get_owner_info(user)
        
        if event.owner_type != owner_type or event.owner_id != owner_id:
            return jsonify({'error': 'You can only generate certificates for your events'}), 403
        
        # Check if student attended
        if registration.status != 'attended':
            return jsonify({'error': 'Student must be marked as attended first'}), 400
        
        # Check if certificate already exists
        existing = Certificate.query.filter_by(
            student_id=registration.student_id,
            event_id=event.id
        ).first()
        
        if existing:
            return jsonify({
                'message': 'Certificate already exists',
                'certificate': existing.to_dict()
            }), 200
        
        # Generate unique code
        unique_code = f"SCH-{uuid.uuid4().hex[:8].upper()}"
        
        # Create certificate record
        certificate = Certificate(
            student_id=registration.student_id,
            event_id=event.id,
            issued_by=user_id,
            unique_code=unique_code
        )
        
        db.session.add(certificate)
        db.session.commit()
        
        # TODO: Generate actual PDF
        # For now, just return the certificate data
        
        return jsonify({
            'message': 'Certificate generated successfully',
            'certificate': certificate.to_dict(include_student=True, include_event=True)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@certificates_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_certificates():
    """Get student's certificates"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'student':
            return jsonify({'error': 'Only students can view their certificates'}), 403
        
        if not user.student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        certificates = Certificate.query.filter_by(
            student_id=user.student.id
        ).order_by(Certificate.issued_at.desc()).all()
        
        return jsonify({
            'certificates': [c.to_dict(include_event=True) for c in certificates]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@certificates_bp.route('/verify/<string:code>', methods=['GET'])
def verify_certificate(code):
    """Public certificate verification"""
    try:
        certificate = Certificate.query.filter_by(unique_code=code).first()
        
        if not certificate:
            return jsonify({'valid': False, 'error': 'Certificate not found'}), 404
        
        return jsonify({
            'valid': True,
            'certificate': certificate.to_dict(include_student=True, include_event=True)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@certificates_bp.route('/download/<string:certificate_id>', methods=['GET'])
@jwt_required()
def download_certificate(certificate_id):
    """Download certificate PDF"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        certificate = Certificate.query.get_or_404(certificate_id)
        
        # Students can only download their own certificates
        if user.role == 'student':
            if not user.student or certificate.student_id != user.student.id:
                return jsonify({'error': 'Unauthorized'}), 403
        
        # TODO: Generate or retrieve PDF
        # For now, return placeholder
        
        pdf_buffer = BytesIO(b"PDF placeholder content")
        pdf_buffer.seek(0)
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"certificate_{certificate.unique_code}.pdf"
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
