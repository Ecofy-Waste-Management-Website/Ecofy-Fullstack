import React from 'react';
import { Recycle, Users, Building2, Leaf } from 'lucide-react';

const ImpactPanel = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-center gap-12 text-white">
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h3 className="text-[#66c45e] font-bold tracking-widest text-xs mb-3 uppercase">Our Impact</h3>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
          Creating a Greener<br/>Planet <span className="text-[#66c45e]">Together</span>
        </h2>
        <p className="text-gray-400 max-w-md mx-auto lg:mx-0 mb-8 text-base">
          Every action counts. Together, we're making a real difference for our planet's future.
        </p>

        <div className="grid grid-cols-2 gap-6">
          {[
            { icon: Recycle, val: "10k+", label: "Kg Recycled" },
            { icon: Users, val: "5k+", label: "Users" },
            { icon: Building2, val: "50+", label: "Cities" },
            { icon: Leaf, val: "2.5T", label: "CO₂ Saved" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center lg:items-start">
              <stat.icon className="w-6 h-6 text-[#66c45e] mb-2" />
              <div className="font-bold text-2xl mb-0.5">{stat.val}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:flex w-full lg:w-1/2 justify-center relative h-[300px]">
         {/* Decorative Globe Art */}
         <div className="relative w-[300px] h-[300px]">
           <div className="absolute inset-0 rounded-full border border-[#66c45e]/30 shadow-[0_0_60px_rgba(161,240,105,0.15)]"></div>
           <div className="absolute inset-4 rounded-full border border-[#66c45e]/10 animate-[spin_20s_linear_infinite]"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-br from-[#66c45e]/20 to-transparent rounded-full blur-3xl"></div>
           <Leaf className="absolute -top-6 left-6 w-12 h-12 text-[#66c45e] opacity-40 animate-bounce" />
           <Leaf className="absolute bottom-6 -right-6 w-14 h-14 text-[#66c45e] opacity-20 animate-bounce" style={{ animationDelay: '1s' }} />
         </div>
      </div>
    </div>
  );
};

export default ImpactPanel;
