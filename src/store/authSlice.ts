import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const loadstaffFromStorage = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('staff_user');
    return saved ? JSON.parse(saved) : null;
  }
  return null;
};

interface AuthState {
  staff: any | null;
}

const initialState: AuthState = {
  staff: loadstaffFromStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setStaff: (state, action: PayloadAction<any>) => {
      state.staff = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('staff_user', JSON.stringify(action.payload));
      }
    },
    clearstaff: (state) => {
      state.staff = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('staff_user');
      }
    },
  },
});

export const { setStaff, clearstaff } = authSlice.actions;
export default authSlice.reducer;
