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
import { UUID } from "crypto";



const LoginHandler = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" 
        ? "Email already in use with different provider" 
        : "";
    const [sessionId, setSessionId] = useState<UUID | undefined >(undefined);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [twoFactor, setTwoFactor] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const LoginHandler = async (data: z.infer<typeof LoginSchema>) => {
      // Handle Login form submission
      // Call login function from actions/login.ts
      // Handle response
      // If client is authenticated, check if two factor is required
      // If two factor is required redirect to two factor form
      // If two factor is not required redirect to appropriate page
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
          setSessionId(response.sessionId);
          return;
        }
        toast.success("Login successful");
        setSuccess("Login successful");
        router.push(response.redirectTo || "/settings");
      });
    };

    const twoFactorHandler = async (data: z.infer<typeof TwoFactorSchema>) => {
      // Handle Two Factor form submission
      // Call twoFactorLogin function from actions/two-factor-login.ts
      // Handle response
      // If client is authenticated, redirect to appropriate page
      // If two factor token is expired, redirect to login form

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
            setSessionId(undefined);
          }
          return;
        }
        toast.success(response.success);
        setSuccess(response.success);
      });
    };


  return (
    <div>
      {twoFactor&&sessionId ? 
      (<TwoFactorForm 
        onFormSubmit={twoFactorHandler} 
        disabled={isPending} 
        sessionId={sessionId}
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
