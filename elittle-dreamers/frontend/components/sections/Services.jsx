export default function Services() {
  const services = [
    { title: 'SECURE\nENVIRONMENT' },
    { title: 'CHILD\nCARE' },
    { title: 'FUN\nACTIVITIES' }
  ]

  return (
    <section className="bg-sky-blue px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service, idx) => (
          <div key={idx} className="relative rounded-2xl overflow-hidden" style={{ height: '240px' }}>
            {/* IMAGE SLOT: Replace with <Image fill objectFit="cover"> when service photo is ready */}
            <div className="img-slot absolute inset-0 w-full h-full" data-label="[ IMAGE ]" />
            
            {/* Gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(to top, rgba(27,58,75,0.85), transparent)' }} />
            
            {/* Title */}
            <div className="absolute bottom-4 w-full text-center text-xs font-bold text-white uppercase tracking-widest leading-tight px-2 whitespace-pre-line">
              {service.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
