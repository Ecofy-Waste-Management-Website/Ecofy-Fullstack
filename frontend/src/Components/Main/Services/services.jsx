import React, { useEffect, useRef } from 'react';
import Navbar from '../Top-Header-Section/navbar/navbar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
  {
    id: 1,
    title: "Household Collection",
    subtitle: "RESIDENTIAL SOLUTIONS",
    desc: "We provide regular, reliable doorstep waste pickup tailored for modern residential living. Our smart scheduling ensures your neighborhood stays clean without the guesswork.",
    icon: "🏠",
    color: "bg-[#D6E9CA]",
    imgSide: "left"
  },
  {
    id: 2,
    title: "Commercial Waste",
    subtitle: "BUSINESS INFRASTRUCTURE",
    desc: "Tailored waste management for offices, restaurants, and retail. We handle the heavy lifting and compliance so you can focus on growing your business.",
    icon: "🏢",
    color: "bg-[#86efac]",
    imgSide: "right"
  },
  {
    id: 3,
    title: "Bulk Disposal",
    subtitle: "LARGE SCALE REMOVAL",
    desc: "From old furniture to construction debris, our bulk service handles items that don't fit in the bin. Fast, professional, and environmentally responsible.",
    icon: "🚛",
    color: "bg-[#4ade80]",
    imgSide: "left"
  },
  {
    id: 4,
    title: "Drain Cleaning",
    subtitle: "MAINTENANCE & CARE",
    desc: "Expert clearing and maintenance of drainage systems. We use advanced technology to prevent blockages and ensure smooth urban water flow.",
    icon: "💧",
    color: "bg-[#D6E9CA]",
    imgSide: "right"
  }
];

export default function Services() {
  const sectionRefs = useRef([]);

  useEffect(() => {
    sectionRefs.current.forEach((el) => {
      gsap.fromTo(el.querySelector('.content-box'), 
        { opacity: 0, x: el.dataset.side === 'left' ? 50 : -50 },
        { 
          opacity: 1, x: 0, duration: 1, 
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
    <div className="bg-[#1a2e1a] text-white min-h-screen font-sans selection:bg-[#86efac] selection:text-[#1a2e1a]">
      <Navbar />

      {/* ── HERO SECTION (Agency Style) ── */}
      <section className="pt-40 pb-24 px-6 text-center border-b border-white/5">
        <h4 className="text-[#86efac] font-bold tracking-[0.4em] uppercase text-xs mb-4">What we do</h4>
        <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">
          Outstanding & <br/>Dedicated Services
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 font-medium leading-relaxed">
          Ecofy is your smart partner in urban waste recovery, specializing in turning 
          logistical challenges into sustainable innovations.
        </p>
      </section>

      {/* ── STAGGERED SERVICES SECTIONS ── */}
      <div className="py-20">
        {servicesData.map((service, i) => (
          <section 
            key={service.id}
            ref={el => sectionRefs.current[i] = el}
            data-side={service.imgSide}
            className={`flex flex-col ${service.imgSide === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center max-w-7xl mx-auto py-24 px-8 gap-16`}
          >
            {/* Visual/Image Side */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className={`relative ${service.size || 'w-80 h-80'} rounded-[3rem] ${service.color} flex items-center justify-center shadow-2xl group overflow-hidden`}>
                <span className="text-9xl transition-transform duration-500 group-hover:scale-110">{service.icon}</span>
                {/* Decorative Shape (Similar to the orange dots in your image) */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#397234] rounded-full opacity-50" />
              </div>
            </div>

            {/* Text Side */}
            <div className="w-full md:w-1/2 content-box">
              <span className="text-[#86efac] font-black text-sm tracking-widest uppercase mb-2 block">{service.subtitle}</span>
              <h2 className="text-5xl font-black mb-6 tracking-tight italic">{service.title}</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 font-medium">
                {service.desc}
              </p>
              <button className="bg-[#86efac] text-[#1a2e1a] px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-white transition-colors">
                Learn More
              </button>
            </div>
          </section>
        ))}
      </div>

      {/* ── SUPPORT & TRACKING (Full Width Feature Cards) ── */}
      <section className="bg-[#142414] py-32 rounded-t-[5rem]">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            <div className="p-12 bg-[#1a2e1a] rounded-[3rem] border border-white/5 relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-xs font-black text-[#86efac] tracking-widest uppercase mb-4">Support</h3>
                 <h2 className="text-4xl font-black mb-6 italic">Digital Guidance</h2>
                 <p className="text-gray-400 font-medium mb-8">Our AI Chatbot simplifies waste management with instant recommendations and 24/7 service guidance.</p>
                 <button className="text-white font-black uppercase text-[10px] tracking-widest border-b-2 border-[#86efac] pb-1">Open Chatbot</button>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#86efac]/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
            </div>

            <div className="p-12 bg-[#1a2e1a] rounded-[3rem] border border-white/5 relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-xs font-black text-[#86efac] tracking-widest uppercase mb-4">Logistics</h3>
                 <h2 className="text-4xl font-black mb-6 italic">Live Tracking</h2>
                 <p className="text-gray-400 font-medium mb-8">Track your collection vehicle's live location and get precise arrival notifications via our GPS dashboard.</p>
                 <button className="text-white font-black uppercase text-[10px] tracking-widest border-b-2 border-[#86efac] pb-1">Track Driver</button>
              </div>
               {/* Decorative Circle */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#86efac]/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <footer className="py-32 text-center">
        <h2 className="text-5xl font-black mb-8 italic">Ready to join the ecosystem?</h2>
        <button className="bg-white text-[#1a2e1a] px-16 py-6 rounded-full font-black text-lg hover:bg-[#86efac] transition-all shadow-2xl">
          Get Started Now
        </button>
      </footer>
    </div>
  );
}