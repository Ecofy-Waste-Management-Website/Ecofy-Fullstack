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
    description: 'Regular waste pickup for residential properties. Perfect for daily household waste management.',
    features: ['Weekly pickup', 'Standard bins', 'Morning/Evening slots'],
    image: 'https://illustrations.popsy.co/green/home-maintenance.svg',
    gradient: 'from-[#244c21] to-[#397234]'
  },
  {
    id: 2,
    name: 'Commercial Waste Collection',
    icon: '🏢',
    description: 'For businesses, offices, and commercial establishments. Customizable schedules for your needs.',
    features: ['Custom schedule', 'Large bins', 'Priority support', 'Monthly billing'],
    image: 'https://illustrations.popsy.co/green/digital-marketing.svg',
    gradient: 'from-[#1e3a5f] to-[#2e5a8a]'
  },
  {
    id: 3,
    name: 'Bulk Waste Collection',
    icon: '📦',
    description: 'Large items or high-volume waste like furniture, construction debris, and electronics.',
    features: ['Heavy items', 'Construction debris', 'Furniture removal', 'Same-day available'],
    image: 'https://illustrations.popsy.co/green/moving-house.svg',
    gradient: 'from-[#8B4513] to-[#A0522D]'
  },
  {
    id: 4,
    name: 'Drain Cleaning Service',
    icon: '🚰',
    description: 'Professional drain cleaning and unblocking services for residential and commercial properties.',
    features: ['24/7 emergency', 'Camera inspection', 'Hydro jetting', 'Preventive maintenance'],
    image: 'https://illustrations.popsy.co/green/repairman.svg',
    gradient: 'from-[#4a154b] to-[#6b2d5c]'
  }
];

// Counter Component for stats
function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            let start = 0;
            const end = target;
            const duration = 2000; // 2 seconds
            const increment = end / (duration / 16); // 60fps
            
            const timer = setInterval(() => {
              start += increment;
              if (start >= end) {
                setCount(end);
                clearInterval(timer);
              } else {
                setCount(Math.floor(start));
              }
            }, 16);
            
            return () => clearInterval(timer);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [target, hasAnimated]);
  
  return (
    <span ref={counterRef}>
      {prefix}{count}{suffix}
    </span>
  );
}

