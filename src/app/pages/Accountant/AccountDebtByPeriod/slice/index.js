import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { AccountDebtByPeriodSaga } from './saga';

export const initialState = {
  loading: false,
  detail: {},
  debtPeriod: {},
  currDebtPeriod: {},
  overviewStats: {},
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
};

const slice = createSlice({
  name: 'AccountDebtByPeriod',
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
    getCurrDebtPeriod(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    getCurrDebtPeriodDone(state, action) {
      const detail = action.payload;
      state.currDebtPeriod = detail;
      state.loading = false;
    },
    getCurrDebtPeriodError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: AccountDebtByPeriodActions } = slice;

export const useAccountDebtByPeriodSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: AccountDebtByPeriodSaga });
  return { actions: slice.actions };
};
