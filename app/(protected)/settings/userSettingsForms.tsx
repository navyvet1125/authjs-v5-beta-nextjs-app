"use client"
import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import  * as z  from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import { currentUser } from "@/lib/auth"
// import { useCurrentRole } from "@/hooks/use-current-role"
// import { useCurrentUser } from "@/hooks/use-current-user"
import { useSession } from 'next-auth/react';
import { settings } from '@/actions/settings';
import { UserRole } from "@prisma/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { SettingsSchema } from "@/schemas";
// import { FormError } from "@/components/formError"
// import { FormSuccess } from "@/components/formSuccess"
import { toast } from "sonner"

type FormValues = z.infer<typeof SettingsSchema>

interface SettingsFormProps {
    isOauth?: boolean;
  }

export function SettingsForm({ isOauth }:SettingsFormProps) {
  const { data:session, update } = useSession();
  const user = session?.user;
    const initialValues: FormValues = {
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        newPassword: "",
        isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
        role: user?.role || UserRole.USER,
        isOauth: isOauth || false,
    };
    const [isPending, startTransition] = useTransition();
    const [isChanged, setIsChanged] = useState(false);
    const form = useForm<FormValues>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: initialValues
    })
    
    // 2. Define a submit handler.
    function onSubmit(values: FormValues) {
      // setError("");
      // setSuccess("");
      startTransition(() => {
      const changedValues = values;
      for (const key in values) {
        const typedKey = key as keyof FormValues;
        const value = values[typedKey];
        const initialValue = initialValues[typedKey];
        if (value === undefined || (value === initialValue && typeof value !== 'boolean')) {
          delete changedValues[typedKey] 
        }
      }
        settings(changedValues)
        .then((data) => {
          if (data.success) {
            const {values} = data;
              toast.success(data.success);
              // setSuccess(data.success);
              if(values.name) initialValues.name = data.values.name;
              if(values.email) initialValues.email = data.values.email;
              if(values.role) initialValues.role = data.values.role;
              if(values.isTwoFactorEnabled) initialValues.isTwoFactorEnabled = data.values.isTwoFactorEnabled;
              form.reset(initialValues);
              update({ session, user: { ...initialValues,  } });
              setIsChanged(false);
              // console.log(initialValues);

          } else if (data.error) {
              console.error('Error updating name:', data.error);
              toast.error(data.error);
              form.reset(initialValues);
              setIsChanged(false);
          }
        })
        .catch((error) => {
          console.error('Error updating name:', error);
          toast.error('Something went wrong');
        });

    })
    } 
    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        const updatedValues = { ...form.getValues(), [name]: value };
        let hasChanged = false;
        for (const key in updatedValues) {
            if (updatedValues[key as keyof FormValues] !== initialValues[key as keyof FormValues]) {
                hasChanged = true;
                break;
            }
        }
        setIsChanged(hasChanged);
    
        // Update the specific field value
        form.setValue(name as keyof FormValues, value);
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                placeholder="Name" 
                {...field} 
                onChange={onChange} 
                // value={formValues.name}
                disabled={!user || isPending}
                />
              </FormControl>
              <FormDescription>
              Your name will appear next to your comments. 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                placeholder="example@email.com" 
                {...field} 
                onChange={onChange}
                autoComplete="email"
                // value={formValues.email}
                disabled={!user || isOauth || isPending}
                />
                </FormControl>
                <FormDescription>
                    {isOauth? "Email address used from Oauth": "Changeing email will require re-verification."}
                </FormDescription>
                <FormMessage />
            </FormItem>
            )}
        />
     {!isOauth && <>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                placeholder="Password"
                type="password" 
                {...field} 
                onChange={onChange}
                autoComplete="current-password"
                // value={formValues.password}
                disabled={!user || isPending}
                // value={password}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input 
                placeholder="New Password" 
                type="password"
                autoComplete="new-password"
                {...field} 
                onChange={onChange}
                // value={formValues.newPassword}
                disabled={!user || isPending}
                // value={newPassword}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          </>}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={(value)=> {
                field.onChange(value);
                onChange({ target: { name: "role", value } } as any);
                }} defaultValue={field.value}
                disabled={ isPending}
                >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="User Role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>ADMIN</SelectItem>
                  <SelectItem value={UserRole.USER}>USER</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Admins have full access to all settings and features. Users have limited access.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

            {!isOauth && <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Two Factor Authentication</FormLabel>
                    <FormDescription>
                      Enable Two Factor Authentication (Recommended)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        onChange({ target: { name: "isTwoFactorEnabled", value } } as any);
                      }}
                      disabled={isOauth || isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />}
        </div>
        {/* <FormError message={error} /> */}
        {/* <FormSuccess message={success} />  */}

        <Button type="submit" disabled={!isChanged || isPending}>Submit</Button>
      </form>
    </Form>
  )
}
