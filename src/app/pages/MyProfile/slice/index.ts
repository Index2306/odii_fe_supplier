import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { myprofileSaga } from './saga';
import { MyProfileState } from './types';

export const initialState: MyProfileState = {
  loading: false,
  detail: {},
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
};

const slice = createSlice({
  name: 'myprofile',
  initialState,
  reducers: {
    getData(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    getDone(state, action: PayloadAction) {
      const repos = action.payload;
      state.data = repos;
      state.loading = false;
    },
    getError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    updateMyProfile(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    updateDone(state, _action: PayloadAction) {
      state.loading = false;
    },
    updateError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    getDetail(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
  },
});

export const { actions: myprofileActions } = slice;

export const useMyProfileSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: myprofileSaga });
  return { actions: slice.actions };
};
