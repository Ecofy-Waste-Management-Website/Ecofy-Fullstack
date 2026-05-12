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
    // Ensure ScrollTrigger recalculates positions after all panels are rendered
    ScrollTrigger.refresh();
  }, []);

  return (
    <main className="w-full bg-[#244c21]">
      {/* Panel 1: Hero */}
      <ScrollPanel offset={0} bgColor="bg-[#244c21]" zIndex={10}>
        <HeroPanel />
      </ScrollPanel>

      {/* Panel 2: Features */}
      <ScrollPanel offset={40} bgColor="bg-[#244c21]" zIndex={20}>
        <FeaturesPanel />
      </ScrollPanel>

      {/* Panel 3: Steps */}
      <ScrollPanel offset={80} bgColor="bg-[#397239]" zIndex={30}>
        <StepsPanel />
      </ScrollPanel>

      {/* Panel 4: Impact */}
      <ScrollPanel offset={120} bgColor="bg-[#397239]" zIndex={40}>
        <ImpactPanel />
      </ScrollPanel>

      {/* Final Combined Frame: Testimonials + CTA + Footer */}
      <section className="relative w-full z-[60] bg-[#66c45e] rounded-t-[3rem] -mt-10 overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
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
      </section>
    </main>
  );
}
