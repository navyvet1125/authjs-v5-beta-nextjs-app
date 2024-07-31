import { ErrorCard } from '@/components/auth/errorCard';
import React from 'react'
import { metadata as layoutMetadata } from '@/app/layout';

export const metadata = {
    ...layoutMetadata,
    title: `${layoutMetadata.title} - Error`,
    description: 'An error occurred while processing your request',
  };
const AuthErrorPage = () => {
  return (< ErrorCard/>)
}

export default AuthErrorPage;
