import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../Top-Header-Section/navbar/navbar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mock data for services
const services = [
  {
    id: 1,
    name: 'Household Waste Collection',
    icon: '🏠',
    iconBg: 'from-emerald-400 to-teal-500',
    description: 'Regular waste pickup for residential properties. Perfect for daily household waste management.',
    price: 'LKR 350',
    priceUnit: 'per pickup',
    features: ['Weekly pickup', 'Standard bins', 'Morning/Evening slots'],
    category: 'household',
    gradient: 'from-[#244c21] to-[#397234]'
  },
  {
    id: 2,
    name: 'Commercial Waste Collection',
    icon: '🏢',
    iconBg: 'from-blue-400 to-cyan-500',
    description: 'For businesses, offices, and commercial establishments. Customizable schedules for your needs.',
    price: 'LKR 750',
    priceUnit: 'per pickup',
    features: ['Custom schedule', 'Large bins', 'Priority support', 'Monthly billing'],
    category: 'commercial',
    gradient: 'from-[#1e3a5f] to-[#2e5a8a]'
  },
  {
    id: 3,
    name: 'Bulk Waste Collection',
    icon: '📦',
    iconBg: 'from-orange-400 to-red-500',
    description: 'Large items or high-volume waste like furniture, construction debris, and electronics.',
    price: 'LKR 1500',
    priceUnit: 'per item',
    features: ['Heavy items', 'Construction debris', 'Furniture removal', 'Same-day available'],
    category: 'bulk',
    gradient: 'from-[#8B4513] to-[#A0522D]'
  },
  {
    id: 4,
    name: 'Drain Cleaning Service',
    icon: '🚰',
    iconBg: 'from-purple-400 to-pink-500',
    description: 'Professional drain cleaning and unblocking services for residential and commercial properties.',
    price: 'LKR 1200',
    priceUnit: 'per service',
    features: ['24/7 emergency', 'Camera inspection', 'Hydro jetting', 'Preventive maintenance'],
    category: 'drain',
    gradient: 'from-[#4a154b] to-[#6b2d5c]'
  }
];

const wasteCategories = [
  'General Waste', 'Recyclables', 'Organic Waste', 'E-Waste', 
  'Hazardous Waste', 'Construction Debris', 'Furniture', 'Electronics'
];

const timeSlots = [
  '6:00 AM - 9:00 AM', '9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM', 
  '3:00 PM - 6:00 PM', '6:00 PM - 9:00 PM'
];

