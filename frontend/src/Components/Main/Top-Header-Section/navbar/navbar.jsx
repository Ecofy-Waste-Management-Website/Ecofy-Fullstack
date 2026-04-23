import React from 'react';
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";

export default function Navbar() {
  return (
    <div className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8 flex justify-center pb-4">
      <nav className="w-full max-w-5xl relative bg-green-50/70 backdrop-blur-md border border-green-200/60 rounded-full shadow-sm">
        <div className="flex justify-between h-16 items-center px-6 lg:px-8">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold items-center text-green-600 tracking-tight cursor-pointer" onClick={() => window.location.href='/' }>Ecofy</span>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <a href="/" className="text-gray-700 hover:bg-green-600 hover:text-white px-5 py-2 rounded-full font-medium transition-all duration-300">Home</a>
            <a href="/services" className="text-gray-700 hover:bg-green-600 hover:text-white px-5 py-2 rounded-full font-medium transition-all duration-300">Services</a>
            <a href="/about" className="text-gray-700 hover:bg-green-600 hover:text-white px-5 py-2 rounded-full font-medium transition-all duration-300">About</a>
            <a href="/contact" className="text-gray-700 hover:bg-green-600 hover:text-white px-5 py-2 rounded-full font-medium transition-all duration-300">Contact</a>
          </div>

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

          <div className="md:hidden flex items-center">
            <SignedIn>
               <div className="mr-3">
                 <UserButton />
               </div>
            </SignedIn>
            <button id="mobile-menu-button" className="text-gray-700 hover:text-green-600 focus:outline-none transition">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div id="mobile-menu" className="hidden md:hidden absolute top-[calc(100%+0.5rem)] left-0 w-full bg-white/90 backdrop-blur-xl border border-gray-200 p-4 space-y-2 rounded-3xl shadow-xl z-50">
          <a href="/" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all font-medium">Home</a>
          <a href="/services" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all font-medium">Services</a>
          <a href="/about" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all font-medium">About</a>
          <a href="/contact" className="block px-4 py-3 bg-green-600 text-white rounded-xl transition-all font-medium text-center shadow-sm">Contact</a>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="block w-full text-center px-4 py-3 bg-green-600 hover:bg-green-700 transition text-white rounded-xl mt-3 font-medium shadow-sm">Sign In</button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </div>
  );
}
