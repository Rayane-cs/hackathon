import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  Heart, 
  Bookmark, 
  Calendar, 
  MapPin, 
  Users, 
  School, 
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Trophy,
  Palette,
  FlaskConical,
  Calculator,
  Globe,
  Clock,
  Phone,
  Mail,
  MapPinIcon,
  X,
  ExternalLink
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Navbar from '../../components/ui/Navbar.original';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  capacity: number;
  location: string;
  registered_count: number;
  image?: string;
  school_name: string;
  school_id: number;
  type: 'workshop' | 'competition' | 'exhibition' | 'seminar';
}

interface SchoolInfo {
  id: number;
  name: string;
  description: string;
  email: string;
  phone?: string;
  address?: string;
  image?: string;
  rating: number;
  students_count: number;
  established_year: number;
  services: Service[];
  is_following?: boolean;
}

interface Service {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
}

interface Professor {
  id: number;
  name: string;
  subject: string;
  school_id: number;
  school_name: string;
  rating: number;
  image?: string;
}

// Mock data
const mockEvents: Event[] = [
  {
    id: 1,
    title: '🚀 Science Fair 2024',
    description: 'Discover amazing student innovations and experiments. Prizes worth 50,000 DZD!',
    date: '2024-12-25T10:00:00',
    capacity: 200,
    location: 'Grand Auditorium',
    registered_count: 156,
    school_name: 'École Internationale',
    school_id: 1,
    type: 'exhibition',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800'
  },
  {
    id: 2,
    title: '💻 Hackathon Challenge',
    description: '48-hour coding competition. Build the next big app!',
    date: '2024-12-20T09:00:00',
    capacity: 100,
    location: 'Tech Hub',
    registered_count: 89,
    school_name: 'Lycée Technique',
    school_id: 2,
    type: 'competition',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'
  },
  {
    id: 3,
    title: '🎨 Art & Design Expo',
    description: 'Showcase of creative talents from top art schools',
    date: '2024-12-18T14:00:00',
    capacity: 150,
    location: 'Gallery Hall',
    registered_count: 134,
    school_name: 'École des Arts',
    school_id: 3,
    type: 'exhibition',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'
  },
  {
    id: 4,
    title: '📊 Business Summit',
    description: 'Learn from industry leaders about entrepreneurship',
    date: '2025-01-15T10:00:00',
    capacity: 80,
    location: 'Conference Center',
    registered_count: 67,
    school_name: 'Business Academy',
    school_id: 4,
    type: 'seminar',
    image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800'
  },
  {
    id: 5,
    title: '🎭 Theater Workshop',
    description: 'Professional acting and performance training',
    date: '2025-01-10T16:00:00',
    capacity: 40,
    location: 'Drama Studio',
    registered_count: 38,
    school_name: 'Institut des Arts',
    school_id: 5,
    type: 'workshop',
    image: 'https://images.unsplash.com/photo-1507676184212-d1ab0a8e5dee?w=800'
  }
];

