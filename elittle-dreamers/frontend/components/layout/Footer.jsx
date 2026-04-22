'use client'
import { useState } from 'react'
import { FaTiktok, FaGlobe, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState('idle') // 'idle' | 'loading' | 'success'

  return (
    <footer className="bg-footer-light px-10 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Col 1 — Brand */}
        <div>
          <p className="font-bold text-[15px] text-navy">Elittle Dreamers</p>
          <p className="text-xs text-gray-500 mt-2.5 leading-relaxed max-w-[180px]">
            Dedicated to providing the most serene and effective early learning
            experience for the next generation of global citizens.
          </p>
        </div>

        {/* Col 2 — Programs */}
        <div>
          <h4 className="uppercase tracking-widest text-[11px] font-bold text-navy mb-3">Programs</h4>
          <nav>
            <a href="#" className="text-xs text-gray-500 hover:text-navy transition-colors leading-7 block">Toddler Program</a>
            <a href="#" className="text-xs text-gray-500 hover:text-navy transition-colors leading-7 block">Preschool</a>
            <a href="#" className="text-xs text-gray-500 hover:text-navy transition-colors leading-7 block">Nursery</a>
            <a href="#" className="text-xs text-gray-500 hover:text-navy transition-colors leading-7 block">After School</a>
          </nav>
        </div>

        {/* Col 3 — Quick Links */}
        <div>
          <h4 className="uppercase tracking-widest text-[11px] font-bold text-navy mb-3">QUICK LINKS</h4>
          <nav>
            <a href="#" className="text-xs text-gray-500 hover:text-navy transition-colors leading-7 block">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-navy transition-colors leading-7 block">Terms of Service</a>
            <a href="#" className="text-xs text-gray-500 hover:text-navy transition-colors leading-7 block">Careers</a>
            <a href="#" className="text-xs text-gray-500 hover:text-navy transition-colors leading-7 block">Safety Protocols</a>
          </nav>
        </div>

        {/* Col 4 — Newsletter */}
        <div>
          <h4 className="uppercase tracking-widest text-[11px] font-bold text-navy mb-3">NEWSLETTER</h4>
          <p className="text-xs text-gray-500 mb-3">Stay updated with our events.</p>
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-teal transition-colors mt-2"
          />

          <button
            onClick={async () => {
              if (!email) return
              setSubStatus('loading')
              // TODO: wire to newsletter API route
              setTimeout(() => setSubStatus('success'), 1000)
            }}
            className="w-full mt-2 bg-navy text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-teal transition-colors duration-300"
          >
            {subStatus === 'loading' ? 'Subscribing...' :
             subStatus === 'success' ? 'Subscribed! ✓' : 'Subscribe'}
          </button>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between items-center">
        <p className="text-[11px] text-gray-400">
          © 2026 Elittle Dreamers. All rights reserved.
        </p>
        <div className="flex gap-4">
          <FaTiktok className="text-gray-400 hover:text-navy transition-colors cursor-pointer text-sm" />
          <FaGlobe className="text-gray-400 hover:text-navy transition-colors cursor-pointer text-sm" />
          <FaInstagram className="text-gray-400 hover:text-navy transition-colors cursor-pointer text-sm" />
        </div>
      </div>
    </footer>
  )
}
