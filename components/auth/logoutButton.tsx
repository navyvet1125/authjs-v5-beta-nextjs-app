
import { signOut } from "@/auth"
import { Button } from '../ui/button';
import { FiLogOut } from 'react-icons/fi'

export const LogOutButton = () => {
    return ( 
        <form
        action={async () => {
          "use server"
          await signOut({
            redirectTo: "/auth/login",
          })
        }}
      >
    <Button type="submit">
        <FiLogOut className="mr-2" />
        Sign Out
    </Button>
    </form>
    )
  }
  