const mockSchools: SchoolInfo[] = [
  {
    id: 1,
    name: "École Internationale d'Alger",
    description: 'Premier international school offering world-class education with IB curriculum, modern facilities, and exceptional faculty.',
    email: 'contact@eia.dz',
    phone: '+213 21 123 456',
    address: 'Hydra, Alger',
    rating: 4.8,
    students_count: 1200,
    established_year: 1985,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600',
    services: [
      { id: 1, name: 'International Baccalaureate', description: 'Full IB Diploma Programme', icon: 'graduation', category: 'Academic' },
      { id: 2, name: 'STEM Labs', description: 'Advanced science and robotics labs', icon: 'flask', category: 'Science' },
      { id: 3, name: 'Sports Complex', description: 'Olympic-size pool and tennis courts', icon: 'trophy', category: 'Sports' },
      { id: 4, name: 'Arts Center', description: 'Theater, music, and visual arts', icon: 'palette', category: 'Arts' }
    ]
  },
  {
    id: 2,
    name: 'Lycée des Sciences et Technologies',
    description: 'Leading technical school specializing in engineering, computer science, and mathematics with state-of-the-art labs.',
    email: 'info@lst.dz',
    phone: '+213 21 234 567',
    address: 'Bab Ezzouar, Alger',
    rating: 4.6,
    students_count: 800,
    established_year: 1995,
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600',
    services: [
      { id: 5, name: 'Computer Science', description: 'Programming and AI courses', icon: 'calculator', category: 'Tech' },
      { id: 6, name: 'Robotics Club', description: 'Build and program robots', icon: 'flask', category: 'Science' },
      { id: 7, name: 'Math Olympiad', description: 'Competition preparation', icon: 'book', category: 'Academic' }
    ]
  },
  {
    id: 3,
    name: 'École Supérieure de Commerce',
    description: 'Business school preparing future leaders with practical training, internships, and global partnerships.',
    email: 'contact@esc.dz',
    phone: '+213 21 345 678',
    address: 'Central Business District',
    rating: 4.7,
    students_count: 600,
    established_year: 2000,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600',
    services: [
      { id: 8, name: 'MBA Program', description: 'Master of Business Administration', icon: 'graduation', category: 'Academic' },
      { id: 9, name: 'Incubator', description: 'Start your own business', icon: 'globe', category: 'Business' },
      { id: 10, name: 'Internships', description: 'Corporate partnerships', icon: 'briefcase', category: 'Career' }
    ]
  },
  {
    id: 4,
    name: 'Institut de Langues Moderne',
    description: 'Language institute offering courses in English, French, Spanish, German, and Arabic with native speakers.',
    email: 'admin@ilm.dz',
    phone: '+213 21 456 789',
    address: 'El Biar, Alger',
    rating: 4.5,
    students_count: 450,
    established_year: 1990,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
    services: [
      { id: 11, name: 'IELTS/TOEFL', description: 'Test preparation courses', icon: 'book', category: 'Languages' },
      { id: 12, name: 'Conversation', description: 'Practice with native speakers', icon: 'globe', category: 'Languages' },
      { id: 13, name: 'Translation', description: 'Professional certification', icon: 'graduation', category: 'Career' }
    ]
  },
  {
    id: 5,
    name: 'École des Arts et Design',
    description: 'Creative arts school for visual arts, graphic design, interior design, and multimedia arts.',
    email: 'info@arts.dz',
    phone: '+213 21 567 890',
    address: "Sidi M'Hamed, Alger",
    rating: 4.9,
    students_count: 350,
    established_year: 1988,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
    services: [
      { id: 14, name: 'Graphic Design', description: 'Digital art and branding', icon: 'palette', category: 'Arts' },
      { id: 15, name: 'Photography', description: 'Professional photo courses', icon: 'camera', category: 'Arts' },
      { id: 16, name: 'Interior Design', description: 'Space planning and decoration', icon: 'home', category: 'Design' }
    ]
  }
];

