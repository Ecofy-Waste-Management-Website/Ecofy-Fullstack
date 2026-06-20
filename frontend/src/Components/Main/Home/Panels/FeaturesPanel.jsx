import React, { useLayoutEffect, useRef } from 'react';
import { Truck, MapPin, TrendingUp, Users } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FeaturesPanel = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const cardsRef = useRef([]);

  const features = [
    { icon: Truck, title: "Smart Pickup", desc: "Request pickups easily and get real-time updates.", color: "bg-white" },
    { icon: MapPin, title: "Track & Monitor", desc: "Track your waste collections in real-time.", color: "bg-[#f8fdf5]" },
    { icon: TrendingUp, title: "Impact Dashboard", desc: "See the positive impact you're creating.", color: "bg-[#f0fae8]" },
    { icon: Users, title: "Community Driven", desc: "Bridging communities and collectors.", color: "bg-[#e6f5da]" }
  ];

  useLayoutEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const cards = cardsRef.current;
    
    const ctx = gsap.context(() => {
      // Cinematic entrance reveal for the entire section content (improved to scrub: 1 for buttery smoothness)
      gsap.fromTo(contentRef.current, 
        { y: 100, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%", // Start animating when the top of the section hits 90% of viewport
            end: "top 20%",   // Finish animating when it reaches 20%
            scrub: 1,         // Buttery smooth scrubbing
          }
        }
      );

      // Initialize the cards using GSAP to prevent React inline-style conflicts
      cards.forEach((card, index) => {
        if (!card) return;
        if (index === 0) {
          gsap.set(card, {
            y: 0,
            yPercent: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
          });
        } else {
          gsap.set(card, {
            y: 0,
            yPercent: 120, // Start off-screen
            scale: 0.9,
            opacity: 0,
            filter: "blur(6px)",
          });
        }
      });

      // Pin the outer container while cards stack
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: () => `+=${window.innerHeight * 1.8}`, // Perfectly proportioned scroll distance
          scrub: 1, // Smooth, cinematic momentum damping (changed from 2 to 1 for high responsiveness)
          anticipatePin: 1, 
          invalidateOnRefresh: true,
        }
      });

      // Cinematic stacking animation: progressive scale down and fade out of previous cards as new cards arrive
      cards.forEach((card, index) => {
        if (index === 0) return; // First card is already positioned

        const label = `step_${index}`;
        // Add a slight scroll pause between stacks for organic feel
        tl.add(label, index > 1 ? `+=0.25` : `+=0.1`);

        // 1. Animate incoming card into view
        tl.fromTo(card, 
          { 
            yPercent: 120,
            scale: 0.92,
            opacity: 0,
            filter: "blur(6px)",
          }, 
          { 
            yPercent: 0,
            y: index * 20, // Subtle vertical stack spacing
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power2.out"
          },
          label
        );

        // 2. Concurrently animate previous cards to scale down, shift up, and dim for cinematic perspective depth
        for (let prevIndex = 0; prevIndex < index; prevIndex++) {
          const prevCard = cards[prevIndex];
          if (!prevCard) continue;

          const depth = index - prevIndex;
          tl.to(prevCard,
            {
              scale: 1 - depth * 0.03, // Progressive shrink
              y: prevIndex * 20 - depth * 10, // Dynamic vertical stack shift
              opacity: 1 - depth * 0.15, // Progressive dimming for ambient contrast
              filter: `blur(${depth * 0.5}px)`, // Super lightweight progressive blur for premium depth of field
              duration: 1,
              ease: "power2.out"
            },
            label
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-screen flex flex-col items-center justify-center px-6 lg:px-16 bg-[#D6E9CA] relative overflow-hidden select-none"
    >
      <div ref={contentRef} className="w-full flex flex-col items-center">
        <div className="max-w-4xl w-full text-center mb-8 z-10">
          <h3 className="text-[#397239] font-black tracking-widest text-sm mb-3 uppercase">Why Ecofy?</h3>
          <h2 className="text-4xl md:text-5xl font-black text-[#244c21] max-w-3xl mx-auto leading-tight">
            Everything You Need for a <span className="text-[#397239]">Cleaner Tomorrow</span>
          </h2>
        </div>

        {/* The Stacked Cards Frame Area */}
        <div className="relative w-full max-w-3xl h-[400px] md:h-[260px] mx-auto z-10">
          {features.map((feature, i) => (
            <div 
              key={i} 
              ref={el => cardsRef.current[i] = el}
              className={`absolute inset-x-0 mx-auto w-full rounded-[2.5rem] p-8 md:p-10 border border-[#244c21]/10 shadow-[0_20px_50px_rgba(36,76,33,0.1)] flex flex-col md:flex-row items-center text-left ${feature.color}`}
              style={{ 
                zIndex: 10 + i,
                willChange: 'transform, opacity, filter',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#244c21] flex items-center justify-center text-[#D6E9CA] mb-6 md:mb-0 md:mr-8 flex-shrink-0 shadow-lg">
                <feature.icon className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-black text-2xl md:text-3xl text-[#244c21] mb-2">{feature.title}</h4>
                <p className="text-[#244c21]/80 text-base md:text-lg font-bold leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPanel;
