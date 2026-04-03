import React from 'react'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

export default function signup() {
  return (
    <div className="hidden md:flex items-center space-x-6">
  <Show when="signed-out">
    <div className="flex items-center space-x-4">
      <SignInButton mode="modal">
        <button className="text-gray-700 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-md font-medium transition-all duration-200">
          Sign In
        </button>
      </SignInButton>

      <SignUpButton mode="modal">
        <button className="text-gray-700 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-md font-medium transition-all duration-200">
          Get Started
        </button>
      </SignUpButton>
    </div>
  </Show>

  <Show when="signed-in">
    <div className="flex items-center">
      <UserButton afterSignOutUrl="/" />
    </div>
  </Show>
</div>
)
}
