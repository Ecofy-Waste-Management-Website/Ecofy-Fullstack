import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../Top-Header-Section/navbar/navbar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../Footer/footer';
import { useAppUI } from '../../../context/AppUIContext';

import householdImg from '../../../assets/Household waste.jpg';
import commercialImg from '../../../assets/Commercial Waste.jpg';
import bulkImg from '../../../assets/Bulk Collection.jpg';
import drainImg from '../../../assets/Drain Cleaning.jpg';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
    DATA
───────────────────────────────────────── */
const services = [
  {
    id: 1,
    name: 'Household Waste',
    icon: '🏠',
    description: 'Regular waste pickup for residential properties. Perfect for daily management.',
    features: ['Weekly pickup', 'Standard bins'],
    image: householdImg,
    gradient: 'from-[#397234] to-[#244c21]',
    price: 'Rs. 1,500 / month',
    details: [
      { label: 'Pickup Frequency', value: 'Weekly (1x per week)' },
      { label: 'Bin Size', value: 'Standard 120L bin included' },
      { label: 'Coverage Area', value: 'Colombo & suburbs' },
      { label: 'Contract', value: 'No long-term commitment, cancel anytime' },
    ]
  },
  {
    id: 2,
    name: 'Commercial Waste',
    icon: '🏢',
    description: 'For businesses and offices. Customizable schedules for your specific needs.',
    features: ['Custom schedule', 'Priority support'],
    image: commercialImg,
    gradient: 'from-[#1e3a5f] to-[#244c21]',
    price: 'From Rs. 5,000 / month',
    details: [
      { label: 'Pickup Frequency', value: 'Daily, alternate-day, or custom' },
      { label: 'Bin Size', value: '240L–1100L options available' },
      { label: 'Support', value: '24/7 priority account manager' },
      { label: 'Billing', value: 'Custom quote based on volume' },
    ]
  },
  {
    id: 3,
    name: 'Bulk Collection',
    icon: '📦',
    description: 'Large items or high-volume waste like furniture and construction debris.',
    features: ['Heavy items', 'Same-day available'],
    image: bulkImg,
    gradient: 'from-[#8B4513] to-[#244c21]',
    price: 'From Rs. 3,000 / pickup',
    details: [
      { label: 'Item Types', value: 'Furniture, appliances, construction debris' },
      { label: 'Turnaround', value: 'Same-day available (subject to slots)' },
      { label: 'Pricing', value: 'Based on volume & item type' },
      { label: 'Booking', value: 'On-demand, no subscription needed' },
    ]
  },
  {
    id: 4,
    name: 'Drain Cleaning',
    icon: '🚰',
    description: 'Professional drain cleaning and unblocking services for all properties.',
    features: ['24/7 emergency', 'Hydro jetting'],
    image: drainImg,
    gradient: 'from-[#4a154b] to-[#244c21]',
    price: 'From Rs. 4,000 / visit',
    details: [
      { label: 'Service Type', value: 'Hydro jetting & manual unblocking' },
      { label: 'Availability', value: '24/7 emergency callout' },
      { label: 'Response Time', value: 'Within 2 hours (emergency)' },
      { label: 'Warranty', value: '30-day service guarantee' },
    ]
  }
];

/* ─────────────────────────────────────────
    SUB-COMPONENTS
───────────────────────────────────────── */
function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      });
    }, { threshold: 0.5 });
    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return <span ref={counterRef}>{prefix}{count}{suffix}</span>;
}

