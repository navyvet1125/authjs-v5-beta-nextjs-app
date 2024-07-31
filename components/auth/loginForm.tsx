"use client";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
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

// import { FieldValues } from "react-hook-form/dist";

export const LoginForm = () => {
    const { formState: { errors } } = useForm();
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" 
        ? "Email already in use with different provider" 
        : "";
    const [twoFactor, setTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            token: "",
        }
    });

    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        console.log("Form data submitted:", data);
        setError("");
        setSuccess("");
        startTransition(async () => {
            try {
                const response = await login(data);
                console.log("Login response:", response);
                if(!response) {
                    setError("An unexpected error occurred");
                    return;
                }
                if (response.error) {
                    setError(response.error);
                } else if (response.success) {
                    setSuccess(response.success);
                    if (response.twoFactor) {
                        setTwoFactor(true);
                    } else if (response.redirectTo) {
                        router.push(response.redirectTo);
                    }
                }
            } catch (e) {
                console.error("Error caught:", e);
                setError("An unexpected error occurred");
            }
        });
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
                        {!twoFactor &&(<>
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
                        </>)}
                        {twoFactor && (
                            <FormField
                            control={form.control}
                            name="token"
                            render={({ field }) => (
                                // <TwoFactorInput
                                // {...field} 
                                // disabled={isPending}
                                // placeholder="_"
                                // protected={false}
                                // value={field.value}
                                // />
                                <FormItem>
                                    <FormLabel>2FA Code</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                        disabled={isPending}
                                        placeholder="123456" 
                                        type="text"
                                         />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                  
                        )}
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