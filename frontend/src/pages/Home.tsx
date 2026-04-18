import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    setIsLoaded(true);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
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
      answer:
        'Yes! Scholaria is designed with simplicity in mind. Our intuitive interface requires no technical training, and we provide comprehensive onboarding support for all schools.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      ),
      question: 'How do payments work for event registrations?',
      answer:
        "Currently, Scholaria supports manual payment tracking. Schools can manage payment status through the dashboard, and we're working on integrated payment solutions for the future.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <path d="M12 18h.01" />
        </svg>
      ),
      question: 'Is Scholaria mobile-friendly?',
      answer:
        'Absolutely! Scholaria is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. Students can register and browse events from any device.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
      ),
      question: "Can we customize the platform for our school's specific needs?",
      answer:
        'Our Pro plan includes customization options and priority support. We can work with your school to tailor the platform to your specific requirements.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      question: 'What kind of support do you provide?',
      answer:
        'We offer email support for all plans, with priority phone support for Pro customers. We also provide training materials and video tutorials.',
    },
  ];

  const features = {
    schools: [
      {
        icon: <i className="fa-solid fa-calendar-days" />,
        title: 'Create & Manage Events',
        description: 'Easily create events, set capacity limits, and manage all aspects of your school activities.',
      },
      {
        icon: <i className="fa-solid fa-users" />,
        title: 'Track Registrations',
        description: 'Monitor student registrations in real-time and manage participant lists efficiently.',
      },
      {
        icon: <i className="fa-solid fa-gauge-high" />,
        title: 'Manage Capacity',
        description: 'Set limits for each event and automatically stop registrations when capacity is reached.',
      },
      {
        icon: <i className="fa-solid fa-bullhorn" />,
        title: 'Send Announcements',
        description: 'Communicate important updates and changes to registered participants instantly.',
      },
      {
        icon: <i className="fa-solid fa-credit-card" />,
        title: 'Payment Tracking',
        description: 'Keep track of payment status for paid events and manage financial records.',
      },
    ],
    students: [
      {
        icon: <i className="fa-solid fa-lock" />,
        title: 'Easy Sign-up/Login',
        description: 'Quick and secure registration process with single sign-on options.',
      },
      {
        icon: <i className="fa-solid fa-magnifying-glass" />,
        title: 'Browse Events',
        description: 'Discover and explore all available school events in one organized platform.',
      },
      {
        icon: <i className="fa-solid fa-circle-check" />,
        title: 'One-Click Registration',
        description: 'Register for events instantly with a single click and receive confirmation.',
      },
      {
        icon: <i className="fa-solid fa-bell" />,
        title: 'Instant Notifications',
        description: 'Receive updates about event changes, reminders, and important announcements.',
      },
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`fade-in ${isLoaded ? 'active' : ''}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Manage School Events &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Registrations
              </span>
              <br />
              in One Place
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              The complete event management platform designed for Algerian private schools. Simplify event
              creation, track student participation, and streamline your school's activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" onClick={() => (window.location.href = '/signup')}>
                Create School Account
              </Button>
              <Button variant="outline" size="lg" onClick={() => (window.location.href = '/login')}>
                Join an Event
              </Button>
            </div>
          </div>
        </div>
      </section>

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
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fa-solid fa-school text-blue-600" />
                </span>
                For Schools
              </h3>
              <div className="space-y-4">
                {features.schools.map((feature, index) => (
                  <Card key={index} hover className="flex items-start space-x-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fa-solid fa-graduation-cap text-green-600" />
                </span>
                For Students
              </h3>
              <div className="space-y-4">
                {features.students.map((feature, index) => (
                  <Card key={index} hover className="flex items-start space-x-4">
                    <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                      {feature.icon}
                    </div>
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

      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 scroll-reveal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Empowering Algerian Schools</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Scholaria is built specifically for the Algerian education system, understanding the unique needs of
              private schools and providing tools that make event management simple and effective.
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

      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-white scroll-reveal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your school's needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.highlighted ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">
                      {plan.currency}
                      {plan.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.highlighted ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => (window.location.href = '/signup')}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 scroll-reveal">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Frequently asked questions
            </h2>
            <p className="text-lg text-gray-500">Got questions? We've got answers.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? 'ring-2 ring-blue-300 shadow-sm'
                      : 'border border-gray-100 shadow-sm hover:border-blue-100'
                  }`}
                >
                  <button
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                        {faq.icon}
                      </div>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-250 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-48' : 'max-h-0'
                    }`}
                  >
                    <div className="px-5 pb-5 pt-1">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm mb-3">Still have questions?</p>
            
              <a href="mailto:support@scholaria.dz"
              className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm hover:underline"
            >
              Contact our support team
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={'M17 8l4 4m0 0l-4 4m4-4H3'} />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-500 scroll-reveal">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your School's Event Management?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join hundreds of Algerian schools already using Scholaria to streamline their events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              className="bg-white !text-blue-600 hover:bg-gray-50"
              onClick={() => (window.location.href = '/signup')}
            >
              Create School Account
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="border-2 border-white !text-white hover:bg-white/20"
              onClick={() => (window.location.href = '/login')}
            >
              Try Demo
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Scholaria</h3>
              <p className="text-gray-400 mb-4">
                Simplifying school event management for Algerian private schools.
              </p>
              <p className="text-gray-500 text-sm italic">"Education is the most valuable investment in the future"</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/#features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/#faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@scholaria.dz" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                <p>Email: support@scholaria.dz</p>
                <p>Phone: +213 123 456 789</p>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="hover:text-white transition-colors">
                    Facebook
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    Twitter
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2024 Scholaria. All rights reserved. Made  for Algerian schools.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
