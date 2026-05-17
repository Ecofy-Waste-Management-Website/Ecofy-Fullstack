import React, { useRef } from 'react';
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Navbar() {
  const navRef = useRef(null);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  });

  return (
    <header className="fixed top-6 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6 rounded-full border border-white/20 bg-white/10 backdrop-blur-[50px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span 
              className="text-xl font-bold items-center text-white tracking-tight cursor-pointer hover:text-[#66c45e] transition-colors duration-300" 
              onClick={() => window.location.href='/' }
            >
              Ecofy
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            <a href="/" className="text-white/70 hover:text-white px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/10 rounded-full">Home</a>
            <a href="/blogs" className="text-white/70 hover:text-white px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/10 rounded-full">Blogs</a>
            <a href="/services" className="text-white/70 hover:text-white px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/10 rounded-full">Services</a>
            <a href="/about" className="text-white/70 hover:text-white px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/10 rounded-full">About</a>
            <a href="/contact" className="text-white/70 hover:text-white px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/10 rounded-full">Contact</a>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedIn>
              <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-9 h-9 border-2 border-white/20' } }} />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-white text-black px-5 py-1.5 rounded-full text-sm font-bold hover:bg-[#66c45e] transition-all duration-300 shadow-lg active:scale-95">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <SignedIn>
               <div className="mr-3">
                 <UserButton />
               </div>
            </SignedIn>
            <button id="mobile-menu-button" className="text-white hover:text-[#66c45e] focus:outline-none transition-colors duration-300">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
      </div>
    </nav>
  </header>
  );
}