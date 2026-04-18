import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Calendar, Users, Eye, Trash2, Search, X, MapPin, CheckCircle, TrendingUp } from 'lucide-react';

interface Event {
  id: number; title: string; description: string; date: string; capacity: number;
  location: string; registered_count: number; available_spots: number; is_full: boolean;
  type: 'event' | 'workshop' | 'seminar' | 'competition'; status: 'active' | 'completed' | 'cancelled'; views: number; image?: string;
}
interface Registration {
  id: number; student_name: string; student_email: string; event_title: string;
  status: 'pending' | 'approved' | 'rejected'; registered_at: string;
}

const mockStats = { total_events: 24, total_registrations: 856, active_events: 8, views_this_month: 12500 };

const mockEvents: Event[] = [
  { id: 1, title: 'Science Fair 2025', description: 'Annual science fair showcasing student innovations.', date: '2025-12-25T10:00:00', capacity: 200, location: 'Grand Auditorium', registered_count: 156, available_spots: 44, is_full: false, type: 'event', status: 'active', views: 2340 },
  { id: 2, title: 'Programming Workshop', description: 'Learn Python from basics to advanced.', date: '2025-12-20T14:00:00', capacity: 50, location: 'Computer Lab 3', registered_count: 48, available_spots: 2, is_full: true, type: 'workshop', status: 'active', views: 1890 },
  { id: 3, title: 'Art Exhibition', description: 'Student artwork showcase.', date: '2025-12-18T10:00:00', capacity: 150, location: 'Art Gallery Hall', registered_count: 134, available_spots: 16, is_full: false, type: 'event', status: 'active', views: 1560 },
  { id: 4, title: 'Business Leadership Seminar', description: 'Guest lecture by industry leaders.', date: '2025-12-15T16:00:00', capacity: 100, location: 'Conference Center', registered_count: 92, available_spots: 8, is_full: false, type: 'seminar', status: 'active', views: 1230 },
];

const mockRegistrations: Registration[] = [
  { id: 1, student_name: 'Ahmed Benali', student_email: 'ahmed@student.dz', event_title: 'Science Fair 2025', status: 'approved', registered_at: '2025-12-01T10:30:00' },
  { id: 2, student_name: 'Sarah Mansouri', student_email: 'sarah@student.dz', event_title: 'Programming Workshop', status: 'pending', registered_at: '2025-12-05T14:15:00' },
  { id: 3, student_name: 'Karim Hadj', student_email: 'karim@student.dz', event_title: 'Art Exhibition', status: 'approved', registered_at: '2025-12-08T09:45:00' },
  { id: 4, student_name: 'Leila Bouaziz', student_email: 'leila@student.dz', event_title: 'Math Olympiad', status: 'pending', registered_at: '2025-12-10T16:20:00' },
];

const typeColors: Record<string, string> = { workshop: '#F97316', seminar: '#8B5CF6', competition: '#EF4444', event: '#2563EB' };
const typeBg: Record<string, string> = { workshop: '#FFF7ED', seminar: '#F5F3FF', competition: '#FEF2F2', event: '#EFF6FF' };

