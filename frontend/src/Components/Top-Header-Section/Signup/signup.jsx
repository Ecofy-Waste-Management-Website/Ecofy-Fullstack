import React from 'react'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

export default function signup() {
  return (
    <div>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
    </div>
  )
}
