import React from 'react'
// import { auth } from '@/auth'
import { LogOutButton } from '@/components/auth/logoutButton'
// import { useCurrentUser } from '@/hooks/use-current-user';
// import TwoFactorInput from '@/components/auth/twoFactorInput';

import { metadata as layoutMetadata } from '@/app/(protected)/layout';

export const metadata = {
    ...layoutMetadata,
    title: `${layoutMetadata.title} - Settings`,
    description: 'Settings',
  };


const SettingsPage = () => {
  // const  user = useCurrentUser();
  return (
      <div className='bg-white p-10 rounded-xl'>
          {/* {!session?.user.emailVerified && (<div className='w-full bg-destructive/10 text-destructive font-mono'>Verify Your Email!</div>)} */}
          <h1 className='text-xl font-semibold'>Dashboard</h1>
          <h2 className='text-lg font-semibold'>Session: </h2>
          <LogOutButton>Logout</LogOutButton>

      </div>
  )
}

export default SettingsPage