function ServiceCard({ service, index, onViewDetails }) {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <div ref={cardRef} className="relative w-full group">
      <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] shadow-xl overflow-hidden border border-[#397234]/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
        <div className={`h-40 bg-gradient-to-br ${service.gradient} relative overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity`}>
           <img src={service.image} alt={service.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl bg-[#D6E9CA] w-10 h-10 flex items-center justify-center rounded-full border border-[#397234]/20">{service.icon}</span>
            <h3 className="font-black text-[#244c21] text-lg uppercase tracking-tight">{service.name}</h3>
          </div>
          <p className="text-[#244c21]/70 text-sm mb-6 font-bold leading-relaxed line-clamp-2">{service.description}</p>
          <div className="space-y-2 mb-8">
            {service.features.map((f, i) => (
              <div key={i} className="flex items-center text-[10px] font-black text-[#397234] uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#397234] mr-2 shadow-sm" /> {f}
              </div>
            ))}
          </div>
          <button
            onClick={() => onViewDetails(service)}
            className="w-full py-4 bg-[#D6E9CA] text-[#244c21] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-[#397234]/20 hover:bg-[#244c21] hover:text-white transition-all duration-300"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

function ServiceModal({ service, onClose, onBookNow }) {
  const backdropRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(modalRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power2.out" }
    );

    // Lock body scroll while modal is open
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleClose = () => {
    gsap.to(modalRef.current, { opacity: 0, y: 20, scale: 0.95, duration: 0.2, ease: "power2.in" });
    gsap.to(backdropRef.current, {
      opacity: 0, duration: 0.2, delay: 0.05,
      onComplete: onClose
    });
  };

  const handleBookNow = () => {
    if (onBookNow) onBookNow(service);
  };

  if (!service) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleClose}
      className="fixed inset-0 z-50 bg-[#0a1a08]/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-[#397234]/10 max-h-[90vh] overflow-y-auto"
      >
        <div className={`h-44 bg-gradient-to-br ${service.gradient} relative`}>
          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-lg font-bold transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl bg-[#D6E9CA] w-10 h-10 flex items-center justify-center rounded-full border border-[#397234]/20">{service.icon}</span>
            <h3 className="font-black text-[#244c21] text-xl uppercase tracking-tight">{service.name}</h3>
          </div>

          <p className="text-[#397234] font-black text-lg mb-4">{service.price}</p>

          <p className="text-[#244c21]/70 text-sm mb-6 font-bold leading-relaxed">{service.description}</p>

          <div className="space-y-3 mb-8">
            {service.details.map((d, i) => (
              <div key={i} className="flex justify-between items-start gap-4 border-b border-[#397234]/10 pb-2 last:border-0">
                <span className="text-[10px] font-black text-[#397234] uppercase tracking-widest shrink-0">{d.label}</span>
                <span className="text-xs font-bold text-[#244c21]/80 text-right">{d.value}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-4 bg-[#D6E9CA] text-[#244c21] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-[#397234]/20 hover:bg-[#f0f0f0] transition-all duration-300"
            >
              Close
            </button>
            <button
              onClick={handleBookNow}
              className="flex-1 py-4 bg-[#244c21] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#397234] transition-all duration-300"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
    MAIN COMPONENT
───────────────────────────────────────── */
export default function Services() {
  const [selectedService, setSelectedService] = useState(null);
  const { openBooking, openChatbot } = useAppUI();

  return (
    <div className="bg-[#244c21] min-h-screen selection:bg-[#397234] selection:text-white">
      <Navbar />

      <style>{`
        .path-dash-bg {
          stroke-dasharray: 8 6;
          animation: dashMove 3s linear infinite;
        }
        @keyframes dashMove {
          to { stroke-dashoffset: -28; }
        }

        /* Waving Animation for Chatbot */
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-15deg); }
          40% { transform: rotate(10deg); }
          60% { transform: rotate(-15deg); }
          80% { transform: rotate(10deg); }
        }
        .animate-wave {
          display: inline-block;
          transform-origin: 70% 70%;
          animation: wave 2.5s infinite;
        }

        /* Truck Driving Animation */
        @keyframes drive {
          0% { transform: translateX(-150%) scaleX(-1); }
          100% { transform: translateX(450%) scaleX(-1); }
        }
        .animate-truck {
          animation: drive 8s linear infinite;
        }
      `}</style>

      {/* SECTION 1: HERO */}
      <section className="bg-[#397234] text-white pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl  font-black mb-4 tracking-tighter">
            Our Services
          </h1>
          <p className="text-xl text-green-100 font-bold opacity-80 max-w-2xl mx-auto mb-12">
            Sri Lanka's first fully integrated smart waste collection platform, designed for reliability and transparency.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Tons Collected', target: 1250, suffix: '+' },
              { label: 'Active Users', target: 5000, suffix: '+' },
              { label: 'Daily Pickups', target: 450, suffix: '' },
              { label: 'Avg Rating', target: 4, prefix: '4.', suffix: '/5' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-[#D6E9CA]/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                <div className="text-2xl font-black text-[#D6E9CA]">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} prefix={stat.prefix} />
                </div>
                <div className="text-[9px] uppercase font-black text-white/40 tracking-[0.2em] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#244c21] rounded-full blur-[100px] opacity-40" />
      </section>

      <section className="bg-[#D6E9CA] py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-[#397234] font-black mb-2">Management Services</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#244c21] tracking-tighter uppercase">Tailored for you</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
            {services.map((s, i) => (
              <div
                key={s.id}
                className={`w-full ${i % 2 !== 0 ? 'sm:mt-12 lg:mt-24' : 'sm:mt-0'}`}
              >
                <ServiceCard service={s} index={i} onViewDetails={setSelectedService} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: TECH FEATURES */}
      <section className="bg-[#244c21] py-24 px-6 overflow-hidden relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 relative z-10">
          {/* AI Box */}
          <div className="bg-[#397234]/30 backdrop-blur-xl border border-white/5 p-12 rounded-[3rem] hover:bg-[#397234]/50 transition-all">
            <div className="w-14 h-14 bg-[#D6E9CA] rounded-2xl mb-8 flex items-center justify-center shadow-lg border border-[#397234]/20">
              <div className="text-3xl relative">
                🤖
                <span className="absolute -top-1 -right-2 text-xl animate-wave">👋</span>
              </div>
            </div>
            <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Ecofy Bot</h3>
            <p className="text-green-100/60 leading-relaxed mb-8 font-bold text-sm">
              Need help? Our AI assistant is available 24/7 for instant scheduling, route queries, and waste categorization.
            </p>
            <button
              onClick={openChatbot}
              className="bg-[#D6E9CA] text-[#244c21] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform border border-[#397234]/20 shadow-xl"
            >
              Launch Assistant
            </button>
          </div>

          {/* Live Fleet */}
          <div className="bg-[#397234]/30 backdrop-blur-xl border border-white/5 p-12 rounded-[3rem] flex flex-col justify-between group">
            <div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Live Fleet</h3>
              <p className="text-green-100/60 leading-relaxed mb-10 font-bold text-sm">
                Real-time transparency. Watch your collection vehicle move across the map in real-time as it heads to your location.
              </p>
            </div>
            <div className="bg-black/40 h-24 rounded-[1.5rem] flex items-center px-8 relative overflow-hidden border border-white/10">
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
                <span className="text-[10px] font-black tracking-[0.3em] text-white/50 uppercase">GPS Feed Active</span>
              </div>
              {/* Moving Truck */}
              <span className="absolute left-0 text-5xl animate-truck">🚚</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CTA */}
      <section className="bg-[#D6E9CA] py-24 text-center px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-[#244c21] mb-6 tracking-tighter uppercase">Cleanliness starts here</h2>
          <p className="text-[#397234]/60 text-base mb-10 font-bold">
            Join the smart waste revolution in Sri Lanka today.
          </p>
          <button
            onClick={() => openBooking()}
            className="bg-[#244c21] text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-[#397234] transition-all transform hover:-translate-y-1"
          >
            Book Your First Collection
          </button>
        </div>
      </section>

      <Footer/>

      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onBookNow={openBooking}
        />
      )}
    </div>
  );
}