function ServiceCard({ service, index, onBookNow }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 50, rotationX: -15 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated border glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${service.gradient} rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500 group-hover:duration-200`}></div>
      
      {/* Card content */}
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
        {/* Animated wave background */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <svg className="absolute bottom-0 w-full h-32" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <path fill={`url(#grad-${service.id})`} fillOpacity="0.1" d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,208C960,213,1056,203,1152,186.7C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        {/* Icon section with floating animation */}
        <div className="relative h-48 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${service.iconBg} opacity-90`}></div>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `floatParticle ${2 + Math.random() * 2}s infinite ease-in-out ${Math.random()}s`
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-7xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
              {service.icon}
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-black text-[#244c21] mb-2">{service.name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
          
          {/* Features list */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {service.features.map((feature, i) => (
                <span key={i} className="text-xs bg-green-50 text-[#397234] px-2 py-1 rounded-full font-medium">
                  ✓ {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Price section */}
          <div className="border-t border-gray-100 pt-4 mb-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-[#244c21]">{service.price}</span>
                <span className="text-sm text-gray-500 ml-1">{service.priceUnit}</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">starting from</div>
                <div className="text-xs text-green-600 font-semibold">+ taxes</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onBookNow(service)}
            className="w-full bg-gradient-to-r from-[#244c21] to-[#397234] text-white py-3 rounded-xl font-bold transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 relative overflow-hidden group/btn"
          >
            <span className="relative z-10">Book Now →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#397234] to-[#4a8a42] transform translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ service, isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    location: '',
    date: '',
    timeSlot: '',
    wasteCategory: '',
    specialInstructions: ''
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" }
      );
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfetti(true);
    onSubmit(formData, service);
    setTimeout(() => {
      setShowConfetti(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 2 + 's',
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`
              }}
            />
          ))}
        </div>
      )}
      
      <div ref={modalRef} className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
        >
          ✕
        </button>

        <div className={`bg-gradient-to-r ${service.gradient} p-6 rounded-t-3xl`}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{service.icon}</span>
            <div>
              <h2 className="text-2xl font-black text-white">{service.name}</h2>
              <p className="text-white/80 text-sm">Fill in the details to schedule your pickup</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Pickup Location */}
          <div>
            <label className="block text-sm font-bold text-[#244c21] mb-2">📍 Pickup Location</label>
            <input
              type="text"
              required
              placeholder="Enter your full address"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#397234] focus:outline-none transition-colors"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#244c21] mb-2">📅 Preferred Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#397234] focus:outline-none transition-colors"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#244c21] mb-2">⏰ Time Slot</label>
              <select
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#397234] focus:outline-none transition-colors"
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
              >
                <option value="">Select time slot</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Waste Category */}
          <div>
            <label className="block text-sm font-bold text-[#244c21] mb-2">🗑️ Waste Category</label>
            <select
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#397234] focus:outline-none transition-colors"
              value={formData.wasteCategory}
              onChange={(e) => setFormData({ ...formData, wasteCategory: e.target.value })}
            >
              <option value="">Select waste category</option>
              {wasteCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-bold text-[#244c21] mb-2">📝 Special Instructions</label>
            <textarea
              rows="3"
              placeholder="Any special notes for the collection team?"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#397234] focus:outline-none transition-colors resize-none"
              value={formData.specialInstructions}
              onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
            />
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#244c21]">Total Price:</span>
              <span className="text-2xl font-black text-[#244c21]">{service.price}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">*Price includes standard service fee. Additional charges may apply for special requests.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#244c21] to-[#397234] text-white py-4 rounded-xl font-bold text-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            Confirm Booking →
          </button>
        </form>
      </div>
    </div>
  );
}

function AIChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { type: 'bot', text: '👋 Hi! I\'m EcoBot, your AI assistant. Need help choosing the right service? Ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(chatRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.2)" }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { type: 'user', text: input }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response = '';
      const userInput = input.toLowerCase();
      
      if (userInput.includes('household') || userInput.includes('home')) {
        response = '🏠 For household waste, I recommend our Household Waste Collection service at LKR 350 per pickup. It includes weekly pickup with morning/evening slots available! Would you like me to help you book it?';
      } else if (userInput.includes('commercial') || userInput.includes('business') || userInput.includes('office')) {
        response = '🏢 Our Commercial Waste Collection service is perfect for businesses! Starting at LKR 750 per pickup with customizable schedules and priority support. Shall I assist with booking?';
      } else if (userInput.includes('bulk') || userInput.includes('furniture') || userInput.includes('construction')) {
        response = '📦 For bulk items, try our Bulk Waste Collection at LKR 1500 per item. We handle furniture, construction debris, and electronics with same-day available!';
      } else if (userInput.includes('drain') || userInput.includes('clog')) {
        response = '🚰 Our Drain Cleaning Service costs LKR 1200 and includes 24/7 emergency response, camera inspection, and hydro jetting. Need immediate assistance?';
      } else if (userInput.includes('price') || userInput.includes('cost')) {
        response = '💰 Our services start from LKR 350 (Household) up to LKR 1500 (Bulk). Commercial and Drain services are LKR 750 and LKR 1200 respectively. All prices include standard service!';
      } else {
        response = '🤔 Let me help! We offer Household (LKR 350), Commercial (LKR 750), Bulk (LKR 1500), and Drain Cleaning (LKR 1200). What type of waste do you need to dispose of?';
      }
      
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-8 z-50 w-96 animate-slideUp">
      <div ref={chatRef} className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Chat header */}
        <div className="bg-gradient-to-r from-[#244c21] to-[#397234] p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-bold">EcoBot Assistant</h3>
                <p className="text-xs text-green-100">Online • Ready to help</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1 transition-colors">
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                msg.type === 'user' 
                  ? 'bg-gradient-to-r from-[#244c21] to-[#397234] text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me about services, pricing, or booking..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:border-[#397234] focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-[#244c21] to-[#397234] text-white px-4 py-2 rounded-xl hover:scale-105 transition-transform"
            >
              Send →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [recentBookings, setRecentBookings] = useState([]);
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Hero animations
    gsap.fromTo('.hero-title',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo('.hero-subtitle',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out" }
    );
    gsap.fromTo('.hero-stats',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, delay: 0.4, stagger: 0.1, ease: "back.out(1.2)" }
    );

    // Stats counter animation
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const updateCount = () => {
        const target = parseInt(counter.getAttribute('data-target'));
        const count = parseInt(counter.innerText);
        const increment = target / 50;
        if (count < target) {
          counter.innerText = Math.ceil(count + increment);
          setTimeout(updateCount, 20);
        } else {
          counter.innerText = target;
        }
      };
      
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 80%",
        onEnter: () => updateCount(),
        once: true
      });
    });
  }, []);

  const handleBookNow = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = (formData, service) => {
    const booking = {
      id: Date.now(),
      service: service.name,
      ...formData,
      status: 'pending',
      timestamp: new Date().toLocaleString()
    };
    setRecentBookings(prev => [booking, ...prev].slice(0, 3));
    
    // Show success message
    alert(`✅ Booking confirmed!\n\nService: ${service.name}\nDate: ${formData.date}\nTime: ${formData.timeSlot}\n\nYou can track your booking status in real-time.`);
  };

  return (
    <div className="bg-gradient-to-b from-[#D6E9CA] to-white min-h-screen overflow-x-hidden">
      {/* Custom animations */}
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.5s ease-out forwards; }
        .animate-confetti { animation: confetti 2s linear forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        .animate-rotate { animation: rotate 20s linear infinite; }
        
        .floating-shape {
          position: absolute;
          background: radial-gradient(circle, rgba(57,114,52,0.1) 0%, rgba(57,114,52,0) 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        
        .glow-text {
          text-shadow: 0 0 30px rgba(57,114,52,0.3);
        }
        
        .card-hover-effect {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .gradient-border {
          position: relative;
          background: linear-gradient(135deg, #244c21, #397234);
          padding: 2px;
          border-radius: 1.5rem;
        }
        
        .gradient-border > div {
          background: white;
          border-radius: 1.5rem;
        }
      `}</style>

      <Navbar />

      {/* Hero Section with animated background */}
      <div ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-[#244c21] via-[#2d5a29] to-[#397234]">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-shape w-96 h-96 top-20 -left-48 animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="floating-shape w-128 h-128 bottom-20 -right-48 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-10 right-20 w-32 h-32 border border-white/10 rounded-full animate-rotate"></div>
          <div className="absolute bottom-10 left-20 w-24 h-24 border border-white/10 rounded-full animate-rotate" style={{ animationDirection: 'reverse' }}></div>
          
          {/* Animated dots */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse-slow"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animationDuration: 1 + Math.random() * 2 + 's'
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="hero-title inline-block mb-4">
            <span className="bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-semibold tracking-wider">
              ✨ OUR SERVICES
            </span>
          </div>
          <h1 className="hero-title text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter glow-text">
            Waste Collection
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
              Made Simple
            </span>
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-green-100 mb-12 max-w-3xl mx-auto font-medium">
            Book, track, and manage your waste collection with Sri Lanka's most trusted platform
          </p>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: '🗑️', label: 'Waste Collected', target: 1250, suffix: 'tons' },
              { icon: '✅', label: 'Happy Customers', target: 5000, suffix: '+' },
              { icon: '🚛', label: 'Pickups Completed', target: 15000, suffix: '+' },
              { icon: '⭐', label: 'Customer Rating', target: 48, prefix: '4.', suffix: '/5' }
            ].map((stat, idx) => (
              <div key={idx} className="hero-stats bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-black text-white">
                  {stat.prefix}<span className="stat-number" data-target={stat.target}>0</span>{stat.suffix}
                </div>
                <div className="text-sm text-green-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative h-16">
          <svg className="absolute bottom-0 w-full" preserveAspectRatio="none" viewBox="0 0 1440 120">
            <path d="M0,64L80,74.7C160,85,320,107,480,106.7C640,107,800,85,960,80C1120,75,1280,85,1360,90.7L1440,96L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="#D6E9CA"></path>
          </svg>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-[#244c21] mb-4">Choose Your Service</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select from our range of professional waste collection services tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <ServiceCard key={service.id} service={service} index={idx} onBookNow={handleBookNow} />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-[#244c21] to-[#397234] py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            {[
              { icon: '🤖', title: 'AI-Powered Assistant', desc: 'Get instant help choosing the right service and scheduling pickups' },
              { icon: '📍', title: 'Real-Time Tracking', desc: 'Track your service provider in real-time from pickup to completion' },
              { icon: '💳', title: 'Secure Payments', desc: 'Multiple payment options with 100% secure transaction processing' }
            ].map((feature, idx) => (
              <div key={idx} className="text-center animate-slideUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-green-100">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings Section */}
      {recentBookings.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h3 className="text-2xl font-bold text-[#244c21] mb-6">📋 Recent Bookings</h3>
          <div className="space-y-3">
            {recentBookings.map(booking => (
              <div key={booking.id} className="bg-white border border-green-100 rounded-xl p-4 flex justify-between items-center hover:shadow-lg transition-shadow">
                <div>
                  <p className="font-bold text-[#244c21]">{booking.service}</p>
                  <p className="text-sm text-gray-500">{booking.date} • {booking.timeSlot}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pending</span>
                  <button className="text-[#397234] font-semibold text-sm hover:underline">Track →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 mb-12">
        <div className="gradient-border">
          <div className="bg-gradient-to-r from-[#D6E9CA] to-white p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-black text-[#244c21] mb-4">Ready to Get Started?</h3>
            <p className="text-lg text-gray-600 mb-6">Join thousands of satisfied customers using Ecofy for waste management</p>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-gradient-to-r from-[#244c21] to-[#397234] text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              Talk to EcoBot →
            </button>
          </div>
        </div>
      </div>

     

      {/* Modals */}
      <BookingModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleBookingSubmit}
      />

      <AIChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}