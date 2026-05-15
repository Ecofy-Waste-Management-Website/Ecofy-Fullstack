import React from 'react';
import { ArrowRight, Leaf } from 'lucide-react';
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

export default function Hero() {
  React.useEffect(() => {
    // Delay refresh so all panels and fonts are fully rendered before GSAP measures them
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="w-full bg-[#244c21]">
      {/* Panel 1: Hero */}
      <ScrollPanel offset={0} bgColor="bg-[#397234]" zIndex={10}>
        <HeroPanel />
      </ScrollPanel>

      {/* Panel 2: Features */}
      <ScrollPanel offset={40} bgColor="bg-[#D6E9CA]" zIndex={20}>
        <FeaturesPanel />
      </ScrollPanel>

      {/* Panel 3: Steps */}
      <ScrollPanel offset={80} bgColor="bg-[#397234]" zIndex={30}>
        <StepsPanel />
      </ScrollPanel>

      {/* Panel 4: Impact */}
      <ScrollPanel offset={120} bgColor="bg-[#D6E9CA]" zIndex={40}>
        <ImpactPanel />
      </ScrollPanel>

      {/* Final Combined Frame: Testimonials + CTA + Footer */}
      {/* isLast=true disables GSAP scale/parallax on this section, preventing animation overlap glitch */}
      <div
        className="relative w-full z-[60]"
        style={{
          borderRadius: '3rem 3rem 0 0',
          overflow: 'hidden',
          boxShadow: '0 -20px 80px rgba(0,0,0,0.3)',
          backgroundColor: '#397234',
          isolation: 'isolate',
          willChange: 'auto',
          transform: 'translateZ(0)',
        }}
      >
        {/* Testimonials Part */}
        <div className="py-24 px-6 lg:px-16">
          <TestimonialsPanel />
        </div>

        {/* CTA Part - Simplified */}
        <div className="flex justify-center pb-24">
          <a href="/dashboard" className="bg-white hover:bg-gray-50 text-[#051F10] px-12 py-5 rounded-full font-extrabold text-2xl flex items-center justify-center gap-3 transition-all hover:scale-110 shadow-2xl active:scale-95">
            Get Started Now <ArrowRight className="w-8 h-8" />
          </a>
        </div>

        {/* Footer Part - White background */}
        <div className="bg-white">
          <Footer />
        </div>

        {/* Decorative elements */}
        <Leaf className="absolute top-40 right-10 text-white/5 w-64 h-64 rotate-45 pointer-events-none" />
        <Leaf className="absolute bottom-96 left-10 text-white/5 w-48 h-48 -rotate-45 pointer-events-none" />
      </div>
    </main>
  );
}
