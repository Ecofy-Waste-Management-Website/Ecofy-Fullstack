import React, { useState } from 'react';
import { useUser } from "@clerk/clerk-react";
import Navbar from '../Main/Top-Header-Section/navbar/navbar';
import Footer from '../Main/Footer/footer';

export default function InquiryPage() {
  const { user } = useUser();

  const [form, setForm] = useState({
    phone: '',
    category: '',
    subject: '',
    message: '',
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    if (!form.category) e.category = 'Please select a category.';
    if (!form.subject.trim()) e.subject = 'Subject is required.';
    if (!form.message.trim()) e.message = 'Message is required.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('clerkId', user.id);
      formData.append('name', `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim());
      formData.append('email', user.primaryEmailAddress?.emailAddress ?? '');
      formData.append('phone', form.phone);
      formData.append('category', form.category);
      formData.append('subject', form.subject);
      formData.append('message', form.message);
      if (form.file) formData.append('attachment', form.file);

      const res = await fetch('http://localhost:5000/inquiries', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setTicketNumber(data.ticketNumber ?? `ECO-${Math.floor(10000 + Math.random() * 90000)}`);
        setSubmitted(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Inquiry submit error:', err);
      alert('Failed to submit. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.username;
  const email = user?.primaryEmailAddress?.emailAddress ?? '';

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        <a href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-5">
          ← Back to Dashboard
        </a>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">

          {!submitted ? (
            <>
              <div className="mb-6">
                <div className="w-11 h-11 bg-pink-50 rounded-xl flex items-center justify-center text-xl mb-3">📝</div>
                <h1 className="text-xl font-bold text-gray-800">Submit an Inquiry</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Have a service-related question? Fill in the form and our team will get back to you shortly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name & Email — auto-filled, read-only */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text" value={fullName} readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email" value={email} readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+94 77 123 4567"
                    className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-green-200 focus:border-green-400 ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inquiry Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category" value={form.category} onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-green-200 focus:border-green-400 ${errors.category ? 'border-red-400' : 'border-gray-300'}`}
                  >
                    <option value="">Select a category</option>
                    <option>Pickup Issues</option>
                    <option>Billing & Payments</option>
                    <option>Account & Profile</option>
                    <option>Driver / Staff Complaint</option>
                    <option>Schedule Change Request</option>
                    <option>General Inquiry</option>
                  </select>
                  {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" name="subject" value={form.subject} onChange={handleChange}
                    placeholder="Brief subject of your inquiry"
                    className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-green-200 focus:border-green-400 ${errors.subject ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange} rows={5}
                    placeholder="Describe your issue or question in detail..."
                    className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition resize-y focus:ring-2 focus:ring-green-200 focus:border-green-400 ${errors.message ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>

                {/* File Attachment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attachment <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-5 cursor-pointer hover:border-green-300 hover:bg-green-50 transition">
                    <span className="text-2xl mb-1">📎</span>
                    <p className="text-sm text-gray-500">
                      <span className="text-green-600 font-medium">Click to upload</span> or drag & drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 5MB</p>
                    {form.file && (
                      <p className="text-xs text-green-600 mt-2 font-medium">✓ {form.file.name}</p>
                    )}
                    <input type="file" name="file" onChange={handleChange} accept="image/*,.pdf,.doc,.docx" className="hidden" />
                  </label>
                </div>

                <hr className="border-gray-100" />

                <button
                  type="submit" disabled={submitting}
                  className="w-full py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold rounded-lg text-sm transition"
                >
                  {submitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>

              </form>
            </>
          ) : (
            /* Success State */
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-2xl mb-4">✓</div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">Inquiry Submitted!</h2>
              <p className="text-sm text-gray-500 mb-2">
                Our team will respond within <span className="font-medium">1–2 business days</span>.
              </p>
              <span className="text-sm bg-pink-50 text-pink-600 border border-pink-200 px-4 py-1.5 rounded-full font-medium mt-1 mb-2">
                Ticket #{ticketNumber}
              </span>
              <p className="text-xs text-gray-400 mb-6">A confirmation has been sent to {email}</p>
              <a href="/dashboard" className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                ← Back to Dashboard
              </a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}