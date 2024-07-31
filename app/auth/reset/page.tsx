import { ResetPageForm } from '@/components/auth/resetPageForm'
import React from 'react'
import { metadata as layoutMetadata } from '@/app/layout';

export const metadata = {
    ...layoutMetadata,
    title: `${layoutMetadata.title} - Reset Password`,
    description: 'Password Reset Page',
  };

const ResetPage = () => {
  return (<ResetPageForm />)
}

export default ResetPage
