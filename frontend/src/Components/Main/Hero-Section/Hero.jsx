import React, { useEffect, useRef, useState } from 'react';
import { 
  Leaf, 
  PlayCircle, 
  Recycle, 
  Users, 
  Building2, 
  CloudRain,
  Truck,
  MapPin,
  BarChart3,
  Globe2,
  TrendingUp,
  CircleUserRound,
  ArrowRight,
  FileText,
  Quote,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ScrollAnimationSection from './ScrollAnimationSection';
import SmoothScroll from './SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const loaderExitTimerRef = useRef(null);
  const heroBadgeRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroCopyRef = useRef(null);
  const heroActionsRef = useRef(null);
  const heroVisualRef = useRef(null);
  const heroStatsRef = useRef(null);
  const heroFloatingCardsRef = useRef([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderExiting, setIsLoaderExiting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoaderExiting(true);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaderExiting) return;

    loaderExitTimerRef.current = window.setTimeout(() => {
      setIsLoading(false);
    }, 650);

    return () => {
      if (loaderExitTimerRef.current) {
        window.clearTimeout(loaderExitTimerRef.current);
      }
    };
  }, [isLoaderExiting]);

  useGSAP(() => {
    // Reveal up animations for sections
    const elements = gsap.utils.toArray('.reveal-up');
    elements.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    });

    if (!isLoaderExiting) return;

    const entranceTargets = [
      heroBadgeRef.current,
      heroTitleRef.current,
      heroCopyRef.current,
      heroActionsRef.current,
      heroVisualRef.current,
      heroStatsRef.current,
    ].filter(Boolean);

    gsap.set(entranceTargets, { autoAlpha: 0, y: 28 });
    gsap.set(heroFloatingCardsRef.current.filter(Boolean), { autoAlpha: 0, y: 18, scale: 0.96 });

    const tl = gsap.timeline();

    tl.to('.eco-loader-panel', {
      autoAlpha: 0,
      scale: 0.96,
      duration: 0.55,
      ease: 'power2.out'
    })
      .to(heroBadgeRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        ease: 'power3.out'
      }, '-=0.15')
      .to(heroTitleRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        ease: 'power3.out'
      }, '-=0.25')
      .to(heroCopyRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.35')
      .to(heroActionsRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.3')
      .to(heroVisualRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out'
      }, '-=0.45')
      .to(heroFloatingCardsRef.current.filter(Boolean), {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        stagger: 0.12,
        ease: 'back.out(1.7)'
      }, '-=0.4')
      .to(heroStatsRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out'
      }, '-=0.35');

  }, { scope: containerRef, dependencies: [isLoaderExiting], revertOnUpdate: true });

  return (
    <SmoothScroll>
    <main ref={containerRef} className="w-full font-sans bg-[#f4faf6] relative">
      {isLoading && (
        <div
          className={`eco-loader-panel fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#031509] text-white transition-all duration-700 ease-out ${isLoaderExiting ? 'opacity-0 scale-[0.985] pointer-events-none' : 'opacity-100'}`}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#A1F069]/12 blur-[120px] animate-[pulse_4s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[-8rem] right-[-2rem] h-72 w-72 rounded-full bg-[#2a8d41]/10 blur-[120px] animate-[pulse_6s_ease-in-out_infinite]"></div>
            <div className="absolute left-10 top-16 h-24 w-24 rounded-full border border-[#A1F069]/25 animate-[spin_16s_linear_infinite]"></div>
            <div className="absolute right-12 top-20 h-16 w-16 rounded-full border border-white/10 animate-[spin_10s_linear_infinite_reverse]"></div>
            <Leaf className="absolute left-16 bottom-20 w-16 h-16 text-[#24502f] rotate-[-18deg] opacity-70 animate-[eco-loader-float_5s_ease-in-out_infinite]" />
            <Leaf className="absolute right-16 bottom-28 w-12 h-12 text-[#A1F069] rotate-[22deg] opacity-70 animate-[eco-loader-float-reverse_6s_ease-in-out_infinite]" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
            <div className="relative flex h-36 w-36 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#A1F069]/20"></div>
              <div className="absolute inset-3 rounded-full border border-[#A1F069]/35 border-t-transparent animate-[spin_2.2s_linear_infinite]"></div>
              <div className="absolute inset-8 rounded-full border border-[#A1F069]/50 border-b-transparent animate-[spin_3.5s_linear_infinite_reverse]"></div>
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#0A2D19] shadow-[0_0_50px_rgba(161,240,105,0.15)]">
                <Leaf className="h-10 w-10 text-[#A1F069]" />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[0.65rem] uppercase tracking-[0.65em] text-white/50">Loading experience</p>
              <h1 className="text-5xl md:text-7xl font-black tracking-[0.42em] text-white drop-shadow-[0_0_30px_rgba(161,240,105,0.18)]">
                ECOFY
              </h1>
            </div>

            <div className="w-64 max-w-[70vw] overflow-hidden rounded-full bg-white/10">
              <div className="h-1 w-1/2 rounded-full bg-gradient-to-r from-transparent via-[#A1F069] to-transparent animate-[eco-loader-sweep_1.6s_ease-in-out_infinite]"></div>
            </div>

            <p className="max-w-sm text-sm text-white/55">
              Preparing smarter waste management tools.
            </p>
          </div>
        </div>
      )}
      {/* --- TOP DARK SECTION --- */}
      <section className="relative w-full bg-[#031509] pt-24 pb-48 px-6 lg:px-16 overflow-hidden flex justify-center text-white">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
           {/* Glowing ring with light trail */}
           <div className="absolute top-1/2 left-[60%] -translate-y-1/2 w-[600px] h-[600px] rounded-full overflow-hidden border border-[#A1F069]/10 shadow-[0_0_100px_rgba(161,240,105,0.1)]">
             {/* Spinning gradient tail */}
             <div className="absolute inset-[-50%] animate-[spin_5s_linear_infinite]" style={{ background: 'conic-gradient(from 0deg, transparent 60%, rgba(161,240,105,0.8) 100%)' }}></div>
             {/* Inner circle mask */}
             <div className="absolute inset-[2px] bg-[#031509] rounded-full"></div>
           </div>
           {/* Gradient glow */}
           <div className="absolute top-1/2 left-[60%] -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#A1F069]/5 blur-[120px]"></div>
           {/* Floating Leaves (simulated with CSS shapes/svgs) */}
           <Leaf className="absolute top-24 left-[10%] text-[#235833] w-12 h-12 -rotate-45 blur-[1px] opacity-60" />
           <Leaf className="absolute bottom-40 left-[5%] text-[#1a4125] w-24 h-24 rotate-12 blur-[2px] opacity-40" />
           <Leaf className="absolute top-32 right-[40%] text-[#A1F069] w-8 h-8 rotate-45 opacity-80" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start pt-10">
            <div ref={heroBadgeRef} className="flex items-center gap-2 bg-[#0A2D19] border border-[#164D2B] rounded-full px-4 py-1.5 mb-6">
              <Leaf className="w-4 h-4 text-[#A1F069]" />
              <span className="text-sm font-medium text-white/90">Smart Waste Management</span>
            </div>
            
            <h1 ref={heroTitleRef} className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6">
              Smart Waste.<br/>
              <span className="text-[#A1F069]">Smarter Future.</span>
            </h1>
            
            <p ref={heroCopyRef} className="text-lg text-gray-300 mb-10 max-w-lg leading-relaxed">
              Ecofy is a smart, web-based platform that bridges the gap between communities and waste collectors—making pickups smarter, greener, and more accountable.
            </p>

            <div ref={heroActionsRef} className="flex items-center gap-6 mb-12">
              <a href="/dashboard" className="bg-[#A1F069] hover:bg-[#8ee155] text-[#051F10] px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 transition-colors">
                Open Dashboard <ArrowRight className="w-5 h-5" />
              </a>
              <a href="/blogs" className="text-white hover:text-[#A1F069] flex items-center gap-2 font-semibold px-4 py-3 border border-white/20 rounded-full transition-colors">
                <PlayCircle className="w-5 h-5" /> Read Blogs
              </a>
            </div>

          </div>

          {/* Right Visual Content (Phone + Floating Cards) */}
          <div ref={heroVisualRef} className="w-full lg:w-1/2 relative flex justify-center lg:justify-end items-center h-[600px]">
            
            {/* Center Group: Base Platform + Phone + Bin */}
            <div className="relative flex justify-center items-end mr-0 lg:mr-16">
              
              {/* Base platform */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[450px] h-[120px] bg-[#0E351E] rounded-[100%] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center border-t border-[#1a5231] z-10 pointer-events-none">
                 <div className="w-[380px] h-[90px] bg-[#124227] rounded-[100%] border-t border-[#1d633b]"></div>
              </div>

              {/* Detailed 3D Wheelie Bin */}
              <div className="absolute bottom-0 -right-12 z-30 transform perspective-[1000px] rotate-y-[-20deg] rotate-x-[5deg] scale-110">
                <div className="relative w-40 h-[260px] flex flex-col items-center">
                  
                  {/* --- Lid --- */}
                  <div className="absolute top-0 w-[105%] h-[20px] bg-gradient-to-b from-[#87C475] to-[#6AA85B] rounded-t-lg z-40 shadow-[0_4px_10px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-[#558D48]">
                    {/* Lid Handle / Ridge */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1/2 h-2 bg-gradient-to-r from-[#7BBA6A] to-[#6AA85B] rounded-t-sm border border-[#558D48]"></div>
                    {/* Side Hinge/Handle */}
                    <div className="absolute top-1 -right-3 w-4 h-6 bg-[#629E53] rounded-r-md border border-[#558D48] shadow-sm"></div>
                  </div>

                  {/* --- Main Lip/Rim --- */}
                  <div className="absolute top-[18px] w-[110%] h-[16px] bg-gradient-to-b from-[#7BBA6A] to-[#5C984B] rounded-sm z-30 shadow-[0_5px_10px_rgba(0,0,0,0.3),inset_0_2px_2px_rgba(255,255,255,0.3)] border border-[#4D823E]"></div>

                  {/* --- Under-rim Supports --- */}
                  <div className="absolute top-[34px] w-[96%] flex justify-evenly z-20 px-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="w-1.5 h-6 bg-gradient-to-b from-[#4D823E] to-transparent" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}></div>
                    ))}
                  </div>

                  {/* --- Tapered Body --- */}
                  <div className="absolute top-[32px] w-[96%] h-[200px] z-10 drop-shadow-[10px_15px_15px_rgba(0,0,0,0.5)]">
                    <div 
                      className="w-full h-full bg-gradient-to-br from-[#80C070] via-[#61A051] to-[#3A6B2D] border border-[#4D823E]"
                      style={{ 
                        clipPath: 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)',
                        borderRadius: '0 0 10px 10px'
                      }}
                    >
                      {/* Body Highlight */}
                      <div className="absolute top-0 left-2 w-12 h-full bg-gradient-to-r from-white/20 to-transparent skew-x-[-4deg]"></div>
                      
                      {/* Recycle Logo */}
                      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 text-white/95 drop-shadow-md">
                        <Recycle className="w-16 h-16" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>

                  {/* --- Wheel (Right/Back) --- */}
                  <div className="absolute bottom-3 -right-4 w-14 h-14 bg-[#5A994B] rounded-full z-20 border-4 border-[#3D6E31] shadow-[5px_5px_10px_rgba(0,0,0,0.6),inset_2px_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center transform rotate-12">
                    {/* Wheel Inner Details */}
                    <div className="w-8 h-8 rounded-full border-2 border-[#488339] flex items-center justify-center">
                      <div className="w-3 h-3 bg-[#3D6E31] rounded-full shadow-inner"></div>
                    </div>
                  </div>
                  
                </div>
              </div>

            {/* Floating Card 1 */}
            <div ref={(el) => { heroFloatingCardsRef.current[0] = el; }} className="absolute top-[20%] right-[-5%] z-30 bg-white text-[#051F10] rounded-2xl p-4 flex items-center gap-4 shadow-xl animate-[bounce_4s_infinite]">
               <div className="w-12 h-12 rounded-full bg-[#E8F8E3] flex items-center justify-center text-[#2B8B3F]">
                 <Recycle className="w-6 h-6" />
               </div>
               <div>
                 <div className="font-bold text-xl">10,000+</div>
                 <div className="text-sm text-gray-500">Kg Recycled</div>
               </div>
            </div>

            {/* Floating Card 2 */}
            <div ref={(el) => { heroFloatingCardsRef.current[1] = el; }} className="absolute top-[45%] right-[-10%] z-30 bg-white text-[#051F10] rounded-2xl p-4 flex items-center gap-4 shadow-xl animate-[bounce_5s_infinite]">
               <div className="w-12 h-12 rounded-full bg-[#E8F8E3] flex items-center justify-center text-[#2B8B3F]">
                 <Leaf className="w-6 h-6" />
               </div>
               <div>
                 <div className="font-bold text-xl">2.5 Ton</div>
                 <div className="text-sm text-gray-500">CO₂ Saved</div>
               </div>
            </div>

            {/* Phone Mockup */}
            <div className="relative z-20 w-[280px] h-[580px] bg-gradient-to-br from-[#4a4a5a] via-[#1a1a2e] to-[#0a0a0a] rounded-[44px] p-[2px] shadow-[30px_20px_60px_rgba(0,0,0,0.8),inset_2px_2px_4px_rgba(255,255,255,0.2)] transform perspective-[1000px] rotate-y-[-4deg] rotate-x-[2deg]">
              
              {/* Truck beside the phone */}
              <div className="absolute top-1/2 -left-48 w-72 z-40 transform -translate-y-1/2 drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)]">
                <img src="/truck.png" alt="Ecofy Truck" className="w-full h-auto" />
              </div>

              <div className="w-full h-full bg-black rounded-[42px] p-[6px] border border-[#222] shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
                <div className="w-full h-full bg-[#081F12] rounded-[32px] overflow-hidden relative flex flex-col">
                  {/* Glass Reflection */}
                  <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-gradient-to-br from-white/10 to-transparent -rotate-45 pointer-events-none z-50"></div>
                  {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-6 bg-black rounded-b-2xl w-32 mx-auto z-50"></div>
                
                {/* Screen Content */}
                <div className="pt-10 px-5 pb-5 flex-1 flex flex-col overflow-hidden">
                  {/* App Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                       <Leaf className="w-5 h-5 text-[#A1F069]" />
                       <span className="font-bold text-white">Ecofy</span>
                    </div>
                    <CircleUserRound className="w-6 h-6 text-gray-300" />
                  </div>
                  <div className="text-sm text-gray-300 mb-1">Dashboard</div>
                  
                  {/* Chart Card */}
                  <div className="bg-[#0B2C1A] border border-[#164D2B] rounded-xl p-4 mb-4">
                    <div className="text-xs text-gray-400 mb-1">Total Waste Recycled</div>
                    <div className="text-2xl font-bold text-white mb-1">12,450 kg</div>
                    <div className="text-[10px] text-[#A1F069] mb-4">+ 18% than last month</div>
                    
                    {/* Simulated Chart */}
                    <div className="relative w-full h-16 border-b border-white/10 flex items-end justify-between px-1">
                      {[30, 45, 25, 60, 40, 75, 50, 90].map((h, i) => (
                        <div key={i} className="w-1.5 bg-[#A1F069] rounded-t-sm" style={{ height: `${h}%` }}></div>
                      ))}
                      {/* overlay line */}
                      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,70 L15,55 L30,75 L45,40 L60,60 L75,25 L90,50 L100,10" fill="none" stroke="#A1F069" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#123D24] rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2">
                      <Truck className="w-6 h-6 text-[#A1F069]" />
                      <span className="text-[10px] text-white font-medium">Pickup Request</span>
                    </div>
                    <div className="bg-[#123D24] rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2">
                      <MapPin className="w-6 h-6 text-[#A1F069]" />
                      <span className="text-[10px] text-white font-medium">Track Pickup</span>
                    </div>
                  </div>

                  {/* Impact Overview */}
                  <div className="text-xs font-semibold text-white mb-2 mt-2">Impact Overview</div>
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 rounded-full bg-[#0B2C1A] flex items-center justify-center text-[#A1F069]">
                      <Recycle className="w-5 h-5" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#0B2C1A] flex items-center justify-center text-[#A1F069]">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#0B2C1A] flex items-center justify-center text-[#A1F069]">
                      <CloudRain className="w-5 h-5" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#0B2C1A] flex items-center justify-center text-[#A1F069]">
                      <Globe2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Bottom Nav */}
                <div className="h-16 bg-[#06180E] border-t border-white/5 flex justify-between items-center px-8">
                  <div className="text-[#A1F069]"><Leaf className="w-5 h-5" /></div>
                  <div className="text-gray-500"><BarChart3 className="w-5 h-5" /></div>
                  <div className="text-gray-500"><CircleUserRound className="w-5 h-5" /></div>
                </div>
              </div>
              </div>
            </div>
            
            </div>
          </div>
        </div>
      </section>

      {/* --- FLOATING STATS BANNER --- */}
      <div ref={heroStatsRef} className="max-w-6xl mx-auto px-4 -mt-16 relative z-30 reveal-up">
        <div className="bg-[#0A2916] border border-[#164525] rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center shadow-2xl divide-y md:divide-y-0 md:divide-x divide-[#164525]">
          
          <div className="flex items-center gap-4 py-4 md:py-0 px-6 w-full md:w-1/4 justify-center md:justify-start">
            <Recycle className="w-10 h-10 text-[#A1F069]" />
            <div>
              <div className="text-white font-bold text-2xl">10,000+</div>
              <div className="text-gray-400 text-sm">Kg Waste Recycled</div>
            </div>
          </div>

          <div className="flex items-center gap-4 py-4 md:py-0 px-6 w-full md:w-1/4 justify-center md:justify-start">
            <Users className="w-10 h-10 text-[#A1F069]" />
            <div>
              <div className="text-white font-bold text-2xl">5,000+</div>
              <div className="text-gray-400 text-sm">Happy Users</div>
            </div>
          </div>

          <div className="flex items-center gap-4 py-4 md:py-0 px-6 w-full md:w-1/4 justify-center md:justify-start">
            <Building2 className="w-10 h-10 text-[#A1F069]" />
            <div>
              <div className="text-white font-bold text-2xl">50+</div>
              <div className="text-gray-400 text-sm">Cities Covered</div>
            </div>
          </div>

          <div className="flex items-center gap-4 py-4 md:py-0 px-6 w-full md:w-1/4 justify-center md:justify-start">
            <Leaf className="w-10 h-10 text-[#A1F069]" />
            <div>
              <div className="text-white font-bold text-2xl">2.5 Ton</div>
              <div className="text-gray-400 text-sm">CO₂ Saved</div>
            </div>
          </div>

        </div>
      </div>

      {/* --- BOTTOM WHITE SECTION --- */}
      <section className="bg-white w-full py-32 px-6 lg:px-16 relative overflow-hidden reveal-up">
        {/* Leaf decorations */}
        <Leaf className="absolute -left-10 top-20 text-[#E8F8E3] w-48 h-48 rotate-45 pointer-events-none" />
        <Leaf className="absolute -right-10 bottom-20 text-[#E8F8E3] w-48 h-48 -rotate-45 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h3 className="text-[#328B49] font-bold tracking-widest text-sm mb-4">WHY ECOFY?</h3>
          <h2 className="text-4xl font-extrabold text-[#051F10] mb-16">
            Everything You Need for a Cleaner Tomorrow
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform text-left flex flex-col h-full">
              <div className="w-14 h-14 rounded-full bg-[#F2FCF4] flex items-center justify-center text-[#328B49] mb-6">
                <Truck className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-xl text-[#051F10] mb-3">Smart Pickup</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Request pickups easily and get real-time updates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform text-left flex flex-col h-full">
              <div className="w-14 h-14 rounded-full bg-[#F2FCF4] flex items-center justify-center text-[#328B49] mb-6">
                <MapPin className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-xl text-[#051F10] mb-3">Track & Monitor</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Track your waste collections in real-time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform text-left flex flex-col h-full">
              <div className="w-14 h-14 rounded-full bg-[#F2FCF4] flex items-center justify-center text-[#328B49] mb-6">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-xl text-[#051F10] mb-3">Impact Dashboard</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                See the positive impact you're creating.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform text-left flex flex-col h-full">
              <div className="w-14 h-14 rounded-full bg-[#F2FCF4] flex items-center justify-center text-[#328B49] mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-xl text-[#051F10] mb-3">Community Driven</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Bridging communities and collectors for a cleaner world.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="bg-[#fcfdfc] w-full py-24 px-6 lg:px-16 relative reveal-up">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-[#328B49] font-bold tracking-widest text-sm mb-4">HOW IT WORKS</h3>
          <h2 className="text-4xl font-extrabold text-[#051F10] mb-20">
            Simple Steps, Big Impact
          </h2>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
            {/* Connecting Dashed Line (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-[#A1F069] z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-[#1A5C28] flex items-center justify-center text-[#A1F069] border-[6px] border-[#fcfdfc] shadow-xl mb-6">
                <FileText className="w-10 h-10" />
              </div>
              <div className="text-[#328B49] font-bold mb-2">01</div>
              <h4 className="font-bold text-xl text-[#051F10] mb-3">Request Pickup</h4>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">
                Schedule a pickup by selecting your location and waste type.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-[#1A5C28] flex items-center justify-center text-[#A1F069] border-[6px] border-[#fcfdfc] shadow-xl mb-6">
                <Truck className="w-10 h-10" />
              </div>
              <div className="text-[#328B49] font-bold mb-2">02</div>
              <h4 className="font-bold text-xl text-[#051F10] mb-3">We Collect</h4>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">
                Our verified collectors pick up the waste on time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-[#1A5C28] flex items-center justify-center text-[#A1F069] border-[6px] border-[#fcfdfc] shadow-xl mb-6">
                <Recycle className="w-10 h-10" />
              </div>
              <div className="text-[#328B49] font-bold mb-2">03</div>
              <h4 className="font-bold text-xl text-[#051F10] mb-3">We Recycle</h4>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">
                Waste is sorted and processed responsibly for recycling.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-[#1A5C28] flex items-center justify-center text-[#A1F069] border-[6px] border-[#fcfdfc] shadow-xl mb-6">
                <Leaf className="w-10 h-10" />
              </div>
              <div className="text-[#328B49] font-bold mb-2">04</div>
              <h4 className="font-bold text-xl text-[#051F10] mb-3">We Impact</h4>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">
                You contribute to a cleaner environment and a better future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SCROLL ANIMATION SECTION --- */}
      <ScrollAnimationSection />

      {/* --- OUR IMPACT SECTION --- */}
      <section className="bg-[#031509] w-full py-24 px-6 lg:px-16 relative overflow-hidden flex justify-center text-white reveal-up">
        {/* Background dark pattern/glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#A1F069]/5 rounded-full blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          {/* Left Text & Stats */}
          <div className="w-full lg:w-1/2 text-left">
            <h3 className="text-[#A1F069] font-bold tracking-widest text-sm mb-4">OUR IMPACT</h3>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Creating a Greener<br/>Planet <span className="text-[#A1F069]">Together</span>
            </h2>
            <p className="text-gray-400 max-w-md mb-12">
              Every action counts. Together, we're making a real difference for our planet.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <Recycle className="w-8 h-8 text-[#A1F069] mb-3" />
                <div className="font-bold text-2xl mb-1">10,000+</div>
                <div className="text-xs text-gray-400">Kg Waste Recycled</div>
              </div>
              <div>
                <Users className="w-8 h-8 text-[#A1F069] mb-3" />
                <div className="font-bold text-2xl mb-1">5,000+</div>
                <div className="text-xs text-gray-400">Active Users</div>
              </div>
              <div>
                <Building2 className="w-8 h-8 text-[#A1F069] mb-3" />
                <div className="font-bold text-2xl mb-1">50+</div>
                <div className="text-xs text-gray-400">Cities Covered</div>
              </div>
              <div>
                <Leaf className="w-8 h-8 text-[#A1F069] mb-3" />
                <div className="font-bold text-2xl mb-1">2.5 Ton</div>
                <div className="text-xs text-gray-400">CO₂ Saved</div>
              </div>
            </div>
          </div>

          {/* Right Glowing Globe CSS Art */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative h-[500px] items-center">
             <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px]">
               {/* Outer glow */}
               <div className="absolute inset-0 rounded-full border-[1px] border-[#A1F069]/30 shadow-[0_0_80px_rgba(161,240,105,0.2)]"></div>
               {/* Longitude / Latitude Rings */}
               <div className="absolute inset-2 rounded-full border border-[#A1F069]/20"></div>
               <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[50%] border border-[#A1F069]/20 rounded-[100%]"></div>
               <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[50%] border border-[#A1F069]/20 rounded-[100%]"></div>
               {/* Core glow */}
               <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle,_rgba(161,240,105,0.1)_0%,_transparent_70%)]"></div>
               {/* Continents approximation (abstract circles/shapes) */}
               <div className="absolute top-[20%] left-[30%] w-24 h-24 bg-[#A1F069]/20 blur-md rounded-full"></div>
               <div className="absolute top-[40%] right-[25%] w-32 h-20 bg-[#A1F069]/10 blur-lg rounded-[100%] rotate-45"></div>
               <div className="absolute bottom-[20%] left-[40%] w-20 h-28 bg-[#A1F069]/15 blur-md rounded-full"></div>
               {/* Decorative dots / connection points */}
               <div className="absolute top-[30%] left-[40%] w-2 h-2 bg-[#A1F069] rounded-full shadow-[0_0_10px_#A1F069]"></div>
               <div className="absolute top-[45%] right-[30%] w-2 h-2 bg-[#A1F069] rounded-full shadow-[0_0_10px_#A1F069]"></div>
               <div className="absolute bottom-[35%] left-[45%] w-2 h-2 bg-[#A1F069] rounded-full shadow-[0_0_10px_#A1F069]"></div>
               {/* Connecting line */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none">
                 <path d="M 140 105 L 202 202 L 315 157" fill="none" stroke="rgba(161,240,105,0.5)" strokeWidth="1" strokeDasharray="4 4" />
               </svg>
               {/* Leaves floating */}
               <Leaf className="absolute -top-10 left-10 w-12 h-12 text-[#A1F069] rotate-45 opacity-60 animate-[bounce_6s_infinite]" />
               <Leaf className="absolute bottom-10 -right-10 w-16 h-16 text-[#A1F069] -rotate-12 opacity-80 animate-[bounce_5s_infinite]" />
             </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="bg-[#fcfdfc] w-full py-24 px-6 lg:px-16 relative overflow-hidden reveal-up">
        {/* Leaf decorations */}
        <Leaf className="absolute top-20 -left-10 text-[#E8F8E3] w-48 h-48 rotate-[120deg] pointer-events-none" />
        <Leaf className="absolute bottom-20 -right-10 text-[#E8F8E3] w-48 h-48 -rotate-[60deg] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h3 className="text-[#328B49] font-bold tracking-widest text-sm mb-4">WHAT OUR USERS SAY</h3>
          <h2 className="text-4xl font-extrabold text-[#051F10] mb-16">
            Trusted by Communities
          </h2>

          <div className="flex items-center justify-between absolute top-1/2 left-0 right-0 -translate-y-1/2 z-0 pointer-events-none hidden md:flex">
             <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-400 pointer-events-auto cursor-pointer hover:text-[#328B49] -ml-6 border border-gray-100">
               <ChevronLeft className="w-6 h-6" />
             </div>
             <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-400 pointer-events-auto cursor-pointer hover:text-[#328B49] -mr-6 border border-gray-100">
               <ChevronRight className="w-6 h-6" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 px-4 md:px-12">
            
            {/* Review 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] text-left flex flex-col border border-gray-100 hover:-translate-y-1 transition-transform">
               <Quote className="w-10 h-10 text-[#A1F069] mb-6 fill-current opacity-50" />
               <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                 "Ecofy made waste disposal so easy and convenient. I can track pickups and see my impact!"
               </p>
               <div className="flex gap-1 text-[#FFC107] mb-6">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
               </div>
               <div>
                 <div className="font-bold text-[#051F10]">- Sanduni Perera</div>
                 <div className="text-xs text-gray-400">Colombo</div>
               </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] text-left flex flex-col border border-gray-100 hover:-translate-y-1 transition-transform">
               <Quote className="w-10 h-10 text-[#A1F069] mb-6 fill-current opacity-50" />
               <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                 "The collectors are reliable and the platform is super user-friendly. Highly recommended!"
               </p>
               <div className="flex gap-1 text-[#FFC107] mb-6">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
               </div>
               <div>
                 <div className="font-bold text-[#051F10]">- Nimal Fernando</div>
                 <div className="text-xs text-gray-400">Kandy</div>
               </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] text-left flex flex-col border border-gray-100 hover:-translate-y-1 transition-transform">
               <Quote className="w-10 h-10 text-[#A1F069] mb-6 fill-current opacity-50" />
               <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                 "Love how Ecofy brings communities together for a cleaner, greener Sri Lanka."
               </p>
               <div className="flex gap-1 text-[#FFC107] mb-6">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
               </div>
               <div>
                 <div className="font-bold text-[#051F10]">- Tharushi Silva</div>
                 <div className="text-xs text-gray-400">Galle</div>
               </div>
            </div>

          </div>
          
          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-2 mt-10">
             <div className="w-2.5 h-2.5 rounded-full bg-[#328B49]"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </section>

      {/* --- READY TO MAKE AN IMPACT BANNER --- */}
      <section className="bg-[#fcfdfc] w-full pb-24 px-6 lg:px-16 relative z-10">
         <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-[#0E351E] via-[#1A5C28] to-[#2B8B3F] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[50px]"></div>
            
            <div className="flex items-center gap-6 md:gap-10 mb-8 md:mb-0 relative z-10 w-full md:w-auto">
               <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1A5C28]/50 border-4 border-[#328B49] flex items-center justify-center shrink-0 shadow-inner">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <Leaf className="w-8 h-8 text-[#328B49]" />
                  </div>
               </div>
               <div>
                 <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to Make an Impact?</h2>
                 <p className="text-gray-300 text-sm md:text-base max-w-md">
                   Join thousands of users who are building a cleaner, greener tomorrow with Ecofy.
                 </p>
               </div>
            </div>
            
            <a href="/dashboard" className="w-full md:w-auto bg-white hover:bg-gray-50 text-[#051F10] px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 transition-transform hover:scale-105 relative z-10 shadow-lg">
              Get Started Now <ArrowRight className="w-5 h-5" />
            </a>
         </div>
      </section>
    </main>
    </SmoothScroll>
  );
}
