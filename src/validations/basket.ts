// validations/basket.ts
import { z } from "zod";

export const ConstructionBasketSchema = z.object({
  fullRegistrationName: z.string().min(3, "Name is too short"),
  phoneNumber: z.string().min(10, "Invalid phone number"),
  occupation: z.string().min(1, "Please select an occupation"),
  monthlyIncome: z.number().min(1, "Income must be greater than 0"),
  propertyType: z.string().min(1, "Please select property type"),
  propertyArea: z.string().min(1, "Area is required"),
  country: z.string(),
  residenceCard: z.string().min(1, "Residence card is required"),
  unifiedCard: z.string().min(1, "Unified card is required"),
});

export type ConstructionBasketType = z.infer<typeof ConstructionBasketSchema>;