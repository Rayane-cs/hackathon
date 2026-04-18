import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { GraduationCap, BookOpen, Building2, ChevronLeft, Loader2, Eye, EyeOff, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const ALGERIA_WILAYAS = [
  { code: "16", name: "Algiers / الجزائر" }, { code: "31", name: "Oran / وهران" }, { code: "25", name: "Constantine / قسنطينة" },
  { code: "9", name: "Blida / البليدة" }, { code: "5", name: "Batna / باتنة" }, { code: "6", name: "Béjaïa / بجاية" },
  { code: "7", name: "Biskra / بسكرة" }, { code: "19", name: "Sétif / سطيف" }, { code: "23", name: "Annaba / عنابة" },
  { code: "15", name: "Tizi Ouzou / تيزي وزو" }, { code: "30", name: "Ouargla / ورقلة" }, { code: "13", name: "Tlemcen / تلمسان" },
  { code: "35", name: "Boumerdès / بومرداس" }, { code: "42", name: "Tipaza / تيبازة" }, { code: "26", name: "Médéa / المدية" },
]

const SCHOOL_LEVELS = [
  "1ère année moyenne", "2ème année moyenne", "3ème année moyenne", "4ème année moyenne",
  "1ère année secondaire", "2ème année secondaire", "3ème année secondaire (BAC)",
  "Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2", "Doctorat", "Other"
]

const TEACHER_SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Natural Sciences", "Computer Science",
  "Arabic Language", "French Language", "English Language", "History & Geography",
  "Islamic Studies", "Philosophy", "Economics", "Physical Education", "Fine Arts", "Other"
]

