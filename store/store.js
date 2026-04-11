import { configureStore } from "@reduxjs/toolkit";
const createSagaMiddleware = require("redux-saga").default;
import { persistReducer, persistStore } from "redux-persist";

import rootSaga from "../sagas/rootSaga";
import authReducer from "../slices/Auth/authSlice";
import connectStudentsReducer from "../slices/Teacher/ConnectStudents/connectStudentSlice";
import scheduleTuitionEventsReducer from "../slices/Teacher/Schedule/scheduleTuitionEventsSlice";
import studentManagementReducer from "../slices/Teacher/StudentManagement/studentManagementSlice";
import notificationsReducer from "../slices/Notification/notificationSlice";
import teacherHomeReducer from "../slices/Teacher/TeacherHome/teacherHomeSlice";
import { authPersistConfig } from "./persistConfig";

import { router } from "expo-router";
import { setOnUnauthorized } from "../services/fetcher";

const sagaMiddleware = createSagaMiddleware();

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // only this is persisted
    connectStudents: connectStudentsReducer,
    scheduleTuitionEvents: scheduleTuitionEventsReducer,
    studentManagement: studentManagementReducer,
    notifications: notificationsReducer,
    teacherHomeData: teacherHomeReducer,
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
        ignoredActionPaths: ["payload.navigate"],
      },
    }).concat(sagaMiddleware),
});

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

/** ========= Global unauthorized behavior ========= */
let loggingOut = false;
setOnUnauthorized((err) => {
  if (loggingOut) return;
  loggingOut = true;

  store.dispatch({
    type: "LOGOUT",
    payload: {
      reason: err?.message, // optional: show in toast
      navigate: (path) => router.replace(path), // pass router into saga
    },
  });

  // prevent duplicate dispatches if multiple requests fail together
  setTimeout(() => {
    loggingOut = false;
  }, 1000);
});
/** =============================================== */

export default store;
