import Hero from '@/components/sections/Hero'
import Excellence from '@/components/sections/Excellence'
import ImageRow from '@/components/sections/ImageRow'
import About from '@/components/sections/About'
import Services from '@/components/sections/Services'
import Branches from '@/components/sections/Branches'
import SessionTimes from '@/components/sections/SessionTimes'

export default function Home() {
  return (
    <main>
      <Hero />
      <Excellence />
      <ImageRow />
      <About />
      <Services />
      <Branches />
      <SessionTimes />
    </main>
  )
}
