import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const productFormSchema = z.object({
  title: z.object({
    en: z.string().min(1, "Title in English is required"),
    ar: z.string().optional(),
  }),
  description: z.object({
    en: z.string().min(1, "Description in English is required"),
    ar: z.string().optional(),
  }),
  category: z.string().min(1, "Category is required").regex(objectIdRegex, "Invalid category format"),
  price: z.string().min(1, "Price is required").regex(/^\d+(\.\d+)?$/, "Price must be a valid number"),
  remainingPieces: z.number().int().min(0, "Cannot be negative"),
  isNewArrival: z.boolean(),
  variant: z.string().optional(),
  photo: z.any().refine((file) => file !== null, "Main photo is required"),
  images: z.array(z.any()).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
