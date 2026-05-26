import React, { useLayoutEffect, useRef } from 'react';
import { ArrowRight, Truck, MapPin, Recycle, Globe, Target } from 'lucide-react';
import ScrollPanel from '../Home/Panels/ScrollPanel';
import HeroPanel from '../Home/Panels/HeroPanel';
import FeaturesPanel from '../Home/Panels/FeaturesPanel';
import StepsPanel from '../Home/Panels/StepsPanel';
import ImpactPanel from '../Home/Panels/ImpactPanel';
import TestimonialsPanel from '../Home/Panels/TestimonialsPanel';
import Footer from '../Footer/footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Section Data ───────────────────────────────────────────────────────────────
const horizontalSections = [
  {
    title: 'Smart Collection',
    description: 'AI-powered waste collection scheduling optimized for your area and community.',
    icon: Truck,
    color: 'from-[#1a5c2a] to-[#397234]',
  },
  {
    title: 'Real-Time Tracking',
    description: 'Track your waste pickup in real-time with live GPS updates on every collection.',
    icon: MapPin,
    color: 'from-[#244c21] to-[#397234]',
  },
  {
    title: 'Recycling Rewards',
    description: 'Earn points for every kilogram recycled and redeem them for exciting rewards.',
    icon: Recycle,
    color: 'from-[#2d7a3f] to-[#66c45e]',
  },
  {
    title: 'Community Impact',
    description: 'See your environmental footprint and inspire your neighbours to go green.',
    icon: Globe,
    color: 'from-[#1a5c2a] to-[#244c21]',
  },
  {
    title: 'Zero Waste Goals',
    description: 'Set and achieve your zero-waste targets with personalised AI guidance.',
    icon: Target,
    color: 'from-[#397234] to-[#66c45e]',
  },
];

// ── Horizontal Reveal Component ────────────────────────────────────────────────
// Technique: One single GSAP tween scrubs the track's X position.
// No secondary triggers, no scale/opacity juggling — pure GPU transform only.
// This eliminates all sources of jitter and layout shift.
function HorizontalSections() {
  const wrapperRef = useRef(null);
  const trackRef   = useRef(null);

  useLayoutEffect(() => {
    if (!wrapperRef.current || !trackRef.current) return;

    const getDistance = () => -(trackRef.current.scrollWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        // Move track left by exactly its overflow width — linear, no easing
        x: getDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: true,            // freeze the viewport
          anticipatePin: 1,     // pre-calculates pin start to prevent jump
          scrub: 2,             // high value = maximum smoothness / inertia feel
          // End when we've scrolled exactly as far as the track overflows
          end: () => `+=${-getDistance()}`,
          invalidateOnRefresh: true,
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative h-screen w-full overflow-hidden bg-[#081F12]"
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        style={{ opacity: 0.6 }}
      >
        <source src="/Second section/ecofy.mp4" type="video/mp4" />
      </video>

      {/* GPU-composited track — only transform:translateX changes, nothing else */}
      <div
        ref={trackRef}
        className="relative z-10 flex h-full"
        style={{
          width: `${horizontalSections.length * 100}vw`,
          willChange: 'transform',
          transform: 'translateZ(0)',          // promote to its own compositor layer
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
      >
        {horizontalSections.map((section, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-screen h-full flex items-center justify-center px-8 md:px-20"
          >
            <div
              className={`
                max-w-2xl w-full text-center
                p-10 md:p-14 rounded-3xl
                bg-gradient-to-br ${section.color}
                text-white shadow-2xl border border-white/10
                flex flex-col items-center
              `}
            >
              <section.icon className="w-16 h-16 md:w-20 md:h-20 mb-6 text-[#D6E9CA]" />
              <h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight">
                {section.title}
              </h2>
              <p className="text-lg md:text-2xl opacity-90 leading-relaxed font-medium">
                {section.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress dots — purely decorative, no JS needed */}
      <div className="absolute z-10 bottom-14 left-1/2 -translate-x-1/2 flex gap-2.5 pointer-events-none">
        {horizontalSections.map((_, i) => (
          <span key={i} className="w-2 h-2 rounded-full bg-white/30" />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute z-10 bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs font-semibold tracking-widest uppercase animate-bounce select-none pointer-events-none">
        Scroll to explore →
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Hero() {
  useLayoutEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="w-full bg-[#244c21] overflow-x-hidden">
      {/* Panel 1: Hero */}
      <ScrollPanel bgColor="bg-[#397234]">
        <HeroPanel />
      </ScrollPanel>

      {/* Panel 2: Horizontal Reveal — slides in from the right as you scroll down */}
      <HorizontalSections />

      {/* Panel 3: Features */}
      <FeaturesPanel />

      {/* Panel 4: Steps */}
      <ScrollPanel bgColor="bg-[#397234]">
        <StepsPanel />
      </ScrollPanel>

      {/* Panel 5: Impact */}
      <ScrollPanel bgColor="bg-[#D6E9CA]">
        <ImpactPanel />
      </ScrollPanel>

      {/* Panel 6: Testimonials + CTA */}
      <ScrollPanel bgColor="bg-[#397234]">
        <div className="w-full flex flex-col items-center justify-center">
          <TestimonialsPanel />
          <div className="mt-24 flex flex-col items-center justify-center text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-8 leading-tight">
              Ready to Make a Difference?
            </h2>
            <a
              href="/dashboard"
              className="bg-white hover:bg-gray-50 text-[#051F10] px-12 py-5 rounded-full font-extrabold text-2xl flex items-center justify-center gap-3 transition-all hover:scale-110 shadow-2xl active:scale-95"
            >
              Get Started Now <ArrowRight className="w-8 h-8" />
            </a>
          </div>
        </div>
      </ScrollPanel>

      {/* Footer */}
      <div className="bg-white">
        <Footer />
      </div>
    </main>
  );
}
