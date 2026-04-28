import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

// Components
import Navbar from './Components/Main/Top-Header-Section/navbar/navbar';
import Footer from './Components/Main/Footer/footer';
import Hero from './Components/Main/Hero-Section/Hero';
import Dashboard from './Components/Screens/Dashboard'; 
import AdminDashboard from './Components/Admin/adminDashboard';
import ServiceHistory from './Components/Screens/ServiceHistory';
import PaymentHistory from './Components/Screens/PaymentHistory';
import Notifications from './Components/Screens/Notifications';

// Auth Components
import RoleRedirect from "./Components/Auth/RoleRedirect";
import ProtectedRoute from './Components/Auth/ProtectedRoute';

// About Component
const About = () => {
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

  const timelineSteps = [
    {
      id: 'step1',
      title: 'The Problem',
      description: 'Millions of tons of waste produced annually through consumer products without tracking, missed pickups, mixed piles, and accountability.'
    },
    {
      id: 'step2',
      title: 'Smart Digital Platform',
      description: 'A unified digital platform for customers, staff, and admins. Seamlessly integration across operations including request bookings, missed pickups, schedules, etc.'
    },
    {
      id: 'step3',
      title: 'Integrating the System',
      description: 'All Plugins, the core Offix and module architecture defined. HRM stack, payment integration, messaging, etc.'
    },
    {
      id: 'step4',
      title: 'Raising Funds',
      description: 'Raising funds to accelerate growth, market expansion, hiring, training, payments, ICT studies, etc.'
    },
    {
      id: 'step5',
      title: 'Tailing & Refinement',
      description: 'Roll out across all user roles. Performance optimization, security audits, and UI polish updates.'
    }
  ];

  const statCards = [
    { icon: '🌱', value: '10,000+', label: 'Kg Waste Recycled' },
    { icon: '👥', value: '5,000+', label: 'Active Users' },
    { icon: '♻️', value: '50+', label: 'Cities Served' }
  ];

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
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(144, 238, 144, 0.3); }
          50% { box-shadow: 0 0 25px rgba(144, 238, 144, 0.6); }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes tilt {
          0%, 100% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); }
          50% { transform: perspective(1000px) rotateX(5deg) rotateY(5deg); }
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
      
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0f3d2e 0%, #1f7a63 50%, #1a5c4a 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientMove 8s ease infinite',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(144, 238, 144, 0.1), transparent)',
          borderRadius: '50%',
          filter: 'blur(80px)'
        }} />
        
        <div style={{
          maxWidth: '1200px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'center',
          zIndex: 2
        }}>
          {/* Left Content */}
          <div>
            <h1 style={{
              fontSize: '56px',
              fontWeight: '700',
              color: '#fff',
              marginBottom: '20px',
              animation: 'slideIn 0.8s ease'
            }}>
              About Ecofy
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#e0f2f1',
              marginBottom: '30px',
              lineHeight: '1.8',
              animation: 'slideIn 1s ease'
            }}>
              Ecofy is a smart, web-based waste management platform that bridges the gap between communities and private waste collection services. We champion environmental sustainability, social responsibility, and economic accountability.
            </p>
            <div style={{ display: 'flex', gap: '15px', animation: 'slideIn 1.2s ease' }}>
              <button style={{
                padding: '14px 32px',
                backgroundColor: '#4ade80',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(74, 222, 128, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 6px 20px rgba(74, 222, 128, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(74, 222, 128, 0.3)';
              }}>
                Get Started
              </button>
              <button style={{
                padding: '14px 32px',
                backgroundColor: 'transparent',
                color: '#4ade80',
                border: '2px solid #4ade80',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#4ade80';
                e.target.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#4ade80';
              }}>
                Learn More
              </button>
            </div>
          </div>
          
          {/* Right Image/Illustration */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
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
              border: '2px solid rgba(144, 238, 144, 0.2)'
            }}>
              <div style={{
                fontSize: '120px',
                animation: 'pulse-glow 2s ease infinite'
              }}>
                ♻️
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission Section */}
      <div style={{ padding: '80px 20px', backgroundColor: '#f9f9f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '42px',
            fontWeight: '700',
            color: '#1a5c4a',
            marginBottom: '60px'
          }}>
            Our Values
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px'
          }}>
            {/* Vision Card */}
            <div style={{
              backgroundColor: '#fff',
              padding: '50px 30px',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              border: '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = '#4ade80';
              e.currentTarget.querySelector('.vision-icon').style.transform = 'rotate(15deg) scale(1.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.querySelector('.vision-icon').style.transform = 'rotate(0) scale(1)';
            }}>
              <div className="vision-icon" style={{
                width: '70px',
                height: '70px',
                backgroundColor: '#1a5c4a',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                marginBottom: '20px',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 20px rgba(26, 92, 74, 0.3)'
              }}>
                🎯
              </div>
              <h3 style={{ color: '#1a5c4a', fontSize: '24px', fontWeight: '700', marginBottom: '15px' }}>
                VISION
              </h3>
              <p style={{
                color: '#666',
                fontSize: '15px',
                lineHeight: '1.8'
              }}>
                A world where waste is a resource, and failure issues and misused principles are eliminated. We envision a planet where waste and climate issues are solved through technology and innovation.
              </p>
            </div>

            {/* Mission Card */}
            <div style={{
              backgroundColor: '#fff',
              padding: '50px 30px',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              border: '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = '#4ade80';
              e.currentTarget.querySelector('.mission-icon').style.transform = 'rotate(15deg) scale(1.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.querySelector('.mission-icon').style.transform = 'rotate(0) scale(1)';
            }}>
              <div className="mission-icon" style={{
                width: '70px',
                height: '70px',
                backgroundColor: '#1a5c4a',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                marginBottom: '20px',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 20px rgba(26, 92, 74, 0.3)'
              }}>
                🚀
              </div>
              <h3 style={{ color: '#1a5c4a', fontSize: '24px', fontWeight: '700', marginBottom: '15px' }}>
                MISSION
              </h3>
              <p style={{
                color: '#666',
                fontSize: '15px',
                lineHeight: '1.8'
              }}>
                To establish Ecofy as Sri Lanka's most trusted and innovative waste collection service. We champion customer-centric service, environmental sustainability, transparency, and accountability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0f3d2e 0%, #1f7a63 100%)',
        padding: '60px 20px',
        color: '#fff'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          textAlign: 'center'
        }}>
          {statCards.map((stat, index) => (
            <div key={index} style={{
              padding: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(144, 238, 144, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(144, 238, 144, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '36px',
                fontWeight: '700',
                marginBottom: '10px'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '16px',
                color: '#e0f2f1'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Journey Section */}
      <div style={{ padding: '80px 20px', backgroundColor: '#f9f9f9' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '42px',
            fontWeight: '700',
            color: '#1a5c4a',
            marginBottom: '20px'
          }}>
            Our Journey
          </h2>
          <p style={{
            textAlign: 'center',
            fontSize: '16px',
            color: '#666',
            marginBottom: '60px'
          }}>
            From vision to reality: How we're transforming waste management
          </p>

          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            {/* Connecting Line */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'linear-gradient(180deg, #1a5c4a, transparent)',
              transform: 'translateX(-50%)'
            }} />

            {/* Timeline Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
              {timelineSteps.map((step, index) => (
                <div
                  key={step.id}
                  id={step.id}
                  className="timeline-item"
                  style={{
                    opacity: visibleItems.has(step.id) ? 1 : 0,
                    transform: visibleItems.has(step.id) ? 'translateY(0)' : 'translateY(30px)'
                  }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '40px',
                    alignItems: 'center'
                  }}>
                    {index % 2 === 0 ? (
                      <>
                        <div style={{
                          backgroundColor: '#fff',
                          padding: '30px',
                          borderRadius: '12px',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                          border: '2px solid #1a5c4a'
                        }}>
                          <h3 style={{
                            color: '#1a5c4a',
                            fontSize: '20px',
                            fontWeight: '700',
                            marginBottom: '10px'
                          }}>
                            {step.title}
                          </h3>
                          <p style={{
                            color: '#666',
                            fontSize: '14px',
                            lineHeight: '1.6'
                          }}>
                            {step.description}
                          </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <div style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: '#4ade80',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#fff',
                            boxShadow: '0 4px 15px rgba(74, 222, 128, 0.3)',
                            zIndex: 1
                          }}>
                            {index + 1}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <div style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: '#4ade80',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#fff',
                            boxShadow: '0 4px 15px rgba(74, 222, 128, 0.3)',
                            zIndex: 1
                          }}>
                            {index + 1}
                          </div>
                        </div>
                        <div style={{
                          backgroundColor: '#fff',
                          padding: '30px',
                          borderRadius: '12px',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                          border: '2px solid #1a5c4a'
                        }}>
                          <h3 style={{
                            color: '#1a5c4a',
                            fontSize: '20px',
                            fontWeight: '700',
                            marginBottom: '10px'
                          }}>
                            {step.title}
                          </h3>
                          <p style={{
                            color: '#666',
                            fontSize: '14px',
                            lineHeight: '1.6'
                          }}>
                            {step.description}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};


const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    inquirySource: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    setFormData({ fullName: '', email: '', inquirySource: '', message: '' });
  };

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Banner Section */}
      <div style={{
        backgroundColor: '#1a5c4a',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><defs><pattern id="waste" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse"><g opacity="0.1" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"><circle cx="50" cy="30" r="25"/><rect x="80" y="20" width="40" height="50"/><path d="M40 100 Q50 120 40 140"/><circle cx="150" cy="80" r="20"/><rect x="100" y="120" width="60" height="30"/></g></pattern></svg>#waste')`,
        backgroundSize: 'cover',
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ color: '#90ee90', fontSize: '13px', letterSpacing: '2px', marginBottom: '15px', fontWeight: '600', textTransform: 'uppercase' }}>CONTACT US</h3>
          <h1 style={{ color: '#fff', fontSize: '56px', marginBottom: '20px', fontWeight: 'bold' }}>Get in Touch</h1>
          <p style={{ color: '#ddd', fontSize: '16px', lineHeight: '1.6' }}>Have questions about our waste collection services or need help with your account? We're here to help.</p>
        </div>
      </div>

      {/* Contact Cards Section */}
      <div style={{ padding: '60px 20px', backgroundColor: '#f9f9f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
          
          {/* Card 1: Our Reach */}
          <div style={{ backgroundColor: '#fff', padding: '40px 30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center', position: 'relative' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#1a5c4a',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '-40px auto 20px',
              fontSize: '28px',
              color: '#fff',
              boxShadow: '0 4px 10px rgba(26, 92, 74, 0.3)'
            }}>
              📍
            </div>
            <h3 style={{ color: '#1a5c4a', marginBottom: '10px', fontSize: '18px', fontWeight: '600' }}>Our Reach</h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>Serving the Western & Southern Provinces, Sri Lanka</p>
          </div>

          {/* Card 2: Call or Email */}
          <div style={{ backgroundColor: '#fff', padding: '40px 30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center', position: 'relative' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#1a5c4a',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '-40px auto 20px',
              fontSize: '28px',
              color: '#fff',
              boxShadow: '0 4px 10px rgba(26, 92, 74, 0.3)'
            }}>
              📞
            </div>
            <h3 style={{ color: '#1a5c4a', marginBottom: '10px', fontSize: '18px', fontWeight: '600' }}>Call or Email</h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>info@ecofy.lk<br />+94 723 608</p>
          </div>

          {/* Card 3: AI Chatbot */}
          <div style={{ backgroundColor: '#fff', padding: '40px 30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center', position: 'relative' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#1a5c4a',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '-40px auto 20px',
              fontSize: '28px',
              color: '#fff',
              boxShadow: '0 4px 10px rgba(26, 92, 74, 0.3)'
            }}>
              💬
            </div>
            <h3 style={{ color: '#1a5c4a', marginBottom: '10px', fontSize: '18px', fontWeight: '600' }}>24/7 AI Chatbot</h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>Use our automated assistant to answer booking and help routing</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div style={{ padding: '40px 20px 80px', backgroundColor: '#f9f9f9' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '50px 40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#1a5c4a', textAlign: 'center', marginBottom: '10px', fontSize: '28px', fontWeight: '600' }}>Send us an Inquiry</h2>
          <p style={{ color: '#666', textAlign: 'center', marginBottom: '35px', fontSize: '13px' }}>Fill out the form below and our team will get back to you within 24 hours.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '13px', fontWeight: '600' }}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: 'none',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'background-color 0.2s'
                }}
                onFocus={(e) => e.target.style.backgroundColor = '#efefef'}
                onBlur={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                required
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '13px', fontWeight: '600' }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: 'none',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'background-color 0.2s'
                }}
                onFocus={(e) => e.target.style.backgroundColor = '#efefef'}
                onBlur={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                required
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '13px', fontWeight: '600' }}>Inquiry Source</label>
              <select
                name="inquirySource"
                value={formData.inquirySource}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: 'none',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  cursor: 'pointer'
                }}
                required
              >
                <option value="">Select inquiry source</option>
                <option value="service-question">Service Question</option>
                <option value="technical-issue">Technical Issue</option>
                <option value="billing">Billing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '13px', fontWeight: '600' }}>Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows="5"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: 'none',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#1a5c4a',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#144a3a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#1a5c4a'}
            >
              ✈ Send Message
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <>
      <Routes>
        
        {/* The Landing Page (Public) */}
        <Route path="/" element={
          <>
            <Navbar />
            <Hero />
            <Footer />
          </>
        } />

        {/* The Login Redirect */}
        <Route path="/redirect" element={
          <>
            <SignedIn><RoleRedirect /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </> 
        } />

        {/* Regular Customer Dashboard (Anyone logged in can see this) */}
        <Route path="/dashboard" element={
          <>
            <SignedIn>
              <Navbar />
              <Dashboard />
              <Footer />
            </SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />

        {/* Admin Dashboard (ONLY Admins can see this) */}
        <Route path="/admin-dashboard" element={
          <>
            <SignedIn>
              {/* ProtectedRoute goes INSIDE SignedIn */}
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            </SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />

        <Route path="/service-history" element={
          <>
            <SignedIn><Navbar /><ServiceHistory /><Footer /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />

        <Route path="/payment-history" element={
          <>
            <SignedIn><Navbar /><PaymentHistory /><Footer /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />

        <Route path="/notifications" element={
          <>
            <SignedIn><Navbar /><Notifications /><Footer /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />

        {/* Contact Us Page (Public) */}
        <Route path="/contact-us" element={
          <>
            <ContactUs />
          </>
        } />

        {/* About Page (Public) */}
        <Route path="/about" element={
          <>
            <About />
          </>
        } />
      </Routes>
    </>
  );
}