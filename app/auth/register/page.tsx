import { RegisterForm } from '@/components/auth/registerForm'
import React from 'react'
import { metadata as layoutMetadata } from '@/app/layout';

export const metadata = {
    ...layoutMetadata,
    title: `${layoutMetadata.title} - Register`,
    description: 'Registration Page',
  };

const RegisterPage = () => {
  return (
    <div>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
