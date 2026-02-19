import { z } from "zod";

const PasswordRegex = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

const PasswordSchema = z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
        PasswordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number or special character"
    );

export const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: PasswordSchema,
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: PasswordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export const ForgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: PasswordSchema,
});

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

export const VerifyEmailSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

export type VerifyEmailSchemaType = z.infer<typeof VerifyEmailSchema>;