import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure(state, action) {
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    initializeState(state) {
      state.user = JSON.parse(localStorage.getItem('user')) || null;
      state.token = localStorage.getItem('token') || null;
    },
  },
});

export const { loginSuccess, loginFailure, logout, initializeState } = authSlice.actions;
export default authSlice.reducer;