type Role = 'student' | 'teacher' | 'academy' | ''

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<Role>('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '', password: '', confirm_password: '', phone: '',
    full_name: '', date_of_birth: '', place_of_birth: '',
    school_level: '', name: '', size: '', wilaya: '', address: '',
    subjects: [] as string[],
  })

  const inputStyle = {
    width: '100%', padding: '11px 14px', fontSize: 14,
    border: '1.5px solid #E2E8F0', borderRadius: 10, outline: 'none',
    color: '#0B1D3A', background: '#fff', boxSizing: 'border-box' as const,
    fontFamily: "'DM Sans', sans-serif",
  }
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600 as const, color: '#334155', marginBottom: 5 }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const payload: Record<string, any> = { role, email: formData.email, password: formData.password, confirm_password: formData.confirm_password, phone: formData.phone }
      if (role === 'student') { payload.full_name = formData.full_name; payload.date_of_birth = formData.date_of_birth; payload.place_of_birth = formData.place_of_birth; payload.school_level = formData.school_level; payload.wilaya = formData.place_of_birth; }
      else if (role === 'teacher') { payload.full_name = formData.full_name; payload.date_of_birth = formData.date_of_birth; payload.place_of_birth = formData.place_of_birth; payload.subjects = formData.subjects; }
      else if (role === 'academy') { payload.name = formData.name; payload.size = parseInt(formData.size); payload.wilaya = formData.wilaya; payload.address = formData.address; }
      await axios.post(`${API_URL}/auth/register`, payload, { withCredentials: true })
      toast.success('Account created!')
      navigate('/verify-email', { state: { email: formData.email } })
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const roles = [
    { id: 'student', label: 'Student', icon: GraduationCap, desc: 'Browse and join school events' },
    { id: 'teacher', label: 'Teacher', icon: BookOpen, desc: 'Create events and manage students' },
    { id: 'academy', label: 'Academy', icon: Building2, desc: 'Manage your school\'s events' },
  ]

  const toggleSubject = (s: string) => {
    setFormData(prev => ({ ...prev, subjects: prev.subjects.includes(s) ? prev.subjects.filter(x => x !== s) : [...prev.subjects, s] }))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFBFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <Link to="/" style={{ display: 'block', textAlign: 'center', color: '#2563EB', fontWeight: 800, fontSize: 24, letterSpacing: '-0.5px', textDecoration: 'none', marginBottom: 40 }}>Scholaria</Link>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 36, justifyContent: 'center' }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ height: 4, width: 60, borderRadius: 4, background: step >= s ? '#2563EB' : '#E2E8F0', transition: 'background 0.3s' }} />
          ))}
        </div>

        <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 20, padding: '36px 40px' }}>
          {step === 1 ? (
            <>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0B1D3A', marginBottom: 6, letterSpacing: '-0.5px' }}>Create your account</h1>
              <p style={{ color: '#64748B', fontSize: 15, marginBottom: 28 }}>Choose your account type to get started.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {roles.map((r) => (
                  <button key={r.id} onClick={() => { setRole(r.id as Role); setStep(2); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', border: '1.5px solid #E2E8F0', borderRadius: 14, background: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#2563EB')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#E2E8F0')}
                  >
                    <div style={{ width: 44, height: 44, background: '#EFF6FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <r.icon size={22} color="#2563EB" />
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#0B1D3A', marginBottom: 2 }}>{r.label}</div>
                      <div style={{ fontSize: 13, color: '#64748B' }}>{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#64748B' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
              </p>
            </>
          ) : (
            <>
              <button onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24, padding: 0 }}>
                <ChevronLeft size={16} /> Back
              </button>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0B1D3A', marginBottom: 24, letterSpacing: '-0.5px', textTransform: 'capitalize' }}>Register as {role}</h1>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Common fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="05XXXXXXXX" style={inputStyle} />
                  </div>
                </div>

                {/* Student / Teacher fields */}
                {(role === 'student' || role === 'teacher') && (
                  <>
                    <div>
                      <label style={labelStyle}>Full Name</label>
                      <input type="text" required value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Date of Birth</label>
                        <input type="date" required value={formData.date_of_birth} onChange={e => setFormData({ ...formData, date_of_birth: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Wilaya</label>
                        <select value={formData.place_of_birth} onChange={e => setFormData({ ...formData, place_of_birth: e.target.value })} style={inputStyle}>
                          <option value="">Select wilaya...</option>
                          {ALGERIA_WILAYAS.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {role === 'student' && (
                  <div>
                    <label style={labelStyle}>School Level</label>
                    <select value={formData.school_level} onChange={e => setFormData({ ...formData, school_level: e.target.value })} style={inputStyle}>
                      <option value="">Select level...</option>
                      {SCHOOL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                )}

                {role === 'teacher' && (
                  <div>
                    <label style={labelStyle}>Subject(s)</label>
                    <div style={{ border: '1.5px solid #E2E8F0', borderRadius: 10, padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, maxHeight: 160, overflowY: 'auto' }}>
                      {TEACHER_SUBJECTS.map(s => (
                        <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                          <input type="checkbox" checked={formData.subjects.includes(s)} onChange={() => toggleSubject(s)} />
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {role === 'academy' && (
                  <>
                    <div>
                      <label style={labelStyle}>Academy Name</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Total Seats</label>
                        <input type="number" required min="1" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Wilaya</label>
                        <select value={formData.wilaya} onChange={e => setFormData({ ...formData, wilaya: e.target.value })} style={inputStyle}>
                          <option value="">Select...</option>
                          {ALGERIA_WILAYAS.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Full Address</label>
                      <input type="text" required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Street, district, city..." style={inputStyle} />
                    </div>
                  </>
                )}

                {/* Password */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={{ ...inputStyle, paddingRight: 44 }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <input type="password" required value={formData.confirm_password} onChange={e => setFormData({ ...formData, confirm_password: e.target.value })} style={{ ...inputStyle, paddingRight: 44 }} />
                      {formData.confirm_password && formData.password === formData.confirm_password && (
                        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#22C55E' }}>
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button onClick={handleSubmit} disabled={isLoading} style={{ background: '#2563EB', color: '#fff', padding: '13px', borderRadius: 10, border: 'none', fontSize: 15, fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
                  {isLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Create Account'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}