import { useMutation, useQuery } from "@tanstack/react-query";
import { submitContactForm, ContactFormData, AdminReportData, submitAdminReport, getAdminReport } from "@/services/contact";
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

export const useSubmitAdminReport = () => {
  return useMutation({
    mutationFn: (formData: AdminReportData) => submitAdminReport(formData),
    onSuccess: () => {
      toast.success("Report submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit report.");
    },
  });
};

export const useGetAdminReport = () => {
  return useQuery({
    queryKey: ["adminReport"],
    queryFn: () => getAdminReport(),
  });
};
