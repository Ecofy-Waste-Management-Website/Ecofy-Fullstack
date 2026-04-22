'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Branches', path: '/branches' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Parent Info', path: '/parent-info' }
  ]

  return (
    <header className="glass-nav sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between h-14 px-10">
        
        {/* LEFT — Logo */}
        <Link href="/">
          <span className="font-bold text-lg text-navy">
            Elittle Dreamers
          </span>
        </Link>

        {/* CENTER — Nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.path} className={`text-sm font-medium text-navy hover:text-teal transition-colors duration-200 ${link.path === '/' ? 'underline decoration-navy underline-offset-4' : ''}`}>
              {link.name}
            </Link>
          ))}
        </nav>

        {/* RIGHT */}
        <div className="hidden md:flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <Link href="/parent-info">
            <button className="ml-4 bg-teal text-white text-xs font-semibold px-5 py-2 rounded-full hover:bg-navy transition-colors duration-300">
              Book a Visit
            </button>
          </Link>
        </div>

        {/* MOBILE hamburger */}
        <button className="md:hidden text-navy" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* MOBILE Dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute glass-nav top-14 left-0 right-0 flex flex-col py-4 gap-4 px-10">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.path} className="text-sm font-medium text-navy block w-full" onClick={() => setMenuOpen(false)}>
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-navy/10 flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <Link href="/parent-info" onClick={() => setMenuOpen(false)}>
              <button className="bg-teal text-white text-xs font-semibold px-5 py-2 rounded-full">
                Book a Visit
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
