import React, { useRef } from 'react';
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Navbar() {
  const navRef = useRef(null);
  const landingPath = '/landing';

  // Keep the smooth entrance animation
  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  });

  // Static Black Theme for a Solid White Navbar
  const textPrimary = 'text-black hover:text-gray-700';
  const linkClass = 'text-black/70 hover:text-black hover:bg-black/10';
  const signInBtnClass = 'bg-black text-white hover:bg-gray-800';

  return (
    <header ref={navRef} className="fixed top-6 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8">
      
      {/* UPDATED: Solid bg-white, removed backdrop-blur, changed border to gray */}
      <nav className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-6 rounded-full border border-gray-200 bg-white shadow-lg">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span 
              className={`text-xl font-bold items-center tracking-tight cursor-pointer transition-colors duration-500 ease-in-out ${textPrimary}`} 
              onClick={() => window.location.href = landingPath}
            >
              Ecofy
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            <a href={landingPath} className={`px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-full ${linkClass}`}>Home</a>
            <a href="/blogs" className={`px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-full ${linkClass}`}>Blogs</a>
            <a href="/services" className={`px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-full ${linkClass}`}>Services</a>
            <a href="/about" className={`px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-full ${linkClass}`}>About</a>
            <a href="/contact" className={`px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-full ${linkClass}`}>Contact</a>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedIn>
              {/* Added a subtle border to the avatar so it pops against the white background */}
              <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-9 h-9 border border-gray-300' } }} />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ease-in-out shadow-md active:scale-95 ${signInBtnClass}`}>
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
            <button id="mobile-menu-button" className={`focus:outline-none transition-colors duration-300 ease-in-out ${textPrimary}`}>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
      </nav>
    </header>
  );
}