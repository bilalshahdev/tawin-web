import z from "zod";

export const supplierSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  code: z.string().min(1, "Code is required"),
  phone: z.string().min(7, "Invalid phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;