import { call, put, takeLatest } from "redux-saga/effects";
import { api } from "@/app/lib/api";
import { fetchUsersFailure, fetchUsersRequest, fetchUsersSuccess } from "@/app/stores/reducers/dashboard/userSlice";

// --- Worker Saga ---
function* fetchUserSaga(): Generator<any, void, any> {
  try {
    // gọi API NestJS, ví dụ GET /auth/me
    const response = yield call(api.get, "/auth/me");
    yield put(fetchUsersSuccess(response.data));
  } catch (error: any) {
    yield put(fetchUsersFailure(error.response?.data?.message || "Failed to fetch user"));
  }
}

// --- Watcher Saga ---
export default function* userSaga() {
  yield takeLatest(fetchUsersRequest.type, fetchUserSaga);
}
