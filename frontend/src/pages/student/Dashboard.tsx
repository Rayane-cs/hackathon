import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Bookmark, Calendar, MapPin, Users, ChevronLeft, ChevronRight,
  Sparkles, BookOpen, GraduationCap, Palette,
  Search, ArrowRight, Star, X, Heart, Bell, TrendingUp, Clock,
  CheckCircle2, AlertCircle
} from 'lucide-react';

interface Event {
  id: number; title: string; description: string; date: string; capacity: number;
  location: string; registered_count: number; school_name: string; type: string;
  image?: string; is_saved?: boolean; featured?: boolean;
}

interface SchoolInfo {
  id: number; name: string; description: string; email: string; phone?: string;
  address?: string; rating: number; students_count: number; established_year: number;
}

const featuredEvents: Event[] = [
  {
    id: 1, title: 'Science Fair 2025',
    description: 'Discover amazing student innovations and experiments. Prizes worth 50,000 DZD!',
    date: '2025-12-25T10:00:00', capacity: 200, location: 'Grand Auditorium',
    registered_count: 156, school_name: 'École Internationale', type: 'exhibition', featured: true,
    image: 'https://images.unsplash.com/photo-1563225409-127c18758bd5?w=1200&q=80'
  },
  {
    id: 2, title: 'Hackathon Challenge',
    description: '48-hour coding competition. Build the next big app!',
    date: '2025-12-20T09:00:00', capacity: 100, location: 'Tech Hub',
    registered_count: 89, school_name: 'Lycée Technique', type: 'competition', featured: true,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80'
  },
  {
    id: 3, title: 'Art Exhibition',
    description: 'Showcase of creative talents from top art schools.',
    date: '2025-12-18T14:00:00', capacity: 150, location: 'Gallery Hall',
    registered_count: 134, school_name: 'École des Arts', type: 'exhibition', featured: true,
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&q=80'
  },
];

const allEvents: Event[] = [
  { id: 4, title: 'Business Summit', description: 'Learn from industry leaders about entrepreneurship and leadership.', date: '2026-01-15T10:00:00', capacity: 80, location: 'Conference Center', registered_count: 67, school_name: 'Business Academy', type: 'seminar' },
  { id: 5, title: 'Theater Workshop', description: 'Professional acting and stage performance training with experts.', date: '2026-01-10T16:00:00', capacity: 40, location: 'Drama Studio', registered_count: 38, school_name: 'Institut des Arts', type: 'workshop' },
  { id: 6, title: 'Math Olympiad Prep', description: 'Advanced mathematics training for national competitions.', date: '2026-01-05T09:00:00', capacity: 60, location: 'Room 302', registered_count: 45, school_name: 'École Internationale', type: 'competition' },
  { id: 7, title: 'Photography Class', description: 'Learn professional photography and photo editing techniques.', date: '2025-12-28T14:00:00', capacity: 30, location: 'Art Studio', registered_count: 22, school_name: 'École des Arts', type: 'workshop' },
  { id: 8, title: 'Debate Competition', description: 'Sharpen your public speaking and argumentation skills.', date: '2026-01-20T10:00:00', capacity: 50, location: 'Main Hall', registered_count: 34, school_name: 'Lycée Technique', type: 'competition' },
  { id: 9, title: 'Web Dev Bootcamp', description: 'Learn HTML, CSS & JavaScript from scratch in 3 intensive days.', date: '2025-12-30T09:00:00', capacity: 25, location: 'Computer Lab', registered_count: 20, school_name: 'Lycée Technique', type: 'workshop' },
];

const mockSchools: SchoolInfo[] = [
  { id: 1, name: "École Internationale d'Alger", description: 'Premier international school with IB curriculum.', email: 'contact@eia.dz', phone: '+213 21 123 456', address: 'Hydra, Alger', rating: 4.8, students_count: 1200, established_year: 1985 },
  { id: 2, name: 'Lycée des Sciences', description: 'Leading technical school specializing in STEM education.', email: 'info@lst.dz', phone: '+213 21 234 567', address: 'Bab Ezzouar', rating: 4.6, students_count: 800, established_year: 1995 },
  { id: 3, name: 'École Supérieure de Commerce', description: 'Business school preparing future Algerian leaders.', email: 'contact@esc.dz', phone: '+213 21 345 678', address: 'CBD', rating: 4.7, students_count: 600, established_year: 2000 },
];

