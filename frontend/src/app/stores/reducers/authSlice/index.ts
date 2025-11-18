import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/app/stores";

export interface SigninRequestPayload {
  email: string;
  password: string;
}

export interface SigninSession {
  user: Record<string, unknown> | null;
  accessToken?: string;
  refreshToken?: string;
  deviceId?: string | null;
}

export interface SigninState {
  isCalling: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: unknown;
  session: SigninSession | null;
  params: SigninRequestPayload | null;
}

export interface LogoutState {
  isCalling: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
}

interface AuthState {
  signin: SigninState;
  logout: LogoutState;
}

const initialState: AuthState = {
  signin: {
    isCalling: false,
    isSuccess: false,
    isError: false,
    error: null,
    session: null,
    params: null,
  },
  logout: {
    isCalling: false,
    isSuccess: false,
    isError: false,
    error: null,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signinAction: (state, action: PayloadAction<SigninRequestPayload>) => {
      console.log("[authSlice] signinAction", action.payload);
      state.signin.isCalling = true;
      state.signin.isSuccess = false;
      state.signin.isError = false;
      state.signin.error = null;
      state.signin.params = action.payload;
      state.signin.session = null;
    },
    signinSuccess: (state, action: PayloadAction<SigninSession>) => {
      console.log("[authSlice] signinSuccess", action.payload);
      state.signin.isCalling = false;
      state.signin.isSuccess = true;
      state.signin.isError = false;
      state.signin.session = action.payload;
    },
    signinFailure: (state, action: PayloadAction<unknown>) => {
      console.error("[authSlice] signinFailure", action.payload);
      state.signin.isCalling = false;
      state.signin.isSuccess = false;
      state.signin.isError = true;
      state.signin.error = action.payload;
      state.signin.session = null;
    },
    logoutAction: (state) => {
      state.logout.isCalling = true;
      state.logout.isSuccess = false;
      state.logout.isError = false;
      state.logout.error = null;
    },
    logoutSuccess: (state) => {
      state.logout.isCalling = false;
      state.logout.isSuccess = true;
      state.logout.isError = false;
      state.signin.isSuccess = false;
      state.signin.session = null;
    },
    logoutFailure: (state, action: PayloadAction<string | null>) => {
      state.logout.isCalling = false;
      state.logout.isSuccess = false;
      state.logout.isError = true;
      state.logout.error = action.payload;
    },
  },
});

export const authReducer = authSlice.reducer;
export const {
  signinAction,
  signinSuccess,
  signinFailure,
  logoutAction,
  logoutSuccess,
  logoutFailure,
} = authSlice.actions;

const selectState = (state: RootState) => state.auth;

export const makeSelectSignin = createSelector(selectState, (state) => state.signin);

export const makeSelectLogout = createSelector(selectState, (state) => state.logout);

export default authReducer;
