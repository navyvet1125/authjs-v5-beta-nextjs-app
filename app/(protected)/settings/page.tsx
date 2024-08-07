// "use client";
// import React, {useTransition} from 'react'
// import { useSession } from 'next-auth/react';
// import { auth } from '@/auth'
// import { LogOutButton } from '@/components/auth/logoutButton';
// import { useCurrentUser } from '@/hooks/use-current-user';
// import TwoFactorInput from '@/components/auth/twoFactorInput';
import { currentUser } from '@/lib/auth';
import { SettingsForm } from '@/app/(protected)/settings/userSettingsForms';
import { metadata as layoutMetadata } from '@/app/(protected)/layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export const metadata = {
    ...layoutMetadata,
    title: `${layoutMetadata.title} - Settings`,
    description: 'Settings',
  };


const SettingsPage = async () => {
  const user = await currentUser();
  return (
    <Card className='min-w-[412px] w-[600px]'>
      <CardHeader>
        <p className='text-2xl font-semibold text-center'>
          ⚙️ Settings
        </p>
      </CardHeader>
      <CardContent>
        <SettingsForm isOauth={user?.isOauth}/>
      </CardContent>
    </Card>
  )
}

export default SettingsPage
