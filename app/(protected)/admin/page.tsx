import React from 'react'
import { metadata as layoutMetadata } from '@/app/(protected)/layout';
import AdminClientWrapper from '@/app/(protected)/admin/adminClientWrapper';
// import { currentUserRole } from '@/lib/auth';

export const metadata = {
    ...layoutMetadata,
    title: `${layoutMetadata.title} - Admin Page`,
    description: 'Admin Example Page',
  };
const AdminPage = async () => {
    // const role = await currentUserRole();
    return (
        <div>
            <AdminClientWrapper />
            {/* Current Role: {role} (Server Side Rendered) */}

        </div>
    )
}

export default AdminPage
