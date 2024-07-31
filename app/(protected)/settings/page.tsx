import React from 'react'
import { auth } from '@/auth'
import { LogOutButton } from '@/components/auth/logoutButton'
// import TwoFactorInput from '@/components/auth/twoFactorInput';



const SettingsPage = async () => {
  const session = await auth();

  return (
    <div className='p-8'>
        {!session?.user.emailVerified && (<div className='w-full bg-destructive/10 text-destructive font-mono'>Verify Your Email!</div>)}
        <h1 className='text-xl font-semibold'>Settings</h1>
        <h2 className='text-lg font-semibold'>Session: </h2>
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <h2 className='text-lg font-semibold'>Test</h2>
        <LogOutButton />
    </div>
  )
}

export default SettingsPage

