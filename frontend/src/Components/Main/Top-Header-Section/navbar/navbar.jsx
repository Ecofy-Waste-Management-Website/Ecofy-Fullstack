import React from 'react';
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span 
              className="text-2xl font-bold items-center text-white tracking-tight cursor-pointer hover:text-green-400 transition-colors duration-300" 
              onClick={() => window.location.href='/' }
            >
              Ecofy
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-2">
            <a href="/" className="text-white/80 hover:text-white px-5 py-2 font-medium transition-colors duration-300">Home</a>
            <a href="/blogs" className="text-white/80 hover:text-white px-5 py-2 font-medium transition-colors duration-300">Blogs</a>
            <a href="/services" className="text-white/80 hover:text-white px-5 py-2 font-medium transition-colors duration-300">Services</a>
            <a href="/about" className="text-white/80 hover:text-white px-5 py-2 font-medium transition-colors duration-300">About</a>
            <a href="/contact" className="text-white/80 hover:text-white px-5 py-2 font-medium transition-colors duration-300">Contact</a>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-green-700 transition duration-300 shadow-sm">
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
            <button id="mobile-menu-button" className="text-white hover:text-green-400 focus:outline-none transition-colors duration-300">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

        {/* Mobile Menu Dropdown */}
        <div id="mobile-menu" className="hidden md:hidden absolute top-full left-0 w-full bg-transparent px-4 py-4 space-y-2">
          <a href="/" className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium">Home</a>
          <a href="/blogs" className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium">Blogs</a>
          <a href="/services" className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium">Services</a>
          <a href="/about" className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium">About</a>
          <a href="/contact" className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium">Contact</a>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="block w-full text-center px-4 py-3 bg-green-600 hover:bg-green-700 transition text-white rounded-xl mt-3 font-medium shadow-sm">Sign In</button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}