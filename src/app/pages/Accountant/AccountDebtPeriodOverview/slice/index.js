import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { AccountDebtPeriodOverviewSaga } from './saga';

export const initialState = {
  loading: false,
  detail: {},
  listDebtPeriodTime: [],
  overviewStats: {},
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
  timeline: {},
  transactions: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
  timeline_debt: {},
};

const slice = createSlice({
  name: 'AccountDeabtPeriodOverview',
  initialState,
  reducers: {
    getData(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    getDone(state, action) {
      const repos = action.payload;
      state.data = repos;
      state.loading = false;
    },
    getError(state) {
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
    getListDebtPeriodTime(state, _action) {
      state.loading = true;
      // state.listDebtPeriodTime = {};
    },
    getListDebtPeriodTimeDone(state, action) {
      state.listDebtPeriodTime = action.payload;
      state.loading = false;
    },
    getListDebtPeriodTimeError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
    getOverviewStats(state, _action) {
      state.loading = true;
      // state.listDebtPeriodTime = {};
    },
    getOverviewStatsDone(state, action) {
      state.overviewStats = action.payload;
      state.loading = false;
    },
    getOverviewStatsError(state) {
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
    getTransactions(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    getTransactionsDone(state, action) {
      const repos = action.payload;
      state.transactions = repos;
      state.loading = false;
    },
    getTransactionsError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    AccountantUpdateConfirm(state, _action) {
      state.loading = true;
      // state.data = {};
    },

    ChiefAccountantUpdateConfirm(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    updateDebtProgress(state, _action) {
      state.loading = true;
    },
    updateDebtProgressDone(state, _action) {
      state.loading = false;
    },
    updateDebtProgressError(state, _action) {
      state.loading = false;
    },
    getDebtTimeline(state, _action) {
      state.loading = true;
    },
    getDebtTimelineDone(state, action) {
      const timeline = action.payload;
      state.debt_timeline = timeline;
      state.loading = false;
    },
    getDebtTimelineError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: AccountDebtPeriodOverviewActions } = slice;

export const useAccountDebtPeriodOverviewSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: AccountDebtPeriodOverviewSaga });
  return { actions: slice.actions };
};
