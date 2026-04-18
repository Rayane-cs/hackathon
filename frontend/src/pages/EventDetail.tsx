import { useParams } from 'react-router-dom'

export default function EventDetail() {
  const { id } = useParams()
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Event Detail</h1>
      <p className="text-muted">Event ID: {id}</p>
    </div>
  )
}
