"use client";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from '@/components/ui/avatar';
import { FaUser } from 'react-icons/fa';
import { ExitIcon } from '@radix-ui/react-icons';
import { useCurrentUser } from '@/hooks/use-current-user';
import { LogOutButton } from '@/components/auth/logoutButton';

const UserButton = () => {
    const user = useCurrentUser();
  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Avatar>
                <AvatarImage src={user?.image || ""} alt="Avatar" />
                <AvatarFallback className='bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
    from-sky-400 to-blue-800'>
                    <FaUser className='text-white'/>
                </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
            <LogOutButton>
                <DropdownMenuItem>
                    <ExitIcon className="w-5 h-5 mr-2" />
                    Logout
                </DropdownMenuItem>
            </LogOutButton>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton
