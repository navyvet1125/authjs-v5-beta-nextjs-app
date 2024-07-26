import React from 'react'
import { auth } from '@/auth'
import { LogOutButton } from '@/components/auth/logoutButton'



const SettingsPage = async () => {
  const session = await auth();

  return (
    <div className='p-8'>
        <h1 className='text-xl font-semibold'>Settings</h1>
        <h2 className='text-lg font-semibold'>Session: </h2>
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <LogOutButton />
    </div>
  )
}

export default SettingsPage

