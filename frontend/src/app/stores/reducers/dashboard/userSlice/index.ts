import { RootState } from "@/app/stores";
import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: number;
  website?: string;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

interface StateStyle {
  user: UserState
}

const initialState: StateStyle = {
  user: {
    users: [],
    loading: false,
    error: null,
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
    removeUser: (state, action: PayloadAction<number>) => {
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
  },
});

export const { addUser,
  updateUser,
  removeUser,
  clearUsers,
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure, } =
  userSlice.actions;
export default userSlice.reducer;

// --- SELECTORS ---
const selectUserState = (state: RootState ) => state.dashboard.user;

export const makeUser = createSelector(selectUserState, (state) => state.user);
// export const selectUsers = createSelector([selectUserState], (user) => user.users);
// export const selectUserLoading = createSelector([selectUserState], (user) => user.loading);
// export const selectUserError = createSelector([selectUserState], (user) => user.error);
