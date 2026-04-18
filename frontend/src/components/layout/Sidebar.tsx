import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, Calendar, Users, BarChart3, UserCircle, 
  CreditCard, GraduationCap, BookOpen, School
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

interface SidebarProps {
  role: 'academy' | 'teacher'
}

export default function Sidebar({ role }: SidebarProps) {
  const location = useLocation()
  const { user } = useAuthStore()

  const isActive = (path: string) => location.pathname.startsWith(path)

  const academyLinks = [
    { to: '/academy/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/academy/events', icon: Calendar, label: 'Events' },
    { to: '/academy/teachers', icon: GraduationCap, label: 'Teachers' },
    { to: '/academy/students', icon: Users, label: 'Students' },
    { to: '/academy/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/academy/billing', icon: CreditCard, label: 'Billing' },
    { to: '/academy/profile', icon: UserCircle, label: 'Profile' },
  ]

  const teacherLinks = [
    { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/teacher/events', icon: Calendar, label: 'My Events' },
    { to: '/teacher/students', icon: Users, label: 'My Students' },
    { to: '/teacher/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/teacher/profile', icon: UserCircle, label: 'Profile' },
  ]

  const links = role === 'academy' ? academyLinks : teacherLinks

  return (
    <aside className="w-60 bg-white border-r border-gray-200 min-h-screen hidden lg:block">
      <div className="p-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
              {role === 'academy' ? (
                <School className="w-5 h-5 text-white" />
              ) : (
                <GraduationCap className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-[#0F172A] truncate">
                {user?.profile?.name || user?.profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-[#64748B] capitalize">{role}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const active = isActive(link.to)
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#2563EB] text-white'
                    : 'text-[#64748B] hover:bg-gray-100 hover:text-[#0F172A]'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
