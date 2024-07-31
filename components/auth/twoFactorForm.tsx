"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TwoFactorSchema } from "@/schemas";
// import { Input } from "@/components/ui/input";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form"
import { CardWrapper } from "@/components/auth/cardWrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/formError";
import { FormSuccess } from "@/components/formSuccess";
import { TwoFactorInput } from "@/components/auth/twoFactorInput";  

interface TwoFactorFormProps {
    onFormSubmit: (data: z.infer<typeof TwoFactorSchema>) => void;
    disabled?: boolean;
    email: string;
    error?: string;
    success?: string;
}

export const TwoFactorForm = ({ 
    onFormSubmit,
    disabled,
    email,
    error,
    success
}: TwoFactorFormProps) => {
    const formSubmit = onFormSubmit || (() => {});
    const form = useForm<z.infer<typeof TwoFactorSchema>>({
        resolver: zodResolver(TwoFactorSchema),
        defaultValues: {
            token: "",
            email,
        }
    });

    const onSubmit = async (data: z.infer<typeof TwoFactorSchema>) => {
        formSubmit(data);
    };
    return (
        <CardWrapper
            headerLabel="Two Factor Authentication"
            backButtonLabel=""
            backButtonHref=""
        >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="token"
                            render={({ field }) => (
                                <TwoFactorInput
                                {...field} 
                                disabled={disabled}
                                placeholder="_"
                                protected={false}
                                value={field.value}
                                />
                            )}
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