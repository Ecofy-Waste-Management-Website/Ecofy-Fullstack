import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Main/Top-Header-Section/navbar/navbar';
import Footer from '../Components/Main/Footer/footer';

const timelineSteps = [
  {
    id: 'step1',
    title: 'The Problem',
    description:
      'Millions of tons of waste are produced annually through consumer products without tracking, missed pickups, mixed piles, and accountability.',
  },
  {
    id: 'step2',
    title: 'Smart Digital Platform',
    description:
      'A unified digital platform for customers, staff, and admins. It brings together bookings, missed pickups, schedules, and operations in one place.',
  },
  {
    id: 'step3',
    title: 'Integrating the System',
    description:
      'Core modules, plugin integration, HRM workflows, payment processing, and messaging features are brought together into one system.',
  },
  {
    id: 'step4',
    title: 'Raising Funds',
    description:
      'Raising funds to accelerate growth, expand the market, support hiring, training, payments, and ICT studies.',
  },
  {
    id: 'step5',
    title: 'Tuning and Refinement',
    description:
      'Rolling out across all user roles with performance optimization, security audits, and UI polish updates.',
  },
];

const statCards = [
  { icon: '🌱', value: '10,000+', label: 'Kg Waste Recycled' },
  { icon: '👥', value: '5,000+', label: 'Active Users' },
  { icon: '♻️', value: '50+', label: 'Cities Served' },
];

export default function About() {
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.timeline-item').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(144, 238, 144, 0.3); }
          50% { box-shadow: 0 0 25px rgba(144, 238, 144, 0.6); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .timeline-item {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease;
        }

        .timeline-item.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <Navbar />

      <section
        style={{
          background: 'linear-gradient(135deg, #0f3d2e 0%, #1f7a63 50%, #1a5c4a 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientMove 8s ease infinite',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(144, 238, 144, 0.1), transparent)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />

        <div
          style={{
            maxWidth: '1200px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '56px',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '20px',
                animation: 'slideIn 0.8s ease',
              }}
            >
              About Ecofy
            </h1>
            <p
              style={{
                fontSize: '18px',
                color: '#e0f2f1',
                marginBottom: '30px',
                lineHeight: 1.8,
                animation: 'slideIn 1s ease',
              }}
            >
              Ecofy is a smart, web-based waste management platform that bridges the gap between communities and private waste collection services. We champion environmental sustainability, social responsibility, and economic accountability.
            </p>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', animation: 'slideIn 1.2s ease' }}>
              <a
                href="/contact"
                style={{
                  padding: '14px 32px',
                  backgroundColor: '#4ade80',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(74, 222, 128, 0.3)',
                }}
              >
                Get in Touch
              </a>
              <a
                href="#journey"
                style={{
                  padding: '14px 32px',
                  backgroundColor: 'transparent',
                  color: '#4ade80',
                  border: '2px solid #4ade80',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                Learn More
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                width: '280px',
                height: '380px',
                background: 'linear-gradient(135deg, #0d8659 0%, #1a5c4a 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                animation: 'float 3.5s ease-in-out infinite',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(144, 238, 144, 0.2)',
              }}
            >
              <div style={{ fontSize: '120px', animation: 'pulseGlow 2s ease infinite' }}>♻️</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 20px', backgroundColor: '#f9f9f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '42px', fontWeight: 700, color: '#1a5c4a', marginBottom: '60px' }}>
            Our Values
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            <div style={{ backgroundColor: '#fff', padding: '50px 30px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)', border: '2px solid transparent' }}>
              <div style={{ width: '70px', height: '70px', backgroundColor: '#1a5c4a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', marginBottom: '20px', boxShadow: '0 8px 20px rgba(26, 92, 74, 0.3)' }}>
                🎯
              </div>
              <h3 style={{ color: '#1a5c4a', fontSize: '24px', fontWeight: 700, marginBottom: '15px' }}>VISION</h3>
              <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.8 }}>
                A world where waste is a resource, and climate issues are solved through technology and innovation.
              </p>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '50px 30px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)', border: '2px solid transparent' }}>
              <div style={{ width: '70px', height: '70px', backgroundColor: '#1a5c4a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', marginBottom: '20px', boxShadow: '0 8px 20px rgba(26, 92, 74, 0.3)' }}>
                🚀
              </div>
              <h3 style={{ color: '#1a5c4a', fontSize: '24px', fontWeight: 700, marginBottom: '15px' }}>MISSION</h3>
              <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.8 }}>
                To establish Ecofy as Sri Lanka's most trusted and innovative waste collection service with transparency and accountability.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'linear-gradient(135deg, #0f3d2e 0%, #1f7a63 100%)', padding: '60px 20px', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', textAlign: 'center' }}>
          {statCards.map((stat) => (
            <div key={stat.label} style={{ padding: '40px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(144, 238, 144, 0.2)' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>{stat.icon}</div>
              <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: '10px' }}>{stat.value}</div>
              <div style={{ fontSize: '16px', color: '#e0f2f1' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="journey" style={{ padding: '80px 20px', backgroundColor: '#f9f9f9' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '42px', fontWeight: 700, color: '#1a5c4a', marginBottom: '20px' }}>
            Our Journey
          </h2>
          <p style={{ textAlign: 'center', fontSize: '16px', color: '#666', marginBottom: '60px' }}>
            From vision to reality: how we're transforming waste management.
          </p>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(180deg, #1a5c4a, transparent)', transform: 'translateX(-50%)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
              {timelineSteps.map((step, index) => (
                <div
                  key={step.id}
                  id={step.id}
                  className={`timeline-item ${visibleItems.has(step.id) ? 'show' : ''}`}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', alignItems: 'center' }}>
                    {index % 2 === 0 ? (
                      <>
                        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)', border: '2px solid #1a5c4a' }}>
                          <h3 style={{ color: '#1a5c4a', fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>{step.title}</h3>
                          <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6 }}>{step.description}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <div style={{ width: '50px', height: '50px', backgroundColor: '#4ade80', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: '#fff', boxShadow: '0 4px 15px rgba(74, 222, 128, 0.3)', zIndex: 1 }}>
                            {index + 1}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <div style={{ width: '50px', height: '50px', backgroundColor: '#4ade80', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: '#fff', boxShadow: '0 4px 15px rgba(74, 222, 128, 0.3)', zIndex: 1 }}>
                            {index + 1}
                          </div>
                        </div>
                        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)', border: '2px solid #1a5c4a' }}>
                          <h3 style={{ color: '#1a5c4a', fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>{step.title}</h3>
                          <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6 }}>{step.description}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}