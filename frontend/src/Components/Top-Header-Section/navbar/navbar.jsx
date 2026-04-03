import React from 'react';
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-green-600">Ecofy</span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a href="/" className="text-gray-700 hover:bg-green-600 hover:text-white px-4 py-2 rounded-md font-medium transition-all duration-200">Home</a>
            <a href="/services" className="text-gray-700 hover:bg-green-600 hover:text-white px-4 py-2 rounded-md font-medium transition-all duration-200">Services</a>
            <a href="/about" className="text-gray-700 hover:bg-green-600 hover:text-white px-4 py-2 rounded-md font-medium transition-all duration-200">About</a>
            <a href="/contact" className="text-gray-700 hover:bg-green-600 hover:text-white px-4 py-2 rounded-md font-medium transition-all duration-200">Contact</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <SignedIn>
              {/* This is the requested Clerk UserButton */ }
              <UserButton />
            </SignedIn>
            <SignedOut>
              {/* Optional SignIn button just purely to trigger modal logging in if SignedOut */}
              <SignInButton mode="modal">
                <button className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          <div className="md:hidden flex items-center">
            {/* Mobile menu logic placeholder */}
            <SignedIn>
               <UserButton />
            </SignedIn>
            <button id="mobile-menu-button" className="text-gray-700 hover:text-green-600 focus:outline-none ml-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div id="mobile-menu" className="hidden md:hidden bg-gray-50 border-t border-gray-200 p-2 space-y-1">
        <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-green-600 hover:text-white rounded-md transition-all">Home</a>
        <a href="/services" className="block px-4 py-2 text-gray-700 hover:bg-green-600 hover:text-white rounded-md transition-all">Services</a>
        <a href="/about" className="block px-4 py-2 text-gray-700 hover:bg-green-600 hover:text-white rounded-md transition-all">About</a>
        <a href="/contact" className="block px-4 py-2 bg-green-600 text-white rounded-md">Contact</a>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="block w-full text-left px-4 py-2 bg-green-600 text-white rounded-md mt-2">Sign In</button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
}
