"use client";
import * as z from "zod";
// import { useState, useTransition } from "react";
// import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
// import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import Link from "next/link";
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
import { TwoFactorInput } from "@/components/auth/twoFactorInput";  

interface LoginHandlerFormProps {
  onFormSubmit: (data: z.infer<typeof LoginSchema>) => void;
  disabled?: boolean;
  error?: string;
  success?: string;
}

export const LoginHandlerForm = ({onFormSubmit, disabled, error, success}: LoginHandlerFormProps) => {
    const formSubmit = onFormSubmit || (() => {});
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            // token: "",
        }
    });

    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        formSubmit(data);
    };

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
                                        disabled={disabled}
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
                                        disabled={disabled}
                                        placeholder="********" 
                                        type="password"
                                        autoComplete="current-password"
                                         />
                                    </FormControl>
                                    <Button
                                        size="sm"
                                        variant="link"
                                        asChild
                                        className="px-0 font-normal"
                                    >
                                        <Link href="/auth/reset">
                                            Forgot password?
                                        </Link>
                                    </Button>
                                    <FormMessage />
                                </FormItem>)}
                        />
                    </div>
                    {error && <FormError message={error} />}
                    {success && <FormSuccess message={success} />}
                    <Button 
                    disabled={disabled}
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