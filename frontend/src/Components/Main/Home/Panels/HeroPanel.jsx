import React from 'react';
import { Leaf, ArrowRight, PlayCircle, Truck, TrendingUp } from 'lucide-react';

const HeroPanel = () => {
  return (
    <div className="w-full relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* 1. Layered Background & Decorative Elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 bg-[#040D07]">
        {/* Soft radial glow at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#184523] via-[#040D07] to-transparent blur-3xl opacity-80"></div>
        
        {/* Floating blurred green shapes */}
        <div className="absolute -top-32 -left-20 w-[500px] h-[500px] bg-[#66c45e]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-10 -right-20 w-[600px] h-[600px] bg-[#244c21]/30 rounded-full blur-[150px] animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-20 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8 z-10">
        
        {/* Left Side: Typography & CTAs */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
          
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-8 shadow-2xl hover:bg-white/[0.06] transition-colors duration-300 cursor-default group">
            <span className="w-2 h-2 rounded-full bg-[#66c45e] shadow-[0_0_10px_#66c45e] animate-pulse"></span>
            <span className="text-sm font-semibold tracking-wide text-gray-300 group-hover:text-white transition-colors">
              Smart Waste Management Platform
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5rem] font-black leading-[1.1] mb-6 tracking-tight text-white animate-fade-in-up">
            Smart Waste.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#66c45e] to-[#a3e69f]">
              Smarter Future.
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-300/80 mb-10 max-w-xl leading-relaxed font-medium">
            Ecofy is a smart, web-based platform that bridges the gap between communities and waste collectors—making pickups smarter, greener, and more accountable.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <a 
              href="/dashboard" 
              className="w-full sm:w-auto bg-gradient-to-r from-[#4ca545] to-[#66c45e] hover:from-[#58b750] hover:to-[#78d66e] text-[#041208] px-8 py-4 rounded-full font-extrabold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_10px_30px_rgba(102,196,94,0.2)] hover:shadow-[0_15px_40px_rgba(102,196,94,0.4)] hover:-translate-y-1 active:scale-95"
            >
              Open Dashboard <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="/blogs" 
              className="w-full sm:w-auto text-white hover:text-[#66c45e] flex items-center justify-center gap-3 font-bold text-lg px-8 py-4 border border-white/10 rounded-full transition-all duration-300 bg-white/5 hover:bg-white/10 backdrop-blur-md shadow-xl hover:-translate-y-1 active:scale-95"
            >
              <PlayCircle className="w-5 h-5" /> Read Blogs
            </a>
          </div>
        </div>

        {/* Right Side: HTML/CSS Product Mockup (Hidden on mobile for better focus) */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10 hidden md:block mt-10 lg:mt-0">
          <div className="relative w-full aspect-square flex items-center justify-center">
            
            {/* Core Glow behind UI */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-[#184523] to-[#66c45e] rounded-full blur-[100px] opacity-20 -z-10 animate-pulse"></div>

            {/* Central Dashboard Card */}
            <div className="absolute z-20 w-[90%] max-w-md bg-[#0a1710]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 hover:-translate-y-3 group cursor-default">
              
              {/* Card Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#66c45e] to-[#244c21] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-lg leading-tight">Eco Dashboard</h3>
                    <p className="text-sm text-gray-400 font-medium">Live Statistics</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-[#66c45e]/10 border border-[#66c45e]/20 text-[#66c45e] text-xs font-bold rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#66c45e] animate-pulse"></span>
                  Live
                </div>
              </div>
              
              {/* Bar Chart Mockup */}
              <div className="w-full h-36 flex items-end justify-between gap-2 mb-8">
                {[45, 75, 55, 95, 65, 85, 100].map((height, i) => (
                  <div key={i} className="w-full bg-[#184523] rounded-t-md relative hover:bg-[#66c45e] transition-colors duration-300 flex-1" style={{ height: `${height}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#040D07] border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                      {height}0 kg
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats Footer */}
              <div className="flex justify-between items-center border-t border-white/10 pt-5">
                <div>
                  <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Total Recycled</p>
                  <p className="font-black text-2xl text-white tracking-tight">2,450 <span className="text-sm font-bold text-[#66c45e]">kg</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Carbon Saved</p>
                  <p className="font-black text-2xl text-white tracking-tight">1.2 <span className="text-sm font-bold text-[#66c45e]">tons</span></p>
                </div>
              </div>
            </div>

            {/* Floating Mini Card 1: Active Pickup */}
            <div 
              className="absolute -left-8 top-16 z-30 bg-[#0a1710]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_15px_30px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              style={{ animation: 'float 6s ease-in-out infinite' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#184523] border border-[#66c45e]/20 flex items-center justify-center shadow-inner">
                  <Truck className="w-5 h-5 text-[#66c45e]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-0.5 uppercase tracking-wide">Active Pickup</p>
                  <p className="text-sm font-black text-white">Driver in 15 mins</p>
                </div>
              </div>
            </div>

            {/* Floating Mini Card 2: Impact Score */}
            <div 
              className="absolute -right-6 bottom-20 z-30 bg-[#0a1710]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_15px_30px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              style={{ animation: 'float 7s ease-in-out infinite reverse' }}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="20" className="stroke-[#184523]" strokeWidth="4" fill="none" />
                    <circle cx="24" cy="24" r="20" className="stroke-[#66c45e]" strokeWidth="4" fill="none" strokeDasharray="125" strokeDashoffset="15" strokeLinecap="round" />
                  </svg>
                  <TrendingUp className="absolute w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-0.5 uppercase tracking-wide">Eco Score</p>
                  <p className="text-sm font-black text-[#66c45e]">Top 5% Region</p>
                </div>
              </div>
            </div>

            {/* Inline CSS for Float Animation since we can't edit tailwind config */}
            <style>{`
              @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
                100% { transform: translateY(0px); }
              }
              .animate-fade-in-up {
                animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPanel;
