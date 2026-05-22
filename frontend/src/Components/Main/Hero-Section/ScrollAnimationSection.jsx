import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Recycle, Leaf } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function ScrollAnimationSection() {
  const containerRef = useRef(null);
  const truckRef = useRef(null);
  const garbageContainerRef = useRef(null);
  const garbageItemsRef = useRef([]);

  useGSAP(() => {
    // Initial setup: hide garbage
    gsap.set(garbageItemsRef.current, { y: 0, opacity: 0, scale: 0.5 });
    
    // Create the scroll-linked timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=2000", // Pin the section for 2000px of scrolling
        scrub: 1, // Smooth scrubbing
        pin: true,
      }
    });

    // Phase 1: Truck drives in from the left following a curved path
    tl.to(truckRef.current, {
      motionPath: {
        path: "#drivePath",
        align: "#drivePath",
        alignOrigin: [0.5, 1], // Align bottom center of truck to the path
        autoRotate: true,
      },
      duration: 3,
      ease: "power2.inOut"
    })
    // Phase 2: Truck stops and tilts backward to dump (simulate the green body tilting)
    .to(truckRef.current, {
      rotation: 30, // positive to lift the front (left side) up
      transformOrigin: "bottom right", // Pivot on rear wheels (now on the right side)
      duration: 1,
      ease: "power1.inOut"
    }, "+=0.2") // slight pause
    // Phase 3: Garbage pieces fall out and bounce
    .to(garbageItemsRef.current, {
      y: (i) => 200 + (Math.random() * 50), // Fall to ground
      x: (i) => 80 + (Math.random() * 120), // Spread to the right behind the truck
      opacity: 1,
      scale: 1,
      rotation: (i) => Math.random() * 360,
      stagger: 0.1, // Stagger the falling
      duration: 1,
      ease: "bounce.out"
    }, "-=0.8"); // Start falling while truck is tilting

    // Phase 4: Truck lowers back down
    tl.to(truckRef.current, {
      rotation: 0,
      transformOrigin: "bottom right",
      duration: 1,
      ease: "power1.inOut"
    }, "+=0.5");

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full h-screen bg-[#E8F8E3] relative overflow-hidden flex flex-col justify-center border-t-8 border-b-8 border-[#0E351E]">
      
      {/* Background Decor */}
      <div className="absolute top-10 left-10 opacity-10"><Leaf className="w-32 h-32 text-green-800 rotate-45" /></div>
      <div className="absolute top-40 right-20 opacity-10"><Leaf className="w-24 h-24 text-green-800 -rotate-12" /></div>
      
      <div className="text-center absolute top-20 left-1/2 -translate-x-1/2 w-full px-4 z-10">
        <h3 className="text-[#328B49] font-bold tracking-widest text-sm mb-2">RESPONSIBLE DISPOSAL</h3>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#051F10]">
          We Collect, We Recycle
        </h2>
        <p className="text-gray-600 mt-4 max-w-lg mx-auto">
          Scroll down to see our smart trucks in action. We ensure that your waste is securely transported and processed with zero hassle.
        </p>
      </div>

      {/* SVG Motion Path (The "Red Line" path) */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {/* We use a viewBox that gives us a good coordinate system for the path */}
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 600">
           {/* A nice S-curve path starting from off-screen left, curving, and ending in the center-right */}
           {/* You can uncomment the stroke below to visually see the "red line path" */}
           <path 
             id="drivePath" 
             d="M -200 400 C 100 400, 300 200, 500 350 C 600 420, 750 450, 800 450" 
             fill="none" 
             stroke="rgba(255,0,0,0.2)" 
             strokeWidth="4" 
             strokeDasharray="10 10"
           />
        </svg>
      </div>
      
      {/* Container for the Truck and Garbage */}
      <div className="absolute inset-0 pointer-events-none z-20">
        
        {/* The Animated Truck */}
        <div ref={truckRef} className="absolute top-0 left-0">
          
          {/* Garbage Pieces inside (Hidden initially, fall out on tilt) */}
          <div ref={garbageContainerRef} className="absolute bottom-[40%] right-[20%] w-[50px] h-[50px] z-10">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                ref={el => garbageItemsRef.current[i] = el}
                className={`absolute w-12 h-12 rounded-sm shadow-md flex items-center justify-center border-2 border-white/20
                  ${i % 3 === 0 ? 'bg-[#8B5A2B]' : i % 3 === 1 ? 'bg-[#555]' : 'bg-[#A1F069]'}`}
                style={{ 
                  top: Math.random() * 20, 
                  left: Math.random() * 20 
                }}
              >
                <Recycle className="w-6 h-6 text-white/50" />
              </div>
            ))}
          </div>

          {/* The static 3D truck image */}
          <img 
            src="/truck.png" 
            alt="Ecofy Garbage Truck" 
            className="w-[300px] h-auto relative z-20 drop-shadow-[15px_20px_15px_rgba(0,0,0,0.5)] scale-x-[-1]" 
          />
          
        </div>
      </div>
      
      {/* Road / Ground base overlay */}
      <div className="absolute bottom-[25%] left-0 w-full h-[50px] bg-gradient-to-t from-[#E8F8E3] to-transparent z-30 pointer-events-none"></div>

    </section>
  );
}
