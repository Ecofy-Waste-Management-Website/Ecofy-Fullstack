import React from 'react';
import { FileText, Truck, Recycle, Leaf } from 'lucide-react';

const StepsPanel = () => {
  return (
    <div className="w-full text-center">
      <h3 className="text-[#66c45e] font-bold tracking-widest text-sm mb-4 uppercase">How It Works</h3>
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-20">
        Simple Steps, <span className="text-[#66c45e]">Big Impact</span>
      </h2>

      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-[#66c45e]/30 -z-10"></div>

        {[
          { icon: FileText, step: "01", title: "Request Pickup", desc: "Schedule a pickup by selecting your location." },
          { icon: Truck, step: "02", title: "We Collect", desc: "Our verified collectors pick up on time." },
          { icon: Recycle, step: "03", title: "We Recycle", desc: "Waste is sorted and processed responsibly." },
          { icon: Leaf, step: "04", title: "We Impact", desc: "You contribute to a greener future." }
        ].map((step, i) => (
          <div key={i} className="flex flex-col items-center group">
            <div className="w-24 h-24 rounded-full bg-[#397239] flex items-center justify-center text-[#66c45e] border-4 border-[#244c21] shadow-2xl mb-6 group-hover:scale-110 transition-transform">
              <step.icon className="w-10 h-10" />
            </div>
            <div className="text-[#66c45e] font-bold mb-2">{step.step}</div>
            <h4 className="font-bold text-xl text-white mb-3">{step.title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[200px]">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsPanel;
