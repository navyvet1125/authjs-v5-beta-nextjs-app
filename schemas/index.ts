import * as z from 'zod';

export const ForgotSchema = z.object({
    email: z.string().email({
        message: "Email Required"
    }),
});


export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email Required"
    }),
    password: z.string().min(1, {
        message: "Please enter a password"
    }),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email Required"
    }),
    password: z.string().min(8, {
        message: "Minimum 8 characters"
    })
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    name: z.string().min(1, {
        message: "Name is required"
    }),
});
