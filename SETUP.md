# Maktabi - Setup Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16+)
- **Python** (v3.8+)
- **MySQL** server
- **Git**

### Step 1: Clone and Setup
```bash
git clone <repository-url>
cd hackathon
```

### Step 2: Backend Setup

1. **Install Python dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Configure Database**
   - Start MySQL server
   - Create a database named `maktabi` (optional, script will create it)
   - Update `.env` file with your MySQL credentials

3. **Initialize Database**
```bash
python init_db.py
```

4. **Start Backend Server**
```bash
python app.py
```
The API will be available at `http://localhost:5000`

### Step 3: Frontend Setup

1. **Install Node.js dependencies**
```bash
cd frontend
npm install
```

2. **Start Development Server**
```bash
npm start
```
The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
hackathon/
├── backend/                 # Flask API
│   ├── app/
│   │   ├── models/         # Database models
│   │   └── routes/         # API routes
│   ├── app.py             # Main Flask app
│   ├── init_db.py         # Database initialization
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
├── frontend/               # React App
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main App component
│   ├── public/            # Static files
│   ├── package.json       # Node.js dependencies
│   └── tailwind.config.js # Tailwind CSS config
└── README.md              # Project documentation
```

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
DATABASE_URL=mysql+pymysql://username:password@localhost/maktabi
SECRET_KEY=your-super-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Database Setup
The application uses MySQL with the following tables:
- `users` - User accounts (students/schools)
- `events` - School events and workshops
- `registrations` - Student event registrations

## 🎯 Features

### For Schools
- ✅ Create and manage events
- ✅ Track registrations and capacity
- ✅ View participant lists
- ✅ Manage event announcements

### For Students
- ✅ Browse available events
- ✅ One-click registration
- ✅ View registration history
- ✅ Receive notifications

## 🧪 Testing the Application

### 1. Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test School","email":"test@school.dz","password":"School123!","role":"school"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@school.dz","password":"School123!"}'
```

### 2. Test Frontend
1. Open `http://localhost:3000`
2. Navigate through landing page sections
3. Test signup/login functionality
4. Create events (as school)
5. Register for events (as student)

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL server is running
   - Check credentials in `.env` file
   - Verify database exists

2. **Frontend Build Issues**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version: `node --version`

3. **CORS Errors**
   - Ensure backend is running on port 5000
   - Check Flask-CORS configuration

4. **JWT Token Issues**
   - Clear browser localStorage
   - Check JWT_SECRET_KEY in .env

### Port Conflicts
- Backend default: 5000
- Frontend default: 3000
- Change ports if needed in respective configuration files

## 📱 Mobile Responsiveness

The application is fully responsive:
- Mobile-first design approach
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- CORS protection
- Input validation and sanitization

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Render)
```bash
# Set environment variables
# Configure production database
# Deploy using platform-specific methods
```

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Contact support at support@maktabi.dz

---

**Maktabi** - Simplifying school event management in Algeria 🇩🇿
