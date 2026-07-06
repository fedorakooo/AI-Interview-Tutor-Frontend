import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(3, "Name must be between 3 and 30 characters")
  .max(30)
  .regex(/^[a-zA-Zа-яА-ЯёЁ\-'\s]+$/, "Name contains invalid characters");

export const signupSchema = z.object({
  first_name: nameSchema,
  second_name: nameSchema,
  username: z
    .string()
    .trim()
    .min(4)
    .max(30)
    .regex(/^[a-zA-Z0-9_.]+$/, "Invalid username characters")
    .refine((v) => !/^[._]|[._]$/.test(v), "Cannot start/end with . or _")
    .refine((v) => !/[._]{2,}/.test(v), "No consecutive . or _"),
  phone_number: z
    .string()
    .transform((v) => v.replace(/[^\d+]/g, ""))
    .refine((v) => /^\+?\d{10,15}$/.test(v), "Invalid phone number"),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/\d/, "Password must contain at least one digit"),
  email: z.email(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
