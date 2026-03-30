import React from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

export default function Signup() {
  return (
    <div className="hidden md:flex items-center space-x-6">
      {/* Replaced <Show when="signed-out"> */}
      <SignedOut>
        <div className="flex items-center space-x-4">
          <SignInButton mode="modal">
            <button className="text-gray-700 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-md font-medium transition-all duration-200">
              Log in 
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="text-gray-700 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-md font-medium transition-all duration-200">
              Get Started
            </button>
          </SignUpButton>
        </div>
      </SignedOut>

      {/* Replaced <Show when="signed-in"> */}
      <SignedIn>
        <div className="flex items-center">
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </div>
  );
}