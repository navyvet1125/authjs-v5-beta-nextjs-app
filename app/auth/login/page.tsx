// import { LoginForm } from '@/components/auth/loginForm'
import LoginHandler  from '@/components/auth/loginHandler'
import { Toaster } from 'sonner'
import React from 'react'

const LoginPage = () => {
  return (
    <div>
      {/* <LoginForm /> */}
      <LoginHandler />
      <Toaster />
    </div>
  )
}

export default LoginPage
