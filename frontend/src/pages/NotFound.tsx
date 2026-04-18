import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-[120px] font-bold text-[#2563EB] leading-none mb-4">404</div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Page not found</h1>
        <p className="text-[#64748B] mb-8">Looks like this page doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1D4ED8] transition-colors"
        >
          <GraduationCap className="w-5 h-5" />
          Go Home
        </Link>
      </div>
    </div>
  )
}
