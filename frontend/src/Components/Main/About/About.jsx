import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../Top-Header-Section/navbar/navbar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const milestones = [
  {
    icon: '🔍', phase: 'Phase 1 · Oct 2025', title: 'The Problem',
    desc: 'Identified broken waste collection across Western & Southern provinces — manual bookings, missed pickups, zero accountability.',
    side: 'right',
  },
  {
    icon: '💡', phase: 'Phase 2 · Planning', title: 'The Idea',
    desc: 'Proposed Ecofy — a unified digital platform for customers, staff, and admins. Feasibility confirmed; team of 6 formed.',
    side: 'left',
  },
  {
    icon: '🎨', phase: 'Phase 3 · Design', title: 'Designing the System',
    desc: 'ER diagrams, use cases, DFDs and module architecture defined. MERN stack chosen. Agile sprints kick off.',
    side: 'right',
  },
  {
    icon: '⚙️', phase: 'Phase 4 · Build', title: 'Building Ecofy',
    desc: '9 modules built in parallel — booking, tracking, payments, AI chatbot, SLA analytics, notifications and more.',
    side: 'left',
  },
  {
    icon: '🧪', phase: 'Phase 5 · Testing', title: 'Testing & Refinement',
    desc: 'End-to-end testing across all user roles. Performance optimization, security audits, and UI polish applied.',
    side: 'right',
  },
  {
    icon: '🚀', phase: 'Phase 6 · Launch', title: 'Launching & Beyond',
    desc: 'Deployed on Vercel. MVP live for Western & Southern provinces — with plans to expand nationwide.',
    side: 'left',
  },
];

const treeLabels = [
  { label: '🌱 The Seed',   desc: "A real problem in Sri Lanka's cities",          cls: 'bottom-[2%] left-1/2 -translate-x-1/2' },
  { label: '🌿 The Roots',  desc: 'Research, feasibility & team formation',         cls: 'bottom-[14%] left-[2%]' },
  { label: '🪵 The Trunk',  desc: 'MERN stack architecture & core system design',   cls: 'bottom-[38%] left-[2%]' },
  { label: '📦 Branch 1',   desc: 'Booking & tracking modules built',               cls: 'top-[38%] right-[2%]' },
  { label: '💳 Branch 2',   desc: 'Payments & notifications integrated',            cls: 'top-[24%] left-[2%]' },
  { label: '🤖 Branch 3',   desc: 'AI chatbot & SLA analytics deployed',            cls: 'top-[12%] right-[2%]' },
  { label: '🌳 The Crown',  desc: 'Ecofy — live, scalable & growing',               cls: 'top-[2%] left-1/2 -translate-x-1/2' },
];

