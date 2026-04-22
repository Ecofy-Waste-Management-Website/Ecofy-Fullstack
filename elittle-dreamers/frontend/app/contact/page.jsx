'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  })
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setStatus('success')
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <main className="bg-sky-blue min-h-screen py-16 px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Contact Info */}
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-extrabold text-navy mb-4">Get in Touch</h1>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-navy">Phone</h3>
            <p className="text-sm text-navy/70 mt-1">+971 56 201 6469</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-navy">Hours</h3>
            <p className="text-sm text-navy/70 mt-1">Monday to Saturday, 07:00 AM – 07:00 PM</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-navy">Email</h3>
            <p className="text-sm text-navy/70 mt-1">info@elittledreamers.com</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-navy mb-6">Send a Message</h2>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="border border-white/30 bg-white/50 rounded-lg px-4 py-3 outline-none focus:border-teal transition-colors text-sm"
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="border border-white/30 bg-white/50 rounded-lg px-4 py-3 outline-none focus:border-teal transition-colors text-sm"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border border-white/30 bg-white/50 rounded-lg px-4 py-3 outline-none focus:border-teal transition-colors text-sm"
            />
            <input
              type="tel"
              placeholder="Phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border border-white/30 bg-white/50 rounded-lg px-4 py-3 outline-none focus:border-teal transition-colors text-sm"
            />
            <textarea
              placeholder="Message"
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="border border-white/30 bg-white/50 rounded-lg px-4 py-3 outline-none focus:border-teal transition-colors text-sm"
            />
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-teal text-white rounded-full px-8 py-3 hover:bg-navy transition-colors font-semibold mt-2 disabled:opacity-70"
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm mt-2 text-center">
                Thank you! We'll be in touch within 24 hours.
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mt-2 text-center">
                Something went wrong. Please try again.
              </div>
            )}
          </form>
        </div>

      </div>
    </main>
  )
}
