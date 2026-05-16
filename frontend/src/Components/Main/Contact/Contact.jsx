import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const res = await fetch('http://localhost:5000/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: formData.name,
        userEmail: formData.email,
        subject: formData.subject,
        message: formData.message,
      })
    });

    if (res.ok) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  } catch (err) {
    console.error('Failed to send message:', err);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-[#66c45e] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-green-100">
            We're here to help! Get in touch with us.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Get In Touch
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex 
                    items-center justify-center">
                    <span>📧</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium">mailhello@ecofy.eco</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex 
                    items-center justify-center">
                    <span>📞</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-gray-800 font-medium">+94 (555) ECO-WASTE</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex 
                    items-center justify-center">
                    <span>📍</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-gray-800 font-medium">
                      123 Galle Face, Eco City, Colombo
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex 
                    items-center justify-center">
                    <span>🕐</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Working Hours</p>
                    <p className="text-gray-800 font-medium">
                      Mon - Sat: 8:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick FAQ</h2>
              <div className="space-y-3">
                <div className="border-b pb-3">
                  <p className="font-medium text-gray-800 text-sm">
                    How do I book a pickup?
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Sign up, go to your dashboard and click "Request Pickup".
                  </p>
                </div>
                <div className="border-b pb-3">
                  <p className="font-medium text-gray-800 text-sm">
                    How can I track my pickup?
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Track in real-time from your customer dashboard.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    What areas do you cover?
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    We cover 15 cities across Western and Southern provinces.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Send us a Message
            </h2>

            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-[#397239] text-sm font-medium">
                  ✅ Message sent successfully! We'll get back to you soon.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="w-full mt-1 px-3 py-2 border border-gray-300 
                    rounded-lg text-sm focus:outline-none focus:border-[#66c45e]"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full mt-1 px-3 py-2 border border-gray-300 
                    rounded-lg text-sm focus:outline-none focus:border-[#66c45e]"
                />
              </div>
              <div>
                <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                  className="w-full mt-1 px-3 py-2 border border-gray-300 
                    rounded-lg text-sm focus:outline-none focus:border-[#66c45e]"
                />
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more..."
                  rows={4}
                  required
                  className="w-full mt-1 px-3 py-2 border border-gray-300 
                    rounded-lg text-sm focus:outline-none focus:border-[#66c45e]"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#66c45e] text-white py-3 rounded-lg 
                  font-medium hover:bg-[#397239] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
