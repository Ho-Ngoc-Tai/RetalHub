import { RootState } from "@/app/stores";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | null;
  user: { id: string; email: string } | null;
  loading: boolean;
  error: string | null;
}

interface StateStyle {
  login: AuthState
}

const initialState: StateStyle = {
  login: {
    token: null,
    user: null,
    loading: false,
    error: null,
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state, _action: PayloadAction<{ email: string; password: string }>) => {
      state.login.loading = true;
      state.login.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ accessToken: string; user: { id: string; email: string } }>
    ) => {
      state.login.loading = false;
      state.login.token = action.payload.accessToken;
      state.login.user = action.payload.user;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.login.loading = false;
      state.login.error = action.payload;
    },
    logout: (state) => {
      state.login.token = null;
      state.login.user = null;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;

const selectAuthState = (state: RootState) => state.auth;

// export const makeSelectAuthData = createSelector(
//   [selectAuthState],
//   (auth: AuthState) => ({
//     token: auth.token,
//     account: auth.user,
//   })
// );

// export const makeSelectAuthLoading = createSelector(
//   [selectAuthState],
//   (auth: AuthState) => auth.loading
// );
export const makeAuth = createSelector(
  selectAuthState,
  (state) => state.login
);

// export const makeSelectAuthError = createSelector(
//   [selectAuthState],
//   (auth: AuthState) => auth.error
// );

// export const makeSelectIsAuthenticated = createSelector(
//   [selectAuthState],
//   (auth: AuthState) => !!auth.token
// );

// export const makeSelectAuthUser = createSelector(
//   [selectAuthState],
//   (auth: AuthState) => auth.user
// );