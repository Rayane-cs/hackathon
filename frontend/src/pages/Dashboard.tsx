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
  role: 'student' | 'school';
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
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const navigate = useNavigate();

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    capacity: '',
    location: ''
  });

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
      // Default to student user for testing
      parsedUser = {
        id: 1,
        name: 'Test User',
        email: 'user@scholaria.dz',
        role: 'student'
      };
      localStorage.setItem('user', JSON.stringify(parsedUser));
      localStorage.setItem('access_token', 'mock-token-for-development');
    }
    
    // Redirect to appropriate page based on role
    if (parsedUser.role === 'student') {
      navigate('/discover');
      return;
    } else if (parsedUser.role === 'school') {
      navigate('/school-dashboard');
      return;
    }
    
    setUser(parsedUser);
    fetchEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      let url = 'http://localhost:5000/api/events';
      if (userData.role === 'school') {
        url = 'http://localhost:5000/api/events/school/my-events';
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      } else {
        toast.error('Failed to fetch events');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch('http://localhost:5000/api/events/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newEvent,
          capacity: parseInt(newEvent.capacity)
        })
      });

      if (response.ok) {
        toast.success('Event created successfully!');
        setShowCreateEvent(false);
        setNewEvent({
          title: '',
          description: '',
          date: '',
          capacity: '',
          location: ''
        });
        fetchEvents();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create event');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const handleRegister = async (eventId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://localhost:5000/api/registrations/event/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Registration successful!');
        fetchEvents();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to register');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role === 'school' ? 'Manage your school events' : 'Browse and join events'}
              </p>
            </div>
            <div className="flex space-x-4">
              {user?.role === 'school' && (
                <Button
                  variant="primary"
                  onClick={() => setShowCreateEvent(true)}
                >
                  Create Event
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {user?.role === 'school' && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{events.length}</div>
                <div className="text-gray-600">Total Events</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {events.reduce((sum, event) => sum + event.registered_count, 0)}
                </div>
                <div className="text-gray-600">Total Registrations</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {events.filter(e => e.is_full).length}
                </div>
                <div className="text-gray-600">Full Events</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {events.filter(e => !e.is_full).length}
                </div>
                <div className="text-gray-600">Available Events</div>
              </div>
            </Card>
          </div>
        )}

        {/* Create Event Modal */}
        {showCreateEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Create New Event</h3>
              <form onSubmit={handleCreateEvent}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Title
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      rows={3}
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      value={newEvent.capacity}
                      onChange={(e) => setNewEvent({...newEvent, capacity: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateEvent(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                  >
                    Create Event
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Events List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {user?.role === 'school' ? 'Your Events' : 'Available Events'}
          </h2>
          
          {events.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {user?.role === 'school' ? 'No events yet' : 'No available events'}
                </h3>
                <p className="text-gray-600">
                  {user?.role === 'school' 
                    ? 'Create your first event to get started' 
                    : 'Check back later for new events'
                  }
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} hover>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.is_full 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {event.is_full ? 'Full' : 'Available'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {event.registered_count}/{event.capacity} registered
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(event.registered_count / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                  
                  {user?.role === 'student' && (
                    <Button
                      variant="primary"
                      className="w-full"
                      disabled={event.is_full}
                      onClick={() => handleRegister(event.id)}
                    >
                      {event.is_full ? 'Event Full' : 'Register Now'}
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
