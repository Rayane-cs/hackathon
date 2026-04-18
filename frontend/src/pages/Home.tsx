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
  }, []);

  const faqs = [
    {
      question: 'Is Scholaria easy to use for schools with limited technical experience?',
      answer: 'Yes! Scholaria is designed with simplicity in mind. Our intuitive interface requires no technical training, and we provide comprehensive onboarding support for all schools.',
    },
    {
      question: 'How do payments work for event registrations?',
      answer: "Currently, Scholaria supports manual payment tracking. Schools can manage payment status through the dashboard, and we're working on integrated payment solutions for the future.",
    },
    {
      question: 'Is Scholaria mobile-friendly?',
      answer: 'Absolutely! Scholaria is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. Students can register and browse events from any device.',
    },
    {
      question: "Can we customize the platform for our school's specific needs?",
      answer: 'Our Pro plan includes customization options and priority support. We can work with your school to tailor the platform to your specific requirements.',
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'We offer email support for all plans, with priority phone support for Pro customers. We also provide training materials and video tutorials.',
    },
  ];

  const features = {
    schools: [
      { icon: CalendarDays, title: 'Create & Manage Events', description: 'Easily create events, set capacity limits, and manage all aspects of your school activities.' },
      { icon: Users, title: 'Track Registrations', description: 'Monitor student registrations in real-time and manage participant lists efficiently.' },
      { icon: Gauge, title: 'Manage Capacity', description: 'Set limits for each event and automatically stop registrations when capacity is reached.' },
      { icon: Megaphone, title: 'Send Announcements', description: 'Communicate important updates and changes to registered participants instantly.' },
      { icon: CreditCard, title: 'Payment Tracking', description: 'Keep track of payment status for paid events and manage financial records.' },
    ],
    students: [
      { icon: Lock, title: 'Easy Sign-up/Login', description: 'Quick and secure registration process with single sign-on options.' },
      { icon: Search, title: 'Browse Events', description: 'Discover and explore all available school events in one organized platform.' },
      { icon: CheckCircle, title: 'One-Click Registration', description: 'Register for events instantly with a single click and receive confirmation.' },
      { icon: Bell, title: 'Instant Notifications', description: 'Receive updates about event changes, reminders, and important announcements.' },
    ],
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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="sticky top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#0B1D3A]">Scholaria</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-[#64748B] hover:text-[#2563EB] text-sm font-medium">
                Home
              </Link>
              <Link to="/login" className="text-[#64748B] hover:text-[#2563EB] text-sm font-medium">
                Sign In
              </Link>
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/register"
                className="bg-[#2563EB] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#1D4ED8]"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#0B1D3A]" />
              ) : (
                <Menu className="w-6 h-6 text-[#0B1D3A]" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
              <div className="px-4 py-4 space-y-4">
                <Link
                  to="/"
                  className="block text-[#64748B] hover:text-[#2563EB] text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className="block text-[#64748B] hover:text-[#2563EB] text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1D4ED8] text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 overflow-hidden">
        {/* Geometric pattern background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-[#2563EB] rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-[#2563EB] rounded-lg rotate-45"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-[#2563EB] rounded-full"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="display text-[#0B1D3A] mb-8">
              Manage School Events &{' '}
              <span className="text-[#2563EB]">Registrations</span>
              <br />
              in One Place
            </h1>
            <p className="body text-[#64748B] mb-12 max-w-2xl mx-auto">
              The complete event management platform designed for Algerian private schools. Simplify event
              creation, track student participation, and streamline your school's activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#1D4ED8] shadow-lg"
              >
                Create School Account
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0B1D3A] px-8 py-4 rounded-lg font-medium border-2 border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB]"
              >
                Join an Event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading text-[#0B1D3A] mb-4">
              Everything You Need to Manage School Events
            </h2>
            <p className="body text-[#64748B] max-w-2xl mx-auto">
              Powerful features designed for both school administrators and students
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* For Schools */}
            <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center">
                  <School className="w-6 h-6 text-white" />
                </div>
                <h3 className="heading text-[#0B1D3A]">
                  For Schools
                </h3>
              </div>
              <div className="space-y-6">
                {features.schools.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 bg-[#F8FAFC] rounded-xl p-6 border border-[#E2E8F0] shadow-sm">
                    <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0B1D3A] mb-2">{feature.title}</h4>
                      <p className="body text-[#64748B]">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Students */}
            <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="heading text-[#0B1D3A]">
                  For Students
                </h3>
              </div>
              <div className="space-y-6">
                {features.students.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 bg-[#F8FAFC] rounded-xl p-6 border border-[#E2E8F0] shadow-sm">
                    <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0B1D3A] mb-2">{feature.title}</h4>
                      <p className="body text-[#64748B]">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4" style={{ fontFamily: 'ScholariaFont, sans-serif' }}>
              Empowering Algerian Schools
            </h2>
            <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
              Scholaria is built specifically for the Algerian education system
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { number: '500+', label: 'Events Managed', color: '#2563EB' },
              { number: '2,500+', label: 'Active Students', color: '#22C55E' },
              { number: '50+', label: 'Partner Schools', color: '#8B5CF6' },
              { number: '98%', label: 'Satisfaction Rate', color: '#F59E0B' },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <div className="text-3xl font-bold mb-2" style={{ color: stat.color }}>{stat.number}</div>
                <div className="text-[#64748B] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-[#2563EB]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#2563EB] font-bold text-lg">ME</span>
              </div>
              <div>
                <div className="font-semibold text-[#0F172A] text-lg">Mohammed El Amine</div>
                <div className="text-[#64748B] text-sm mb-3">Principal, École Internationale d'Alger</div>
                <p className="text-[#64748B] italic leading-relaxed">
                  "Scholaria has transformed how we manage school events. What used to take hours of coordination
                  now happens seamlessly. Our teachers love it, and our students find it incredibly easy to use."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4" style={{ fontFamily: 'ScholariaFont, sans-serif' }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-[#64748B]">
              Choose the plan that fits your school's needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-[#2563EB] text-white shadow-xl shadow-blue-500/25'
                    : 'bg-white border-2 border-gray-100 text-[#0F172A]'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-[#2563EB] px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className={plan.highlighted ? 'text-white/70' : 'text-[#64748B]'}>
                      {plan.currency}{plan.period}
                    </span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${plan.highlighted ? 'text-white' : 'text-[#22C55E]'}`} />
                      <span className={plan.highlighted ? 'text-white/90' : 'text-[#64748B]'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-white text-[#2563EB] hover:bg-gray-100'
                      : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#EFF6FF] text-[#2563EB] text-sm font-medium px-4 py-1 rounded-full mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4" style={{ fontFamily: 'ScholariaFont, sans-serif' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-[#64748B]">Got questions? We've got answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-xl overflow-hidden transition-all duration-200 ${
                    isOpen ? 'ring-2 ring-[#2563EB] shadow-md' : 'border border-gray-100 shadow-sm'
                  }`}
                >
                  <button
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                  >
                    <span className="font-semibold text-[#0F172A]">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#64748B] flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? 'max-h-48' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 pb-5">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-[#64748B] leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#2563EB] to-[#38BDF8] rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'ScholariaFont, sans-serif' }}>
              Ready to Transform Your School's Event Management?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of Algerian schools already using Scholaria to streamline their events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#2563EB] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Create School Account
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white px-8 py-4 rounded-xl font-semibold border-2 border-white hover:bg-white/10 transition-colors"
              >
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-gray-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white" style={{ fontFamily: 'ScholariaFont, sans-serif' }}>
                  Scholaria
                </span>
              </Link>
              <p className="text-sm mb-4">
                Simplifying school event management for Algerian private schools.
              </p>
              <p className="text-xs italic text-gray-500">
                "Education is the most valuable investment in the future"
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><a href="mailto:support@scholaria.dz" className="hover:text-white transition-colors">Contact</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@scholaria.dz
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +213 123 456 789
                </li>
              </ul>
              <div className="flex gap-4 mt-6">
                <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm">
            <p>&copy; 2024 Scholaria. All rights reserved. Made with passion for Algerian schools.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
