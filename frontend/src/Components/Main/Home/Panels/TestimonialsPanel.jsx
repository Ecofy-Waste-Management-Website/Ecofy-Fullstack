import React from 'react';
import { Quote, Star } from 'lucide-react';

const TestimonialsPanel = () => {
  return (
    <div className="w-full text-center">
      <h3 className="text-[#D6E9CA] font-black tracking-widest text-sm mb-4 uppercase">Testimonials</h3>
      <h2 className="text-4xl md:text-5xl font-black text-white mb-16">
        Trusted by <span className="text-[#D6E9CA]">Communities</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: "Sanduni Perera", loc: "Colombo", text: "Ecofy made waste disposal so easy. I can track pickups and see my impact!" },
          { name: "Nimal Fernando", loc: "Kandy", text: "The collectors are reliable and the platform is super user-friendly." },
          { name: "Tharushi Silva", loc: "Galle", text: "Love how Ecofy brings communities together for a cleaner Sri Lanka." }
        ].map((rev, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-[40px] rounded-3xl p-8 border border-white/10 text-left shadow-xl flex flex-col hover:bg-white/10 transition-all hover:-translate-y-1">
            <Quote className="w-10 h-10 text-[#D6E9CA] mb-6 opacity-80" />
            <p className="text-white/80 text-lg font-medium italic mb-8 flex-1">"{rev.text}"</p>
            <div className="flex gap-1 text-[#FFC107] mb-4">
              {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
            </div>
            <div>
              <div className="font-black text-white text-xl">{rev.name}</div>
              <div className="text-sm text-white/40 font-bold uppercase tracking-widest">{rev.loc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsPanel;
