import React, { useLayoutEffect, useRef } from 'react';
import { Truck, MapPin, TrendingUp, Users } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FeaturesPanel = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const features = [
    { 
      icon: Truck, 
      title: "Smart Pickup", 
      desc: "Request collections instantly with smart timing optimized for your area.", 
      glow: "shadow-[0_30px_70px_-15px_rgba(57,114,57,0.12)]" 
    },
    { 
      icon: MapPin, 
      title: "Track & Monitor", 
      desc: "Monitor collections in real-time with precise GPS navigation maps.", 
      glow: "shadow-[0_30px_70px_-15px_rgba(36,76,33,0.12)]" 
    },
    { 
      icon: TrendingUp, 
      title: "Impact Dashboard", 
      desc: "Visualize your positive impact, CO2 reduction, and points earned.", 
      glow: "shadow-[0_30px_70px_-15px_rgba(45,122,63,0.12)]" 
    },
    { 
      icon: Users, 
      title: "Community Driven", 
      desc: "Join forces with local neighbors and collectors to build a cleaner city.", 
      glow: "shadow-[0_30px_70px_-15px_rgba(50,107,46,0.12)]" 
    }
  ];

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const cards = cardsRef.current;

    const ctx = gsap.context(() => {
      // 1. Initialize absolute card states before timeline starts to prevent jumps
      cards.forEach((card, index) => {
        if (index === 0) {
          gsap.set(card, {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            transformPerspective: 1000,
          });
        } else {
          gsap.set(card, {
            yPercent: 130, // Start completely off-screen below
            scale: 0.9,
            opacity: 0,
            filter: "blur(8px)",
            transformPerspective: 1000,
          });
        }
      });

      // 2. Main Consolidate ScrollTrigger Timeline (Handling Pinning + Text + Cards)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: () => `+=${window.innerHeight * 2}`, // 2 screen heights worth of scroll
          scrub: 1.2, // Ultra-responsive scroll tracking momentum
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      // 3. Cinematic Entrance for Section Header
      const header = containerRef.current.querySelector(".section-header");
      if (header) {
        tl.fromTo(header,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" },
          0 // Start instantly
        );
      }

      // 4. Gorgeous 3D Stack Perspective Deck Animation Sequence
      features.forEach((_, index) => {
        if (index === 0) return; // Card 0 is already present

        const card = cards[index];
        const prevCards = cards.slice(0, index);
        const label = `step-${index}`;

        tl.add(label);

        // Slide up and dock active card
        tl.to(card, {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          ease: "power2.out",
          duration: 2.2,
        }, label);

        // Simultaneously scale, translate, and blur previous cards to simulate 3D depth
        prevCards.forEach((prevCard, prevIdx) => {
          const depth = index - prevIdx; // relative distance in stack
          tl.to(prevCard, {
            scale: 1 - depth * 0.045, // progressive scale down
            yPercent: -depth * 10,   // slide slightly up to look stacked
            opacity: Math.max(0.2, 1 - depth * 0.28), // fade background cards
            filter: `blur(${depth * 2}px)`, // cinematic progressive glass blur
            ease: "power2.out",
            duration: 2.2,
          }, label);
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-screen flex flex-col items-center justify-center px-6 lg:px-16 bg-gradient-to-b from-[#D6E9CA] to-[#CBE2BD] relative overflow-hidden select-none"
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Premium ambient glow layer */}
      <div className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-br from-[#397239]/10 to-[#244c21]/5 blur-[80px] md:blur-[120px] pointer-events-none z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="w-full flex flex-col items-center z-10 max-w-4xl">
        
        {/* Animated section header */}
        <div className="section-header w-full text-center mb-10 md:mb-14">
          <h3 className="text-[#2d622a] font-extrabold tracking-widest text-xs md:text-sm mb-3 uppercase">
            Why Ecofy?
          </h3>
          <h2 className="text-3xl md:text-5xl font-black text-[#1c3c1a] max-w-3xl mx-auto leading-tight md:leading-none">
            Everything You Need for a <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-[#244c21] to-[#397239] bg-clip-text text-transparent">Cleaner Tomorrow</span>
          </h2>
        </div>

        {/* Stacked Cards Area */}
        <div 
          className="relative w-full max-w-3xl h-[360px] md:h-[260px] mx-auto"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}
        >
          {features.map((feature, i) => (
            <div 
              key={i} 
              ref={el => cardsRef.current[i] = el}
              className={`absolute inset-x-0 mx-auto w-full rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-white/50 bg-white/65 backdrop-blur-xl flex flex-col md:flex-row items-center text-center md:text-left justify-center md:justify-start ${feature.glow}`}
              style={{ 
                zIndex: 10 + i,
                willChange: 'transform, opacity, filter',
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Rounded 2xl icon container with glowing shadow */}
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#244c21] to-[#397239] flex items-center justify-center text-[#e8f5df] mb-4 md:mb-0 md:mr-8 flex-shrink-0 shadow-[0_12px_30px_-5px_rgba(36,76,33,0.3)] transition-transform duration-500 hover:rotate-6">
                <feature.icon className="w-7 h-7 md:w-9 md:h-9" />
              </div>
              
              <div>
                <h4 className="font-extrabold text-xl md:text-3xl text-[#1c3c1a] mb-2 tracking-tight">
                  {feature.title}
                </h4>
                <p className="text-[#244c21]/90 text-sm md:text-lg font-semibold leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FeaturesPanel;