/* ─────────────────────────────────────────
   HOOK — fade-in on scroll
───────────────────────────────────────── */
function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
function MilestoneCard({ item, index }) {
  const ref = useRef(null);
  const isRight = item.side === 'right';

  useEffect(() => {
    const el = ref.current;
    
    // Animate the container
    gsap.fromTo(el, 
      { opacity: 0, y: 30, scale: 0.95 },
      { 
        opacity: 1, y: 0, scale: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <div
      ref={ref}
      className={`flex items-start gap-4 
        ${isRight ? 'flex-row' : 'flex-row-reverse text-right'}`}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[#397234]
          bg-[#D6E9CA] flex items-center justify-center text-xl z-10
          hover:scale-110 transition-all duration-300 shadow-md">
        {item.icon}
      </div>
      <div className="max-w-[280px] bg-[#D6E9CA] p-5 rounded-2xl border border-[#397234]/10 shadow-xl">
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#397234] font-black mb-1">{item.phase}</p>
        <h4 className="text-base font-black text-[#244c21] mb-1">{item.title}</h4>
        <p className="text-sm leading-relaxed text-[#244c21]/80 font-bold">{item.desc}</p>
      </div>
    </div>
  );
}

function TreeLabel({ label, desc, cls }) {
  return (
    <div className={`absolute ${cls} bg-[#D6E9CA]/90 border border-[#397234]/20
        shadow-xl px-3 py-2 max-w-[160px] rounded-lg animate-fadeLabel backdrop-blur-md`}>
      <h4 className="text-[0.75rem] font-black text-[#244c21] mb-1">{label}</h4>
      <p className="text-[0.68rem] leading-relaxed text-[#244c21]/70 font-bold">{desc}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function About() {
  const [vmRef, vmVis]         = useFadeIn();
  const [journeyRef, journeyVis] = useFadeIn();
  const [treeRef, treeVis]     = useFadeIn();
  const journeyContainerRef = useRef(null);

  useEffect(() => {
    const cards = journeyContainerRef.current.querySelectorAll('.desktop-journey-card');
    cards.forEach((card, i) => {
      gsap.fromTo(card, 
        { 
          opacity: 0, 
          x: card.classList.contains('left-side') ? 50 : -50,
          scale: 0.8 
        },
        { 
          opacity: 1, x: 0, scale: 1,
          duration: 1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, []);

  return (
    <div className="bg-[#244c21] text-[#244c21]">

      {/* ── KEYFRAMES ── */}
      <style>{`
        @keyframes dashMove {
          to { stroke-dashoffset: -28; }
        }
        @keyframes trunkGrow {
          to { stroke-dashoffset: 0; }
        }
        @keyframes leafBloom {
          from { opacity:0; transform-origin:center; transform:scale(0); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes seedPulse {
          0%,100% { r:8; }
          50%      { r:12; }
        }
        @keyframes fadeLabel {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .animate-fadeLabel { animation: fadeLabel .6s ease-out forwards; }

        .trunk-path {
          stroke-dasharray: 700;
          stroke-dashoffset: 700;
          animation: trunkGrow 2.5s 0.5s ease-out forwards;
        }
        .branch-path {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
        }
        .b1 { animation: trunkGrow 1.2s 2.5s ease-out forwards; }
        .b2 { animation: trunkGrow 1.2s 2.8s ease-out forwards; }
        .b3 { animation: trunkGrow 1.2s 3.1s ease-out forwards; }
        .b4 { animation: trunkGrow 1.2s 3.4s ease-out forwards; }
        .b5 { animation: trunkGrow 1.2s 3.7s ease-out forwards; }
        .b6 { animation: trunkGrow 1.2s 4.0s ease-out forwards; }

        .lc1 { opacity:0; animation: leafBloom .8s 3.0s ease-out forwards; }
        .lc2 { opacity:0; animation: leafBloom .8s 3.3s ease-out forwards; }
        .lc3 { opacity:0; animation: leafBloom .8s 3.6s ease-out forwards; }
        .lc4 { opacity:0; animation: leafBloom .8s 3.9s ease-out forwards; }
        .lc5 { opacity:0; animation: leafBloom .8s 4.2s ease-out forwards; }
        .lc6 { opacity:0; animation: leafBloom .8s 4.5s ease-out forwards; }
        .lc7 { opacity:0; animation: leafBloom .8s 4.8s ease-out forwards; }

        .root-path {
          stroke-dasharray: 150;
          stroke-dashoffset: 150;
          animation: trunkGrow 1s 0.2s ease-out forwards;
        }
        .seed-circle {
          animation: seedPulse 2s ease-in-out infinite;
        }
        .path-dash {
          stroke-dasharray: 8 6;
          animation: dashMove 3s linear infinite;
        }
      `}</style>

      <Navbar />

      {/* ══════════════════════════════
          HERO — matches Home hero style
      ══════════════════════════════ */}
      <div className="bg-[#397234] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-4 tracking-tighter">About Ecofy</h1>
          <p className="text-xl text-green-100 font-bold opacity-80">
            Sri Lanka's first fully integrated smart waste collection platform.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════
          VISION & MISSION
      ══════════════════════════════ */}
      <section className="bg-[#D6E9CA] py-20 px-4">
        <div ref={vmRef} className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-[#244c21] mb-2 text-center tracking-tight">Vision &amp; Mission</h2>
          <p className="text-sm text-[#397234]/60 text-center mb-12 font-bold uppercase tracking-widest">What drives us</p>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-700
              ${vmVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            {/* Vision */}
            <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 border border-white/20">
              <span className="text-4xl mb-6 block">🌿</span>
              <h3 className="text-2xl font-black text-[#244c21] mb-4">Our Vision</h3>
              <p className="text-base leading-relaxed text-[#244c21]/80 mb-4 font-medium">
                To become Sri Lanka's leading digital waste management platform — a future where
                every pickup is on time, every complaint is heard, and every community lives
                cleaner through the power of smart technology.
              </p>
              <p className="text-base leading-relaxed text-[#244c21]/80 font-medium">
                We envision a country where waste collection is no longer an afterthought,
                but a transparent, data-driven public service that communities can depend on.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 border border-white/20">
              <span className="text-4xl mb-6 block">🎯</span>
              <h3 className="text-2xl font-black text-[#244c21] mb-4">Our Mission</h3>
              <p className="text-base leading-relaxed text-[#244c21]/80 mb-4 font-medium">
                To design and deliver a smart, web-based waste management system that
                digitalizes private waste collection — ensuring timely pickups, transparent
                operations, and seamless communication between customers, staff, and administrators.
              </p>
              <p className="text-base leading-relaxed text-[#244c21]/80 font-medium">
                We achieve this through real-time tracking, AI-powered support, SLA-driven
                analytics, and a platform that scales with Sri Lanka's growing urban needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          WINDING PATH TIMELINE
      ══════════════════════════════ */}
      <section ref={journeyContainerRef} className="bg-[#397234] py-24 px-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-4xl font-black text-white mb-2 text-center tracking-tight">Our Journey</h2>
          <p className="text-sm text-green-100/60 text-center mb-16 font-bold uppercase tracking-widest">
            From identifying a real urban problem in Sri Lanka to building a future-ready platform
          </p>

          {/* Desktop: SVG path + floating cards */}
          <div className="relative max-w-3xl mx-auto hidden md:block">
            <svg viewBox="0 0 800 1100" className="w-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
              {/* road bg */}
              <path fill="none" stroke="#dcfce7" strokeWidth="44" strokeLinecap="round"
                d="M400 50 C650 50,700 200,400 220 C100 240,80 400,400 420 C700 440,720 580,400 610 C80 640,80 790,400 810 C700 830,700 970,400 1000 C260 1020,180 1060,140 1080" />
              {/* dashed line */}
              <path fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"
                className="path-dash"
                d="M400 50 C650 50,700 200,400 220 C100 240,80 400,400 420 C700 440,720 580,400 610 C80 640,80 790,400 810 C700 830,700 970,400 1000 C260 1020,180 1060,140 1080" />
              {/* dots */}
              {[50, 220, 420, 610, 810, 1000].map((y, i) => (
                <circle key={i} cx="400" cy={y} r="7"
                  fill={i === 5 ? '#ca8a04' : '#16a34a'} opacity=".9" />
              ))}
            </svg>

            {/* milestone cards */}
            <div className="absolute inset-0">
              {milestones.map((m, i) => {
                const tops = ['2%', '17%', '34%', '51%', '68%', '84%'];
                return (
                  <div key={i}
                    style={{ top: tops[i] }}
                    className={`absolute flex items-start gap-4 desktop-journey-card
                      ${m.side === 'right' ? 'left-[55%] flex-row left-side' : 'right-[55%] flex-row-reverse text-right right-side'}`}>
                    <div className="flex-shrink-0 w-11 h-11 rounded-full border-2 border-[#D6E9CA]
                        bg-[#D6E9CA] flex items-center justify-center text-lg z-10
                        hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(214,233,202,0.3)]">
                      {m.icon}
                    </div>
                    <div className="max-w-[240px] bg-[#D6E9CA] rounded-2xl shadow-2xl p-6 border border-[#397234]/10">
                      <p className="text-[0.62rem] tracking-[0.18em] uppercase text-[#397234] font-black mb-1">{m.phase}</p>
                      <h4 className="text-sm font-black text-[#244c21] mb-1">{m.title}</h4>
                      <p className="text-xs leading-relaxed text-[#244c21]/60 font-bold">{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: stacked */}
          <div className="md:hidden flex flex-col gap-6">
            {milestones.map((m, i) => (
              <MilestoneCard key={i} item={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          SEED TO TREE
      ══════════════════════════════ */}
      <section ref={treeRef} className="bg-[#D6E9CA] py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-[#244c21] mb-2 text-center tracking-tight">How Ecofy Grew</h2>
          <p className="text-sm text-[#397234]/60 text-center mb-16 font-bold uppercase tracking-widest max-w-2xl mx-auto">
            Watch how Ecofy grew from a single problem into a branching ecosystem of solutions.
          </p>

          <div className={`relative max-w-2xl mx-auto transition-all duration-1000
              ${treeVis ? 'opacity-100' : 'opacity-0'}`}>

          {/* tree SVG — unchanged */}
          <svg viewBox="0 0 800 700" className="w-full" xmlns="http://www.w3.org/2000/svg">
            {/* roots */}
            {[
              "M400 660 Q340 680 300 700",
              "M400 660 Q380 685 360 700",
              "M400 660 Q420 685 440 700",
              "M400 660 Q460 680 500 700",
            ].map((d, i) => (
              <path key={i} className="root-path" d={d}
                fill="none" stroke="#86efac" strokeWidth="4" strokeLinecap="round" />
            ))}

            {/* trunk */}
            <path className="trunk-path" fill="none" stroke="#16a34a" strokeWidth="10" strokeLinecap="round"
              d="M400 660 C400 580 400 500 400 420 C400 360 400 280 400 200 C400 180 400 160 400 140" />

            {/* branches */}
            <path className="branch-path b1" fill="none" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" d="M400 440 C370 420 330 410 280 400" />
            <path className="branch-path b2" fill="none" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" d="M400 370 C430 350 470 340 525 328" />
            <path className="branch-path b3" fill="none" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" d="M400 300 C365 280 320 268 268 252" />
            <path className="branch-path b4" fill="none" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" d="M400 245 C435 225 478 212 526 198" />
            <path className="branch-path b5" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" d="M400 195 C368 172 332 156 292 138" />
            <path className="branch-path b6" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" d="M400 175 C432 154 468 138 508 122" />

            {/* leaf clusters */}
            <g className="lc1"><circle cx="264" cy="396" r="22" fill="#bbf7d0" /><circle cx="280" cy="382" r="18" fill="#86efac" /><circle cx="252" cy="380" r="15" fill="#4ade80" /></g>
            <g className="lc2"><circle cx="540" cy="322" r="22" fill="#bbf7d0" /><circle cx="525" cy="310" r="18" fill="#86efac" /><circle cx="552" cy="308" r="15" fill="#4ade80" /></g>
            <g className="lc3"><circle cx="252" cy="246" r="24" fill="#bbf7d0" /><circle cx="270" cy="232" r="20" fill="#86efac" /><circle cx="244" cy="230" r="16" fill="#4ade80" /></g>
            <g className="lc4"><circle cx="540" cy="192" r="24" fill="#bbf7d0" /><circle cx="526" cy="179" r="20" fill="#86efac" /><circle cx="554" cy="178" r="16" fill="#4ade80" /></g>
            <g className="lc5"><circle cx="276" cy="130" r="26" fill="#bbf7d0" /><circle cx="294" cy="116" r="22" fill="#86efac" /><circle cx="266" cy="113" r="18" fill="#4ade80" /></g>
            <g className="lc6"><circle cx="522" cy="116" r="26" fill="#bbf7d0" /><circle cx="508" cy="102" r="22" fill="#86efac" /><circle cx="536" cy="100" r="18" fill="#4ade80" /></g>
            {/* crown */}
            <g className="lc7">
              <circle cx="400" cy="100" r="38" fill="#86efac" />
              <circle cx="378" cy="80"  r="28" fill="#4ade80" />
              <circle cx="422" cy="78"  r="28" fill="#4ade80" />
              <circle cx="400" cy="66"  r="24" fill="#22c55e" />
            </g>

            {/* seed */}
            <circle className="seed-circle" cx="400" cy="670" r="8" fill="#ca8a04" />
            <circle cx="400" cy="670" r="14" fill="none" stroke="#ca8a04" strokeWidth="1.5" opacity=".4" />
          </svg>

          {/* floating label cards */}
          <div className="absolute inset-0 pointer-events-none">
            {treeLabels.map((t, i) => (
              <TreeLabel key={i} {...t} />
            ))}
          </div>
        </div>
        </div>
      </section>

    </div>
  );
}