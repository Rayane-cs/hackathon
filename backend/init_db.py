#!/usr/bin/env python3
"""
Database initialization script for Scholaria
This script creates the database and all necessary tables.
"""

import pymysql
from app import app, db
from app.models.user import User
from app.models.event import Event
from app.models.registration import Registration
import os

def create_database():
    """Create the database if it doesn't exist"""
    try:
        # Extract database info from DATABASE_URL
        database_url = os.getenv('DATABASE_URL', 'mysql+pymysql://root:password@localhost/scholaria')
        # Parse: mysql+pymysql://username:password@host/database
        import re
        match = re.match(r'mysql\+pymysql://([^:]+):([^@]+)@([^/]+)/(.+)', database_url)
        if match:
            username, password, host, database = match.groups()
            
            # Connect to MySQL server (without specifying database)
            connection = pymysql.connect(
                host=host,
                user=username,
                password=password
            )
            
            with connection.cursor() as cursor:
                # Create database if it doesn't exist
                cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
                print(f"Database '{database}' created or already exists")
            
            connection.close()
            return True
        else:
            print("Invalid DATABASE_URL format")
            return False
            
    except Exception as e:
        print(f"Error creating database: {e}")
        return False

def create_tables():
    """Create all tables in the database"""
    try:
        with app.app_context():
            # Create all tables
            db.create_all()
            print("All tables created successfully")
            return True
    except Exception as e:
        print(f"Error creating tables: {e}")
        return False

def create_sample_data():
    """Create sample data for testing"""
    try:
        with app.app_context():
            # Create sample school
            school = User(
                name='École Internationale d\'Alger',
                email='school@scholaria.dz',
                password='School123!',
                role='school'
            )
            db.session.add(school)
            
            # Create sample student
            student = User(
                name='Ahmed Benali',
                email='ahmed@student.dz',
                password='Student123!',
                role='student'
            )
            db.session.add(student)
            
            db.session.commit()
            
            # Create sample events
            event1 = Event(
                title='Science Fair 2024',
                description='Annual science fair showcasing student projects and experiments',
                created_by=school.id,
                capacity=50,
                location='School Auditorium'
            )
            
            event2 = Event(
                title='Programming Workshop',
                description='Learn the basics of Python programming',
                created_by=school.id,
                capacity=30,
                location='Computer Lab'
            )
            
            db.session.add(event1)
            db.session.add(event2)
            db.session.commit()
            
            # Create sample registration
            registration = Registration(
                user_id=student.id,
                event_id=event1.id,
                status='approved'
            )
            db.session.add(registration)
            db.session.commit()
            
            print("Sample data created successfully")
            return True
            
    except Exception as e:
        print(f"Error creating sample data: {e}")
        return False

def main():
    """Main function to initialize the database"""
    print("Initializing Scholaria database...")
    
    # Create database
    if not create_database():
        print("Failed to create database")
        return
    
    # Create tables
    if not create_tables():
        print("Failed to create tables")
        return
    
    # Create sample data (optional)
    print("\nDo you want to create sample data? (y/n): ", end="")
    choice = input().lower().strip()
    
    if choice == 'y':
        if not create_sample_data():
            print("Failed to create sample data")
        else:
            print("Sample data created successfully")
    
    print("\nDatabase initialization complete!")
    print("\nNext steps:")
    print("1. Start the Flask server: python app.py")
    print("2. Start the React frontend: cd frontend && npm start")
    print("3. Open http://localhost:3000 in your browser")

if __name__ == "__main__":
    main()
