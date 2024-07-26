"use client";
import { signOut } from "next-auth/react"
import { Button } from '../ui/button';
import { FiLogOut } from 'react-icons/fi'

export const LogOutButton = () => {
    return ( 
    <Button onClick={() => signOut()}>
        <FiLogOut className="mr-2" />
        Sign Out
    </Button>)
  }
  