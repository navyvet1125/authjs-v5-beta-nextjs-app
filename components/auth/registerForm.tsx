"use client";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
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
import { register } from "@/actions/register";

// import { FieldValues } from "react-hook-form/dist";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: ""
        }
    });

    const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            register(data)
            .then((data) => {
                setError(data.error);
                setSuccess(data.success);
            })
        });
    }

    return (
        <CardWrapper
            headerLabel="Create an account"
            backButtonLabel="Already have an account?"
            backButtonHref="/auth/login"
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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                        disabled={isPending}
                                        placeholder="John Doe" 
                                        autoComplete="name"
                                         />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>)}
                        />

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
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button 
                    disabled={isPending}
                    type="submit"
                    className="w-full"
                    >
                        Create account
                    </Button>
                </form>
            </Form>
      </CardWrapper>
    )
} 