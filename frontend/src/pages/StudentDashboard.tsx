import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Heart, 
  Bookmark, 
  Calendar, 
  MapPin, 
  Users, 
  School, 
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
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
  created_by?: number;
  is_saved?: boolean;
  school_name?: string;
}

interface School {
  id: number;
  name: string;
  email: string;
  is_following?: boolean;
}

const StudentDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [followedSchools, setFollowedSchools] = useState<School[]>([]);
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
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
      // Create a mock student user for testing
      parsedUser = {
        id: 1,
        name: 'Test Student',
        email: 'student@scholaria.dz',
        role: 'student'
      };
      localStorage.setItem('user', JSON.stringify(parsedUser));
      localStorage.setItem('access_token', 'mock-token-for-development');
    }
    
    if (parsedUser.role !== 'student') {
      navigate('/school-dashboard');
      return;
    }

    setUser(parsedUser);
    fetchAllData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchEvents(),
        fetchSchools(),
        fetchFollowedSchools(),
        fetchSavedEvents()
      ]);
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
        school_name: 'École Internationale',
        is_saved: false
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
        school_name: 'Lycée Technique',
        is_saved: true
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
        school_name: 'École des Arts',
        is_saved: false
      },
      {
        id: 4,
        title: 'Mathematics Competition',
        description: 'Inter-school math competition with prizes for top performers.',
        date: '2025-01-15T10:00:00',
        capacity: 40,
        location: 'Main Hall',
        registered_count: 12,
        available_spots: 28,
        is_full: false,
        school_name: 'Lycée Algiers',
        is_saved: false
      },
      {
        id: 5,
        title: 'Sports Tournament',
        description: 'Annual sports tournament including football, basketball, and athletics.',
        date: '2025-01-20T08:00:00',
        capacity: 200,
        location: 'Sports Complex',
        registered_count: 150,
        available_spots: 50,
        is_full: false,
        school_name: 'École Internationale',
        is_saved: true
      }
    ];
    setEvents(mockEvents);
  };

  const fetchSchools = async () => {
    // Mock schools data - no backend required
    const mockSchools = [
      { id: 1, name: 'École Internationale d\'Alger', email: 'contact@eia.dz', is_following: true },
      { id: 2, name: 'Lycée des Sciences et Technologies', email: 'info@lst.dz', is_following: false },
      { id: 3, name: 'École Supérieure de Commerce', email: 'contact@esc.dz', is_following: false },
      { id: 4, name: 'Institut de Langues Moderne', email: 'admin@ilm.dz', is_following: true },
      { id: 5, name: 'Lycée Technique', email: 'contact@lt.dz', is_following: false },
      { id: 6, name: 'École des Arts', email: 'info@arts.dz', is_following: false }
    ];
    setSchools(mockSchools);
  };

  const fetchFollowedSchools = async () => {
    // Filter from mock schools - no backend required
    const followed = schools.filter(school => school.is_following);
    setFollowedSchools(followed);
  };

  const fetchSavedEvents = async () => {
    // Filter from mock events - no backend required
    const saved = events.filter(event => event.is_saved);
    setSavedEvents(saved);
  };

  const handleFollowSchool = async (schoolId: number) => {
    // Mock follow action - no backend required
    setSchools(prev => prev.map(school => 
      school.id === schoolId ? { ...school, is_following: true } : school
    ));
    setFollowedSchools(prev => [...prev, schools.find(s => s.id === schoolId)!]);
    toast.success('School followed successfully!');
  };

  const handleUnfollowSchool = async (schoolId: number) => {
    // Mock unfollow action - no backend required
    setSchools(prev => prev.map(school => 
      school.id === schoolId ? { ...school, is_following: false } : school
    ));
    setFollowedSchools(prev => prev.filter(school => school.id !== schoolId));
    toast.success('School unfollowed successfully!');
  };

  const handleSaveEvent = async (eventId: number) => {
    // Mock save action - no backend required
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, is_saved: true } : event
    ));
    const savedEvent = events.find(e => e.id === eventId);
    if (savedEvent) {
      setSavedEvents(prev => [...prev, { ...savedEvent, is_saved: true }]);
    }
    toast.success('Event saved successfully!');
  };

  const handleUnsaveEvent = async (eventId: number) => {
    // Mock unsave action - no backend required
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, is_saved: false } : event
    ));
    setSavedEvents(prev => prev.filter(event => event.id !== eventId));
    toast.success('Event removed from saved list!');
  };

  const handleRegister = async (eventId: number) => {
    // Mock registration - no backend required
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { 
        ...event, 
        registered_count: Math.min(event.registered_count + 1, event.capacity),
        is_full: event.registered_count + 1 >= event.capacity,
        available_spots: Math.max(event.available_spots - 1, 0)
      } : event
    ));
    toast.success('Registration successful! You are now registered for this event.');
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, events.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, events.length - 2)) % Math.max(1, events.length - 2));
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (event.school_name && event.school_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'saved') return matchesSearch && event.is_saved;
    if (filterType === 'upcoming') {
      const eventDate = new Date(event.date);
      return matchesSearch && eventDate > new Date();
    }
    if (filterType === 'available') return matchesSearch && !event.is_full;
    
    return matchesSearch;
  });

  const featuredEvents = events.slice(0, Math.min(5, events.length));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading Scholaria...</p>
            <div className="mt-4 space-y-2">
              <div className="h-2 bg-blue-200 rounded-full w-32 mx-auto animate-pulse"></div>
              <div className="h-2 bg-blue-300 rounded-full w-24 mx-auto animate-pulse"></div>
              <div className="h-2 bg-blue-400 rounded-full w-40 mx-auto animate-pulse"></div>
            </div>
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
            Welcome back, {user?.name}! 🎓
          </h1>
          <p className="text-gray-600">
            Discover amazing events, follow your favorite schools, and save events for later.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{events.length}</div>
              <div className="text-blue-100">Total Events</div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{schools.length}</div>
              <div className="text-green-100">Schools</div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{followedSchools.length}</div>
              <div className="text-purple-100">Following</div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{savedEvents.length}</div>
              <div className="text-orange-100">Saved</div>
            </div>
          </Card>
        </div>

        {/* Events Slider - Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">🔥 Featured Events</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 33.33}%)` }}
              >
                {featuredEvents.map((event) => (
                  <div key={event.id} className="w-1/3 flex-shrink-0 px-2">
                    <Card className="h-full bg-gradient-to-br from-white to-blue-50 border-blue-100">
                      <div className="relative">
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => event.is_saved ? handleUnsaveEvent(event.id) : handleSaveEvent(event.id)}
                            className={`p-2 rounded-full transition-colors ${
                              event.is_saved 
                                ? 'bg-yellow-100 text-yellow-600' 
                                : 'bg-gray-100 text-gray-400 hover:text-yellow-500'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${event.is_saved ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-24 rounded-t-lg mb-4"></div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                      <div className="space-y-1 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location || 'Online'}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {event.registered_count}/{event.capacity} registered
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        className="w-full"
                        disabled={event.is_full}
                        onClick={() => handleRegister(event.id)}
                      >
                        {event.is_full ? 'Event Full 🔒' : 'Register Now ✨'}
                      </Button>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'events', label: '📅 Browse Events' },
              { id: 'schools', label: '🏫 Schools' },
              { id: 'following', label: '❤️ Following' },
              { id: 'saved', label: '🔖 Saved' }
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
        </div>

        {/* Events Tab Content */}
        {activeTab === 'events' && (
          <div>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search events, schools, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Events</option>
                <option value="saved">Saved Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="available">Available</option>
              </select>
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id} hover className="relative">
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        onClick={() => event.is_saved ? handleUnsaveEvent(event.id) : handleSaveEvent(event.id)}
                        className={`p-2 rounded-full transition-colors ${
                          event.is_saved 
                            ? 'bg-yellow-100 text-yellow-600' 
                            : 'bg-white/80 text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        <Bookmark className={`w-5 h-5 ${event.is_saved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 pr-8">{event.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.is_full 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {event.is_full ? 'Full' : 'Available'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {event.registered_count}/{event.capacity} registered
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(event.registered_count / event.capacity) * 100}%` }}
                      ></div>
                    </div>
                    
                    <Button
                      variant="primary"
                      className="w-full"
                      disabled={event.is_full}
                      onClick={() => handleRegister(event.id)}
                    >
                      {event.is_full ? 'Event Full 🔒' : 'Register Now ✨'}
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Schools Tab Content */}
        {activeTab === 'schools' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">🏫 All Schools</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.filter(school => 
                school.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((school) => (
                <Card key={school.id} hover>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <School className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                      <p className="text-gray-500 text-sm">{school.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant={school.is_following ? 'outline' : 'primary'}
                      className="flex-1"
                      onClick={() => school.is_following ? handleUnfollowSchool(school.id) : handleFollowSchool(school.id)}
                    >
                      {school.is_following ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Following
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Following Tab Content */}
        {activeTab === 'following' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">❤️ Schools You Follow</h2>
            
            {followedSchools.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No schools followed yet</h3>
                  <p className="text-gray-600 mb-4">Follow schools to stay updated with their events.</p>
                  <Button variant="primary" onClick={() => setActiveTab('schools')}>
                    Browse Schools
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {followedSchools.map((school) => (
                  <Card key={school.id} hover>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                        <p className="text-gray-500 text-sm">{school.email}</p>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleUnfollowSchool(school.id)}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Unfollow
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Saved Tab Content */}
        {activeTab === 'saved' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔖 Saved Events</h2>
            
            {savedEvents.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <Bookmark className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved events yet</h3>
                  <p className="text-gray-600 mb-4">Save events you're interested in for quick access.</p>
                  <Button variant="primary" onClick={() => setActiveTab('events')}>
                    Browse Events
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedEvents.map((event) => (
                  <Card key={event.id} hover className="relative">
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        onClick={() => handleUnsaveEvent(event.id)}
                        className="p-2 rounded-full bg-yellow-100 text-yellow-600"
                      >
                        <Bookmark className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 pr-8">{event.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.is_full 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {event.is_full ? 'Full' : 'Available'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {event.registered_count}/{event.capacity} registered
                      </div>
                    </div>
                    
                    <Button
                      variant="primary"
                      className="w-full"
                      disabled={event.is_full}
                      onClick={() => handleRegister(event.id)}
                    >
                      {event.is_full ? 'Event Full 🔒' : 'Register Now ✨'}
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
