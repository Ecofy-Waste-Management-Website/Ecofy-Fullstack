import React from 'react';

export default function Hero() {
  return (
    <main className="bg-[#f4faf6] text-[#0f1d33]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_40%),radial-gradient(circle_at_90%_15%,_rgba(15,92,189,0.12),_transparent_34%)]" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-green-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-green-700 backdrop-blur">
              Clean choices, visible impact
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-balance sm:text-5xl lg:text-7xl">
              Waste management that feels modern, transparent, and community-led.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Book pickups, follow service updates, and read the latest eco stories published by the Ecofy team.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/dashboard" className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700">
                Open Dashboard
              </a>
              <a href="/blogs" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-green-300 hover:text-green-700">
                Read Blogs
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
 