const mockProfessors: Professor[] = [
  { id: 1, name: 'Dr. Ahmed Benali', subject: 'Mathematics', school_id: 2, school_name: 'Lycée des Sciences', rating: 4.9, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
  { id: 2, name: 'Prof. Sarah Mansouri', subject: 'Physics', school_id: 1, school_name: 'École Internationale', rating: 4.8, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' },
  { id: 3, name: 'M. Karim Hadj', subject: 'Computer Science', school_id: 2, school_name: 'Lycée Technique', rating: 4.7, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
  { id: 4, name: 'Mme Leila Bouaziz', subject: 'Fine Arts', school_id: 5, school_name: 'École des Arts', rating: 4.9, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
  { id: 5, name: 'Dr. Mohamed Kaci', subject: 'Business', school_id: 3, school_name: 'École de Commerce', rating: 4.6, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { id: 6, name: 'Prof. Fatima Zohra', subject: 'English Literature', school_id: 4, school_name: 'Institut de Langues', rating: 4.8, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }
];

export default function StudentDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [schools, setSchools] = useState<SchoolInfo[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [followedSchools, setFollowedSchools] = useState<number[]>([]);
  const [savedEvents, setSavedEvents] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'schools' | 'professors'>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<SchoolInfo | null>(null);

  useEffect(() => {
    setEvents(mockEvents);
    setSchools(mockSchools);
    setProfessors(mockProfessors);
  }, []);

  // Auto-slide
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [events.length, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % events.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
    setIsAutoPlaying(false);
  };

  const handleFollowSchool = (schoolId: number) => {
    setFollowedSchools(prev => [...prev, schoolId]);
    toast.success('School followed!');
  };

  const handleUnfollowSchool = (schoolId: number) => {
    setFollowedSchools(prev => prev.filter(id => id !== schoolId));
    toast.success('School unfollowed');
  };

  const handleSaveEvent = (eventId: number) => {
    setSavedEvents(prev => [...prev, eventId]);
    toast.success('Event saved!');
  };

  const handleUnsaveEvent = (eventId: number) => {
    setSavedEvents(prev => prev.filter(id => id !== eventId));
    toast.success('Event removed');
  };

  const handleRegister = (eventId: number) => {
    toast.success('Registered successfully! Check your email for details.');
  };

  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProfessors = professors.filter(prof => 
    prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prof.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getServiceIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      graduation: <GraduationCap className="w-6 h-6" />,
      flask: <FlaskConical className="w-6 h-6" />,
      trophy: <Trophy className="w-6 h-6" />,
      palette: <Palette className="w-6 h-6" />,
      calculator: <Calculator className="w-6 h-6" />,
      book: <BookOpen className="w-6 h-6" />,
      globe: <Globe className="w-6 h-6" />,
      briefcase: <ExternalLink className="w-6 h-6" />,
      camera: <ExternalLink className="w-6 h-6" />,
      home: <MapPinIcon className="w-6 h-6" />
    };
    return icons[iconName] || <Star className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Slider Section */}
      <div className="relative h-[500px] overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/40" />
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm mb-4 backdrop-blur-sm">
                  Featured Event
                </span>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                  {event.title}
                </h1>
                <p className="text-xl md:text-2xl mb-6 text-white/90">
                  {event.description}
                </p>
                <div className="flex items-center justify-center gap-6 mb-8 text-sm">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {event.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {event.registered_count}/{event.capacity} joined
                  </span>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="primary"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
                    onClick={() => handleRegister(event.id)}
                  >
                    Register Now
                  </Button>
                  <button
                    onClick={() => savedEvents.includes(event.id) ? handleUnsaveEvent(event.id) : handleSaveEvent(event.id)}
                    className={`p-3 rounded-full transition-colors ${
                      savedEvents.includes(event.id)
                        ? 'bg-yellow-400 text-yellow-900'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Bookmark className={`w-6 h-6 ${savedEvents.includes(event.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        
        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setIsAutoPlaying(false);
              }}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Discover Your Perfect School
          </h2>
          <p className="text-gray-600">
            Search for schools, professors, or services that match your interests
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex gap-2 mb-4">
            {(['all', 'schools', 'professors'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type)}
                className={`px-4 py-2 rounded-full capitalize transition-colors ${
                  searchType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search ${searchType === 'all' ? 'schools and professors' : searchType}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-lg"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-12">
            {(searchType === 'all' || searchType === 'schools') && filteredSchools.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🏫 Schools</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSchools.map((school) => (
                    <Card key={school.id} hover className="cursor-pointer" onClick={() => setSelectedSchool(school)}>
                      <img
                        src={school.image}
                        alt={school.name}
                        className="w-full h-48 object-cover rounded-t-lg -mx-6 -mt-6 mb-4"
                      />
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{school.name}</h4>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{school.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{school.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {school.students_count} students
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Est. {school.established_year}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {(searchType === 'all' || searchType === 'professors') && filteredProfessors.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">👨‍🏫 Professors</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProfessors.map((prof) => (
                    <Card key={prof.id} hover>
                      <div className="text-center">
                        <img
                          src={prof.image}
                          alt={prof.name}
                          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                        />
                        <h4 className="font-semibold text-gray-900">{prof.name}</h4>
                        <p className="text-blue-600 text-sm mb-1">{prof.subject}</p>
                        <p className="text-gray-500 text-sm mb-2">{prof.school_name}</p>
                        <div className="flex items-center justify-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{prof.rating}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* All Schools Section */}
        {!searchQuery && (
          <>
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">🏫 Explore Schools</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schools.map((school) => (
                  <Card key={school.id} hover className="group cursor-pointer" onClick={() => setSelectedSchool(school)}>
                    <div className="relative overflow-hidden rounded-t-lg -mx-6 -mt-6 mb-4">
                      <img
                        src={school.image}
                        alt={school.name}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            followedSchools.includes(school.id)
                              ? handleUnfollowSchool(school.id)
                              : handleFollowSchool(school.id);
                          }}
                          className={`p-2 rounded-full transition-colors ${
                            followedSchools.includes(school.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white/90 text-gray-700 hover:bg-white'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${followedSchools.includes(school.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{school.name}</h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium">{school.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{school.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {school.students_count} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Since {school.established_year}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {school.services.slice(0, 3).map((service) => (
                        <span
                          key={service.id}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                        >
                          {service.name}
                        </span>
                      ))}
                      {school.services.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{school.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Upcoming Events Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">📅 Upcoming Events</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                  Calendar View <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} hover>
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-t-lg -mx-6 -mt-6 mb-4"
                    />
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.type === 'workshop' ? 'bg-orange-100 text-orange-700' :
                        event.type === 'competition' ? 'bg-red-100 text-red-700' :
                        event.type === 'exhibition' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                      {savedEvents.includes(event.id) && (
                        <Bookmark className="w-5 h-5 text-yellow-500 fill-current" />
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <School className="w-4 h-4" />
                        {event.school_name}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {event.registered_count}/{event.capacity} registered
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={() => handleRegister(event.id)}
                      >
                        Register
                      </Button>
                      <button
                        onClick={() => savedEvents.includes(event.id) ? handleUnsaveEvent(event.id) : handleSaveEvent(event.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          savedEvents.includes(event.id)
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Bookmark className={`w-5 h-5 ${savedEvents.includes(event.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* School Detail Modal */}
      {selectedSchool && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={selectedSchool.image}
                  alt={selectedSchool.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSchool.name}</h2>
                  <div className="flex items-center gap-2 text-yellow-500 mt-1">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-medium">{selectedSchool.rating}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{selectedSchool.students_count} students</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedSchool(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium">{selectedSchool.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-sm">{selectedSchool.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <MapPinIcon className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="font-medium">{selectedSchool.address}</div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-8">{selectedSchool.description}</p>

            <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Services & Programs</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {selectedSchool.services.map((service) => (
                <div key={service.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    {getServiceIcon(service.icon)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {service.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  toast.success(`Applied to ${selectedSchool.name}! They will contact you soon.`);
                  setSelectedSchool(null);
                }}
              >
                Apply Now
              </Button>
              <Button
                variant={followedSchools.includes(selectedSchool.id) ? 'outline' : 'primary'}
                className="flex-1"
                onClick={() => {
                  if (followedSchools.includes(selectedSchool.id)) {
                    handleUnfollowSchool(selectedSchool.id);
                  } else {
                    handleFollowSchool(selectedSchool.id);
                  }
                }}
              >
                <Heart className={`w-5 h-5 mr-2 ${followedSchools.includes(selectedSchool.id) ? 'fill-current' : ''}`} />
                {followedSchools.includes(selectedSchool.id) ? 'Following' : 'Follow School'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
