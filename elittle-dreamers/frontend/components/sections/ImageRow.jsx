export default function ImageRow() {
  return (
    <section className="bg-sky-blue mt-8">
      <div className="flex w-full">
        {/* IMAGE SLOT: Replace each div with <Image> when photos are ready */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            data-label="[ IMAGE ]"
            className={`img-slot flex-1 ${
              i === 0 ? 'rounded-tl-2xl rounded-bl-2xl' :
              i === 3 ? 'rounded-tr-2xl rounded-br-2xl' : ''
            }`}
            style={{ height: '200px' }}
          />
        ))}
      </div>
    </section>
  )
}
