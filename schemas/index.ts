import { UserRole } from '@prisma/client';
import * as z from 'zod';

export const SettingsSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required"
    }).optional(),
    isOauth: z.boolean(),
    email: z.string().email({
        message: "Email Required"
    }).optional(),
    isTwoFactorEnabled: z.boolean().optional(),
    role:z.enum([UserRole.ADMIN, UserRole.USER]).optional(),

    password: z.optional(z.string()
    .regex(/(^$|[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(^$|[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(^$|[0-9])/, 'Password must contain at least one number')
    .regex(/(^$|[^a-zA-Z0-9])/, 'Password must contain at least one special character'))
    .refine((value) => {
        return !value || value.length >= 8;
    }, {
        message: "Minimum 8 characters",
    }),
    newPassword: z.optional(z.string()
    .regex(/(^$|[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(^$|[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(^$|[0-9])/, 'Password must contain at least one number')
    .regex(/(^$|[^a-zA-Z0-9])/, 'Password must contain at least one special character'))
    .refine((value) => {
        return !value || value.length >= 8;
        }, {
            message: "Minimum 8 characters",
        }),

}).refine(data => {
    if((data.password && !data.newPassword) ) {
        return false;
    }
    return true;
},{
    message: "Both password and new password are required when changing password",
    path: ["newPassword"]

}).refine(data => {
    if((data.newPassword && !data.password) ) {
        return false;
    }
    return true;
},{
    message: "Both password and new password are required when changing password",
    path: ["password"] 
}).refine(data => {
    if(data.password && (data.newPassword === data.password)) {
        return false;
    }
    return true;
}, {
    message: "New password cannot be the same as the old password",
    path: ["newPassword"]
});


export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email Required"
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(8, {
        message: "Minimum 8 characters"
    })
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
});

export const TwoFactorSchema = z.object({
    sessionId: z.string().uuid({}),
    token: z.string().length(6, {
        message: "Token Required"
    }).regex(/^\d{6}$/, {
        message: "Token must be a 6-digit number"
    })
});

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email Required"
    }),
    password: z.string().min(1, {
        message: "Please enter a password"
    }),
    token: z.string().length(6, {
        message: "Token Required"
    }).regex(/^\d{6}$/, {
        message: "Token must be a 6-digit number"
    }).optional(),    
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
