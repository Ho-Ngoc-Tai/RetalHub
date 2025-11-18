/* eslint-disable @typescript-eslint/no-unused-vars */
import { RootState } from "@/app/stores";
import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: number;
  website?: string;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
  detailLoading: boolean;
  detailError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  updateSuccess: boolean;
}

interface StateStyle {
  user: UserState
}

const initialState: StateStyle = {
  user: {
    users: [],
    loading: false,
    error: null,
    selectedUser: null,
    detailLoading: false,
    detailError: null,
    updateLoading: false,
    updateError: null,
    updateSuccess: false,
  }
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // --- CRUD ---
    addUser: (state, action: PayloadAction<User>) => {
      state.user.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const idx = state.user.users.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) {
        state.user.users[idx] = { ...state.user.users[idx], ...action.payload };
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.user.users = state.user.users.filter((u) => u.id !== action.payload);
    },
    clearUsers: (state) => {
      state.user.users = [];
    },

    // --- FETCH API ---
    fetchUsersRequest: (state) => {
      state.user.loading = true;
      state.user.error = null;
    },
    fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.user.loading = false;
      state.user.users = action.payload;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.user.loading = false;
      state.user.error = action.payload;
    },

    // --- DETAIL USER ---
    fetchUserDetailRequest: (state, _action: PayloadAction<string>) => {
      state.user.detailLoading = true;
      state.user.detailError = null;
      state.user.selectedUser = null;
    },
    fetchUserDetailSuccess: (state, action: PayloadAction<User>) => {
      state.user.detailLoading = false;
      state.user.selectedUser = action.payload;
    },
    fetchUserDetailFailure: (state, action: PayloadAction<string>) => {
      state.user.detailLoading = false;
      state.user.detailError = action.payload;
    },

    // --- UPDATE USER (call API) ---
    updateUserRequest: (state, _action: PayloadAction<User>) => {
      state.user.updateLoading = true;
      state.user.updateError = null;
      state.user.updateSuccess = false;
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.user.updateLoading = false;
      state.user.updateSuccess = true;

      // sync list
      const idx = state.user.users.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) {
        state.user.users[idx] = { ...state.user.users[idx], ...action.payload };
      }

      // sync selected user
      state.user.selectedUser = action.payload;
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.user.updateLoading = false;
      state.user.updateError = action.payload;
      state.user.updateSuccess = false;
    },
  },
});

export const { addUser,
  updateUser,
  removeUser,
  clearUsers,
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserDetailRequest,
  fetchUserDetailSuccess,
  fetchUserDetailFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure, } =
  userSlice.actions;
export default userSlice.reducer;

// --- SELECTORS ---
const selectUserState = (state: RootState ) => state.dashboard.user;

export const makeUser = createSelector(selectUserState, (state) => state.user);
export const makeUserDetail = createSelector(selectUserState, (state) => ({
  data: state.user.selectedUser,
  isCalling: state.user.detailLoading,
  isError: !!state.user.detailError,
  error: state.user.detailError,
}));

export const makeUserUpdate = createSelector(selectUserState, (state) => ({
  isCalling: state.user.updateLoading,
  isError: !!state.user.updateError,
  error: state.user.updateError,
  isSuccess: state.user.updateSuccess,
}));
// export const selectUsers = createSelector([selectUserState], (user) => user.users);
// export const selectUserLoading = createSelector([selectUserState], (user) => user.loading);
// export const selectUserError = createSelector([selectUserState], (user) => user.error);
