import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchConnectionRequestsStart,
  fetchConnectionRequestsSuccess,
  fetchConnectionRequestsFailure,
  disconnectStudentStart,
  disconnectStudentSuccess,
  disconnectStudentFailure,
  countConnectionsSuccess,
  fetchTuitionDetailsStart,
  fetchTuitionDetailsSuccess,
  fetchTuitionDetailsFailure,
  updateTuitionDetailsStart,
  updateTuitionDetailsSuccess,
  updateTuitionDetailsFailure,
  fetchAllDetailsStart,
  fetchAllDetailsSuccess,
  fetchAllDetailsFailure,
} from "../../../slices/Teacher/StudentManagement/studentManagementSlice";

import { STUDENT_MANAGEMENT_API } from "../../../utils/api";
import fetcher from "../../../services/fetcher";
import { notify } from "../../../helpers/toast";

// Worker Saga with dynamic filtering
function* fetchConnectionRequestsSaga(action) {
  try {
    yield put(fetchConnectionRequestsStart());

    const { filters = {} } = action.payload || {};

    const queryParams = new URLSearchParams(filters).toString();

    const response = yield call(() =>
      fetcher(`${STUDENT_MANAGEMENT_API.CONNECTIONS}?${queryParams}`, {
        method: "GET",
      })
    );

    const { requests, pagination } = response.data;

    yield put(fetchConnectionRequestsSuccess({ requests, pagination }));
  } catch (error) {
    const message = error.message || "Something went wrong.";
    yield put(fetchConnectionRequestsFailure(message));
    notify.error("Student connections", message);
  }
}

// Worker saga to disconnect a student
function* disconnectStudentSaga(action) {
  try {
    yield put(disconnectStudentStart());

    const response = yield call(() =>
      fetcher(STUDENT_MANAGEMENT_API.DISCONNECT_STUDENT(action.payload.id), {
        method: "PATCH",
      })
    );

    yield put(disconnectStudentSuccess({ id: action.payload.id }));
    notify.success("Student disconnect", response?.message);
  } catch (error) {
    const message = error.message || "Failed to disconnect student.";
    yield put(disconnectStudentFailure(message));
    yield put(setToastAlert({ type: "error", message }));
  }
}

// worker saga to count the connections

function* countConnectionsSaga() {
  try {
    const response = yield call(() =>
      fetcher(STUDENT_MANAGEMENT_API.COUNT_CONNECTIONS, {
        method: "GET",
      })
    );

    yield put(countConnectionsSuccess(response?.data?.connection_count));
  } catch (error) {
    const message = error?.message || "Failed to check connection status.";
    notify.error("Count connection", message);
  }
}

// GET_TUITION_DETAILS action payload: { id: number | string }
function* fetchTuitionDetailsSaga(action) {
  try {
    yield put(fetchTuitionDetailsStart());

    const id = action?.payload?.id;

    // console.log("id", id);
    if (!id && id !== 0) {
      notify.error("Tuition details", "Missing tuition details id.");
    }

    const response = yield call(() =>
      fetcher(STUDENT_MANAGEMENT_API.GET_TUITION_DETAILS(id), {
        method: "GET",
      })
    );

    const details =
      response?.data?.tuition_details != null
        ? response.data.tuition_details
        : response?.data;

    yield put(fetchTuitionDetailsSuccess(details));
  } catch (error) {
    const message = error?.message || "Failed to fetch tuition details.";
    yield put(fetchTuitionDetailsFailure(message));
    notify.error("Tuition details", message);
  }
}

// update tuition details saga
function* updateTuitionDetailsSaga(action) {
  try {
    yield put(updateTuitionDetailsStart());

    const { id, data, navigate } = action.payload || {};

    // console.log("id", id);
    // console.log("data", data);

    if (!id && id !== 0) {
      notify.error("Tuition details", "Missing tuition details id.");
    }

    const response = yield call(() =>
      fetcher(STUDENT_MANAGEMENT_API.UPDATE_TUITION_DETAILS(id), {
        method: "PATCH",
        body: data,
      })
    );

    yield put(updateTuitionDetailsSuccess());
    notify.success(
      "Tuition details",
      response?.message || "Updated successfully."
    );

    if (navigate) {
      const dest = "/students";
      yield call(navigate, dest);
    }
  } catch (error) {
    const message = error?.message || "Failed to update tuition details.";
    yield put(updateTuitionDetailsFailure(message));
    notify.error("Tuition details", message);
  }
}

// get alll details saga

function* fetchAllDetailsSaga(action) {
  try {
    yield put(fetchAllDetailsStart());

    const connectionId = action?.payload?.connection_id;

    const response = yield call(() =>
      fetcher(STUDENT_MANAGEMENT_API.GET_SINGLE_CONNREQ_DETAILS(connectionId), {
        method: "GET",
      })
    );

    const details =
      response?.data?.connection != null
        ? response.data.connection
        : response?.data;

    yield put(fetchAllDetailsSuccess(details));
  } catch (error) {
    const message = error?.message || "Failed to fetch tuition details.";
    yield put(fetchAllDetailsFailure(message));
    // notify.error("Tuition details", message);
  }
}

// Watcher Saga
export default function* studentManagementSaga() {
  yield takeLatest("FETCH_CONNECTION_REQUESTS", fetchConnectionRequestsSaga);
  yield takeLatest("DISCONNECT_STUDENT", disconnectStudentSaga);
  yield takeLatest("CONNECTION_COUNT", countConnectionsSaga);
  yield takeLatest("GET_TUITION_DETAILS", fetchTuitionDetailsSaga);
  yield takeLatest("UPDATE_TUITION_DETAILS", updateTuitionDetailsSaga);
  yield takeLatest("GET_ALL_DETAILS", fetchAllDetailsSaga);
}
