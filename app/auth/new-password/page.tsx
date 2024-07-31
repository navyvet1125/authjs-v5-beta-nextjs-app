import { NewPasswordForm } from '@/components/auth/newPasswordForm'
import React from 'react'
import { metadata as layoutMetadata } from '@/app/layout';

export const metadata = {
    ...layoutMetadata,
    title: `${layoutMetadata.title} - New Password`,
    description: 'Page to set new password.',
  };

const NewPasswordPage = () => {
  return (
      <NewPasswordForm />
  )
}

export default NewPasswordPage