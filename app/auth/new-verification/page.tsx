import NewVerificationForm from '@/components/auth/newVerificationForm'
import React from 'react'
import { metadata as layoutMetadata } from '@/app/layout';

export const metadata = {
    ...layoutMetadata,
    title: `${layoutMetadata.title} - Verification Page`,
    description: 'Verify your email address.',
  };

const NewVerificationPage = () => {
  return (
    <NewVerificationForm />
  )
}

export default NewVerificationPage
