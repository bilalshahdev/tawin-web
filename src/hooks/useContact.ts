import { useMutation } from "@tanstack/react-query";
import { submitContactForm, ContactFormData } from "@/services/contact";
import { toast } from "sonner";

export const useSubmitContactForm = () => {
  return useMutation({
    mutationFn: (formData: ContactFormData) => submitContactForm(formData),
    onSuccess: () => {
      toast.success("Contact form submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit contact form.");
    },
  });
};
