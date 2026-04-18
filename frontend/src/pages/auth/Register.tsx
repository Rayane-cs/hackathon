import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { GraduationCap, GraduationCap as StudentIcon, BookOpen, Building2, ChevronLeft, Loader2, Eye, EyeOff, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const ALGERIA_WILAYAS = [
  { code: "1", name: "Adrar / أدرار" }, { code: "2", name: "Chlef / الشلف" }, { code: "3", name: "Laghouat / الأغواط" },
  { code: "4", name: "Oum El Bouaghi / أم البواقي" }, { code: "5", name: "Batna / باتنة" }, { code: "6", name: "Béjaïa / بجاية" },
  { code: "7", name: "Biskra / بسكرة" }, { code: "8", name: "Béchar / بشار" }, { code: "9", name: "Blida / البليدة" },
  { code: "10", name: "Bouira / البويرة" }, { code: "11", name: "Tamanrasset / تمنراست" }, { code: "12", name: "Tébessa / تبسة" },
  { code: "13", name: "Tlemcen / تلمسان" }, { code: "14", name: "Tiaret / تيارت" }, { code: "15", name: "Tizi Ouzou / تيزي وزو" },
  { code: "16", name: "Algiers / الجزائر" }, { code: "17", name: "Djelfa / الجلفة" }, { code: "18", name: "Jijel / جيجل" },
  { code: "19", name: "Sétif / سطيف" }, { code: "20", name: "Saïda / سعيدة" }, { code: "21", name: "Skikda / سكيكدة" },
  { code: "22", name: "Sidi Bel Abbès / سيدي بلعباس" }, { code: "23", name: "Annaba / عنابة" }, { code: "24", name: "Guelma / قالمة" },
  { code: "25", name: "Constantine / قسنطينة" }, { code: "26", name: "Médéa / المدية" }, { code: "27", name: "Mostaganem / مستغانم" },
  { code: "28", name: "M'Sila / المسيلة" }, { code: "29", name: "Mascara / معسكر" }, { code: "30", name: "Ouargla / ورقلة" },
  { code: "31", name: "Oran / وهران" }, { code: "32", name: "El Bayadh / البيض" }, { code: "33", name: "Illizi / إليزي" },
  { code: "34", name: "Bordj Bou Arréridj / برج بوعريريج" }, { code: "35", name: "Boumerdès / بومرداس" }, { code: "36", name: "El Tarf / الطارف" },
  { code: "37", name: "Tindouf / تندوف" }, { code: "38", name: "Tissemsilt / تيسمسيلت" }, { code: "39", name: "El Oued / الوادي" },
  { code: "40", name: "Khenchela / خنشلة" }, { code: "41", name: "Souk Ahras / سوق أهراس" }, { code: "42", name: "Tipaza / تيبازة" },
  { code: "43", name: "Mila / ميلة" }, { code: "44", name: "Aïn Defla / عين الدفلى" }, { code: "45", name: "Naâma / النعامة" },
  { code: "46", name: "Aïn Témouchent / عين تموشنت" }, { code: "47", name: "Ghardaïa / غرداية" }, { code: "48", name: "Relizane / غليزان" },
  { code: "49", name: "Timimoun / تيميمون" }, { code: "50", name: "Bordj Badji Mokhtar / برج باجي مختار" }, { code: "51", name: "Ouled Djellal / أولاد جلال" },
  { code: "52", name: "Béni Abbès / بني عباس" }, { code: "53", name: "In Salah / عين صالح" }, { code: "54", name: "In Guezzam / عين قزام" },
  { code: "55", name: "Touggourt / تقرت" }, { code: "56", name: "Djanet / جانت" }, { code: "57", name: "El M'Ghair / المغير" }, { code: "58", name: "El Meniaa / المنيعة" }
]

const SCHOOL_LEVELS = [
  { category: "Middle School", options: ["1ère année moyenne / السنة أولى متوسط", "2ème année moyenne / السنة الثانية متوسط", "3ème année moyenne / السنة الثالثة متوسط", "4ème année moyenne / السنة الرابعة متوسط"] },
  { category: "High School", options: ["1ère année secondaire / السنة أولى ثانوي", "2ème année secondaire / السنة الثانية ثانوي", "3ème année secondaire (BAC) / السنة الثالثة ثانوي (باك)"] },
  { category: "University", options: ["Licence 1 / ليسانس 1", "Licence 2 / ليسانس 2", "Licence 3 / ليسانس 3", "Master 1 / ماستر 1", "Master 2 / ماستر 2", "Doctorat / دكتوراه"] },
  { category: "Other", options: ["Other / أخرى"] }
]

const TEACHER_SUBJECTS = [
  "Mathematics / الرياضيات", "Physics / الفيزياء", "Chemistry / الكيمياء", "Natural Sciences / علوم الطبيعة والحياة",
  "Computer Science / الإعلام الآلي", "Engineering Sciences / العلوم الهندسية", "Arabic Language / اللغة العربية",
  "French Language / اللغة الفرنسية", "English Language / اللغة الإنجليزية", "German Language / اللغة الألمانية",
  "Spanish Language / اللغة الإسبانية", "Amazigh / اللغة الأمازيغية", "History & Geography / التاريخ والجغرافيا",
  "Islamic Studies / التربية الإسلامية", "Civic Education / التربية المدنية", "Philosophy / الفلسفة",
  "Sociology / علم الاجتماع", "Psychology / علم النفس", "Economics / الاقتصاد", "Law / القانون",
  "Management / التسيير", "Physical Education / التربية البدنية", "Music / الموسيقى", "Fine Arts / الفنون التشكيلية",
  "Electrical Engineering / الكهرباء", "Mechanical Engineering / الميكانيك", "Civil Engineering / البناء والأشغال العمومية",
  "Accounting / المحاسبة", "Other / أخرى"
]

type Role = 'student' | 'teacher' | 'academy' | ''

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<Role>('')
  const [isLoading, setIsLoading] = useState(false)
  const [wilayaSearch, setWilayaSearch] = useState('')
  const [subjectSearch, setSubjectSearch] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    full_name: '',
    date_of_birth: '',
    place_of_birth: '',
    school_level: '',
    name: '',
    size: '',
    wilaya: '',
    address: '',
    subjects: [] as string[],
    other_subject: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const checkPasswordStrength = (password: string) => {
    if (!password) return ''
    const hasUpper = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)
    const isLong = password.length >= 8
    
    if (isLong && hasUpper && hasNumber && hasSpecial) return 'strong'
    if (isLong && (hasUpper || hasNumber || hasSpecial)) return 'medium'
    return 'weak'
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const strength = checkPasswordStrength(formData.password)
      if (strength === 'weak') {
        newErrors.password = 'Password must be at least 8 characters with uppercase, number, and special character'
      }
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match'
    }

    if (!formData.phone || !/^(05|06|07)[0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must start with 05, 06, or 07 and be 10 digits'
    }

    if (role === 'student' || role === 'teacher') {
      if (!formData.full_name || formData.full_name.length < 3) {
        newErrors.full_name = 'Full name must be at least 3 characters'
      }
      if (!formData.date_of_birth) {
        newErrors.date_of_birth = 'Date of birth is required'
      }
      if (!formData.place_of_birth) {
        newErrors.place_of_birth = 'Place of birth is required'
      }
    }

    if (role === 'student') {
      if (!formData.school_level) {
        newErrors.school_level = 'School level is required'
      }
    }

    if (role === 'teacher') {
      if (formData.subjects.length === 0) {
        newErrors.subjects = 'At least one subject is required'
      }
      if (formData.subjects.includes('Other / أخرى') && !formData.other_subject) {
        newErrors.other_subject = 'Please specify your subject'
      }
    }

    if (role === 'academy') {
      if (!formData.name || formData.name.length < 3) {
        newErrors.name = 'Academy name must be at least 3 characters'
      }
      if (!formData.size || parseInt(formData.size) < 1 || parseInt(formData.size) > 10000) {
        newErrors.size = 'Size must be between 1 and 10000'
      }
      if (!formData.wilaya) {
        newErrors.wilaya = 'Wilaya is required'
      }
      if (!formData.address || formData.address.length < 10) {
        newErrors.address = 'Address must be at least 10 characters'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsLoading(true)
    try {
      const payload: Record<string, any> = {
        role,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
        phone: formData.phone
      }

      if (role === 'student') {
        payload.full_name = formData.full_name
        payload.date_of_birth = formData.date_of_birth
        payload.place_of_birth = formData.place_of_birth
        payload.school_level = formData.school_level
        payload.wilaya = formData.place_of_birth
      } else if (role === 'teacher') {
        payload.full_name = formData.full_name
        payload.date_of_birth = formData.date_of_birth
        payload.place_of_birth = formData.place_of_birth
        payload.subjects = formData.subjects
        if (formData.subjects.includes('Other / أخرى')) {
          payload.other_subject = formData.other_subject
        }
      } else if (role === 'academy') {
        payload.name = formData.name
        payload.size = parseInt(formData.size)
        payload.wilaya = formData.wilaya
        payload.address = formData.address
      }

      const response = await axios.post(`${API_URL}/auth/register`, payload, { withCredentials: true })
      
      toast.success('Registration successful!')
      navigate('/verify-email', { state: { email: formData.email } })
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredWilayas = ALGERIA_WILAYAS.filter(w => 
    w.name.toLowerCase().includes(wilayaSearch.toLowerCase())
  )

  const filteredSubjects = TEACHER_SUBJECTS.filter(s =>
    s.toLowerCase().includes(subjectSearch.toLowerCase())
  )

  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  const roles = [
    { id: 'student', label: 'Student / طالب', icon: StudentIcon, desc: 'Browse and register for events and classes' },
    { id: 'teacher', label: 'Teacher / أستاذ', icon: BookOpen, desc: 'Create events and manage your students' },
    { id: 'academy', label: 'Academy / أكاديمية', icon: Building2, desc: 'Manage your academy\'s events and registrations' }
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <GraduationCap className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">Scholaria</span>
          </Link>
          <h2 className="text-3xl font-bold text-foreground">
            {step === 1 ? 'Create your account' : 'Complete your registration'}
          </h2>
          <p className="mt-2 text-muted">
            {step === 1 ? 'Choose your account type' : `Registering as ${role}`}
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className={`h-2 w-8 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-300'}`}></span>
            <span className={`h-2 w-8 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`}></span>
          </div>
        </div>

        {step === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => { setRole(r.id as Role); setStep(2) }}
                className={`flex flex-col items-center gap-4 p-6 border-2 rounded-xl transition-all text-center hover:border-primary hover:bg-primary/5 ${
                  role === r.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <r.icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{r.label}</h3>
                  <p className="text-sm text-muted mt-1">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-muted hover:text-foreground mb-6"
            >
              <ChevronLeft className="h-5 w-5" />
              Back to role selection
            </button>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Phone / رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="05XXXXXXXX"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {(role === 'student' || role === 'teacher') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Full Name / الاسم الكامل
                      </label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                      {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Date of Birth / تاريخ الميلاد
                      </label>
                      <input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                      {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
                    </div>
                  </>
                )}

                {(role === 'student' || role === 'teacher') && (
                  <div className="relative">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Place of Birth / ولاية الميلاد
                    </label>
                    <input
                      type="text"
                      placeholder="Search wilaya..."
                      value={wilayaSearch}
                      onChange={(e) => setWilayaSearch(e.target.value)}
                      onFocus={() => setWilayaSearch(formData.place_of_birth || '')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                    {wilayaSearch && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                        {filteredWilayas.map((w) => (
                          <button
                            key={w.code}
                            onClick={() => { setFormData({ ...formData, place_of_birth: w.name }); setWilayaSearch('') }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            {w.name}
                          </button>
                        ))}
                      </div>
                    )}
                    {errors.place_of_birth && <p className="text-red-500 text-sm mt-1">{errors.place_of_birth}</p>}
                  </div>
                )}

                {role === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      School Level / المستوى الدراسي
                    </label>
                    <select
                      value={formData.school_level}
                      onChange={(e) => setFormData({ ...formData, school_level: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    >
                      <option value="">Select level...</option>
                      {SCHOOL_LEVELS.map((group) => (
                        <optgroup key={group.category} label={group.category}>
                          {group.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {errors.school_level && <p className="text-red-500 text-sm mt-1">{errors.school_level}</p>}
                  </div>
                )}

                {role === 'teacher' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject(s) / المواد التي تدرّسها
                    </label>
                    <input
                      type="text"
                      placeholder="Search subjects..."
                      value={subjectSearch}
                      onChange={(e) => setSubjectSearch(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                    />
                    <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                      {filteredSubjects.map((subject) => (
                        <label key={subject} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={formData.subjects.includes(subject)}
                            onChange={() => toggleSubject(subject)}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm">{subject}</span>
                        </label>
                      ))}
                    </div>
                    {errors.subjects && <p className="text-red-500 text-sm mt-1">{errors.subjects}</p>}
                    
                    {formData.subjects.includes('Other / أخرى') && (
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Describe your subject... / صف مادتك..."
                          value={formData.other_subject}
                          onChange={(e) => setFormData({ ...formData, other_subject: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        />
                        {errors.other_subject && <p className="text-red-500 text-sm mt-1">{errors.other_subject}</p>}
                      </div>
                    )}
                  </div>
                )}

                {role === 'academy' && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Academy Name / اسم الأكاديمية
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Total Seats / السعة الإجمالية
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                      <p className="text-xs text-muted mt-1">Total number of seats available</p>
                      {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Location / الولاية
                      </label>
                      <select
                        value={formData.wilaya}
                        onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      >
                        <option value="">Select wilaya...</option>
                        {ALGERIA_WILAYAS.map((w) => (
                          <option key={w.code} value={w.name}>{w.name}</option>
                        ))}
                      </select>
                      {errors.wilaya && <p className="text-red-500 text-sm mt-1">{errors.wilaya}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Full Address / العنوان الكامل
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="Street, district, city... / الشارع، الحي، المدينة..."
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Password / كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value })
                        setPasswordStrength(checkPasswordStrength(e.target.value))
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            passwordStrength === 'weak' ? 'w-1/3 bg-red-500' :
                            passwordStrength === 'medium' ? 'w-2/3 bg-orange-500' :
                            'w-full bg-green-500'
                          }`}
                        />
                      </div>
                      <p className={`text-sm mt-1 ${
                        passwordStrength === 'weak' ? 'text-red-500' :
                        passwordStrength === 'medium' ? 'text-orange-500' :
                        'text-green-500'
                      }`}>
                        {passwordStrength === 'weak' ? 'Weak' : passwordStrength === 'medium' ? 'Medium' : 'Strong'}
                      </p>
                    </div>
                  )}
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Confirm Password / تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirm_password}
                      onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formData.confirm_password && formData.password === formData.confirm_password && (
                    <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
                      <Check className="h-4 w-4" /> Passwords match
                    </p>
                  )}
                  {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
              </button>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
