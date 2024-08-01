"use client";
import React from 'react'
import { useCurrentUser } from '@/hooks/use-current-user';
import UserInfo from '@/components/userInfo';


// Note: Client Side Components do not have metadata, so we can't use the metadata import here
// Therefore, we needed to add the wrapper component so we could show client side rendering
const ClientWrapper = () => {
    const user = useCurrentUser();
    return (
        <div>
        <UserInfo user={user} label={"📱Client Component"} />
        </div>
    )
}

export default ClientWrapper;