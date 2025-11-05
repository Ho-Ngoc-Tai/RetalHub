import { combineReducers } from "@reduxjs/toolkit";

import authReducer, { authSlice } from "./authSlice";
import { commonReducer, commonSlicer } from "./common";
import userReducer from "./dashboard/userSlice";

const dashboardReducer = combineReducers({
  user: userReducer,
});

export const rootReducer = combineReducers({
  [commonSlicer.name]: commonReducer,
  [authSlice.name]: authReducer,
  dashboard: dashboardReducer,
});

export default rootReducer;
