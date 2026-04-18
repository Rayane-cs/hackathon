import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { GraduationCap, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Login() {
  const navigate = useNavigate()
  const { setUser, setAccessToken } = useAuthStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setNeedsVerification(false)

    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { 
          email: formData.email, 
          password: formData.password,
          remember_me: rememberMe
        },
        { withCredentials: true }
      )

      const { user, access_token, redirect } = response.data

      setUser(user)
      setAccessToken(access_token)

      toast.success('Login successful!')
      navigate(redirect || `/${user.role}/dashboard`)
    } catch (error: any) {
      const data = error.response?.data
      
      if (data?.requires_verification) {
        setNeedsVerification(true)
        setPendingEmail(data.email || formData.email)
        toast.error('Please verify your email first')
      } else if (data?.pending_approval) {
        toast(data.message || 'Your account is pending approval', { icon: '⏳' })
      } else {
        toast.error(data?.error || 'Login failed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!pendingEmail) return
    
    try {
      await axios.post(
        `${API_URL}/auth/resend-otp`,
        { email: pendingEmail },
        { withCredentials: true }
      )
      
      navigate('/verify-email', { state: { email: pendingEmail } })
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to resend code')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <GraduationCap className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">Scholaria</span>
          </Link>
          <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
          <p className="mt-2 text-muted">Sign in to your account</p>
        </div>

        {needsVerification ? (
          <div className="bg-white rounded-2xl shadow-card p-8 text-center">
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Email Not Verified</h3>
            <p className="text-muted mb-4">
              Please verify your email before logging in.
            </p>
            <p className="text-sm text-muted mb-6">
              We sent a code to <span className="font-medium text-foreground">{pendingEmail}</span>
            </p>
            <button
              onClick={handleResendVerification}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Verify Email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email / البريد الإلكتروني
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Password / كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary rounded"
                />
                <span className="text-sm text-muted">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-dark">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>
        )}

        <div className="text-center">
          <p className="text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-dark font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