export default function Services() {
  const serviceRefs = useRef([]);
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Hero animations (KEPT ORIGINAL)
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

    // 2. Slide-in Text Animation for Services (INJECTED FROM FIRST CODE)
    serviceRefs.current.forEach((el, idx) => {
      if (!el) return;
      const isEven = idx % 2 === 0;
      const content = el.querySelector('.content-side');
      const visual = el.querySelector('.visual-side');

      // Text slides in from the opposite side of the image
      gsap.fromTo(content, 
        { opacity: 0, x: isEven ? 100 : -100 },
        { 
          opacity: 1, x: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Image pops in
      gsap.fromTo(visual, 
        { opacity: 0, scale: 0.9 },
        { 
          opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#D6E9CA] to-white min-h-screen overflow-x-hidden">
      {/* Custom animations (KEPT ORIGINAL) */}
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
        @keyframes wave { 
          0%, 100% { transform: rotate(0deg); } 
          50% { transform: rotate(-30deg); } 
        }
        @keyframes truckMoveL { 
          0% { left: 110%; } 
          100% { left: -15%; } 
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
        .animate-wave-bot { animation: wave 1.5s ease-in-out infinite; }
        .animate-truck-left { animation: truckMoveL 8s linear infinite; }
        
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

      {/* Hero Section with animated background (KEPT ORIGINAL) */}
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
          
          <h1 className="hero-title text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter glow-text">
            Waste Collection
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
              Made Simple
            </span>
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-green-100 mb-12 max-w-3xl mx-auto font-medium">
            Book, track, and manage your waste collection with Sri Lanka's most trusted platform
          </p>

          {/* Stats with Animated Counters (KEPT ORIGINAL) */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: '🗑️', label: 'Waste Collected', target: 1250, suffix: ' tons' },
              { icon: '✅', label: 'Happy Customers', target: 5000, suffix: '+' },
              { icon: '🚛', label: 'Pickups Completed', target: 15000, suffix: '+' },
              { icon: '⭐', label: 'Customer Rating', target: 4, prefix: '4.', suffix: '/5' }
            ].map((stat, idx) => (
              <div key={idx} className="hero-stats bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-black text-white">
                  {stat.prefix}
                  <AnimatedCounter 
                    target={stat.target} 
                    suffix={stat.suffix || ''}
                    prefix={stat.prefix || ''}
                  />
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

      {/* Sliding Zig-Zag Services Section (INJECTED FROM FIRST CODE) */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-[#244c21] mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select from our range of professional waste collection services tailored to your needs
          </p>
        </div>

        {services.map((service, idx) => (
          <div 
            key={service.id}
            ref={el => serviceRefs.current[idx] = el}
            className={`flex flex-col md:flex-row items-center gap-12 mb-40 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
          >
            {/* Visual Side */}
            <div className="w-full md:w-1/2 visual-side">
              <div className={`relative p-12 rounded-[3.5rem] bg-gradient-to-br ${service.gradient} group shadow-2xl`}>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity rounded-[3.5rem]"></div>
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="relative z-10 w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Content Side (Sliding Text) */}
            <div className="w-full md:w-1/2 space-y-6 px-4 content-side">
              <div className="text-6xl mb-4">{service.icon}</div>
              <h2 className="text-4xl md:text-5xl font-black text-[#244c21] leading-tight">
                {service.name}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                {service.description}
              </p>
              
              <div className="flex flex-wrap gap-3 py-4">
                {service.features.map((feature, i) => (
                  <span key={i} className="bg-white text-[#244c21] px-5 py-2 rounded-full text-sm font-bold shadow-sm border border-[#244c21]/10">
                    ✓ {feature}
                  </span>
                ))}
              </div>

              <button className={`bg-gradient-to-r ${service.gradient} text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95`}>
                Book Service Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Section: AI Chatbot & Live Fleet Tracking (REPLACES HOW TO REQUEST SECTION) */}
      <div className="max-w-7xl mx-auto px-4 pb-32 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Container 1: AI Chatbot (Waving Robot) */}
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border-2 border-[#244c21]/5 flex flex-col items-center text-center group">
            <div className="animate-wave-bot mb-6">
              <svg viewBox="0 0 100 100" className="w-20 h-20">
                <rect x="25" y="30" width="50" height="40" rx="10" fill="#244c21" />
                <circle cx="40" cy="45" r="4" fill="#86efac" />
                <circle cx="60" cy="45" r="4" fill="#86efac" />
                <g className="origin-[75%_40%]">
                  <line x1="75" y1="50" x2="90" y2="30" stroke="#244c21" strokeWidth="6" strokeLinecap="round" />
                </g>
              </svg>
            </div>
            <h3 className="text-2xl font-black text-[#244c21] mb-3 uppercase tracking-tighter">AI Assistant</h3>
            <p className="text-gray-600 font-medium">
              Need help with scheduling? Our EcofyBot is available 24/7 to answer your queries instantly.
            </p>
            <button className="mt-6 px-8 py-3 bg-[#244c21] text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#397234] transition-colors">
              Chat Now
            </button>
          </div>

          {/* Container 2: Driver Tracking (Moving Left Truck) */}
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border-2 border-[#244c21]/5 flex flex-col justify-between overflow-hidden">
            <div>
              <h3 className="text-2xl font-black text-[#244c21] mb-3 uppercase tracking-tighter">Live Fleet Tracking</h3>
              <p className="text-gray-600 font-medium mb-8">
                Watch our collection vehicles in real-time. Transparent waste management at your fingertips.
              </p>
            </div>
            
            <div className="relative h-20 bg-[#244c21]/5 rounded-3xl border border-dashed border-[#244c21]/20 flex items-center overflow-hidden">
                <div className="animate-truck-left text-5xl absolute">
                   <span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>🚚</span>
                </div>
                <div className="absolute right-6 text-[10px] font-black text-[#244c21] uppercase tracking-[0.2em] opacity-30">
                  Live GPS Active
                </div>
            </div>
          </div>

        </div>
      </div>

      
    </div>
  );
}