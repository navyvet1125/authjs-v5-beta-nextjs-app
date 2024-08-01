import React from 'react'
import ClientWrapper from '@/app/(protected)/client/wrapper';

import { metadata as layoutMetadata } from '@/app/(protected)/layout';

export const metadata = {
    ...layoutMetadata,
    title: `${layoutMetadata.title} - Client Page`,
    description: 'Client Side Rendering Example Page',
  };

  // Note: We wrapped the client side rendering of data in a ClientWrapper component.
  // This allows us to keep the metadata and keep the title and description in sync.

const ClientPage = () => {
  return (
    <div>
      <ClientWrapper />
    </div>
  )
}

export default ClientPage
