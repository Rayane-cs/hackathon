#!/usr/bin/env python3
"""
Test script for Maktabi application
This script tests the basic functionality of the Flask API
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print("❌ Health check failed")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_user_registration():
    """Test user registration"""
    try:
        # Test school registration
        school_data = {
            "name": "Test School",
            "email": "test@school.dz",
            "password": "School123!",
            "role": "school"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/signup", json=school_data)
        if response.status_code in [201, 409]:  # 409 means user already exists
            print("✅ School registration test passed")
            school_token = response.json().get('access_token') if response.status_code == 201 else None
        else:
            print(f"❌ School registration failed: {response.text}")
            school_token = None
        
        # Test student registration
        student_data = {
            "name": "Test Student",
            "email": "test@student.dz",
            "password": "Student123!",
            "role": "student"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/signup", json=student_data)
        if response.status_code in [201, 409]:
            print("✅ Student registration test passed")
            student_token = response.json().get('access_token') if response.status_code == 201 else None
        else:
            print(f"❌ Student registration failed: {response.text}")
            student_token = None
        
        return school_token, student_token
        
    except Exception as e:
        print(f"❌ Registration test error: {e}")
        return None, None

def test_login():
    """Test user login"""
    try:
        # Test school login
        login_data = {
            "email": "test@school.dz",
            "password": "School123!"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        if response.status_code == 200:
            school_token = response.json()['access_token']
            print("✅ School login test passed")
        else:
            print(f"❌ School login failed: {response.text}")
            school_token = None
        
        # Test student login
        login_data = {
            "email": "test@student.dz",
            "password": "Student123!"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        if response.status_code == 200:
            student_token = response.json()['access_token']
            print("✅ Student login test passed")
        else:
            print(f"❌ Student login failed: {response.text}")
            student_token = None
        
        return school_token, student_token
        
    except Exception as e:
        print(f"❌ Login test error: {e}")
        return None, None

def test_events(school_token, student_token):
    """Test event creation and registration"""
    try:
        # Test event creation (school only)
        if school_token:
            headers = {"Authorization": f"Bearer {school_token}"}
            event_data = {
                "title": "Test Event",
                "description": "This is a test event",
                "date": "2024-12-25T10:00:00",
                "capacity": 30,
                "location": "Test Location"
            }
            
            response = requests.post(f"{BASE_URL}/api/events/", json=event_data, headers=headers)
            if response.status_code == 201:
                event_id = response.json()['event']['id']
                print("✅ Event creation test passed")
            else:
                print(f"❌ Event creation failed: {response.text}")
                event_id = None
        else:
            event_id = None
        
        # Test event listing
        response = requests.get(f"{BASE_URL}/api/events/")
        if response.status_code == 200:
            events = response.json()['events']
            print(f"✅ Event listing test passed ({len(events)} events found)")
            if events and not event_id:
                event_id = events[0]['id']
        else:
            print(f"❌ Event listing failed: {response.text}")
        
        # Test student registration
        if student_token and event_id:
            headers = {"Authorization": f"Bearer {student_token}"}
            response = requests.post(f"{BASE_URL}/api/registrations/event/{event_id}/register", headers=headers)
            if response.status_code == 201:
                print("✅ Student registration test passed")
            else:
                print(f"❌ Student registration failed: {response.text}")
        
        return True
        
    except Exception as e:
        print(f"❌ Events test error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Maktabi Application...")
    print("=" * 50)
    
    # Wait a moment for the server to start
    time.sleep(2)
    
    # Run tests
    health_ok = test_health_check()
    if not health_ok:
        print("\n❌ Server is not running. Please start the Flask server first:")
        print("   cd backend && python app.py")
        return
    
    print("\n📝 Testing Authentication...")
    school_token_reg, student_token_reg = test_user_registration()
    school_token_login, student_token_login = test_login()
    
    # Use tokens from login if registration failed (user already exists)
    school_token = school_token_login or school_token_reg
    student_token = student_token_login or student_token_reg
    
    print("\n🎪 Testing Events...")
    test_events(school_token, student_token)
    
    print("\n" + "=" * 50)
    print("🎉 Test suite completed!")
    print("\n📋 Next steps:")
    print("1. Start the frontend: cd frontend && npm start")
    print("2. Open http://localhost:3000 in your browser")
    print("3. Test the complete application flow")

if __name__ == "__main__":
    main()
