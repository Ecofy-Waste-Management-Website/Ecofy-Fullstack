import React, { useState } from 'react';

const FaqCard = ({ question, answer }) => (
  <div className="rounded-2xl border border-[#397234]/10 bg-white/60 p-6">
    <h3 className="text-sm font-bold text-[#244c21] mb-2">{question}</h3>
    <p className="text-sm leading-relaxed text-[#244c21]/60">{answer}</p>
  </div>
);

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: formData.name,
          userEmail: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Clear form and show success
        setFormData(EMPTY_FORM);
        setSubmitted(true);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Unable to connect to server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-[#397234]/20 bg-white px-4 py-3 text-sm text-[#244c21] outline-none transition placeholder:text-[#244c21]/30 focus:border-[#397234] focus:ring-2 focus:ring-[#397234]/10";

  const contactItems = [
    {
      icon: (
        <svg className="h-5 w-5 text-[#397234]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      ),
      label: "Phone",
      lines: ["+94 (555) ECO-WASTE"],
    },
    {
      icon: (
        <svg className="h-5 w-5 text-[#397234]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      label: "Email",
      lines: ["mailhello@ecofy.eco"],
    },
    {
      icon: (
        <svg className="h-5 w-5 text-[#397234]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
      label: "Address",
      lines: ["123 Galle Face", "Eco City, Colombo", "Sri Lanka"],
    },
    {
      icon: (
        <svg className="h-5 w-5 text-[#397234]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "Business Hours",
      lines: ["Mon – Fri: 8:00 AM – 6:00 PM", "Saturday: 8:00 AM – 4:00 PM", "Sunday: Emergency calls only"],
    },
  ];

  const faqs = [
    { question: "How do I book a pickup?", answer: "Sign up, go to your dashboard and click 'Schedule Pickup'. Select your location, date and service type." },
    { question: "How can I track my pickup?", answer: "Track your request in real-time from the Track Status section of your customer dashboard." },
    { question: "What areas do you cover?", answer: "We cover 15 cities across the Western and Southern provinces of Sri Lanka." },
    { question: "How do I pay for services?", answer: "We accept secure online payments via Stripe. You can view your payment history anytime in the dashboard." },
    { question: "What types of waste do you collect?", answer: "We collect household, commercial, garden, and bulk waste. Hazardous materials require special handling — contact us for details." },
    { question: "Do you offer emergency pickups?", answer: "Yes, emergency pickups are available outside business hours. Contact us directly by phone for urgent requests." },
  ];

  return (
    <div className="min-h-screen bg-[#D6E9CA]">

      {/* Hero */}
      <div className="relative overflow-hidden bg-[#397234] pt-36 pb-20 px-4 text-center">
        <svg className="absolute -right-8 -top-8 h-48 w-48 opacity-10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={0.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.5V11m0 0a5 5 0 0 1 5-5h2.5c0 4.5-2 6.5-4 8l-3.5 3m0-11a5 5 0 0 0-5-5H7c0 4.5 2 6.5 4 8l3.5 3" />
        </svg>
        <svg className="absolute -left-8 bottom-0 h-40 w-40 opacity-10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={0.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <h1 className="text-5xl font-black text-white tracking-tight mb-4">Get in Touch</h1>
        <p className="text-lg text-green-100/80 font-medium max-w-md mx-auto">
          Have questions about our services? We're here to help you with all your waste management needs.
        </p>
      </div>

      {/* Contact Info + Form */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">

          {/* Left — Contact Info */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h2 className="text-xl font-black text-[#244c21] mb-1">Contact Information</h2>
              <p className="text-sm text-[#397234]/60">Reach us through any of these channels.</p>
            </div>
            <div className="space-y-4">
              {contactItems.map(({ icon, label, lines }) => (
                <div key={label} className="flex items-start gap-4 rounded-2xl bg-white/60 border border-[#397234]/10 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D6E9CA]">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#397234]/50 mb-1">{label}</p>
                    {lines.map((line, i) => (
                      <p key={i} className="text-sm font-semibold text-[#244c21] leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-bold text-red-700 mb-1"> Emergency Services</p>
              <p className="text-xs text-red-600 leading-relaxed">
                For urgent waste collection needs outside business hours.<br />
                Emergency Hotline: +94 77 6777 052
              </p>
            </div>
          </div>

          {/* Right — Form or Success */}
          <div className="lg:col-span-3">
            {submitted ? (
              /* ── Success state ── */
              <div className="rounded-3xl bg-white/60 border border-[#397234]/10 p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px] gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#D6E9CA]">
                  <svg className="h-10 w-10 text-[#397234]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#244c21] mb-2">Message Sent!</h3>
                  <p className="text-sm text-[#397234]/70 max-w-sm">
                    Thank you for reaching out. We've received your inquiry and will get back to you as soon as possible.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 rounded-2xl border border-[#397234]/30 bg-[#D6E9CA] px-6 py-2.5 text-sm font-bold text-[#244c21] hover:bg-[#397234]/20 transition"
                >
                  Send another message
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <div className="rounded-3xl bg-white/60 border border-[#397234]/10 p-8 shadow-sm">
                <h2 className="text-xl font-black text-[#244c21] mb-1">Send us an Inquiry</h2>
                <p className="text-sm text-[#397234]/60 mb-7">
                  Fill out the form and we'll get back to you as soon as possible.
                </p>

                {error && (
                  <div className="mb-5 flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 px-5 py-4">
                    <span className="text-lg">⚠️</span>
                    <p className="text-sm font-semibold text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#244c21] mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                      placeholder="Enter your full name" required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#244c21] mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="Enter your email" required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#244c21] mb-2">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange}
                      placeholder="Brief description of your inquiry" required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#244c21] mb-2">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea name="message" value={formData.message} onChange={handleChange}
                      placeholder="Please provide detailed information about your inquiry..."
                      rows={6} required className={inputClass} />
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className="w-full rounded-2xl bg-[#397234] py-3.5 text-sm font-bold text-white transition hover:bg-[#244c21] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : "Send Message"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#397234] mb-4">
              <svg className="h-6 w-6 text-[#397234]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-[#244c21] mb-2">Frequently Asked Questions</h2>
            <p className="text-sm text-[#397234]/60">Find quick answers to common questions about our services.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {faqs.map((faq) => (
              <FaqCard key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </div>
       <footer className="w-full border-t border-slate-200 bg-white py-8 text-center mt-auto">
        <p className="text-sm font-medium text-slate-500">
          © 2026 Ecofy. Made with 💚 for a cleaner Sri Lanka.
        </p>
      </footer>
    </div>
  );
}