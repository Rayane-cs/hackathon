import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Card from '../components/Card';
import Navbar from '../components/Navbar';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

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
  type: 'event' | 'workshop' | 'seminar';
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
}

interface Registration {
  id: number;
  student_name: string;
  student_email: string;
  event_title: string;
  status: string;
  registered_at: string;
}

const SchoolDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState('events');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'event' as 'event' | 'workshop' | 'seminar',
    date: '',
    capacity: '',
    location: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    // Bypass authentication for development - comment out for production
    // if (!token || !userData) {
    //   navigate('/login');
    //   return;
    // }

    // Mock user for development if no user exists
    let parsedUser;
    if (userData) {
      parsedUser = JSON.parse(userData);
    } else {
      // Create a mock school user for testing
      parsedUser = {
        id: 2,
        name: 'Test School',
        email: 'school@scholaria.dz',
        role: 'school'
      };
      localStorage.setItem('user', JSON.stringify(parsedUser));
      localStorage.setItem('access_token', 'mock-token-for-development');
    }
    
    if (parsedUser.role !== 'school') {
      navigate('/student-dashboard');
      return;
    }

    setUser(parsedUser);
    fetchAllData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchEvents(), fetchRegistrations()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    // Mock events data - no backend required
    const mockEvents = [
      {
        id: 1,
        title: 'Science Fair 2024',
        description: 'Annual science fair showcasing student projects and experiments from all grades.',
        date: '2024-12-25T10:00:00',
        capacity: 50,
        location: 'School Auditorium',
        registered_count: 35,
        available_spots: 15,
        is_full: false,
        type: 'event' as const,
        status: 'active' as const,
        created_at: '2024-11-01T10:00:00'
      },
      {
        id: 2,
        title: 'Programming Workshop',
        description: 'Learn the basics of Python programming with hands-on coding exercises.',
        date: '2024-12-20T14:00:00',
        capacity: 30,
        location: 'Computer Lab',
        registered_count: 28,
        available_spots: 2,
        is_full: false,
        type: 'workshop' as const,
        status: 'active' as const,
        created_at: '2024-11-15T10:00:00'
      },
      {
        id: 3,
        title: 'Art Exhibition',
        description: 'Student artwork showcase featuring paintings, sculptures, and digital art.',
        date: '2024-12-18T09:00:00',
        capacity: 100,
        location: 'Art Gallery Hall',
        registered_count: 100,
        available_spots: 0,
        is_full: true,
        type: 'event' as const,
        status: 'active' as const,
        created_at: '2024-11-20T10:00:00'
      },
      {
        id: 4,
        title: 'Mathematics Seminar',
        description: 'Advanced mathematics seminar for high school students.',
        date: '2024-12-15T10:00:00',
        capacity: 40,
        location: 'Lecture Hall B',
        registered_count: 38,
        available_spots: 2,
        is_full: false,
        type: 'seminar' as const,
        status: 'completed' as const,
        created_at: '2024-11-10T10:00:00'
      },
      {
        id: 5,
        title: 'Robotics Workshop',
        description: 'Introduction to robotics and Arduino programming.',
        date: '2025-01-10T13:00:00',
        capacity: 25,
        location: 'STEM Lab',
        registered_count: 20,
        available_spots: 5,
        is_full: false,
        type: 'workshop' as const,
        status: 'active' as const,
        created_at: '2024-12-01T10:00:00'
      }
    ];
    setEvents(mockEvents);
  };

  const fetchRegistrations = async () => {
    // Mock registrations data - no backend required
    const mockRegistrations = [
      {
        id: 1,
        student_name: 'Ahmed Benali',
        student_email: 'ahmed.benali@student.dz',
        event_title: 'Science Fair 2024',
        status: 'approved',
        registered_at: '2024-12-01T10:30:00'
      },
      {
        id: 2,
        student_name: 'Sarah Mansouri',
        student_email: 'sarah.mansouri@student.dz',
        event_title: 'Programming Workshop',
        status: 'pending',
        registered_at: '2024-12-05T14:15:00'
      },
      {
        id: 3,
        student_name: 'Karim Hadj',
        student_email: 'karim.hadj@student.dz',
        event_title: 'Art Exhibition',
        status: 'approved',
        registered_at: '2024-12-08T09:45:00'
      },
      {
        id: 4,
        student_name: 'Leila Bouaziz',
        student_email: 'leila.bouaziz@student.dz',
        event_title: 'Robotics Workshop',
        status: 'pending',
        registered_at: '2024-12-10T16:20:00'
      },
      {
        id: 5,
        student_name: 'Mohamed Kaci',
        student_email: 'mohamed.kaci@student.dz',
        event_title: 'Science Fair 2024',
        status: 'approved',
        registered_at: '2024-12-12T11:00:00'
      }
    ];
    setRegistrations(mockRegistrations);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock create event - no backend required
    const newEventData = {
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
      status: 'active' as const,
      created_at: new Date().toISOString()
    };
    
    setEvents(prev => [...prev, newEventData]);
    toast.success(`${newEvent.type.charAt(0).toUpperCase() + newEvent.type.slice(1)} created successfully!`);
    setShowCreateModal(false);
    setNewEvent({
      title: '',
      description: '',
      type: 'event',
      date: '',
      capacity: '',
      location: ''
    });
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    // Mock delete event - no backend required
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast.success('Event deleted successfully!');
  };

  const handleUpdateEvent = async (eventId: number, updates: Partial<Event>) => {
    // Mock update event - no backend required
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
    toast.success('Event updated successfully!');
  };

  const handleApproveRegistration = async (registrationId: number) => {
    // Mock approve registration - no backend required
    setRegistrations(prev => prev.map(reg => 
      reg.id === registrationId ? { ...reg, status: 'approved' } : reg
    ));
    toast.success('Registration approved!');
  };

  const handleRejectRegistration = async (registrationId: number) => {
    // Mock reject registration - no backend required
    setRegistrations(prev => prev.map(reg => 
      reg.id === registrationId ? { ...reg, status: 'rejected' } : reg
    ));
    toast.success('Registration rejected!');
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-orange-100 text-orange-800';
      case 'seminar': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalEvents: events.length,
    totalRegistrations: registrations.length,
    upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length,
    averageAttendance: events.length > 0 
      ? Math.round((events.reduce((sum, e) => sum + e.registered_count, 0) / events.reduce((sum, e) => sum + e.capacity, 0)) * 100)
      : 0
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading School Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 🏫
          </h1>
          <p className="text-gray-600">
            Manage your events, workshops, and track student registrations.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{stats.totalEvents}</div>
              <div className="text-blue-100">Total Events</div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{stats.totalRegistrations}</div>
              <div className="text-green-100">Total Registrations</div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{stats.upcomingEvents}</div>
              <div className="text-purple-100">Upcoming Events</div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{stats.averageAttendance}%</div>
              <div className="text-orange-100">Avg. Attendance</div>
            </div>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button 
            variant="primary" 
            onClick={() => setShowCreateModal(true)}
          >
            + Create Event/Workshop
          </Button>
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'events', label: '📅 My Events' },
            { id: 'registrations', label: '👥 Registrations' },
            { id: 'analytics', label: '📊 Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            {filteredEvents.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                  <p className="text-gray-600 mb-4">Create your first event or workshop to get started.</p>
                  <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    Create Event
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id} hover>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <div className="flex gap-2 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getEventTypeColor(event.type)}`}>
                            {event.type}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-2">📅</span>
                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-2">📍</span>
                        {event.location || 'Online'}
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-2">👥</span>
                        {event.registered_count}/{event.capacity} registered
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(event.registered_count / event.capacity) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 text-sm"
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowParticipantsModal(true);
                        }}
                      >
                        View Participants
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div>
            {registrations.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4 text-4xl">👥</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations yet</h3>
                  <p className="text-gray-600">Students will appear here when they register for your events.</p>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Event</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((registration) => (
                        <tr key={registration.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{registration.student_name}</div>
                              <div className="text-sm text-gray-500">{registration.student_email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-700">{registration.event_title}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              registration.status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : registration.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {registration.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-sm">
                            {new Date(registration.registered_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {registration.status === 'pending' && (
                                <>
                                  <Button
                                    variant="outline"
                                    className="text-sm text-green-600"
                                    onClick={() => handleApproveRegistration(registration.id)}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="text-sm text-red-600"
                                    onClick={() => handleRejectRegistration(registration.id)}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Event Performance</h3>
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500">
                        {event.registered_count}/{event.capacity} registered
                      </div>
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(event.registered_count / event.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {Math.round((event.registered_count / event.capacity) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Most Popular Event</span>
                  <span className="font-semibold text-gray-900">
                    {events.length > 0 
                      ? events.reduce((max, event) => 
                          event.registered_count > max.registered_count ? event : max
                        ).title
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Capacity</span>
                  <span className="font-semibold text-gray-900">
                    {events.reduce((sum, e) => sum + e.capacity, 0)} seats
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average per Event</span>
                  <span className="font-semibold text-gray-900">
                    {events.length > 0 
                      ? Math.round(events.reduce((sum, e) => sum + e.registered_count, 0) / events.length)
                      : 0
                    } students
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Create Event Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Create New Event/Workshop</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="event">Event</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="Enter event title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    rows={3}
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder="Describe your event..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent({...newEvent, capacity: e.target.value})}
                    placeholder="Number of participants"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    placeholder="Event location (optional)"
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                  >
                    Create {newEvent.type.charAt(0).toUpperCase() + newEvent.type.slice(1)}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolDashboard;
