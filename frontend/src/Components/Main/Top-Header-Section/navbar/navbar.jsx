import React, { useState, useEffect, useRef } from 'react';
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Navbar() {
  const [isLightBg, setIsLightBg] = useState(false);
  const navRef = useRef(null);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  });

  useEffect(() => {
    const handleScroll = () => {
      // Bypassing navbar container, check the background of the element directly behind it.
      // Top-6 translates to 24px, so center of navbar is around 56px to 64px from the top.
      const checkY = 60;

      // Select all potential background section/container elements
      const elements = document.querySelectorAll('section, main > div, header + main > div, #root > div');
      let currentBgIsLight = false;

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        // If this element covers the vertical position of the navbar
        if (rect.top <= checkY && rect.bottom >= checkY) {
          const classes = el.className || '';

          // Fast check for known explicit tailwind/css background classes
          if (
            classes.includes('bg-[#D6E9CA]') ||
            classes.includes('bg-white') ||
            classes.includes('bg-gray-') ||
            classes.includes('bg-slate-100')
          ) {
            currentBgIsLight = true;
            break;
          }

          // Robust fallback: inspect computed background color of the element
          const computedStyle = window.getComputedStyle(el);
          const bgCol = computedStyle.backgroundColor;
          if (bgCol) {
            const rgb = bgCol.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
              const r = parseInt(rgb[0], 10);
              const g = parseInt(rgb[1], 10);
              const b = parseInt(rgb[2], 10);
              // Calculate relative luminance / brightness
              const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
              if (brightness > 180) { // bright/light color
                currentBgIsLight = true;
                break;
              }
            }
          }
        }
      }

      setIsLightBg(currentBgIsLight);
    };

    // Run on initial load, scroll events, and viewport resizing
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Also re-run after a small delay in case fonts or dynamic layouts finish rendering
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Theme styles based on dynamic background detection - with transition support
  const textPrimary = isLightBg
    ? 'text-[#244c21] hover:text-[#397234]'
    : 'text-white hover:text-[#66c45e]';

  const linkClass = isLightBg
    ? 'text-[#244c21]/70 hover:text-[#244c21] hover:bg-[#244c21]/10'
    : 'text-white/70 hover:text-white hover:bg-white/10';

  const signInBtnClass = isLightBg
    ? 'bg-[#244c21] text-white hover:bg-[#397234]'
    : 'bg-white text-black hover:bg-[#66c45e]';

  return (
    <header ref={navRef} className="fixed top-6 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6 rounded-full border border-white/20 bg-white/10 backdrop-blur-[50px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span
              className={`text-xl font-bold items-center tracking-tight cursor-pointer transition-colors duration-500 ease-in-out ${textPrimary}`}
              onClick={() => window.location.href='/' }
            >
              Ecofy
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            <a href="/" className={`px-4 py-2 text-sm font-medium transition-all duration-500 ease-in-out rounded-full ${linkClass}`}>Home</a>
            <a href="/blogs" className={`px-4 py-2 text-sm font-medium transition-all duration-500 ease-in-out rounded-full ${linkClass}`}>Blogs</a>
            <a href="/services" className={`px-4 py-2 text-sm font-medium transition-all duration-500 ease-in-out rounded-full ${linkClass}`}>Services</a>
            <a href="/about" className={`px-4 py-2 text-sm font-medium transition-all duration-500 ease-in-out rounded-full ${linkClass}`}>About</a>
            <a href="/contact" className={`px-4 py-2 text-sm font-medium transition-all duration-500 ease-in-out rounded-full ${linkClass}`}>Contact</a>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedIn>
              <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-9 h-9 border-2 border-white/20' } }} />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all duration-500 ease-in-out shadow-lg active:scale-95 ${signInBtnClass}`}>
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
            <button id="mobile-menu-button" className={`focus:outline-none transition-colors duration-500 ease-in-out ${textPrimary}`}>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
      </nav>
    </header>
  );
}