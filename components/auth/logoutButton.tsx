"use client";
// import { Button } from '../ui/button';
// import { FiLogOut } from 'react-icons/fi'
import { logout } from '@/actions/logout';

interface LogOutButtonProps {
  children?: React.ReactNode
}

export const LogOutButton = ({children}: LogOutButtonProps) => {
  const onClick =  () => {
    logout();
  } 
    return ( 
    <span onClick={onClick} className='cursor-pointer'>
        {children}
    </span>

    )
  }
  