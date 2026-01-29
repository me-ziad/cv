import { createSlice } from '@reduxjs/toolkit';

type User = {
  id: string;
  email: string;
  role: 'HR' | 'SEEKER';
} | null;

type AuthState = {
  token: string | null;
  user: User;
};

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: { payload: { token: string; user: User } }) => {
    state.token = action.payload.token;
    state.user = action.payload.user;
    localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;