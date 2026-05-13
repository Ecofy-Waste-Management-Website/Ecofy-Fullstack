import React, { useEffect, useRef } from 'react';
import Navbar from '../Top-Header-Section/navbar/navbar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const mainServices = [
  { id: 1, title: "Household Collection", desc: "Regular doorstep waste pickup for residential areas.", icon: "🏠", color: "bg-[#D6E9CA]", size: "w-64 h-64", offset: 20 },
  { id: 2, title: "Commercial Waste", desc: "Tailored solutions for offices, restaurants, and retail.", icon: "🏢", color: "bg-[#86efac]", size: "w-72 h-72", offset: -30 },
  { id: 3, title: "Bulk Disposal", desc: "Large item removal, furniture, and construction debris.", icon: "🚛", color: "bg-[#4ade80]", size: "w-64 h-64", offset: 40 },
  { id: 4, title: "Drain Cleaning", desc: "Professional clearing and maintenance of drainage systems.", icon: "💧", color: "bg-[#D6E9CA]", size: "w-60 h-60", offset: -25 },
];

/* ── ANIMATED COMPONENTS ── */

const WavingBot = () => (
  <div className="relative w-24 h-24 mb-4">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="25" y="30" width="50" height="40" rx="10" fill="#244c21" />
      <circle cx="40" cy="45" r="4" fill="#86efac" />
      <circle cx="60" cy="45" r="4" fill="#86efac" />
      <g className="animate-wave origin-[75%_40%]">
        <line x1="75" y1="50" x2="90" y2="30" stroke="#244c21" strokeWidth="6" strokeLinecap="round" />
      </g>
    </svg>
  </div>
);

const TrackingMap = () => (
  <div className="relative w-full h-32 bg-[#244c21]/5 rounded-2xl overflow-hidden border border-[#244c21]/10 mb-4">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(#244c21 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
    <div className="absolute top-1/2 left-0 -translate-y-1/2 animate-truckMove text-2xl">🚚</div>
  </div>
);

export default function Services() {
  const containerRef = useRef(null);
  const circleRefs = useRef([]);

  useEffect(() => {
    // Floating idle animation
    circleRefs.current.forEach((circle, i) => {
      if (!circle) return;
      gsap.to(circle, {
        y: i % 2 === 0 ? -15 : 15,
        duration: 3 + i,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    // Parallax
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth) - 0.5;
      const yPos = (clientY / window.innerHeight) - 0.5;
      circleRefs.current.forEach((circle, i) => {
        if (!circle) return;
        gsap.to(circle, { x: xPos * 40, y: yPos * 40, duration: 0.6 });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-[#244c21] text-[#244c21]">
      <Navbar />

      <style>{`
        @keyframes wave { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-30deg); } }
        @keyframes truckMove { 0% { left: -10%; } 100% { left: 110%; } }
        .animate-wave { animation: wave 1.5s ease-in-out infinite; }
        .animate-truckMove { animation: truckMove 6s linear infinite; }
      `}</style>

      {/* ── HERO SECTION (Exact About.jsx Format) ── */}
      <div className="bg-[#397234] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-4 tracking-tighter">Our Services</h1>
          <p className="text-xl text-green-100 font-bold opacity-80">
            A branching ecosystem of smart waste solutions designed for urban life.
          </p>
        </div>
      </div>

      {/* ── SERVICES BUBBLES ── */}
      <section className="bg-[#D6E9CA] py-32 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-[#244c21] mb-2 text-center tracking-tight">Collection Ecosystem</h2>
          <p className="text-sm text-[#397234]/60 text-center mb-20 font-bold uppercase tracking-widest">Digitalized Waste Recovery</p>
          
          <div ref={containerRef} className="flex flex-wrap justify-center items-center gap-16 md:gap-24">
            {mainServices.map((s, i) => (
              <div 
                key={s.id} 
                ref={el => circleRefs.current[i] = el}
                className={`flex flex-col items-center justify-center text-center rounded-full shadow-xl bg-white/40 backdrop-blur-sm border border-white/20 ${s.size} p-10 hover:bg-white/60 transition-all duration-500`}
              >
                <span className="text-4xl mb-4">{s.icon}</span>
                <h3 className="text-lg font-black text-[#244c21] mb-2">{s.title}</h3>
                <p className="text-[11px] leading-relaxed text-[#244c21]/70 font-bold max-w-[140px] uppercase tracking-tighter">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUPPORT & TRACKING (Spaced Cards) ── */}
      <section className="bg-[#397234] py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* AI Support */}
            <div className="bg-[#D6E9CA] p-12 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center">
              <WavingBot />
              <h3 className="text-2xl font-black text-[#244c21] mb-4 uppercase">AI Support Guidance</h3>
              <p className="text-sm leading-relaxed text-[#244c21]/80 font-bold mb-6">
                Meet EcoBot. Our integrated AI assistant helps with pickup scheduling, recycling tips, and instant complaint resolution.
              </p>
              <div className="w-full h-px bg-[#244c21]/10 mb-6" />
              <span className="text-[10px] tracking-widest font-black text-[#397234] uppercase">Available 24/7 in App</span>
            </div>

            {/* Live Tracking */}
            <div className="bg-[#D6E9CA] p-12 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center">
              <TrackingMap />
              <h3 className="text-2xl font-black text-[#244c21] mb-4 uppercase">Live Status Tracking</h3>
              <p className="text-sm leading-relaxed text-[#244c21]/80 font-bold mb-6">
                Total transparency. Watch your collection vehicle move in real-time and get precise notifications when they are near.
              </p>
              <div className="w-full h-px bg-[#244c21]/10 mb-6" />
              <span className="text-[10px] tracking-widest font-black text-[#397234] uppercase">GPS-Enabled Infrastructure</span>
            </div>

          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ── */}
      <section className="bg-[#D6E9CA] py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { val: "98%", lab: "Pickup Accuracy" },
            { val: "15min", lab: "Avg. Bot Response" },
            { val: "Live", lab: "Truck Monitoring" }
          ].map((stat, i) => (
            <div key={i} className="p-8">
              <h4 className="text-4xl font-black text-[#244c21] mb-2 tracking-tighter">{stat.val}</h4>
              <p className="text-[10px] font-black text-[#397234]/60 uppercase tracking-widest">{stat.lab}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="bg-[#244c21] py-20 text-center">
        <button className="bg-[#D6E9CA] text-[#244c21] px-12 py-5 rounded-full font-black hover:scale-105 transition-all shadow-xl uppercase tracking-widest text-sm">
          Join the Ecosystem
        </button>
      </div>
    </div>
  );
}