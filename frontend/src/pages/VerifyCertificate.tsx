import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function VerifyCertificate() {
  const { code } = useParams()
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading')
  const [certificate, setCertificate] = useState<any>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (code && code.startsWith('SC-')) {
        setStatus('valid')
        setCertificate({
          studentName: 'Ahmed Benali',
          eventTitle: 'Advanced Mathematics Workshop',
          academyName: 'أكاديمية الفكر الرائد',
          teacherName: 'Dr. Mohamed El Amine',
          issueDate: '2026-04-15',
          code: code
        })
      } else {
        setStatus('invalid')
      }
    }, 1500)
  }, [code])

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {status === 'loading' && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin mx-auto mb-4" />
            <p className="text-[#64748B]">Verifying certificate...</p>
          </div>
        )}

        {status === 'valid' && certificate && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border-t-4 border-green-500">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">Certificate Verified</h1>
              <p className="text-[#64748B]">This certificate is authentic and was issued by Scholaria</p>
            </div>

            <div className="bg-[#F8FAFC] rounded-xl p-6 space-y-4">
              <div>
                <p className="text-xs text-[#64748B] uppercase tracking-wide">Student</p>
                <p className="font-semibold text-[#0F172A]">{certificate.studentName}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B] uppercase tracking-wide">Event</p>
                <p className="font-semibold text-[#0F172A]">{certificate.eventTitle}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B] uppercase tracking-wide">Academy</p>
                <p className="font-semibold text-[#0F172A]">{certificate.academyName}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B] uppercase tracking-wide">Issued By</p>
                <p className="font-semibold text-[#0F172A]">{certificate.teacherName}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B] uppercase tracking-wide">Issue Date</p>
                <p className="font-semibold text-[#0F172A]">{certificate.issueDate}</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-[#64748B] uppercase tracking-wide">Unique Code</p>
                <p className="font-mono text-sm text-[#0F172A]">{certificate.code}</p>
              </div>
            </div>
          </div>
        )}

        {status === 'invalid' && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border-t-4 border-red-500">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Certificate Not Found</h1>
            <p className="text-[#64748B]">This code does not match any certificate in our system.</p>
          </div>
        )}
      </div>
    </div>
  )
}
