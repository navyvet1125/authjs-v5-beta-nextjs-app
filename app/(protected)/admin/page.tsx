import React from 'react'
import { metadata as layoutMetadata } from '@/app/(protected)/layout';

export const metadata = {
    ...layoutMetadata,
    title: `${layoutMetadata.title} - Admin Page`,
    description: 'Admin Page',
  };
const AdminPage = () => {
  return (
    <div>
      Admin
    </div>
  )
}

export default AdminPage
