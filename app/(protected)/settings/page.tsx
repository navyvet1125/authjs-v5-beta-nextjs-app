import React from 'react'

import { auth, signOut } from '@/auth'
import { Button } from '@/components/ui/button'

const SignOut = () => {
  return (
    <form
    action={async () => {
      "use server"
      await signOut()
    }}
  >
    <button type="submit">Sign Out</button>
  </form>
  )
}


const SettingsPage = async () => {
  const session = await auth();

  return (
    <div>
        <h1>Settings</h1>
        <h2>Session: </h2>
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <SignOut />
    </div>
  )
}

export default SettingsPage

