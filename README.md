# Scholaria - School Event Management Platform

A production-ready full-stack web application for private schools in Algeria to manage events, workshops, and student participation.

## 🎯 Overview

Scholaria is a SaaS platform designed specifically for Algerian private schools to:
- Create and manage school events and workshops
- Track student registrations and participation
- Send announcements and notifications
- Manage event capacity and logistics

## 🛠️ Tech Stack

### Frontend
- **React** with modern hooks and functional components
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Hook Form** for form handling

### Backend
- **Flask** (Python) REST API
- **JWT** authentication
- **MySQL** database
- **SQLAlchemy** ORM
- **Flask-CORS** for cross-origin requests

### Design System
- **Primary Color**: #2563EB
- **Light Blue**: #60A5FA
- **Accent**: #38BDF8
- **Background**: #F8FAFC
- **Text**: #0F172A
- **Fonts**: Syne (headings), DM Sans (body)

## 📁 Project Structure

```
scholaria/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── backend/           # Flask API
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── migrations/
│   └── requirements.txt
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MySQL server

### Installation

1. **Clone the repository**
2. **Setup Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```
4. **Configure Database**
   - Create MySQL database named `scholaria`
   - Update database credentials in backend config

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   python app.py
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```

## 📱 Features

### For Schools
- ✅ Create and manage events
- ✅ Track registrations
- ✅ Manage capacity limits
- ✅ Send announcements
- ✅ View participant analytics

### For Students
- ✅ Easy sign-up/login
- ✅ Browse available events
- ✅ One-click registration
- ✅ Receive notifications
- ✅ Track participation history

## 🔐 Authentication

- JWT-based authentication
- Role-based access control (Student/School)
- Secure password handling with bcrypt
- Email-based password reset

## 💳 Pricing Plans

- **Free**: Basic event management
- **Starter**: 3000 DA/month - Advanced features
- **Pro**: 7000 DA/month - Full feature set + priority support

## 🌐 Deployment

The application is designed for easy deployment on:
- Vercel (Frontend)
- Heroku/Render (Backend)
- MySQL Cloud/PlanetScale (Database)

## 📞 Support

For support and inquiries:
- Email: support@scholaria.dz
- Phone: +213 123 456 789

---

**Scholaria** - Simplifying school event management in Algeria 🇩🇿
