import { call, delay, put, takeLatest, takeLeading } from "redux-saga/effects";
import * as SecureStore from "expo-secure-store";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  signedOut,
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailure,
} from "../../slices/Auth/authSlice";

import { AUTH_API } from "../../utils/api";
import fetcher from "../../services/fetcher";

// Optional purge ( wipe persisted storage on logout)
import { purgeStoredState } from "redux-persist";
import { authPersistConfig } from "../../store/persistConfig";
import { notify } from "../../helpers/toast";

// helpers
function* setToken(token) {
  try {
    yield call(SecureStore.setItemAsync, "authToken", token);
  } catch {}
}
function* clearToken() {
  try {
    yield call(SecureStore.deleteItemAsync, "authToken");
  } catch {}
}

// Login Saga
function* loginSaga({ payload }) {
  const { loginData, navigate } = payload || {};
  try {
    yield put(loginStart());

    const response = yield call(fetcher, AUTH_API.LOGIN, {
      method: "POST",
      body: loginData,
      auth: false,
    });

    const data = response?.data || response;

    if (!data?.token) {
      throw new Error(data?.message || "Login failed.");
    }

    // persist token for fetcher and keep in Redux (persisted slice)
    yield call(setToken, data.token);
    yield put(loginSuccess(data));

    notify.success("Login success", response?.message);

    // role-based redirect
    if (navigate) {
      // const dest = data?.user?.role === "teacher" ? "/" : "/home";
      const dest = "/";
      yield call(navigate, dest);
    }
  } catch (error) {
    const message = error.message || "Login failed.";
    notify.error("Login failed", message);
    yield put(loginFailure(message));
  }
}

// Registration Saga
function* registerSaga({ payload }) {
  const { registerData, navigate } = payload || {};
  try {
    yield put(registerStart());

    const response = yield call(fetcher, AUTH_API.REGISTER, {
      method: "POST",
      body: registerData,
      auth: false,
    });

    // const data = response?.data || response;
    // if (data?.status && data.status !== "success") {
    //   throw new Error(data.message || "Registration failed.");
    // }

    yield put(registerSuccess());
    notify.success("Registration success", response?.message);

    // Navigate to sign in
    if (navigate) {
      yield call(navigate, "/(auth)/signIn");
    }
  } catch (error) {
    const message = error.message || "Registration failed.";
    notify.error("Registration failed", message);
    yield put(registerFailure(message));
  }
}

export function* logoutSaga({ payload }) {
  const { navigate, reason } = payload || {};

  // (optional) toast for UX clarity
  if (reason) {
    notify.error("Session expired", reason || "Please sign in again.");
    yield delay(250); // let the toast render before nav
  }

  // Clear device token + reset Redux state
  yield call(clearToken);
  yield put(signedOut());

  if (!reason) {
    notify.success("Logged out", "You have been logged out.");
  }

  // OPTIONAL: wipe persisted state (hard reset)
  yield call(purgeStoredState, authPersistConfig);

  // Navigate back to Welcome
  if (typeof navigate === "function") {
    const dest = "/(auth)/welcome";
    yield call(navigate, dest);
  }
}

function* forgotPasswordSaga({ payload }) {
  try {
    const { email } = payload || {};
    yield put(forgotPasswordStart());

    const res = yield call(fetcher, AUTH_API.FORGOT_PASSWORD, {
      method: "POST",
      body: { email },
      auth: false,
    });

    yield put(forgotPasswordSuccess());
    notify.success(
      "Forgot password",
      res?.message || "If that email exists, a reset link was sent."
    );
  } catch (error) {
    const message = error?.message || "Failed to send reset link.";
    yield put(forgotPasswordFailure(message));
    notify.error("Forgot password", message);
  }
}

// in your auth saga file
function* changePasswordSaga({ payload }) {
  const { data } = payload || {};
  try {
    // start
    yield put(changePasswordStart());

    const res = yield call(fetcher, AUTH_API.CHANGE_PASSWORD, {
      method: "POST",
      body: data,
    });

    // success
    yield put(changePasswordSuccess());
    notify.success(
      "Password changed",
      res?.message || "Password updated successfully."
    );
  } catch (error) {
    const message = error?.message || "Unable to change password.";
    yield put(changePasswordFailure(message));
    notify.error("Change password failed", message);
  }
}

// Root Auth Saga
export default function* authSaga() {
  yield takeLatest("LOGIN", loginSaga);
  yield takeLatest("REGISTER", registerSaga);
  yield takeLeading("LOGOUT", logoutSaga);
  yield takeLatest("FORGOT_PASSWORD", forgotPasswordSaga);

  yield takeLatest("CHANGE_PASSWORD", changePasswordSaga);
}
