// import { LoginForm } from '@/components/auth/loginForm'
import LoginHandler  from '@/components/auth/loginHandler'
import React from 'react'
import { metadata as layoutMetadata } from '@/app/layout';

export const metadata = {
    ...layoutMetadata,
    title: `${layoutMetadata.title} - Login`,
    description: 'Login Page',
  };

const LoginPage = () => {
  return (
    <div>
      {/* <LoginForm /> */}
      <LoginHandler />
    </div>
  )
}

export default LoginPage
