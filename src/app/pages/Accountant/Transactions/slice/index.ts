import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { transactionsSaga } from './saga';
import { TransactionsState } from './types';
import { isEmpty } from 'lodash';

export const initialState: TransactionsState = {
  loading: false,
  detail: {},
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
  timeline: {},
};

const slice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    getData(state, _action: PayloadAction) {
      state.loading = isEmpty(state.data.data);
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

    getDetail(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    getDetailDone(state, action: PayloadAction) {
      const detail = action.payload;
      state.detail = detail;
      state.loading = false;
    },
    getDetailError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    getTimeline(state, _action: PayloadAction) {
      state.loading = true;
    },
    getTimelineDone(state, action: PayloadAction) {
      const timeline = action.payload;
      state.timeline = timeline;
      state.loading = false;
    },
    getTimelineError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    transferStatus(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    transferStatusDetail(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
  },
});

export const { actions: transactionsActions } = slice;

export const useTransactionsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: transactionsSaga });
  return { actions: slice.actions };
};
