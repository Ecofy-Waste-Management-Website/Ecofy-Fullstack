import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../Top-Header-Section/navbar/navbar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    image: 'https://illustrations.popsy.co/green/home-maintenance.svg',
    gradient: 'from-[#397234] to-[#244c21]'
  },
  {
    id: 2,
    name: 'Commercial Waste',
    icon: '🏢',
    description: 'For businesses and offices. Customizable schedules for your specific needs.',
    features: ['Custom schedule', 'Priority support'],
    image: 'https://illustrations.popsy.co/green/digital-marketing.svg',
    gradient: 'from-[#1e3a5f] to-[#244c21]'
  },
  {
    id: 3,
    name: 'Bulk Collection',
    icon: '📦',
    description: 'Large items or high-volume waste like furniture and construction debris.',
    features: ['Heavy items', 'Same-day available'],
    image: 'https://illustrations.popsy.co/green/moving-house.svg',
    gradient: 'from-[#8B4513] to-[#244c21]'
  },
  {
    id: 4,
    name: 'Drain Cleaning',
    icon: '🚰',
    description: 'Professional drain cleaning and unblocking services for all properties.',
    features: ['24/7 emergency', 'Hydro jetting'],
    image: 'https://illustrations.popsy.co/green/repairman.svg',
    gradient: 'from-[#4a154b] to-[#244c21]'
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

function ServiceCard({ service, index }) {
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
           <img src={service.image} alt={service.name} className="w-full h-full object-contain p-6 transform group-hover:scale-110 transition-transform duration-700" />
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
          <button className="w-full py-4 bg-[#D6E9CA] text-[#244c21] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-[#397234]/20 hover:bg-[#244c21] hover:text-white transition-all duration-300">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
    MAIN COMPONENT
───────────────────────────────────────── */
export default function Services() {
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
            Our <span className="text-[#D6E9CA]">Services</span>
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
                <ServiceCard service={s} index={i} />
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
            <button className="bg-[#D6E9CA] text-[#244c21] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform border border-[#397234]/20 shadow-xl">
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
          <button className="bg-[#244c21] text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-[#397234] transition-all transform hover:-translate-y-1">
            Book Your First Collection
          </button>
        </div>
      </section>
    </div>
  );
}