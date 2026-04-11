import { call, put, takeLatest } from "redux-saga/effects";

import { TEACHER_HOME_API } from "../../../utils/api";

import fetcher from "../../../services/fetcher";
import { notify } from "../../../helpers/toast";
import {
  fetchTeacherDataFailure,
  fetchTeacherDataStart,
  fetchTeacherDataSuccess,
} from "../../../slices/Teacher/TeacherHome/teacherHomeSlice";

function* fetchTeacherHomeData() {
  try {
    yield put(fetchTeacherDataStart());

    const response = yield call(() =>
      fetcher(TEACHER_HOME_API.HOME_DATA, {
        method: "GET",
      })
    );

    yield put(fetchTeacherDataSuccess(response?.data?.teacher_data));
  } catch (error) {
    const message = error?.message || "Failed to fetch teacher home data.";
    notify.error("Tuition details", message);
    yield put(fetchTeacherDataFailure(message));
  }
}

// Watcher Saga
export default function* fetchTeacherHomeDataSaga() {
  yield takeLatest("teacherHomeData", fetchTeacherHomeData);
}
