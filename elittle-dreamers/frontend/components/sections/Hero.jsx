export default function Hero() {
  return (
    <section className="bg-sky-blue px-8 pt-6">
      <div className="relative rounded-2xl overflow-hidden bg-hero-dark" style={{ height: '340px' }}>
        
        {/* IMAGE SLOT: Replace with <Image src fill objectFit="cover"> when hero photo is ready */}
        <div className="img-slot absolute right-0 top-0 bottom-0 w-[55%]" data-label="[ HERO IMAGE ]" />

        {/* GLASS CARD — bottom left overlay */}
        <div className="glass-hero absolute bottom-8 left-8 rounded-2xl p-7 max-w-[400px]">
          
          {/* Label pill */}
          <span className="inline-block text-[9px] uppercase tracking-[2px] text-white/75 bg-white/20 px-3 py-1 rounded-full mb-3">
            NURTURING EVERY POTENTIAL
          </span>
          
          {/* H1 */}
          <h1 className="text-[26px] font-bold text-white leading-tight">
            Where Little Dreamers Play, Learn, and Grow
          </h1>
          
          {/* Subtext */}
          <p className="text-xs text-white/80 mt-2 leading-relaxed">
            A boutique early learning sanctuary designed to ignite curiosity
            and foster emotional intelligence in every child.
          </p>
          
          {/* Buttons */}
          <div className="flex items-center gap-3 mt-5">
            <button className="bg-teal text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-navy transition-all duration-300">
              Enroll Now →
            </button>
            <button className="border border-white/60 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-white/10 transition-all duration-300">
              View Programs
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
