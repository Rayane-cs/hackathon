import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyEmail from './pages/auth/VerifyEmail'

// Public pages
import Home from './pages/Home'
import EventDetail from './pages/EventDetail'
import TeacherPublicProfile from './pages/TeacherPublicProfile'

// Student pages
import StudentDashboard from './pages/student/Dashboard'
import StudentEvents from './pages/student/Events'
import StudentRegistrations from './pages/student/Registrations'
import StudentCertificates from './pages/student/Certificates'
import StudentProfile from './pages/student/Profile'

// Academy pages
import AcademyDashboard from './pages/academy/Dashboard'
import AcademyEvents from './pages/academy/Events'
import AcademyEventCreate from './pages/academy/EventCreate'
import AcademyTeachers from './pages/academy/Teachers'
import AcademyAnalytics from './pages/academy/Analytics'
import AcademyBilling from './pages/academy/Billing'
import AcademyProfile from './pages/academy/Profile'

// Teacher pages
import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherEvents from './pages/teacher/Events'
import TeacherStudents from './pages/teacher/Students'
import TeacherProfile from './pages/teacher/Profile'

// Protected route wrapper
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/teacher/:id" element={<TeacherPublicProfile />} />

          {/* Student routes */}
          <Route path="/student/*" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Routes>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="events" element={<StudentEvents />} />
                <Route path="registrations" element={<StudentRegistrations />} />
                <Route path="certificates" element={<StudentCertificates />} />
                <Route path="profile" element={<StudentProfile />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Academy routes */}
          <Route path="/academy/*" element={
            <ProtectedRoute allowedRoles={['academy']}>
              <Routes>
                <Route path="dashboard" element={<AcademyDashboard />} />
                <Route path="events" element={<AcademyEvents />} />
                <Route path="events/create" element={<AcademyEventCreate />} />
                <Route path="teachers" element={<AcademyTeachers />} />
                <Route path="analytics" element={<AcademyAnalytics />} />
                <Route path="billing" element={<AcademyBilling />} />
                <Route path="profile" element={<AcademyProfile />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Teacher routes */}
          <Route path="/teacher/*" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Routes>
                <Route path="dashboard" element={<TeacherDashboard />} />
                <Route path="events" element={<TeacherEvents />} />
                <Route path="students" element={<TeacherStudents />} />
                <Route path="profile" element={<TeacherProfile />} />
              </Routes>
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
