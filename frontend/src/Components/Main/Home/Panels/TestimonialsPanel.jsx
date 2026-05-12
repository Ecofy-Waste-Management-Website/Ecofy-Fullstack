import React from 'react';
import { Quote, Star } from 'lucide-react';

const TestimonialsPanel = () => {
  return (
    <div className="w-full text-center">
      <h3 className="text-[#66c45e] font-bold tracking-widest text-sm mb-4 uppercase">Testimonials</h3>
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-16">
        Trusted by <span className="text-[#66c45e]">Communities</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: "Sanduni Perera", loc: "Colombo", text: "Ecofy made waste disposal so easy. I can track pickups and see my impact!" },
          { name: "Nimal Fernando", loc: "Kandy", text: "The collectors are reliable and the platform is super user-friendly." },
          { name: "Tharushi Silva", loc: "Galle", text: "Love how Ecofy brings communities together for a cleaner Sri Lanka." }
        ].map((rev, i) => (
          <div key={i} className="bg-[#397239]/20 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-left shadow-xl flex flex-col hover:bg-[#397239]/30 transition-colors">
            <Quote className="w-10 h-10 text-[#66c45e] mb-6 opacity-50" />
            <p className="text-gray-300 text-lg italic mb-8 flex-1">"{rev.text}"</p>
            <div className="flex gap-1 text-[#FFC107] mb-4">
              {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
            </div>
            <div>
              <div className="font-bold text-white text-xl">{rev.name}</div>
              <div className="text-sm text-gray-500 uppercase tracking-tighter">{rev.loc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsPanel;
