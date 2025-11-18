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
import type { SigninSession } from "@/app/stores/reducers/authSlice";
import { NEXT_API_SIGNIN_ENDPOINT, NEXT_LOGOUT_ENDPOINT } from "@/routes/nextApi";
import { post } from "@/app/commons/ajax/client";

interface SigninPayload {
  email: string;
  password: string;
}

function* callApiLogin(action: ReturnType<typeof signinAction>): Generator<any, void, unknown> {
  try {
    const payload = action.payload as SigninPayload;
    console.log("[authSaga] callApiLogin", payload);
    const response: any = yield call(post, NEXT_API_SIGNIN_ENDPOINT, {
      email: payload.email,
      password: payload.password,
    });

    console.log("[authSaga] API response", response);
    const result = response; // /api/auth/login trả về { code, success, data }

    if (result?.code === 200 || result?.success) {
      const data = result?.data ?? {};
      const session: SigninSession = {
        user: (data?.user as Record<string, unknown>) ?? null,
        accessToken: typeof data?.accessToken === "string" ? data.accessToken : undefined,
        refreshToken: typeof data?.refreshToken === "string" ? data.refreshToken : undefined,
        deviceId: typeof data?.deviceId === "string" ? data.deviceId : null,
      };

      console.log("[authSaga] dispatch signinSuccess", session);
      yield put(signinSuccess(session));
    } else {
      const errorPayload = result?.data ?? result;
      console.warn("[authSaga] dispatch signinFailure", errorPayload);
      yield put(signinFailure(errorPayload));
    }
  } catch (error: any) {
    console.error("[authSaga] callApiLogin error", error);
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
