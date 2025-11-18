/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from "redux-saga/effects";
import { api } from "@/app/lib/api";
import {
  fetchUsersFailure,
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUserDetailRequest,
  fetchUserDetailSuccess,
  fetchUserDetailFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
} from "@/app/stores/reducers/dashboard/userSlice";

// --- Worker Saga: list users ---
function* fetchUserSaga(): Generator<any, void, any> {
  try {
    const response = yield call(api.get, "/users");
    // Debug log: inspect response from backend
    console.log("[userSaga] /users response", response?.data);
    yield put(fetchUsersSuccess(response.data));
  } catch (error: any) {
    console.error("[userSaga] /users error", error?.response?.data || error);
    yield put(fetchUsersFailure(error.response?.data?.message || "Failed to fetch user"));
  }
}

// --- Worker Saga: user detail ---
function* fetchUserDetailSaga(action: ReturnType<typeof fetchUserDetailRequest>): Generator<any, void, any> {
  try {
    const id = action.payload;
    const response = yield call(api.get, `/users/${id}`);
    console.log("[userSaga] /users/:id request id =", id);
    console.log("[userSaga] /users/:id response", response?.data);
    yield put(fetchUserDetailSuccess(response.data));
  } catch (error: any) {
    console.error("[userSaga] /users/:id error", error?.response?.data || error);
    yield put(fetchUserDetailFailure(error.response?.data?.message || "Failed to fetch user detail"));
  }
}

// --- Worker Saga: update user ---
function* updateUserSaga(action: ReturnType<typeof updateUserRequest>): Generator<any, void, any> {
  try {
    const { id, ...payload } = action.payload as { id: string };
    const response = yield call(api.patch, `/users/${id}`, payload);
    yield put(updateUserSuccess(response.data));
  } catch (error: any) {
    yield put(updateUserFailure(error.response?.data?.message || "Failed to update user"));
  }
}

// --- Watcher Saga ---
export default function* userSaga() {
  yield takeLatest(fetchUsersRequest.type, fetchUserSaga);
  yield takeLatest(fetchUserDetailRequest.type, fetchUserDetailSaga);
  yield takeLatest(updateUserRequest.type, updateUserSaga);
}
