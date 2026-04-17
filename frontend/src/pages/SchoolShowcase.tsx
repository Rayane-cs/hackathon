import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Plus,
  Calendar,
  Users,
  TrendingUp,
  School,
  Clock,
  CheckCircle,
  X,
  Edit2,
  Trash2,
  MoreHorizontal,
  BarChart3,
  Star,
  Eye,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Palette,
  FlaskConical,
  Trophy,
  Globe,
  Briefcase,
  ChevronRight,
  ArrowUpRight,
  LayoutGrid,
  List,
  Search,
  Filter,
  Download,
  Share2,
  Settings,
  Bell,
  UserPlus
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Navbar from '../components/Navbar';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  capacity: number;
  location: string;
  registered_count: number;
  available_spots: number;
  is_full: boolean;
  type: 'event' | 'workshop' | 'seminar' | 'competition';
  status: 'active' | 'completed' | 'cancelled';
  views: number;
  image?: string;
}

interface Registration {
  id: number;
  student_name: string;
  student_email: string;
  event_title: string;
  status: 'pending' | 'approved' | 'rejected';
  registered_at: string;
  student_avatar?: string;
}

interface SchoolStats {
  total_events: number;
  total_registrations: number;
  active_events: number;
  completed_events: number;
  followers: number;
  rating: number;
  views_this_month: number;
}

interface SchoolProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  website?: string;
  founded_year: number;
  student_capacity: number;
  services: string[];
  image?: string;
  cover_image?: string;
}

