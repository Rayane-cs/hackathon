import { useParams } from 'react-router-dom'

export default function TeacherPublicProfile() {
  const { id } = useParams()
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Teacher Profile</h1>
      <p className="text-muted">Teacher ID: {id}</p>
    </div>
  )
}
