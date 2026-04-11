import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teacherData: null,
  loading: false,
  error: null,

  meta: null,
  overview: null,
  stats: null,
  schedule_today: [],
};

const teacherHomeSlice = createSlice({
  name: "teacherHome",
  initialState,
  reducers: {
    fetchTeacherDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTeacherDataSuccess(state, action) {
      state.loading = false;
      state.teacherData = action.payload;
      state.meta = action.payload?.meta || null;
      state.overview = action.payload?.overview || null;
      state.stats = action.payload?.stats || null;
      state.schedule_today = action.payload?.schedule_today || [];
    },
    fetchTeacherDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTeacherDataStart,
  fetchTeacherDataSuccess,
  fetchTeacherDataFailure,
} = teacherHomeSlice.actions;

export default teacherHomeSlice.reducer;