const SchoolShowcase: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'registrations' | 'analytics'>('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  const mockProfile: SchoolProfile = {
    id: 1,
    name: 'École Internationale d\'Alger',
    email: 'contact@eia.dz',
    phone: '+213 21 123 456',
    address: 'Hydra, Alger, Algeria',
    description: 'Premier international school offering world-class education with IB curriculum, modern facilities, and exceptional faculty. We prepare students for global success through innovative teaching methods and comprehensive programs.',
    website: 'www.eia.dz',
    founded_year: 1985,
    student_capacity: 1200,
    services: ['International Baccalaureate', 'STEM Labs', 'Sports Complex', 'Arts Center', 'Language Programs'],
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
    cover_image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200'
  };

  const mockStats: SchoolStats = {
    total_events: 24,
    total_registrations: 856,
    active_events: 8,
    completed_events: 16,
    followers: 2340,
    rating: 4.8,
    views_this_month: 12500
  };

  const mockEvents: Event[] = [
    {
      id: 1,
      title: '🚀 Science Fair 2024',
      description: 'Annual science fair showcasing student innovations and experiments from all grades. Prizes worth 50,000 DZD!',
      date: '2024-12-25T10:00:00',
      capacity: 200,
      location: 'Grand Auditorium',
      registered_count: 156,
      available_spots: 44,
      is_full: false,
      type: 'event',
      status: 'active',
      views: 2340,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600'
    },
    {
      id: 2,
      title: '💻 Programming Workshop',
      description: 'Learn Python programming from basics to advanced concepts. Hands-on coding sessions.',
      date: '2024-12-20T14:00:00',
      capacity: 50,
      location: 'Computer Lab 3',
      registered_count: 48,
      available_spots: 2,
      is_full: true,
      type: 'workshop',
      status: 'active',
      views: 1890,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'
    },
    {
      id: 3,
      title: '🎨 Art Exhibition',
      description: 'Student artwork showcase featuring paintings, sculptures, and digital art.',
      date: '2024-12-18T10:00:00',
      capacity: 150,
      location: 'Art Gallery Hall',
      registered_count: 134,
      available_spots: 16,
      is_full: false,
      type: 'event',
      status: 'active',
      views: 1560,
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600'
    },
    {
      id: 4,
      title: '📊 Business Leadership Seminar',
      description: 'Guest lecture by industry leaders on entrepreneurship and leadership skills.',
      date: '2024-12-15T16:00:00',
      capacity: 100,
      location: 'Conference Center',
      registered_count: 92,
      available_spots: 8,
      is_full: false,
      type: 'seminar',
      status: 'active',
      views: 1230,
      image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=600'
    },
    {
      id: 5,
      title: '🏆 Math Olympiad Competition',
      description: 'Inter-school mathematics competition with prizes for top performers.',
      date: '2025-01-10T09:00:00',
      capacity: 80,
      location: 'Exam Hall A',
      registered_count: 76,
      available_spots: 4,
      is_full: false,
      type: 'competition',
      status: 'active',
      views: 980,
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600'
    },
    {
      id: 6,
      title: '🎭 Theater Workshop',
      description: 'Professional acting and performance training for aspiring actors.',
      date: '2025-01-15T17:00:00',
      capacity: 30,
      location: 'Drama Studio',
      registered_count: 28,
      available_spots: 2,
      is_full: false,
      type: 'workshop',
      status: 'active',
      views: 750,
      image: 'https://images.unsplash.com/photo-1507676184212-d1ab0a8e5dee?w=600'
    }
  ];

  const mockRegistrations: Registration[] = [
    { id: 1, student_name: 'Ahmed Benali', student_email: 'ahmed@student.dz', event_title: '🚀 Science Fair 2024', status: 'approved', registered_at: '2024-12-01T10:30:00', student_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { id: 2, student_name: 'Sarah Mansouri', student_email: 'sarah@student.dz', event_title: '💻 Programming Workshop', status: 'pending', registered_at: '2024-12-05T14:15:00', student_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
    { id: 3, student_name: 'Karim Hadj', student_email: 'karim@student.dz', event_title: '🎨 Art Exhibition', status: 'approved', registered_at: '2024-12-08T09:45:00', student_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
    { id: 4, student_name: 'Leila Bouaziz', student_email: 'leila@student.dz', event_title: '🏆 Math Olympiad', status: 'pending', registered_at: '2024-12-10T16:20:00', student_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
    { id: 5, student_name: 'Mohamed Kaci', student_email: 'mohamed@student.dz', event_title: '🚀 Science Fair 2024', status: 'approved', registered_at: '2024-12-12T11:00:00', student_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
    { id: 6, student_name: 'Fatima Zohra', student_email: 'fatima@student.dz', event_title: '📊 Business Leadership', status: 'approved', registered_at: '2024-12-13T13:30:00', student_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }
  ];

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'event' as const,
    date: '',
    capacity: '',
    location: ''
  });

  useEffect(() => {
    // Mock auth bypass
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      const mockUser = {
        id: 2,
        email: 'school@scholaria.dz',
        name: 'École Internationale',
        role: 'school'
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('access_token', 'mock-school-token');
    }
    
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(false);
    setProfile(mockProfile);
    setStats(mockStats);
    setEvents(mockEvents);
    setRegistrations(mockRegistrations);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEventData: Event = {
      id: events.length + 1,
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      capacity: parseInt(newEvent.capacity),
      location: newEvent.location,
      registered_count: 0,
      available_spots: parseInt(newEvent.capacity),
      is_full: false,
      type: newEvent.type,
      status: 'active',
      views: 0
    };
    
    setEvents(prev => [...prev, newEventData]);
    toast.success(`${newEvent.type.charAt(0).toUpperCase() + newEvent.type.slice(1)} created successfully!`);
    setShowCreateModal(false);
    setNewEvent({ title: '', description: '', type: 'event', date: '', capacity: '', location: '' });
  };

  const handleDeleteEvent = (eventId: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast.success('Event deleted successfully!');
  };

  const handleApproveRegistration = (registrationId: number) => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === registrationId ? { ...reg, status: 'approved' } : reg
    ));
    toast.success('Registration approved!');
  };

  const handleRejectRegistration = (registrationId: number) => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === registrationId ? { ...reg, status: 'rejected' } : reg
    ));
    toast.success('Registration rejected!');
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-orange-100 text-orange-700';
      case 'seminar': return 'bg-purple-100 text-purple-700';
      case 'competition': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Header */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
          <div className="flex items-end gap-6">
            <img
              src={profile?.image}
              alt={profile?.name}
              className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover"
            />
            <div className="text-white pb-2">
              <h1 className="text-3xl font-bold mb-1">{profile?.name}</h1>
              <div className="flex items-center gap-4 text-sm text-white/90">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {stats?.rating} Rating
                </span>
                <span>•</span>
                <span>{stats?.followers.toLocaleString()} followers</span>
                <span>•</span>
                <span>Est. {profile?.founded_year}</span>
              </div>
            </div>
          </div>
          <div className="ml-auto flex gap-3 pb-2">
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => setShowEditProfile(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button
              variant="primary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats?.total_events}</div>
                <div className="text-blue-100">Total Events</div>
              </div>
              <Calendar className="w-10 h-10 text-blue-200" />
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats?.total_registrations}</div>
                <div className="text-green-100">Registrations</div>
              </div>
              <Users className="w-10 h-10 text-green-200" />
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats?.active_events}</div>
                <div className="text-purple-100">Active Events</div>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-200" />
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{(stats?.views_this_month || 0).toLocaleString()}</div>
                <div className="text-orange-100">Views This Month</div>
              </div>
              <Eye className="w-10 h-10 text-orange-200" />
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {[
            { id: 'overview', label: '📊 Overview', icon: LayoutGrid },
            { id: 'events', label: '📅 Events', icon: Calendar },
            { id: 'registrations', label: '👥 Registrations', icon: Users },
            { id: 'analytics', label: '📈 Analytics', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* About Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">About School</h2>
                <p className="text-gray-600 mb-6">{profile?.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{profile?.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium">{profile?.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">Address</div>
                      <div className="font-medium">{profile?.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">Website</div>
                      <div className="font-medium">{profile?.website}</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Services & Programs</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {profile?.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        {index === 0 ? <Award className="w-5 h-5" /> :
                         index === 1 ? <FlaskConical className="w-5 h-5" /> :
                         index === 2 ? <Trophy className="w-5 h-5" /> :
                         index === 3 ? <Palette className="w-5 h-5" /> :
                         <BookOpen className="w-5 h-5" />}
                      </div>
                      <span className="font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 justify-start"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Event
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 justify-start"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Students
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 justify-start"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 justify-start"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {registrations.slice(0, 4).map((reg) => (
                    <div key={reg.id} className="flex items-center gap-3">
                      <img
                        src={reg.student_avatar}
                        alt={reg.student_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{reg.student_name}</div>
                        <div className="text-xs text-gray-500">Registered for {reg.event_title}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(reg.status)}`}>
                        {reg.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Types</option>
                <option value="event">Events</option>
                <option value="workshop">Workshops</option>
                <option value="seminar">Seminars</option>
                <option value="competition">Competitions</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id} hover className="relative">
                    <div className="relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-48 object-cover rounded-t-lg -mx-6 -mt-6 mb-4"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => setShowEventDetails(event)}
                          className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 bg-white/90 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                    <h3 className="text-lg font-semibold mt-2 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {event.registered_count}/{event.capacity} registered
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {event.views} views
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(event.registered_count / event.capacity) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {event.available_spots} spots remaining
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Event</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Registrations</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.map((event) => (
                        <tr key={event.id} className="border-b border-gray-100">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img src={event.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                              <div>
                                <div className="font-medium">{event.title}</div>
                                <span className={`text-xs px-2 py-0.5 rounded ${getEventTypeColor(event.type)}`}>
                                  {event.type}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">{new Date(event.date).toLocaleDateString()}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>{event.registered_count}/{event.capacity}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              event.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {event.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setShowEventDetails(event)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Student</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Event</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={reg.student_avatar}
                            alt={reg.student_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium">{reg.student_name}</div>
                            <div className="text-sm text-gray-500">{reg.student_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{reg.event_title}</td>
                      <td className="py-4 px-4 text-gray-600">{new Date(reg.registered_at).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reg.status)}`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {reg.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveRegistration(reg.id)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectRegistration(reg.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Event Performance</h3>
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <div key={event.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{event.title}</span>
                      <span className="text-sm text-gray-500">{event.registered_count} registrations</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min((event.registered_count / event.capacity) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Events</h3>
              <div className="space-y-4">
                {events.sort((a, b) => b.views - a.views).slice(0, 5).map((event, index) => (
                  <div key={event.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="text-xs text-gray-500">{event.views.toLocaleString()} views</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create New Event</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                  placeholder="Event description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="event">Event</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="competition">Competition</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    required
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent({...newEvent, capacity: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Room 101"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Create Event
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${getEventTypeColor(showEventDetails.type)}`}>
                  {showEventDetails.type}
                </span>
                <h2 className="text-2xl font-bold">{showEventDetails.title}</h2>
              </div>
              <button onClick={() => setShowEventDetails(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <img
              src={showEventDetails.image}
              alt={showEventDetails.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <p className="text-gray-600 mb-6">{showEventDetails.description}</p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="font-medium">{new Date(showEventDetails.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-medium">{showEventDetails.location}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Registrations</div>
                  <div className="font-medium">{showEventDetails.registered_count} / {showEventDetails.capacity}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Views</div>
                  <div className="font-medium">{showEventDetails.views.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowEventDetails(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  setShowEventDetails(null);
                  toast.success('Event details copied to clipboard!');
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Event
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SchoolShowcase;
