import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Login() {
  const navigate = useNavigate()
  const { setUser, setAccessToken } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true })
      const { user, access_token, redirect } = response.data
      setUser(user)
      setAccessToken(access_token)
      toast.success('Welcome back!')
      navigate(redirect || `/${user.role}/dashboard`)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: 15,
    border: '1.5px solid #E2E8F0',
    borderRadius: 10,
    outline: 'none',
    color: '#0B1D3A',
    background: '#fff',
    boxSizing: 'border-box' as const,
    fontFamily: "'DM Sans', sans-serif",
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Left panel */}
      <div style={{ background: '#2563EB', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, background: 'rgba(255,255,255,0.07)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 240, height: 240, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 60, display: 'block' }}>Scholaria</Link>
        <h2 style={{ color: '#fff', fontSize: 36, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-1px', marginBottom: 20 }}>
          Welcome back
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, lineHeight: 1.6, marginBottom: 48 }}>
          Sign in to manage your events, track registrations, and connect with students.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['Create & manage events', 'Track student registrations', 'View analytics & reports'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 22, height: 22, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 4L3.5 6.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', background: '#FAFBFC' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0B1D3A', marginBottom: 8, letterSpacing: '-0.5px' }}>Sign in</h1>
          <p style={{ color: '#64748B', fontSize: 15, marginBottom: 36 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 13, color: '#2563EB', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ ...inputStyle, paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ background: '#2563EB', color: '#fff', padding: '13px', borderRadius: 10, border: 'none', fontSize: 15, fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}
            >
              {isLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}