export default function AcademyDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'registrations'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', type: 'event' as const, date: '', capacity: '', location: '' });

  useEffect(() => {
    setEvents(mockEvents);
    setRegistrations(mockRegistrations);
  }, []);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Event = { id: events.length + 1, title: newEvent.title, description: newEvent.description, date: newEvent.date, capacity: parseInt(newEvent.capacity), location: newEvent.location, registered_count: 0, available_spots: parseInt(newEvent.capacity), is_full: false, type: newEvent.type, status: 'active', views: 0 };
    setEvents(prev => [...prev, created]);
    toast.success('Event created!');
    setShowCreateModal(false);
    setNewEvent({ title: '', description: '', type: 'event', date: '', capacity: '', location: '' });
  };

  const handleDelete = (id: number) => { if (!confirm('Delete this event?')) return; setEvents(prev => prev.filter(e => e.id !== id)); toast.success('Event deleted'); };
  const handleApprove = (id: number) => { setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r)); toast.success('Approved!'); };
  const handleReject = (id: number) => { setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r)); toast.success('Rejected'); };

  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const inputStyle = { width: '100%', padding: '10px 14px', fontSize: 14, border: '1.5px solid #E2E8F0', borderRadius: 10, outline: 'none', color: '#0B1D3A', background: '#fff', boxSizing: 'border-box' as const, fontFamily: "'DM Sans', sans-serif" };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '0 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#2563EB', letterSpacing: '-0.5px' }}>Scholaria</span>
            <nav style={{ display: 'flex', gap: 4 }}>
              {['overview', 'events', 'registrations'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab as any)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, textTransform: 'capitalize', background: activeTab === tab ? '#EFF6FF' : 'transparent', color: activeTab === tab ? '#2563EB' : '#64748B' }}>
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          <button onClick={() => setShowCreateModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#2563EB', color: '#fff', padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
            <Plus size={16} /> Create Event
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Events', value: mockStats.total_events, icon: Calendar, color: '#2563EB', bg: '#EFF6FF' },
            { label: 'Registrations', value: mockStats.total_registrations, icon: Users, color: '#22C55E', bg: '#F0FDF4' },
            { label: 'Active Events', value: mockStats.active_events, icon: TrendingUp, color: '#8B5CF6', bg: '#F5F3FF' },
            { label: 'Views This Month', value: mockStats.views_this_month.toLocaleString(), icon: Eye, color: '#F97316', bg: '#FFF7ED' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, background: bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0B1D3A' }}>{value}</div>
                <div style={{ fontSize: 13, color: '#64748B' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0B1D3A', marginBottom: 20 }}>Event Performance</h3>
              {events.slice(0, 5).map(ev => (
                <div key={ev.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#0B1D3A' }}>{ev.title}</span>
                    <span style={{ fontSize: 13, color: '#64748B' }}>{ev.registered_count}/{ev.capacity}</span>
                  </div>
                  <div style={{ height: 6, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(ev.registered_count / ev.capacity) * 100}%`, background: '#2563EB', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0B1D3A', marginBottom: 20 }}>Recent Registrations</h3>
              {registrations.slice(0, 4).map(reg => (
                <div key={reg.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, background: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#2563EB', flexShrink: 0 }}>
                    {reg.student_name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0B1D3A' }}>{reg.student_name}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>{reg.event_title}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: reg.status === 'approved' ? '#F0FDF4' : reg.status === 'rejected' ? '#FEF2F2' : '#FEFCE8', color: reg.status === 'approved' ? '#16A34A' : reg.status === 'rejected' ? '#DC2626' : '#CA8A04' }}>
                    {reg.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search events..." style={{ ...inputStyle, paddingLeft: 40 }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {filteredEvents.map(ev => (
                <div key={ev.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '20px 20px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: typeBg[ev.type], color: typeColors[ev.type] }}>{ev.type}</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => handleDelete(ev.id)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Trash2 size={14} color="#EF4444" />
                        </button>
                      </div>
                    </div>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0B1D3A', marginBottom: 8 }}>{ev.title}</h4>
                    <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5, marginBottom: 16 }}>{ev.description}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B' }}>
                        <Calendar size={13} /> {new Date(ev.date).toLocaleDateString()}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B' }}>
                        <MapPin size={13} /> {ev.location}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B' }}>
                        <Users size={13} /> {ev.registered_count}/{ev.capacity} registered
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ height: 4, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(ev.registered_count / ev.capacity) * 100}%`, background: ev.is_full ? '#EF4444' : '#2563EB', borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 6 }}>{ev.available_spots} spots left</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Student', 'Event', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#64748B' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {registrations.map(reg => (
                  <tr key={reg.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#0B1D3A' }}>{reg.student_name}</div>
                      <div style={{ fontSize: 12, color: '#94A3B8' }}>{reg.student_email}</div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: '#334155' }}>{reg.event_title}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748B' }}>{new Date(reg.registered_at).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: reg.status === 'approved' ? '#F0FDF4' : reg.status === 'rejected' ? '#FEF2F2' : '#FEFCE8', color: reg.status === 'approved' ? '#16A34A' : reg.status === 'rejected' ? '#DC2626' : '#CA8A04' }}>
                        {reg.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      {reg.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => handleApprove(reg.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, border: '1px solid #BBF7D0', background: '#F0FDF4', color: '#16A34A', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                            <CheckCircle size={13} /> Approve
                          </button>
                          <button onClick={() => handleReject(reg.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, border: '1px solid #FCA5A5', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                            <X size={13} /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0B1D3A' }}>Create Event</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 5 }}>Title</label><input required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} style={inputStyle} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 5 }}>Description</label><textarea required value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 5 }}>Type</label>
                  <select value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value as any })} style={inputStyle}>
                    {['event', 'workshop', 'seminar', 'competition'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 5 }}>Capacity</label><input type="number" required value={newEvent.capacity} onChange={e => setNewEvent({ ...newEvent, capacity: e.target.value })} style={inputStyle} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 5 }}>Date & Time</label><input type="datetime-local" required value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} style={inputStyle} /></div>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 5 }}>Location</label><input required value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} style={inputStyle} /></div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#64748B' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
