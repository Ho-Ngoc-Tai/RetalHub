/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from "redux-saga/effects";
import {
  logoutAction,
  logoutFailure,
  logoutSuccess,
  signinAction,
  signinFailure,
  signinSuccess,
} from "@/app/stores/reducers/authSlice";
import { post } from "@/app/commons/ajax/client";
import { NEXT_API_SIGNIN_ENDPOINT, NEXT_LOGOUT_ENDPOINT } from "@/app/routes/nextApi";

interface SigninPayload {
  email: string;
  password: string;
}

function* callApiLogin(action: ReturnType<typeof signinAction>): Generator<any, void, unknown> {
  try {
    const payload = action.payload as SigninPayload;
    const response: any = yield call(post, NEXT_API_SIGNIN_ENDPOINT, {
      ...payload,
    });
    const result = response?.data ?? response;

    if (result?.code === 200 || result?.success) {
      yield put(signinSuccess(result.data));
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } else {
      yield put(signinFailure(result));
    }
  } catch (error: any) {
    yield put(signinFailure(error?.response?.data ?? error));
  }
}

function* callApiLogout(): Generator<any, void, unknown> {
  try {
    const response: any = yield call(post, NEXT_LOGOUT_ENDPOINT, {});
    const result = response?.data ?? response;

    if (result?.code === 200 || result?.success) {
      yield put(logoutSuccess());
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } else {
      yield put(logoutFailure(result));
    }
  } catch (error: any) {
    yield put(logoutFailure(error?.response?.data ?? error));
  }
}

export function* authSaga() {
  yield takeLatest(signinAction.type, callApiLogin);
  yield takeLatest(logoutAction.type, callApiLogout);
}
