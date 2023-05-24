// import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { revenueSaga } from './saga';
// import { RevenueState } from './types';
import { isEmpty } from 'lodash';

export const initialState = {
  loading: false,
  showEmptyPage: false,
  isFirst: true,
  detail: {},
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
  dataBalance: [],
  timeline: {},
};

const slice = createSlice({
  name: 'revenue',
  initialState,
  reducers: {
    getData(state, _action) {
      state.loading = isEmpty(state.data.data);
      // state.data = {};
    },
    getDone(state, action) {
      const repos = action.payload;
      state.data = repos;
      if (!isEmpty(repos.data)) {
        state.showEmptyPage = false;
      }
      if (isEmpty(repos.data) && state.isFirst) {
        state.showEmptyPage = true;
      }
      state.isFirst = false;
      state.loading = false;
    },
    getError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    setShowEmptyPage(state, action) {
      // state.error = action.payload;
      state.showEmptyPage = action.payload;
    },
    clearEmptyPage(state) {
      state.showEmptyPage = false;
    },
    resetWhenLeave(state) {
      state.isFirst = true;
      state.showEmptyPage = false;
    },

    getBalance(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    getBalanceDone(state, action) {
      const repos = action.payload;
      state.dataBalance = repos;
      state.loading = false;
    },
    getBalanceError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    getDetail(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    getDetailDone(state, action) {
      const detail = action.payload;
      state.detail = detail;
      state.loading = false;
    },
    getDetailError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    getTimeline(state, _action) {
      state.loading = true;
    },
    getTimelineDone(state, action) {
      const timeline = action.payload;
      state.timeline = timeline;
      state.loading = false;
    },
    getTimelineError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: revenueActions } = slice;

export const useRevenueSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: revenueSaga });
  return { actions: slice.actions };
};
