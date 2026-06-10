import { z } from "zod";

export const SignupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  agreeTerms: z.literal(true, {
    message: "You must agree to the terms",
  }),
});

export const LoginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const ProfileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export const ProfilePictureSchema = z.object({
  profilePicture: z.instanceof(File, { message: "Please select a valid image file" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
      "Only JPEG, PNG, WebP, and GIF images are allowed"
    ),
});

export const AddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  label: z.string().optional(),
  zipCode: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  token: z.string().optional().or(z.literal("")), // <-- ALLOWS EMPTY STRINGS ON INITIAL MOUNT
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type Signup = z.infer<typeof SignupSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;
export type ProfilePicture = z.infer<typeof ProfilePictureSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;