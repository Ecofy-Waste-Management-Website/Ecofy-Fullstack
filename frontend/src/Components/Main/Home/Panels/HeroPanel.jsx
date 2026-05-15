import React from 'react';
import { Leaf, ArrowRight, PlayCircle, Recycle, CircleUserRound, Truck, MapPin, BarChart3, Globe2, CloudRain } from 'lucide-react';

const HeroPanel = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-center gap-16 text-white">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
         <div className="absolute top-1/2 left-[60%] -translate-y-1/2 w-[600px] h-[600px] rounded-full overflow-hidden border border-[#66c45e]/10 shadow-[0_0_100px_rgba(161,240,105,0.1)]">
           <div className="absolute inset-[-50%] animate-[spin_5s_linear_infinite]" style={{ background: 'conic-gradient(from 0deg, transparent 60%, rgba(161,240,105,0.8) 100%)' }}></div>
           <div className="absolute inset-[2px] bg-[#244c21] rounded-full"></div>
         </div>
         <div className="absolute top-1/2 left-[60%] -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#66c45e]/5 blur-[120px]"></div>
         <Leaf className="absolute top-24 left-[10%] text-[#235833] w-12 h-12 -rotate-45 blur-[1px] opacity-60" />
         <Leaf className="absolute bottom-40 left-[5%] text-[#1a4125] w-24 h-24 rotate-12 blur-[2px] opacity-40" />
         <Leaf className="absolute top-32 right-[40%] text-[#66c45e] w-8 h-8 rotate-45 opacity-80" />
      </div>

      {/* Left Text Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
        <div className="flex items-center gap-2 bg-[#244c21] border border-[#164D2B] rounded-full px-4 py-1.5 mb-6">
          <Leaf className="w-4 h-4 text-[#66c45e]" />
          <span className="text-sm font-medium text-white/90">Smart Waste Management</span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6">
          Smart Waste.<br/>
          <span className="text-[#66c45e]">Smarter Future.</span>
        </h1>
        
        <p className="text-lg text-gray-300 mb-10 max-w-lg leading-relaxed">
          Ecofy is a smart, web-based platform that bridges the gap between communities and waste collectors—making pickups smarter, greener, and more accountable.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <a href="/dashboard" className="bg-[#66c45e] hover:bg-[#8ee155] text-[#051F10] px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 transition-colors">
            Open Dashboard <ArrowRight className="w-5 h-5" />
          </a>
          <a href="/blogs" className="text-white hover:text-[#66c45e] flex items-center gap-2 font-semibold px-4 py-3 border border-white/20 rounded-full transition-colors">
            <PlayCircle className="w-5 h-5" /> Read Blogs
          </a>
        </div>
      </div>

      {/* Right Visual Content (Simplified for the panel) */}
      <div className="hidden lg:flex w-full lg:w-1/2 relative justify-center lg:justify-end items-center h-[400px]">
        {/* Phone Mockup */}
        <div className="relative z-20 w-[260px] h-[520px] bg-gradient-to-br from-[#4a4a5a] via-[#1a1a2e] to-[#0a0a0a] rounded-[44px] p-[2px] shadow-[30px_20px_60px_rgba(0,0,0,0.8)]">
          <div className="w-full h-full bg-black rounded-[42px] p-[6px]">
            <div className="w-full h-full bg-[#081F12] rounded-[32px] overflow-hidden relative flex flex-col">
              <div className="pt-10 px-5 pb-5 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                     <Leaf className="w-4 h-4 text-[#66c45e]" />
                     <span className="font-bold text-xs text-white">Ecofy</span>
                  </div>
                  <CircleUserRound className="w-5 h-5 text-gray-300" />
                </div>
                <div className="bg-[#0B2C1A] border border-[#164D2B] rounded-xl p-4 mb-4">
                  <div className="text-[10px] text-gray-400">Total Recycled</div>
                  <div className="text-xl font-bold text-white">12,450 kg</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#123D24] rounded-xl p-3 flex flex-col items-center gap-1">
                    <Truck className="w-5 h-5 text-[#66c45e]" />
                    <span className="text-[8px] text-white">Pickup</span>
                  </div>
                  <div className="bg-[#123D24] rounded-xl p-3 flex flex-col items-center gap-1">
                    <MapPin className="w-5 h-5 text-[#66c45e]" />
                    <span className="text-[8px] text-white">Track</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Stats */}
        <div className="absolute top-[20%] right-[60%] z-30 bg-white text-[#051F10] rounded-2xl p-4 shadow-xl animate-bounce">
           <Recycle className="w-6 h-6 text-[#397239]" />
        </div>
      </div>
    </div>
  );
};

export default HeroPanel;
