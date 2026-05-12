import React from 'react';
import { Truck, MapPin, TrendingUp, Users } from 'lucide-react';

const FeaturesPanel = () => {
  return (
    <div className="w-full text-center">
      <h3 className="text-[#66c45e] font-bold tracking-widest text-sm mb-4 uppercase">Why Ecofy?</h3>
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-16 max-w-3xl mx-auto">
        Everything You Need for a <span className="text-[#66c45e]">Cleaner Tomorrow</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Truck, title: "Smart Pickup", desc: "Request pickups easily and get real-time updates." },
          { icon: MapPin, title: "Track & Monitor", desc: "Track your waste collections in real-time." },
          { icon: TrendingUp, title: "Impact Dashboard", desc: "See the positive impact you're creating." },
          { icon: Users, title: "Community Driven", desc: "Bridging communities and collectors." }
        ].map((feature, i) => (
          <div key={i} className="bg-[#244c21]/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl hover:-translate-y-2 transition-transform group">
            <div className="w-16 h-16 rounded-full bg-[#164D2B] flex items-center justify-center text-[#66c45e] mb-6 mx-auto group-hover:scale-110 transition-transform">
              <feature.icon className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-xl text-white mb-3">{feature.title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesPanel;
