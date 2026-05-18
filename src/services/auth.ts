import api from "@/lib/axios";
import { setStaff } from "@/store/authSlice";
import { AppDispatch } from "@/store/store";
import { Address, Login, Signup } from "@/validations/auth";

export const loginUser = async (credentials: Login) => {
  const { data } = await api.post("/api/auth/login", credentials);
  return data.data;
};

export const loginStaff = async (credentials: Login) => {
  const { data } = await api.post("/api/auth/login/staff", credentials);
  return data.data;
};

export const signUpUser = async (credentials: Signup) => {
  const { data } = await api.post("/api/auth/register", credentials);
  return data.data;
};

export const signUpUserByAdmin = async (credentials: Signup) => {
  const { data } = await api.post("/api/admin/users/register", credentials);
  return data.data;
};

export const getUserProfile = async (dispatch: AppDispatch) => {
  const { data } = await api.get("/api/users/me");
  if(data.data.role === 'staff') {
    dispatch(setStaff(data.data));
  }
  return data;
};

export const updateUserProfile = async (data: File | any) => {
  if (data instanceof File) {
    const formData = new FormData();
    formData.append('profileImage', data);
    const response = await api.patch("/api/users/profile-picture", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } else {
    const formData = new FormData();
    if (data.firstName !== undefined) formData.append('firstName', data.firstName);
    if (data.lastName !== undefined) formData.append('lastName', data.lastName);
    if (data.username !== undefined) formData.append('username', data.username);
    if (data.password) {
      formData.append('password', data.password);
    }
    const response = await api.patch("/api/users/profile-picture", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

// api.ts or wherever updateAdminProfile is defined
export const updateAdminProfile = async (data: any) => {
  const formData = new FormData();

  if (data instanceof File) {
    formData.append('profileImage', data);
  } else {
    // Append all text keys to the formData
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
  }

  const response = await api.patch("/api/admin/profile", formData);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const { data } = await api.delete(`/api/auth/delete-user/${userId}`);
  return data;
};

export const getAdminUsers = async (params?: { status?: string; page?: number; search?: string }) => {
  const { data } = await api.get("/api/admin/users", { params });
  return data;
};

export const verifyUser = async (userId: string) => {
  const { data } = await api.patch(`/api/admin/users/${userId}/verify`);
  return data;
};

export const addAddress = async (addressData: Address) => {
  const { data } = await api.post("/api/addresses", addressData);
  return data;
};

export const getAllAddresses = async () => {
  const { data } = await api.get("/api/addresses");
  return data.data;
};

export const deleteAddress = async (addressId: string) => {
  const { data } = await api.delete(`/api/addresses/${addressId}`);
  return data;
};

export const updateAddress = async ({ id, data }: { id: string; data: Address }) => {
  const response = await api.patch(`/api/addresses/${id}`, data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const { data } = await api.post("/api/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (payload: { email: string; token: string; newPassword: string }) => {
  const { data } = await api.post("/api/auth/reset-password", payload);
  return data;
};

export const verifyOtp = async (payload: { email: string; otp: string }) => {
  const { data } = await api.post("/api/auth/verify-otp", payload);
  return data;
};

export const resendOtp = async (email: string) => {
  const { data } = await api.post("/api/auth/resend-otp", { email });
  return data;
};
