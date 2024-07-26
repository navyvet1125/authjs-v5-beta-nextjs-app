"use client";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form"
// import { FieldValues } from "react-hook-form/dist";
import { CardWrapper } from "@/components/auth/cardWrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/formError";
import { FormSuccess } from "@/components/formSuccess";
import { login } from "@/actions/login";

// import { FieldValues } from "react-hook-form/dist";

export const LoginForm = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" 
        ? "Email already in use with different provider" 
        : "";
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = (data: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            login(data)
            .then((data) => {
                if(data){
                    setError(data.error);
                    // TODO: Add when we add 2FA
                    // setSuccess(data.success);
                }
            })
        });
    }

    return (
        <CardWrapper
            headerLabel="Welcome Back!"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocialLogin
        >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                        disabled={isPending}
                                        placeholder="email@example.com" 
                                        type="email"
                                        autoComplete="email"
                                         />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>)}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                        disabled={isPending}
                                        placeholder="********" 
                                        type="password"
                                        autoComplete="current-password"
                                         />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>)}
                        />

                    </div>
                    <FormError message={error || urlError}/>
                    <FormSuccess message={success}/>
                    <Button 
                    disabled={isPending}
                    type="submit"
                    className="w-full"
                    >
                        Login
                    </Button>
                </form>
            </Form>
      </CardWrapper>
    )
} 