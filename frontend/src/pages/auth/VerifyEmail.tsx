import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { GraduationCap, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function VerifyEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(600)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [attemptsRemaining, setAttemptsRemaining] = useState(5)
  const [isLocked, setIsLocked] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!email) {
      navigate('/register')
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [email, navigate])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleChange = (index: number, value: string) => {
    if (isLocked || isSuccess) return
    
    if (!/^\d*$/.test(value)) return
    
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    if (isLocked || isSuccess) return
    
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    
    pastedData.split('').forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit
    })
    
    setOtp(newOtp)
    
    if (pastedData.length === 6) {
      handleVerify(pastedData)
    } else if (pastedData.length < 6) {
      inputRefs.current[pastedData.length]?.focus()
    }
  }

  const handleVerify = async (code: string) => {
    if (isLoading || isLocked || isSuccess) return
    
    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post(
        `${API_URL}/auth/verify-email`,
        { email, otp: code },
        { withCredentials: true }
      )

      setIsSuccess(true)
      toast.success('Email verified successfully!')

      const { user, is_approved, pending_message, redirect } = response.data

      if (user.role === 'academy' && !is_approved) {
        toast(pending_message || 'Your account is pending approval', { icon: '⏳' })
      }

      setTimeout(() => {
        navigate(redirect || `/${user.role}/dashboard`)
      }, 1500)
    } catch (error: any) {
      const data = error.response?.data
      
      if (data?.locked) {
        setIsLocked(true)
        setError('Account locked for 30 minutes due to too many failed attempts.')
      } else {
        setError(data?.error || 'Invalid verification code')
        setAttemptsRemaining(data?.attempts_remaining || 0)
        
        if (data?.attempts_remaining === 0) {
          setIsLocked(true)
        } else {
          setOtp(['', '', '', '', '', ''])
          inputRefs.current[0]?.focus()
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (timeLeft > 0 || isLoading) return

    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post(
        `${API_URL}/auth/resend-otp`,
        { email },
        { withCredentials: true }
      )

      setTimeLeft(response.data.expires_in || 600)
      setAttemptsRemaining(5)
      setIsLocked(false)
      setOtp(['', '', '', '', '', ''])
      toast.success('New verification code sent!')

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error: any) {
      const retryAfter = error.response?.data?.retry_after
      if (retryAfter) {
        setError(`Too many attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`)
      } else {
        setError(error.response?.data?.error || 'Failed to resend code')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <GraduationCap className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">Scholaria</span>
          </div>
          
          <h2 className="text-3xl font-bold text-foreground">Verify Your Email</h2>
          <p className="mt-2 text-muted">
            We sent a 6-digit code to
          </p>
          <p className="font-medium text-foreground">{email}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Email Verified!</h3>
              <p className="text-muted">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={isLocked || isLoading}
                    className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                      error 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300 focus:border-primary'
                    } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                ))}
              </div>

              {error && (
                <div className={`flex items-center gap-2 justify-center mb-4 ${isLocked ? 'text-orange-600' : 'text-red-500'}`}>
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {!isLocked && attemptsRemaining < 5 && attemptsRemaining > 0 && (
                <p className="text-center text-sm text-orange-600 mb-4">
                  {attemptsRemaining} attempts remaining
                </p>
              )}

              <div className="text-center mb-6">
                <p className="text-sm text-muted">
                  Code expires in <span className="font-medium text-foreground">{formatTime(timeLeft)}</span>
                </p>
              </div>

              <button
                onClick={handleResend}
                disabled={timeLeft > 0 || isLoading || isLocked}
                className="w-full py-3 text-primary hover:text-primary-dark font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : timeLeft > 0 ? (
                  `Resend code in ${formatTime(timeLeft)}`
                ) : (
                  'Resend verification code'
                )}
              </button>
            </>
          )}
        </div>

        <p className="text-center text-sm text-muted">
          Wrong email?{' '}
          <button 
            onClick={() => navigate('/register')} 
            className="text-primary hover:text-primary-dark font-medium"
          >
            Go back
          </button>
        </p>
      </div>
    </div>
  )
}
