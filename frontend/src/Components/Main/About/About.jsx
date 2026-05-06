import React, { useEffect, useRef, useState } from 'react';

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
  { label: '🌱 The Seed',    desc: 'A real problem in Sri Lanka\'s cities',         cls: 'bottom-[2%] left-1/2 -translate-x-1/2' },
  { label: '🌿 The Roots',   desc: 'Research, feasibility & team formation',         cls: 'bottom-[14%] left-[2%]' },
  { label: '🪵 The Trunk',   desc: 'MERN stack architecture & core system design',   cls: 'bottom-[38%] left-[2%]' },
  { label: '📦 Branch 1',    desc: 'Booking & tracking modules built',               cls: 'top-[38%] right-[2%]' },
  { label: '💳 Branch 2',    desc: 'Payments & notifications integrated',            cls: 'top-[24%] left-[2%]' },
  { label: '🤖 Branch 3',    desc: 'AI chatbot & SLA analytics deployed',            cls: 'top-[12%] right-[2%]' },
  { label: '🌳 The Crown',   desc: 'Ecofy — live, scalable & growing',              cls: 'top-[2%] left-1/2 -translate-x-1/2' },
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
function SectionTag({ children }) {
  return (
    <span className="block text-[0.68rem] tracking-[0.24em] uppercase text-emerald-400 mb-3">
      {children}
    </span>
  );
}

function MilestoneCard({ item, index }) {
  const [ref, vis] = useFadeIn();
  const isRight = item.side === 'right';
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 100}ms` }}
      className={`flex items-start gap-5 transition-all duration-700
        ${isRight ? 'flex-row' : 'flex-row-reverse text-right'}
        ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {/* node */}
      <div className="relative flex-shrink-0 w-14 h-14 rounded-full border-2 border-emerald-500
          bg-[#0a1a10] flex items-center justify-center text-2xl z-10
          hover:scale-110 hover:shadow-[0_0_24px_#52b78866] transition-all duration-300 cursor-default">
        {item.icon}
        <span className="absolute inset-[-6px] rounded-full border border-emerald-500 opacity-0
          group-hover:opacity-50 transition-opacity" />
      </div>
      {/* content */}
      <div className="max-w-[280px]">
        <p className="text-[0.68rem] tracking-[0.2em] uppercase text-emerald-400 mb-1">{item.phase}</p>
        <h4 className="font-['Cormorant_Garamond'] text-xl font-semibold text-white mb-1">{item.title}</h4>
        <p className="text-sm leading-relaxed text-emerald-200/60">{item.desc}</p>
      </div>
    </div>
  );
}

