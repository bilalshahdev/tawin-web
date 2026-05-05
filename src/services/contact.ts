import api from "@/lib/axios";

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const submitContactForm = async (formData: ContactFormData): Promise<any> => {
  const { data } = await api.post("/api/contact", formData);
  return data;
};
