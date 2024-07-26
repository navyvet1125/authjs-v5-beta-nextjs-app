import { Header } from "@/components/auth/header";
import { BackButton } from "@/components/auth/backButton";
import { CardWrapper } from "@/components/auth/cardWrapper";
import {
    Card,
    CardHeader,
    CardFooter
} from "@/components/ui/card"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const ErrorCard = () => {
    return (
        <CardWrapper
            headerLabel="Opps! Something went wrong!"
            backButtonLabel="Back to Login"
            backButtonHref="/auth/login"
        >
            <div className="w-full flex justify-center items-center">
                <ExclamationTriangleIcon className="h-10 w-10 text-destructive"/>
            </div>
        </CardWrapper>
    )
}