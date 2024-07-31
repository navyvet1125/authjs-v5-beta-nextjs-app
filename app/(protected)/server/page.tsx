import React from 'react'
import { metadata as layoutMetadata } from '@/app/(protected)/layout';

export const metadata = {
    ...layoutMetadata,
    title: `${layoutMetadata.title} - Server Page`,
    description: 'Server Page',
  };

const ServerPage = () => {
  return (
    <div>
      Server
    </div>
  )
}

export default ServerPage
