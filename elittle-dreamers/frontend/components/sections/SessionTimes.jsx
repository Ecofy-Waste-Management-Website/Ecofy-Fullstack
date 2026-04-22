export default function SessionTimes() {
  return (
    <section className="bg-sky-blue px-8 py-14 text-center">
      <span className="inline-block bg-steel-blue text-white text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-full mb-4">
        SESSION TIMES
      </span>
      <p className="text-sm text-navy italic mb-6">
        We provide full day care
      </p>
      <div className="flex justify-center items-center gap-3">
        <div className="bg-white text-navy font-bold text-lg px-10 py-3.5 rounded-full shadow-md">
          7:00am
        </div>
        <div className="bg-teal text-white font-bold text-lg px-10 py-3.5 rounded-full">
          8:00pm
        </div>
      </div>
    </section>
  )
}
