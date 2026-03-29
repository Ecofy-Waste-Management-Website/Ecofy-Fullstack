import React from 'react'
import Signup from '../Signup/signup'


export default function navbar() {
  return (
   <nav className="bg-white border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16 items-center">
      <div className="flex-shrink-0 flex items-center">
        <span className="text-2xl font-bold text-indigo-600">Logo</span>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <a href="#" className="text-gray-700 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-md font-medium transition-all duration-200">Home</a>
        <a href="#" className="text-gray-700 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-md font-medium transition-all duration-200">Services</a>
        <a href="#" className="text-gray-700 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-md font-medium transition-all duration-200">About</a>
        <a href="#" className="text-gray-700 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-md font-medium transition-all duration-200">Contact</a>
        
        
        <Signup />
      </div>

      <div className="md:hidden flex items-center">
        <button id="mobile-menu-button" className="text-gray-700 hover:text-indigo-600 focus:outline-none">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <div id="mobile-menu" className="hidden md:hidden bg-gray-50 border-t border-gray-200 p-2 space-y-1">
    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-indigo-600 hover:text-white rounded-md transition-all">Home</a>
    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-indigo-600 hover:text-white rounded-md transition-all">Services</a>
    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-indigo-600 hover:text-white rounded-md transition-all">About</a>
    <a href="#" className="block px-4 py-2 bg-indigo-600 text-white rounded-md">Contact</a>
  </div>
</nav>
  )
}
