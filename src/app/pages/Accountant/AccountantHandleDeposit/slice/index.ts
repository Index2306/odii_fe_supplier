import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { AccountantHandleDepositSaga } from './saga';
import { AccountantHandleDepositState } from './types';
import { isEmpty } from 'lodash';

export const initialState: AccountantHandleDepositState = {
  loading: false,
  detail: {},
  listSelected: [],
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
  name: 'AccountantHandleDeposit',
  initialState,
  reducers: {
    setListSelected(state, action) {
      state.listSelected = action.payload;
    },

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

    AccountantUpdateConfirm(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },

    ChiefAccountantUpdateConfirm(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
  },
});

export const { actions: AccountantHandleDepositActions } = slice;

export const useAccountantHandleDepositSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: AccountantHandleDepositSaga });
  return { actions: slice.actions };
};
