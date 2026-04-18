import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDays, Users, Gauge, Megaphone, CreditCard, Lock, Search, CheckCircle, Bell, GraduationCap, School,
  ChevronDown, ArrowRight, Mail, Phone, Menu, X
} from 'lucide-react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Scroll reveal animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
      ),
      question: 'Is Scholaria easy to use for schools with limited technical experience?',
      answer: 'Yes! Scholaria is designed with simplicity in mind. Our intuitive interface requires no technical training, and we provide comprehensive onboarding support for all schools.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      ),
      question: 'How do payments work for event registrations?',
      answer: 'Currently, Scholaria supports manual payment tracking. Schools can manage payment status through the dashboard, and we\'re working on integrated payment solutions for the future.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <path d="M12 18h.01" />
        </svg>
      ),
      question: 'Is Scholaria mobile-friendly?',
      answer: 'Absolutely! Scholaria is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. Students can register and browse events from any device.'
    },
    {
      question: 'Can we customize the platform for our school\'s specific needs?',
      answer: 'Our Pro plan includes customization options and priority support. We can work with your school to tailor the platform to your specific requirements.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      question: 'What kind of support do you provide?',
      answer: 'We offer email support for all plans, with priority phone support for Pro customers. We also provide training materials and video tutorials.'
    }
  ];

  const schools = [
    'École Internationale d\'Alger',
    'Lycée des Sciences et Technologies',
    'École Supérieure de Commerce',
    'Institut Français d\'Alger',
    'British School Algiers'
  ];

  const features = {
    schools: [
      {
        icon: '📅',
        title: 'Create & Manage Events',
        description: 'Easily create events, set capacity limits, and manage all aspects of your school activities.'
      },
      {
        icon: '👥',
        title: 'Track Registrations',
        description: 'Monitor student registrations in real-time and manage participant lists efficiently.'
      },
      {
        icon: '📊',
        title: 'Manage Capacity',
        description: 'Set limits for each event and automatically stop registrations when capacity is reached.'
      },
      {
        icon: '📢',
        title: 'Send Announcements',
        description: 'Communicate important updates and changes to registered participants instantly.'
      },
      {
        icon: '💳',
        title: 'Payment Tracking',
        description: 'Keep track of payment status for paid events and manage financial records.'
      }
    ],
    students: [
      {
        icon: '🔐',
        title: 'Easy Sign-up/Login',
        description: 'Quick and secure registration process with single sign-on options.'
      },
      {
        icon: '🔍',
        title: 'Browse Events',
        description: 'Discover and explore all available school events in one organized platform.'
      },
      {
        icon: '✅',
        title: 'One-Click Registration',
        description: 'Register for events instantly with a single click and receive confirmation.'
      },
      {
        icon: '🔔',
        title: 'Instant Notifications',
        description: 'Receive updates about event changes, reminders, and important announcements.'
      }
    ]
  };

  const pricingPlans = [
    {
      name: 'Starter',
      price: '3,000',
      currency: 'DA',
      period: '/month',
      features: [
        'Up to 20 events per month',
        'Advanced event management',
        'Payment tracking',
        'Custom announcements',
        'Priority email support',
      ],
      highlighted: false,
      cta: 'Get Started',
    },
    {
      name: 'Pro',
      price: '7,000',
      currency: 'DA',
      period: '/month',
      features: [
        'Unlimited events',
        'Advanced analytics & reporting',
        'Custom branding options',
        'Priority phone support',
        'Custom integrations',
        'Training & onboarding',
      ],
      highlighted: true,
      cta: 'Start Pro Trial',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`fade-in ${isLoaded ? 'active' : ''}`}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Manage School Events &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Registrations
                </span>
                <br />
                in One Place
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The complete event management platform designed for Algerian private schools. 
                Simplify event creation, track student participation, and streamline your school's activities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => window.location.href = '/signup'}
                >
                  Create School Account
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.href = '/login'}
                >
                  Join an Event
                </Button>
              </div>
            </div>
            
            <div className={`slide-up ${isLoaded ? 'active' : ''}`}>
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Dashboard Overview</h3>
                  <span className="text-sm text-gray-500">Live Demo</span>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">24</div>
                    <div className="text-sm text-gray-600">Active Events</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">156</div>
                    <div className="text-sm text-gray-600">Total Students</div>
                  </div>
                </div>
                
                {/* Event List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-gray-900">Science Fair 2024</div>
                        <div className="text-sm text-gray-500">45/50 registered</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Dec 15</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-gray-900">Programming Workshop</div>
                        <div className="text-sm text-gray-500">28/30 registered</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Dec 18</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-gray-900">Art Exhibition</div>
                        <div className="text-sm text-gray-500">12/40 registered</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Dec 20</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Trust Bar */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 font-medium">Trusted by leading schools across Algeria</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {schools.map((school, index) => (
              <div key={index} className="text-gray-700 font-medium">
                {school}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 scroll-reveal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Empowering Algerian Schools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Scholaria is built specifically for the Algerian education system, understanding the unique needs 
              of private schools and providing tools that make event management simple and effective.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card hover className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Events Managed</div>
            </Card>
            <Card hover className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">2,500+</div>
              <div className="text-gray-600">Active Students</div>
            </Card>
            <Card hover className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Partner Schools</div>
            </Card>
            <Card hover className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </Card>
          </div>

          {/* Testimonial */}
          <Card className="max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">ME</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">Mohammed El Amine</div>
                <div className="text-sm text-gray-500 mb-3">Principal, École Internationale d'Alger</div>
                <p className="text-gray-700 italic">
                  "Scholaria has transformed how we manage school events. What used to take hours of coordination 
                  now happens seamlessly. Our teachers love it, and our students find it incredibly easy to use."
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white scroll-reveal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage School Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed for both school administrators and students
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* For Schools */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  🏫
                </span>
                For Schools
              </h3>
              <div className="space-y-4">
                {features.schools.map((feature, index) => (
                  <Card key={index} hover className="flex items-start space-x-4">
                    <div className="text-2xl">{feature.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* For Students */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  🎓
                </span>
                For Students
              </h3>
              <div className="space-y-4">
                {features.students.map((feature, index) => (
                  <Card key={index} hover className="flex items-start space-x-4">
                    <div className="text-2xl">{feature.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 scroll-reveal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your school's needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.highlighted ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-[#2563EB] px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.currency}{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.highlighted ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => window.location.href = '/signup'}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 bg-white scroll-reveal">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Got questions? We've got answers.
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  className="w-full text-left p-6 focus:outline-none"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                    <svg 
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        activeFaq === index ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-500 scroll-reveal">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your School's Event Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of Algerian schools already using Scholaria to streamline their events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50"
              onClick={() => window.location.href = '/signup'}
            >
              Create School Account
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => window.location.href = '/login'}
            >
              Try Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Scholaria</h3>
              <p className="text-gray-400 mb-4">
                Simplifying school event management for Algerian private schools.
              </p>
              <p className="text-gray-500 text-sm italic">
                "التعليم هو أثمن استثمار في المستقبل"
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><a href="mailto:support@scholaria.dz" className="hover:text-white transition-colors">Contact</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                <p>Email: support@scholaria.dz</p>
                <p>Phone: +213 123 456 789</p>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="hover:text-white transition-colors">Facebook</a>
                  <a href="#" className="hover:text-white transition-colors">Twitter</a>
                  <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2024 Scholaria. All rights reserved. Made with ❤️ for Algerian schools.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
