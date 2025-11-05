import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/app/stores/index";

export const commonSlicer = createSlice({
  name: "common",
  initialState: {
    isCommon: false,
    profile: {
      isCalling: false,
      isSuccess: false,
      isError: false,
      profile: null,
      roles: [],
    },
  },
  reducers: {
    adminProfileAction(state) {
      state.profile.isCalling = true;
      state.profile.isSuccess = false;
      state.profile.isError = false;
    },
    adminProfileSuccessAction(state, action) {
      state.profile.isCalling = false;
      state.profile.isSuccess = true;
      state.profile.isError = false;
      state.profile.profile = action.payload?.profile || null;
      state.profile.roles = action.payload?.roles;
    },
    adminProfileErrorAction(state) {
      state.profile.isCalling = false;
      state.profile.isSuccess = false;
      state.profile.isError = true;
    },
  },
});
export const commonReducer = commonSlicer.reducer;

export const { adminProfileAction, adminProfileSuccessAction, adminProfileErrorAction } = commonSlicer.actions;

const selectState = (state: RootState) => state.common;

export const makeAdminProfile = createSelector(selectState, (state) => state.profile?.profile);
export const makeRoles = createSelector(selectState, (state) => state.profile?.roles);
export const makeAdminInfo = createSelector(selectState, (state) => state.profile);
