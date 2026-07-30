import { z } from "zod";
import { validationMessages } from "./validation-messages";

export const loginSchema = z.object({
    email: z.string().trim().min(1, validationMessages.required).email(validationMessages.email),
    password: z.string().min(1, validationMessages.passwordRequired),
    rememberDevice: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const citizenLookupSchema = z.object({
    nationalId: z
        .string()
        .trim()
        .regex(/^\d{16}$/, validationMessages.nationalId),
});

export type CitizenLookupFormValues = z.infer<typeof citizenLookupSchema>;

export const registrationSchema = z
    .object({
        email: z.string().trim().min(1, validationMessages.required).email(validationMessages.email),
        password: z.string().min(15, validationMessages.passwordMinimum),
        confirmPassword: z.string().min(1, validationMessages.required),
        acceptedTerms: z.boolean().refine(Boolean, validationMessages.consent),
        acceptedPrivacy: z.boolean().refine(Boolean, validationMessages.consent),
        acceptedBiometricProcessing: z.boolean().refine(Boolean, validationMessages.consent),
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: validationMessages.passwordConfirmation,
        path: ["confirmPassword"],
    });

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

export const emailVerificationSchema = z.object({
    code: z
        .string()
        .trim()
        .regex(/^\d{6}$/, validationMessages.verificationCode),
});

export type EmailVerificationFormValues = z.infer<typeof emailVerificationSchema>;

export const forgotPasswordSchema = z.object({
    email: z.string().trim().min(1, validationMessages.required).email(validationMessages.email),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
    .object({
        password: z.string().min(15, validationMessages.passwordMinimum),
        confirmPassword: z.string().min(1, validationMessages.required),
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: validationMessages.passwordConfirmation,
        path: ["confirmPassword"],
    });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
