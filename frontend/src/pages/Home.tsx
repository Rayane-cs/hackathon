import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, BarChart3, Shield, ArrowRight, Check, ChevronDown } from 'lucide-react';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    { icon: Calendar, title: 'Event Management', desc: 'Create and manage events, workshops, and seminars with ease.' },
    { icon: Users, title: 'Student Registration', desc: 'Track registrations, manage capacity, and approve participants.' },
    { icon: BarChart3, title: 'Analytics', desc: 'Monitor performance, views, and attendance in real time.' },
    { icon: Shield, title: 'Secure & Reliable', desc: 'Built for Algerian private schools with local compliance in mind.' },
  ];

  const plans = [
    { name: 'Starter', price: '3,000 DA', period: '/month', features: ['20 events/month', 'Registration tracking', 'Email notifications', 'Basic analytics'], cta: 'Get Started' },
    { name: 'Pro', price: '7,000 DA', period: '/month', features: ['Unlimited events', 'Advanced analytics', 'Priority support', 'Custom branding', 'API access'], cta: 'Start Free Trial', popular: true },
  ];

  const faqs = [
    { q: 'Is Scholaria easy to use?', a: 'Yes. Designed for schools with no technical experience required. Onboarding takes minutes.' },
    { q: 'How do payments work?', a: 'Manual payment tracking is available now. Integrated payments are coming soon.' },
    { q: 'Is it mobile-friendly?', a: 'Fully responsive on phones, tablets, and desktops.' },
    { q: 'What support do you offer?', a: 'Email support for all plans. Pro customers get priority phone support and onboarding.' },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#fff', color: '#0B1D3A' }}>
      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E2E8F0', padding: '0 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link to="/" style={{ fontWeight: 700, fontSize: 22, color: '#2563EB', textDecoration: 'none', letterSpacing: '-0.5px' }}>Scholaria</Link>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <a href="#features" style={{ color: '#64748B', textDecoration: 'none', fontSize: 15 }}>Features</a>
            <a href="#pricing" style={{ color: '#64748B', textDecoration: 'none', fontSize: 15 }}>Pricing</a>
            <a href="#faq" style={{ color: '#64748B', textDecoration: 'none', fontSize: 15 }}>FAQ</a>
            <Link to="/login" style={{ color: '#0B1D3A', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Sign in</Link>
            <Link to="/register" style={{ background: '#2563EB', color: '#fff', padding: '8px 20px', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 2rem 80px' }}>
        <div style={{ maxWidth: 680 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EFF6FF', color: '#2563EB', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 28 }}>
            Built for Algerian Private Schools
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-2px', marginBottom: 24, color: '#0B1D3A' }}>
            Manage school events <span style={{ color: '#2563EB' }}>simply.</span>
          </h1>
          <p style={{ fontSize: 20, color: '#64748B', lineHeight: 1.6, marginBottom: 40, maxWidth: 520 }}>
            The complete platform for academies, teachers, and students to organize events and registrations — all in one place.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/register" style={{ background: '#2563EB', color: '#fff', padding: '14px 28px', borderRadius: 12, textDecoration: 'none', fontSize: 16, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Create Account <ArrowRight size={18} />
            </Link>
            <Link to="/login" style={{ background: '#F8FAFC', color: '#0B1D3A', padding: '14px 28px', borderRadius: 12, textDecoration: 'none', fontSize: 16, fontWeight: 600, border: '1.5px solid #E2E8F0' }}>
              Sign In
            </Link>
          </div>
        </div>

        {/* Mini Dashboard Preview */}
        <div style={{ marginTop: 72, background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 20, padding: 28, maxWidth: 640 }}>
          <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 20, fontWeight: 500 }}>DASHBOARD PREVIEW</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            {[['24', 'Active Events'], ['856', 'Registrations'], ['98%', 'Satisfaction']].map(([num, label]) => (
              <div key={label} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#0B1D3A' }}>{num}</div>
                <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
          {[['Science Fair 2025', 'Dec 25', '156/200'], ['Programming Workshop', 'Dec 20', '48/50'], ['Art Exhibition', 'Dec 18', '134/150']].map(([title, date, seats]) => (
            <div key={title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, background: '#22C55E', borderRadius: '50%' }} />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{title}</span>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ fontSize: 13, color: '#94A3B8' }}>{date}</span>
                <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{seats}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ background: '#F8FAFC', padding: '80px 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 12, textAlign: 'center' }}>Everything you need</h2>
          <p style={{ color: '#64748B', textAlign: 'center', fontSize: 18, marginBottom: 56 }}>Powerful tools for schools and students alike.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 28 }}>
                <div style={{ width: 44, height: 44, background: '#EFF6FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={22} color="#2563EB" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '80px 2rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 12, textAlign: 'center' }}>Simple pricing</h2>
          <p style={{ color: '#64748B', textAlign: 'center', fontSize: 18, marginBottom: 56 }}>No hidden fees. Cancel anytime.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {plans.map((plan) => (
              <div key={plan.name} style={{ border: plan.popular ? '2px solid #2563EB' : '1.5px solid #E2E8F0', borderRadius: 20, padding: 32, position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#2563EB', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 16px', borderRadius: 20 }}>Most Popular</div>}
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{plan.name}</h3>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 32, fontWeight: 800 }}>{plan.price}</span>
                  <span style={{ color: '#64748B', fontSize: 15 }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: '#334155' }}>
                      <Check size={16} color="#22C55E" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" style={{ display: 'block', textAlign: 'center', background: plan.popular ? '#2563EB' : '#F8FAFC', color: plan.popular ? '#fff' : '#0B1D3A', padding: '13px 0', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 15, border: plan.popular ? 'none' : '1.5px solid #E2E8F0' }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ background: '#F8FAFC', padding: '80px 2rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 48, textAlign: 'center' }}>FAQ</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 600, color: '#0B1D3A', textAlign: 'left' }}>
                  {faq.q}
                  <ChevronDown size={18} color="#64748B" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {openFaq === i && <div style={{ padding: '0 24px 20px', color: '#64748B', fontSize: 15, lineHeight: 1.7 }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#2563EB', padding: '80px 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 16 }}>Ready to get started?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 36 }}>Join Algerian schools already using Scholaria.</p>
        <Link to="/register" style={{ background: '#fff', color: '#2563EB', padding: '16px 36px', borderRadius: 14, textDecoration: 'none', fontSize: 17, fontWeight: 700, display: 'inline-block' }}>
          Create Free Account
        </Link>
      </section>


    </div>
  );
}