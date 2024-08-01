import React from 'react'
import { metadata as layoutMetadata } from '@/app/(protected)/layout';
import { currentUser } from '@/lib/auth';
import UserInfo from '@/components/userInfo';

export const metadata = {
    ...layoutMetadata,
    title: `${layoutMetadata.title} - Server Page`,
    description: 'Server Side Rendering Example Page',
  };

const ServerPage = async () => {
  const user = await currentUser() 
  return (
    <div>
      <UserInfo user={user} label={"🖥️Server Component"} />
    </div>
  )
}

export default ServerPage