const typeConfig: Record<string, { bg: string; color: string; border: string; label: string }> = {
  workshop:    { bg: '#FFF7ED', color: '#EA580C', border: '#FED7AA', label: 'Workshop' },
  competition: { bg: '#FFF1F2', color: '#E11D48', border: '#FECDD3', label: 'Competition' },
  exhibition:  { bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE', label: 'Exhibition' },
  seminar:     { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE', label: 'Seminar' },
};

const typeGradients: Record<string, string> = {
  workshop:    'from-orange-400 to-orange-600',
  competition: 'from-rose-400 to-rose-600',
  exhibition:  'from-violet-400 to-violet-600',
  seminar:     'from-blue-400 to-blue-600',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function StudentDashboard() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState<Event[]>(allEvents);
  const [savedEvents, setSavedEvents] = useState<number[]>([]);
  const [followedSchools, setFollowedSchools] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'schools'>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<SchoolInfo | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [registerTarget, setRegisterTarget] = useState<Event | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);

  const handleRegister = (id: number) => {
    // Find from all event lists
    const ev = [...allEvents, ...featuredEvents].find(e => e.id === id)
      || events.find(e => e.id === id);
    if (ev) setRegisterTarget(ev);
  };

  const confirmRegister = (id: number) => {
    setEvents(prev => prev.map(e =>
      e.id === id ? { ...e, registered_count: Math.min(e.registered_count + 1, e.capacity) } : e
    ));
    setRegisterTarget(null);
    toast.success('Registration confirmed! 🎉');
  };

  const handleSave = (id: number) => {
    const isSaved = savedEvents.includes(id);
    setSavedEvents(prev => isSaved ? prev.filter(x => x !== id) : [...prev, id]);
    toast.success(isSaved ? 'Removed from saved' : 'Saved for later!');
  };

  const handleFollow = (id: number) => {
    const isFollowing = followedSchools.includes(id);
    setFollowedSchools(prev => isFollowing ? prev.filter(x => x !== id) : [...prev, id]);
    toast.success(isFollowing ? 'Unfollowed' : 'Now following!');
  };

  const filteredEvents = events.filter(e =>
    (e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     e.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (activeCategory === 'all' || e.type === activeCategory)
  );

  const filteredSchools = mockSchools.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', fontFamily: "'Inter', sans-serif" }}>

      {/* Top Navbar */}
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky', top: 0, zIndex: 50,
        padding: '0 2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #2563EB, #4F46E5)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={20} color="#fff" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>Scholaria</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 10, color: '#64748B' }}>
              <Bell size={20} />
            </button>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 10, color: '#64748B' }}>
              <Bookmark size={20} />
              {savedEvents.length > 0 && (
                <span style={{
                  position: 'absolute', top: 4, right: 4,
                  width: 16, height: 16, background: '#EF4444',
                  color: '#fff', borderRadius: '50%', fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{savedEvents.length}</span>
              )}
            </button>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>S</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Slider */}
      <div style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
        {featuredEvents.map((event, index) => (
          <div
            key={event.id}
            style={{
              position: 'absolute', inset: 0,
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 0.8s ease',
              pointerEvents: index === currentSlide ? 'auto' : 'none'
            }}
          >
            <img
              src={event.image}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.1) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
              <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
                <div style={{ maxWidth: 580, color: '#fff' }}>
                  <span style={{
                    display: 'inline-block', padding: '4px 14px',
                    background: typeConfig[event.type]?.color || '#2563EB',
                    borderRadius: 20, fontSize: 11, fontWeight: 700,
                    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16
                  }}>{event.type}</span>
                  <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 16, letterSpacing: '-1px' }}>
                    {event.title}
                  </h1>
                  <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', marginBottom: 24, lineHeight: 1.6 }}>
                    {event.description}
                  </p>
                  <div style={{ display: 'flex', gap: 24, fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 32 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={15} /> {formatDate(event.date)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MapPin size={15} /> {event.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Users size={15} /> {event.registered_count}/{event.capacity}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={() => handleRegister(event.id)}
                      style={{
                        background: '#2563EB', color: '#fff', border: 'none',
                        padding: '12px 28px', borderRadius: 12, fontWeight: 700,
                        fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                        transition: 'background 0.2s'
                      }}
                    >
                      Register Now <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => handleSave(event.id)}
                      style={{
                        background: savedEvents.includes(event.id) ? '#FEF3C7' : 'rgba(255,255,255,0.15)',
                        color: savedEvents.includes(event.id) ? '#D97706' : '#fff',
                        border: '1.5px solid ' + (savedEvents.includes(event.id) ? '#FCD34D' : 'rgba(255,255,255,0.3)'),
                        padding: '12px 16px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      <Bookmark size={18} style={{ fill: savedEvents.includes(event.id) ? '#D97706' : 'none' }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Controls */}
        <button onClick={prevSlide} style={{
          position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
          width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)',
          color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <ChevronLeft size={22} />
        </button>
        <button onClick={nextSlide} style={{
          position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
          width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)',
          color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <ChevronRight size={22} />
        </button>

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
          {featuredEvents.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: i === currentSlide ? 28 : 8, height: 8,
                borderRadius: 4, border: 'none', cursor: 'pointer',
                background: i === currentSlide ? '#fff' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 2rem' }}>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
          {[
            { icon: Sparkles, label: 'Events Available', value: '24', color: '#2563EB', bg: '#EFF6FF' },
            { icon: TrendingUp, label: 'Registrations', value: '856', color: '#7C3AED', bg: '#F5F3FF' },
            { icon: BookOpen, label: 'Workshops', value: '12', color: '#EA580C', bg: '#FFF7ED' },
            { icon: Star, label: 'Top Rated', value: '4.8', color: '#D97706', bg: '#FFFBEB' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} style={{
              background: '#fff', borderRadius: 16, padding: '20px 24px',
              border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['events', 'Browse Events'], ['schools', 'Schools']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                style={{
                  padding: '10px 22px', borderRadius: 10, fontWeight: 600, fontSize: 14,
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: activeTab === id ? '#2563EB' : '#fff',
                  color: activeTab === id ? '#fff' : '#64748B',
                  boxShadow: activeTab === id ? '0 4px 14px rgba(37,99,235,0.3)' : '0 1px 3px rgba(0,0,0,0.06)'
                }}
              >{label}</button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search events, schools…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: 42, paddingRight: 16, paddingTop: 10, paddingBottom: 10,
                border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14,
                outline: 'none', width: 280, color: '#0F172A', background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
            />
          </div>
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <>
            {/* Category Pills */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 36, overflowX: 'auto', paddingBottom: 4 }}>
              {[
                { id: 'all', label: 'All Events', icon: Sparkles },
                { id: 'workshop', label: 'Workshops', icon: BookOpen },
                { id: 'competition', label: 'Competitions', icon: GraduationCap },
                { id: 'exhibition', label: 'Exhibitions', icon: Palette },
                { id: 'seminar', label: 'Seminars', icon: Users },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '8px 18px', borderRadius: 30, fontSize: 13, fontWeight: 600,
                    border: '1.5px solid', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s',
                    background: activeCategory === id ? '#2563EB' : '#fff',
                    color: activeCategory === id ? '#fff' : '#475569',
                    borderColor: activeCategory === id ? '#2563EB' : '#E2E8F0',
                    boxShadow: activeCategory === id ? '0 4px 12px rgba(37,99,235,0.25)' : 'none'
                  }}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            {/* Event Cards Grid */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>
                    {activeCategory === 'all' ? 'All Events' : typeConfig[activeCategory]?.label + 's'}
                  </h2>
                  <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>{filteredEvents.length} events found</p>
                </div>
                <Link to="/student/events" style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: '#2563EB', textDecoration: 'none', fontSize: 14, fontWeight: 600
                }}>
                  View all <ArrowRight size={15} />
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {filteredEvents.map((ev) => {
                  const tc = typeConfig[ev.type] || typeConfig.seminar;
                  const isFull = ev.registered_count >= ev.capacity;
                  const isSaved = savedEvents.includes(ev.id);
                  const pct = Math.round((ev.registered_count / ev.capacity) * 100);
                  return (
                    <div key={ev.id} style={{
                      background: '#fff', borderRadius: 18, overflow: 'hidden',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      display: 'flex', flexDirection: 'column'
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
                    >
                      {/* Card Top Accent */}
                      <div style={{ height: 5, background: tc.color }} />

                      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                          <span style={{
                            padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                            background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`,
                            textTransform: 'uppercase', letterSpacing: 0.5
                          }}>{tc.label}</span>
                          <button
                            onClick={() => handleSave(ev.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: isSaved ? '#D97706' : '#CBD5E1' }}
                          >
                            <Bookmark size={18} style={{ fill: isSaved ? '#D97706' : 'none' }} />
                          </button>
                        </div>

                        {/* Title + Description */}
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 8, lineHeight: 1.4 }}>{ev.title}</h3>
                        <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, marginBottom: 16, flex: 1 }}>{ev.description}</p>

                        {/* Meta */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                          {[
                            { icon: Calendar, text: formatDate(ev.date) + ' · ' + formatTime(ev.date) },
                            { icon: MapPin, text: ev.location },
                            { icon: GraduationCap, text: ev.school_name },
                          ].map(({ icon: Icon, text }) => (
                            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B' }}>
                              <Icon size={14} color="#94A3B8" /> {text}
                            </div>
                          ))}
                        </div>

                        {/* Capacity Bar */}
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94A3B8', marginBottom: 6 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Users size={12} /> {ev.registered_count}/{ev.capacity} registered
                            </span>
                            <span style={{ fontWeight: 600, color: isFull ? '#EF4444' : tc.color }}>{pct}%</span>
                          </div>
                          <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', borderRadius: 3,
                              width: `${pct}%`,
                              background: isFull ? '#EF4444' : tc.color,
                              transition: 'width 0.4s'
                            }} />
                          </div>
                        </div>

                        {/* Register Button */}
                        <button
                          onClick={() => handleRegister(ev.id)}
                          disabled={isFull}
                          style={{
                            width: '100%', padding: '11px 0', borderRadius: 10, border: 'none',
                            fontWeight: 700, fontSize: 14, cursor: isFull ? 'not-allowed' : 'pointer',
                            background: isFull ? '#F1F5F9' : tc.color,
                            color: isFull ? '#94A3B8' : '#fff',
                            transition: 'opacity 0.2s'
                          }}
                        >
                          {isFull ? 'Event Full' : 'Register Now'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Schools Tab */}
        {activeTab === 'schools' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0 }}>Discover Schools</h2>
              <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>{filteredSchools.length} schools available</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {filteredSchools.map((school) => {
                const isFollowing = followedSchools.includes(school.id);
                return (
                  <div
                    key={school.id}
                    onClick={() => setSelectedSchool(school)}
                    style={{
                      background: '#fff', borderRadius: 18, padding: '24px',
                      border: '1.5px solid #E2E8F0', cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2563EB'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(37,99,235,0.12)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#2563EB', fontWeight: 800, fontSize: 20 }}>{school.name.charAt(0)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#FFFBEB', padding: '4px 10px', borderRadius: 20, border: '1px solid #FDE68A' }}>
                        <Star size={13} color="#D97706" style={{ fill: '#D97706' }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#D97706' }}>{school.rating}</span>
                      </div>
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>{school.name}</h3>
                    <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, marginBottom: 16 }}>{school.description}</p>
                    <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#94A3B8', marginBottom: 20 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Users size={13} /> {school.students_count.toLocaleString()} students</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={13} /> Est. {school.established_year}</span>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); handleFollow(school.id); }}
                      style={{
                        width: '100%', padding: '10px 0', borderRadius: 10, fontWeight: 700,
                        fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                        border: isFollowing ? '1.5px solid #E2E8F0' : 'none',
                        background: isFollowing ? '#F8FAFC' : '#2563EB',
                        color: isFollowing ? '#475569' : '#fff'
                      }}
                    >
                      {isFollowing ? '✓ Following' : 'Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* School Modal */}
      {/* Registration Confirmation Modal */}
      {registerTarget && (() => {
        const ev = events.find(e => e.id === registerTarget.id) || registerTarget;
        const seats = ev.capacity - ev.registered_count;
        const isFull = seats <= 0;
        const tc = typeConfig[ev.type] || typeConfig.seminar;
        const pct = Math.round((ev.registered_count / ev.capacity) * 100);
        return (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}
            onClick={() => setRegisterTarget(null)}
          >
            <div
              style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 480, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ padding: '24px 28px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: tc.bg, border: `1.5px solid ${tc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GraduationCap size={20} color={tc.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: tc.color, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{tc.label}</p>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>{ev.title}</h3>
                  </div>
                </div>
                <button onClick={() => setRegisterTarget(null)} style={{ background: '#F1F5F9', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#64748B', flexShrink: 0 }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: '20px 28px' }}>
                {/* Event meta */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {[
                    { icon: Calendar, text: formatDate(ev.date) + ' at ' + formatTime(ev.date) },
                    { icon: MapPin, text: ev.location },
                    { icon: GraduationCap, text: ev.school_name },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#475569' }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={14} color='#94A3B8' />
                      </div>
                      {text}
                    </div>
                  ))}
                </div>

                {/* Capacity */}
                <div style={{ background: isFull ? '#FFF1F2' : '#F8FAFC', border: `1.5px solid ${isFull ? '#FECDD3' : '#E2E8F0'}`, borderRadius: 14, padding: '14px 18px', marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Users size={14} /> Seat Availability
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: isFull ? '#E11D48' : '#16A34A' }}>
                      {isFull ? 'No seats left' : `${seats} seat${seats === 1 ? '' : 's'} left`}
                    </span>
                  </div>
                  <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: 4, background: isFull ? '#E11D48' : tc.color, transition: 'width 0.4s' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94A3B8' }}>
                    <span>{ev.registered_count} registered</span>
                    <span>{ev.capacity} total capacity</span>
                  </div>
                </div>

                {/* Status message */}
                {isFull ? (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#FFF1F2', border: '1.5px solid #FECDD3', borderRadius: 14, padding: '14px 18px', marginBottom: 20 }}>
                    <AlertCircle size={20} color='#E11D48' style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#E11D48', marginBottom: 2 }}>This event is fully booked</p>
                      <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5 }}>All seats have been taken. Save this event to get notified if a spot opens up.</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: 14, padding: '14px 18px', marginBottom: 20 }}>
                    <CheckCircle2 size={20} color='#16A34A' style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#15803D', marginBottom: 2 }}>Spots available!</p>
                      <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>You're about to register for this event. This action cannot be undone.</p>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setRegisterTarget(null)}
                    style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: '1.5px solid #E2E8F0', background: '#F8FAFC', color: '#475569', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  {isFull ? (
                    <button
                      onClick={() => { handleSave(ev.id); setRegisterTarget(null); }}
                      style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: 'none', background: '#F1F5F9', color: '#475569', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                    >
                      <Bookmark size={15} /> Save Event
                    </button>
                  ) : (
                    <button
                      onClick={() => confirmRegister(ev.id)}
                      style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: 'none', background: '#2563EB', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 4px 14px rgba(37,99,235,0.35)' }}
                    >
                      <CheckCircle2 size={15} /> Confirm Registration
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {selectedSchool && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setSelectedSchool(null)}
        >
          <div
            style={{ background: '#fff', borderRadius: 24, padding: 36, maxWidth: 520, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#2563EB', fontWeight: 800, fontSize: 22 }}>{selectedSchool.name.charAt(0)}</span>
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>{selectedSchool.name}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                    <Star size={14} color="#D97706" style={{ fill: '#D97706' }} />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{selectedSchool.rating}</span>
                    <span style={{ color: '#94A3B8', fontSize: 13 }}>· {selectedSchool.students_count} students</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedSchool(null)} style={{ background: '#F8FAFC', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>{selectedSchool.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
              {[
                ['Email', selectedSchool.email],
                ['Phone', selectedSchool.phone || '—'],
                ['Address', selectedSchool.address || '—'],
                ['Est. Year', selectedSchool.established_year.toString()],
              ].map(([label, value]) => (
                <div key={label} style={{ background: '#F8FAFC', borderRadius: 12, padding: '12px 16px', border: '1px solid #E2E8F0' }}>
                  <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => { toast.success('Applied!'); setSelectedSchool(null); }}
                style={{ flex: 1, background: '#2563EB', color: '#fff', border: 'none', padding: '13px 0', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
              >Apply Now</button>
              <button
                onClick={() => handleFollow(selectedSchool.id)}
                style={{
                  padding: '13px 18px', borderRadius: 12, border: '1.5px solid #E2E8F0', cursor: 'pointer', background: '#F8FAFC',
                  color: followedSchools.includes(selectedSchool.id) ? '#EF4444' : '#64748B'
                }}
              >
                <Heart size={18} style={{ fill: followedSchools.includes(selectedSchool.id) ? '#EF4444' : 'none' }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
