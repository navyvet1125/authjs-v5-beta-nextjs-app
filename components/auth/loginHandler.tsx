"use client";
import * as z from "zod";
import { LoginSchema, TwoFactorSchema } from "@/schemas";
import React, {useState, useTransition} from 'react'
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { TwoFactorForm } from '@/components/auth/twoFactorForm';
import { LoginHandlerForm } from '@/components/auth/loginHandlerForm';
import { login } from "@/actions/login";
import { twoFactorLogin } from '@/actions/two-factor-login';
import { toast } from "sonner";
// import { TwoFactorInput } from "@/components/auth/twoFactorInput";  



const LoginHandler = () => {
    const searchParams = useSearchParams();
    // const router = useRouter();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" 
        ? "Email already in use with different provider" 
        : "";
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [twoFactor, setTwoFactor] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const LoginHandler = async (data: z.infer<typeof LoginSchema>) => {
      setError("");
      setSuccess("");
      startTransition(async () => {
        const response = await login(data);
        if(!response) {
          toast.error("An unexpected error occurred");
          setError("An unexpected error occurred");
          return;
        }
        if (response.error) {
          toast.error(response.error);
          setError(response.error);
          return;
        }
        if (response.twoFactor) {
          toast.success("Two factor token sent");
          setSuccess("Two factor token sent");
          setTwoFactor(true);
          setEmail(data.email);
          return;
        }
        toast.success("Login successful");
        setSuccess("Login successful");
        router.push(response.redirectTo || "/settings");
      });
    };

    const twoFactorHandler = async (data: z.infer<typeof TwoFactorSchema>) => {
      setError("");
      setSuccess("");
      startTransition(async () => {
        const response = await twoFactorLogin(data);
        if(!response) return;
        if ( response.error) {
          toast.error(response.error);
          setError(response.error);
          if (response.error.includes("expired")) {
            setTwoFactor(false);
            setEmail("");
          }
          return;
        }
        toast.success(response.success);
        setSuccess(response.success);
      });
    };


  return (
    <div>
      {twoFactor ? 
      (<TwoFactorForm 
        onFormSubmit={twoFactorHandler} 
        disabled={isPending} 
        email={email}
        error={error}
        success={success}
        />) :
      (<LoginHandlerForm 
        onFormSubmit={LoginHandler}
        disabled={isPending}
        error={error || urlError}
        success={success}
        />)}
    </div>
  )
}

export default LoginHandler
