import api from "@/lib/axios";

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface AdminReportData {
  message: string;
}
export const submitContactForm = async (formData: ContactFormData): Promise<any> => {
  const { data } = await api.post("/api/contact", formData);
  return data;
};

export const submitAdminReport = async (formData: AdminReportData): Promise<any> => {
  const { data } = await api.post("/api/reports", formData);
  return data;
};

export const getAdminReport = async (): Promise<any> => {
  const { data } = await api.get("/api/reports");
  return data;
};

export const getAdminContacts = async (): Promise<any> => {
  const { data } = await api.get("/api/contact");
  return data;
};

export const deleteAdminContact = async (id: string): Promise<any> => {
  const { data } = await api.delete(`/api/contact/${id}`);
  return data;
};

export const deleteAdminReport = async (id: string): Promise<any> => {
  const { data } = await api.delete(`/api/reports/${id}`);
  return data;
};
