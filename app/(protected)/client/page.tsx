import React from 'react'
import { metadata as layoutMetadata } from '@/app/(protected)/layout';

export const metadata = {
    ...layoutMetadata,
    title: `${layoutMetadata.title} - Client Page`,
    description: 'Client Page',
  };

const ClientPage = () => {
  return (
    <div>
      Client
    </div>
  )
}

export default ClientPage