function TreeLabel({ label, desc, cls }) {
  return (
    <div className={`absolute ${cls} bg-[#0a1a10ee] border border-emerald-500/20
        backdrop-blur-sm px-3 py-2 max-w-[160px] animate-fadeLabel`}>
      <h4 className="text-[0.78rem] font-medium text-emerald-400 mb-1">{label}</h4>
      <p className="text-[0.7rem] leading-relaxed text-emerald-200/60">{desc}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function About() {
  const [heroVis, setHeroVis] = useState(false);
  const [vmRef, vmVis] = useFadeIn();
  const [journeyRef, journeyVis] = useFadeIn();
  const [treeRef, treeVis] = useFadeIn();

  useEffect(() => {
    const t = setTimeout(() => setHeroVis(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-[#0a1a10] text-emerald-100 font-['Outfit'] overflow-x-hidden">

      {/* ── GOOGLE FONTS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Outfit:wght@300;400;500&display=swap');

        @keyframes breathe {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50%      { transform: translate(-50%,-50%) scale(1.04); }
        }
        @keyframes scrollPulse {
          0%,100% { opacity:.3; height:60px; }
          50%      { opacity:1;  height:80px; }
        }
        @keyframes dashMove {
          to { stroke-dashoffset: -28; }
        }
        @keyframes trunkGrow {
          to { stroke-dashoffset: 0; }
        }
        @keyframes leafBloom {
          from { opacity:0; transform-origin: center; transform: scale(0); }
          to   { opacity:1; transform: scale(1); }
        }
        @keyframes seedPulse {
          0%,100% { r:8; }
          50%      { r:12; }
        }
        @keyframes fadeLabel {
          from { opacity:0; transform: translateY(8px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes riseIn {
          from { opacity:0; transform: translateY(30px); }
          to   { opacity:1; transform: translateY(0); }
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

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center
          text-center px-6 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, #1a3a2888, transparent), #0a1a10' }}>

        {/* watermark */}
        <span className="absolute top-1/2 left-1/2 font-['Cormorant_Garamond'] font-semibold
            text-[clamp(8rem,22vw,22rem)] text-emerald-500/[0.04] whitespace-nowrap pointer-events-none select-none"
          style={{ animation: 'breathe 8s ease-in-out infinite', transform: 'translate(-50%,-50%)' }}>
          ECOFY
        </span>

        <p style={{ animation: 'riseIn .9s .3s both' }}
          className="text-[0.72rem] tracking-[0.28em] uppercase text-emerald-400 mb-6">
          About Us
        </p>
        <h1 style={{ animation: 'riseIn .9s .5s both' }}
          className="font-['Cormorant_Garamond'] font-semibold leading-none text-white
            text-[clamp(3rem,8vw,7rem)]">
          Making waste<br />
          <em className="italic text-emerald-400">management</em><br />
          smarter.
        </h1>
        <p style={{ animation: 'riseIn .9s .7s both' }}
          className="mt-8 max-w-xl text-[1.05rem] leading-[1.85] text-emerald-200/60">
          Ecofy is Sri Lanka's first fully integrated smart waste collection platform —
          connecting communities, collectors, and administrators through one intelligent system.
        </p>

        {/* scroll line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-emerald-400 to-transparent"
          style={{ animation: 'scrollPulse 2s ease-in-out infinite' }} />
      </section>

      {/* ══════════════════════════════
          VISION & MISSION — WATERMARK
      ══════════════════════════════ */}
      <section ref={vmRef} className="relative py-[clamp(5rem,10vw,10rem)] px-[6vw] bg-[#0f2318] overflow-hidden">

        {/* giant watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            flex flex-col items-center gap-4 pointer-events-none select-none z-0">
          <span className="font-['Cormorant_Garamond'] font-semibold text-[clamp(5rem,15vw,14rem)]
              text-emerald-500/[0.05] leading-none whitespace-nowrap">VISION</span>
          <span className="font-['Cormorant_Garamond'] italic text-[clamp(2rem,6vw,5rem)]
              text-emerald-500/[0.05] leading-none">&amp;</span>
          <span className="font-['Cormorant_Garamond'] font-semibold text-[clamp(4rem,13vw,12rem)]
              text-emerald-500/[0.05] leading-none whitespace-nowrap">MISSION</span>
        </div>

        {/* header */}
        <div className="relative z-10 text-center mb-14">
          <SectionTag>What drives us</SectionTag>
          <h2 className="font-['Cormorant_Garamond'] font-semibold text-white
              text-[clamp(2rem,4vw,3.4rem)] leading-tight">
            Vision &amp; Mission
          </h2>
        </div>

        {/* cards */}
        <div className={`relative z-10 grid grid-cols-1 md:grid-cols-2 gap-[2px] max-w-5xl mx-auto
            transition-all duration-1000 ${vmVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

          {/* Vision */}
          <div className="group p-[clamp(3rem,6vw,5rem)] relative overflow-hidden
              hover:-translate-y-1 transition-transform duration-300
              border-t-2 border-emerald-400"
            style={{ background: 'linear-gradient(145deg,#1e4433,#152e22)' }}>
            <span className="absolute top-6 right-8 font-['Cormorant_Garamond'] font-semibold
                text-[5rem] leading-none text-emerald-400/[0.08] select-none">01</span>
            <span className="text-4xl mb-6 block">🌿</span>
            <h3 className="font-['Cormorant_Garamond'] text-[1.9rem] font-semibold
                text-emerald-400 mb-5">Our Vision</h3>
            <p className="text-[0.97rem] leading-[1.85] text-emerald-200/70 mb-4">
              To become Sri Lanka's leading digital waste management platform — a future where
              every pickup is on time, every complaint is heard, and every community lives
              cleaner through the power of smart technology.
            </p>
            <p className="text-[0.97rem] leading-[1.85] text-emerald-200/70">
              We envision a country where waste collection is no longer an afterthought,
              but a transparent, data-driven public service that communities can depend on.
            </p>
          </div>

          {/* Mission */}
          <div className="group p-[clamp(3rem,6vw,5rem)] relative overflow-hidden
              hover:-translate-y-1 transition-transform duration-300
              border-t-2 border-yellow-500/70"
            style={{ background: 'linear-gradient(145deg,#1a2e40,#101e2a)' }}>
            <span className="absolute top-6 right-8 font-['Cormorant_Garamond'] font-semibold
                text-[5rem] leading-none text-yellow-400/[0.08] select-none">02</span>
            <span className="text-4xl mb-6 block">🎯</span>
            <h3 className="font-['Cormorant_Garamond'] text-[1.9rem] font-semibold
                text-yellow-400 mb-5">Our Mission</h3>
            <p className="text-[0.97rem] leading-[1.85] text-emerald-200/70 mb-4">
              To design and deliver a smart, web-based waste management system that
              digitalizes private waste collection — ensuring timely pickups, transparent
              operations, and seamless communication between customers, staff, and administrators.
            </p>
            <p className="text-[0.97rem] leading-[1.85] text-emerald-200/70">
              We achieve this through real-time tracking, AI-powered support, SLA-driven
              analytics, and a platform that scales with Sri Lanka's growing urban needs.
            </p>
          </div>
        </div>

        {/* divider */}
        <div className="relative z-10 flex items-center justify-center max-w-[200px] mx-auto mt-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-emerald-500/20" />
          <span className="text-2xl px-4 opacity-60">♻️</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-emerald-500/20" />
        </div>
      </section>

      {/* ══════════════════════════════
          WINDING PATH TIMELINE
      ══════════════════════════════ */}
      <section ref={journeyRef} className="relative py-[clamp(5rem,10vw,10rem)] px-[6vw] overflow-hidden"
        style={{ background: '#0a1a10' }}>

        {/* bg glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[60%] h-[40%] bottom-[10%] left-[-10%] rounded-full
              bg-emerald-900/20 blur-3xl" />
          <div className="absolute w-[50%] h-[40%] top-[10%] right-[-10%] rounded-full
              bg-yellow-900/10 blur-3xl" />
        </div>

        <div className="relative z-10 text-center mb-20">
          <SectionTag>How we got here</SectionTag>
          <h2 className="font-['Cormorant_Garamond'] font-semibold text-white
              text-[clamp(2rem,4vw,3.4rem)] leading-tight mb-4">
            Our Journey
          </h2>
          <p className="text-[0.97rem] leading-relaxed text-emerald-200/60 max-w-lg mx-auto">
            From identifying a real urban problem in Sri Lanka to building a future-ready platform —
            every step with purpose.
          </p>
        </div>

        {/* Desktop: SVG path + floating cards */}
        <div className="relative max-w-3xl mx-auto hidden md:block">
          <svg viewBox="0 0 800 1100" className="w-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
            {/* road bg */}
            <path fill="none" stroke="#52b78818" strokeWidth="44" strokeLinecap="round"
              d="M400 50 C650 50,700 200,400 220 C100 240,80 400,400 420 C700 440,720 580,400 610 C80 640,80 790,400 810 C700 830,700 970,400 1000 C260 1020,180 1060,140 1080" />
            {/* dashed line */}
            <path fill="none" stroke="#52b788" strokeWidth="2" strokeLinecap="round"
              className="path-dash"
              d="M400 50 C650 50,700 200,400 220 C100 240,80 400,400 420 C700 440,720 580,400 610 C80 640,80 790,400 810 C700 830,700 970,400 1000 C260 1020,180 1060,140 1080" />
            {/* dots */}
            {[50,220,420,610,810,1000].map((y,i) => (
              <circle key={i} cx="400" cy={y} r="7"
                fill={i===5 ? '#c9a84c' : '#52b788'} opacity=".9"/>
            ))}
          </svg>

          {/* milestone cards */}
          <div className="absolute inset-0">
            {milestones.map((m, i) => {
              const tops = ['2%','17%','34%','51%','68%','84%'];
              return (
                <div key={i}
                  style={{ top: tops[i], transitionDelay: `${i*120}ms` }}
                  className={`absolute flex items-start gap-5
                    ${m.side==='right' ? 'left-[55%] flex-row' : 'right-[55%] flex-row-reverse text-right'}
                    transition-all duration-700
                    ${journeyVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-emerald-500
                      bg-[#0a1a10] flex items-center justify-center text-xl z-10
                      hover:scale-110 hover:shadow-[0_0_20px_#52b78855] transition-all duration-300">
                    {m.icon}
                  </div>
                  <div className="max-w-[240px]">
                    <p className="text-[0.65rem] tracking-[0.2em] uppercase text-emerald-400 mb-1">{m.phase}</p>
                    <h4 className="font-['Cormorant_Garamond'] text-lg font-semibold text-white mb-1">{m.title}</h4>
                    <p className="text-[0.82rem] leading-relaxed text-emerald-200/60">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: stacked */}
        <div className="md:hidden flex flex-col gap-8 relative z-10">
          {milestones.map((m, i) => (
            <MilestoneCard key={i} item={m} index={i} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════
          SEED TO TREE
      ══════════════════════════════ */}
      <section ref={treeRef} className="py-[clamp(5rem,10vw,10rem)] px-[6vw] relative overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, #0a1a10, #0f2318)' }}>

        <div className="text-center mb-16">
          <SectionTag>From idea to impact</SectionTag>
          <h2 className="font-['Cormorant_Garamond'] font-semibold text-white
              text-[clamp(2rem,4vw,3.4rem)] leading-tight mb-4">
            How Ecofy Grew
          </h2>
          <p className="text-[0.97rem] leading-relaxed text-emerald-200/60 max-w-lg mx-auto">
            Every great platform starts as a seed. Watch how Ecofy grew from a single problem
            into a branching ecosystem of solutions.
          </p>
        </div>

        <div className={`relative max-w-2xl mx-auto transition-all duration-1000
            ${treeVis ? 'opacity-100' : 'opacity-0'}`}>

          {/* tree SVG */}
          <svg viewBox="0 0 800 700" className="w-full" xmlns="http://www.w3.org/2000/svg">
            {/* roots */}
            {[
              "M400 660 Q340 680 300 700",
              "M400 660 Q380 685 360 700",
              "M400 660 Q420 685 440 700",
              "M400 660 Q460 680 500 700",
            ].map((d,i) => (
              <path key={i} className="root-path" d={d}
                fill="none" stroke="#2d6a4f88" strokeWidth="4" strokeLinecap="round"/>
            ))}

            {/* trunk */}
            <path className="trunk-path" fill="none" stroke="#2d6a4f" strokeWidth="10" strokeLinecap="round"
              d="M400 660 C400 580 400 500 400 420 C400 360 400 280 400 200 C400 180 400 160 400 140"/>

            {/* branches */}
            <path className="branch-path b1" fill="none" stroke="#2d6a4f" strokeWidth="5" strokeLinecap="round" d="M400 440 C370 420 330 410 280 400"/>
            <path className="branch-path b2" fill="none" stroke="#2d6a4f" strokeWidth="5" strokeLinecap="round" d="M400 370 C430 350 470 340 525 328"/>
            <path className="branch-path b3" fill="none" stroke="#2d6a4f" strokeWidth="5" strokeLinecap="round" d="M400 300 C365 280 320 268 268 252"/>
            <path className="branch-path b4" fill="none" stroke="#2d6a4f" strokeWidth="5" strokeLinecap="round" d="M400 245 C435 225 478 212 526 198"/>
            <path className="branch-path b5" fill="none" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" d="M400 195 C368 172 332 156 292 138"/>
            <path className="branch-path b6" fill="none" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" d="M400 175 C432 154 468 138 508 122"/>

            {/* leaf clusters */}
            <g className="lc1"><circle cx="264" cy="396" r="22" fill="#2d6a4f88"/><circle cx="280" cy="382" r="18" fill="#52b78866"/><circle cx="252" cy="380" r="15" fill="#52b78855"/></g>
            <g className="lc2"><circle cx="540" cy="322" r="22" fill="#2d6a4f88"/><circle cx="525" cy="310" r="18" fill="#52b78866"/><circle cx="552" cy="308" r="15" fill="#52b78855"/></g>
            <g className="lc3"><circle cx="252" cy="246" r="24" fill="#2d6a4f88"/><circle cx="270" cy="232" r="20" fill="#52b78866"/><circle cx="244" cy="230" r="16" fill="#52b78855"/></g>
            <g className="lc4"><circle cx="540" cy="192" r="24" fill="#2d6a4f88"/><circle cx="526" cy="179" r="20" fill="#52b78866"/><circle cx="554" cy="178" r="16" fill="#52b78855"/></g>
            <g className="lc5"><circle cx="276" cy="130" r="26" fill="#2d6a4f88"/><circle cx="294" cy="116" r="22" fill="#52b78866"/><circle cx="266" cy="113" r="18" fill="#52b78855"/></g>
            <g className="lc6"><circle cx="522" cy="116" r="26" fill="#2d6a4f88"/><circle cx="508" cy="102" r="22" fill="#52b78866"/><circle cx="536" cy="100" r="18" fill="#52b78855"/></g>
            {/* crown */}
            <g className="lc7">
              <circle cx="400" cy="100" r="38" fill="#2d6a4f99"/>
              <circle cx="378" cy="80"  r="28" fill="#52b78877"/>
              <circle cx="422" cy="78"  r="28" fill="#52b78877"/>
              <circle cx="400" cy="66"  r="24" fill="#52b78866"/>
            </g>

            {/* seed */}
            <circle className="seed-circle" cx="400" cy="670" r="8" fill="#c9a84c"/>
            <circle cx="400" cy="670" r="14" fill="none" stroke="#c9a84c" strokeWidth="1.5" opacity=".4"/>
          </svg>

          {/* floating label cards */}
          <div className="absolute inset-0 pointer-events-none">
            {treeLabels.map((t, i) => (
              <TreeLabel key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FOOTER
      ══════════════════════════════ */}
      
          
    </div>
  );
}