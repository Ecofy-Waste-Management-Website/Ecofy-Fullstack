import React, { useState } from 'react';
import Navbar from '../Components/Main/Top-Header-Section/navbar/navbar';
import Footer from '../Components/Main/Footer/footer';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    inquirySource: '',
    message: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ fullName: '', email: '', inquirySource: '', message: '' });
  };

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Navbar />

      <section
        style={{
          background: 'linear-gradient(135deg, #1a5c4a 0%, #0f3d2e 100%)',
          padding: '80px 20px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ color: '#90ee90', fontSize: '13px', letterSpacing: '2px', marginBottom: '15px', fontWeight: 600, textTransform: 'uppercase' }}>
            Contact Us
          </h3>
          <h1 style={{ color: '#fff', fontSize: '56px', marginBottom: '20px', fontWeight: 'bold' }}>
            Get in Touch
          </h1>
          <p style={{ color: '#ddd', fontSize: '16px', lineHeight: 1.6 }}>
            Have questions about our waste collection services or need help with your account? We are here to help.
          </p>
        </div>
      </section>

      <section style={{ padding: '60px 20px', backgroundColor: '#f9f9f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
          <div style={{ backgroundColor: '#fff', padding: '40px 30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#1a5c4a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-40px auto 20px', fontSize: '28px', color: '#fff', boxShadow: '0 4px 10px rgba(26, 92, 74, 0.3)' }}>
              📍
            </div>
            <h3 style={{ color: '#1a5c4a', marginBottom: '10px', fontSize: '18px', fontWeight: 600 }}>Our Reach</h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.5 }}>Serving the Western and Southern Provinces, Sri Lanka</p>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '40px 30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#1a5c4a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-40px auto 20px', fontSize: '28px', color: '#fff', boxShadow: '0 4px 10px rgba(26, 92, 74, 0.3)' }}>
              📞
            </div>
            <h3 style={{ color: '#1a5c4a', marginBottom: '10px', fontSize: '18px', fontWeight: 600 }}>Call or Email</h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.5 }}>info@ecofy.lk<br />+94 723 608</p>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '40px 30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#1a5c4a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-40px auto 20px', fontSize: '28px', color: '#fff', boxShadow: '0 4px 10px rgba(26, 92, 74, 0.3)' }}>
              💬
            </div>
            <h3 style={{ color: '#1a5c4a', marginBottom: '10px', fontSize: '18px', fontWeight: 600 }}>24/7 AI Chatbot</h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.5 }}>Use our automated assistant to answer booking and help routing</p>
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 20px 80px', backgroundColor: '#f9f9f9' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '50px 40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#1a5c4a', textAlign: 'center', marginBottom: '10px', fontSize: '28px', fontWeight: 600 }}>Send us an Inquiry</h2>
          <p style={{ color: '#666', textAlign: 'center', marginBottom: '35px', fontSize: '13px' }}>
            Fill out the form below and our team will get back to you within 24 hours.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '13px', fontWeight: 600 }}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={{ width: '100%', padding: '12px 14px', border: 'none', backgroundColor: '#f5f5f5', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box', outline: 'none', transition: 'background-color 0.2s' }}
                onFocus={(event) => (event.target.style.backgroundColor = '#efefef')}
                onBlur={(event) => (event.target.style.backgroundColor = '#f5f5f5')}
                required
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '13px', fontWeight: 600 }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                style={{ width: '100%', padding: '12px 14px', border: 'none', backgroundColor: '#f5f5f5', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box', outline: 'none', transition: 'background-color 0.2s' }}
                onFocus={(event) => (event.target.style.backgroundColor = '#efefef')}
                onBlur={(event) => (event.target.style.backgroundColor = '#f5f5f5')}
                required
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '13px', fontWeight: 600 }}>Inquiry Source</label>
              <select
                name="inquirySource"
                value={formData.inquirySource}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 14px', border: 'none', backgroundColor: '#f5f5f5', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box', outline: 'none', cursor: 'pointer' }}
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
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '13px', fontWeight: 600 }}>Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows="5"
                style={{ width: '100%', padding: '12px 14px', border: 'none', backgroundColor: '#f5f5f5', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                required
              />
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '14px', backgroundColor: '#1a5c4a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.3s' }}
              onMouseEnter={(event) => (event.target.style.backgroundColor = '#144a3a')}
              onMouseLeave={(event) => (event.target.style.backgroundColor = '#1a5c4a')}
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}