/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "@/app/commons/ajax/client";
import { adminProfileAction, adminProfileErrorAction, adminProfileSuccessAction } from "@/app/stores/reducers/common";
import { NEXT_API_ADMIN_PROFILE_ENDPOINT } from "@/routes/nextApi";
import { call, put, takeLatest } from "redux-saga/effects";

function* adminProfileSaga(): Generator<any, void, unknown> {
  try {
    const resp: any = yield call(get, NEXT_API_ADMIN_PROFILE_ENDPOINT);
    if (resp?.code === 200) {
      yield put(adminProfileSuccessAction(resp.data));
    } else {
      yield put(adminProfileErrorAction());
    }
  } catch {
    yield put(adminProfileErrorAction());
  }
}
export default function* commonSaga() {
  yield takeLatest(adminProfileAction.type, adminProfileSaga);
}
