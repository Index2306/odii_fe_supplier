import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { AffiliateSaga } from './saga';
import { AffiliateState } from './types';
import { isEmpty } from 'lodash';

export const initialState: AffiliateState = {
  loading: false,

  showEmptyPageListPayout: false,
  showEmptyPageListAffiliater: false,

  isFirstListPayout: true,
  isFirstListAffiliater: true,

  detail: {},
  listSelected: [],

  dataListPayout: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
  dataListAffiliater: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
  dataListOrderSeller: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
  timeline: {},
  dataListPeriodPayout: [],
  dataStatisticalAffiliate: [],
  dataTopAffiliater: [],
};

const slice = createSlice({
  name: 'affiliate',
  initialState,
  reducers: {
    setListSelected(state, action) {
      state.listSelected = action.payload;
    },

    getDataListPeriodPayout(state, _action) {
      state.loading = isEmpty(state.dataListPeriodPayout.data);
    },
    getDataListPeriodPayoutDone(state, action) {
      const repos = action.payload;
      state.dataListPeriodPayout = repos;
      state.loading = false;
    },
    getError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    resetWhenLeave(state) {
      state.isFirstListPayout = true;
      state.showEmptyPageListPayout = false;
      state.isFirstListAffiliater = true;
      state.showEmptyPageListAffiliater = false;
    },

    getDataListPayout(state, _action) {
      state.loading = isEmpty(state.dataListPayout.data);
    },
    getDataListPayoutDone(state, action) {
      const repos = action.payload;
      state.dataListPayout = repos;
      // state.dataTopAffiliateSeller = repos.data;
      if (isEmpty(repos.data) && state.isFirstListPayout) {
        state.showEmptyPageListPayout = true;
      }
      state.isFirstListPayout = false;
      state.loading = false;
    },
    getDataListAffiliater(state, _action) {
      // state.loading = isEmpty(state.dataListAffiliater.data);
    },
    getDataListAffiliaterDone(state, action) {
      const repos = action.payload;
      state.dataListAffiliater = repos;
      // state.dataTopAffiliateSeller = repos.data;
      if (isEmpty(repos.data) && state.isFirstListAffiliater) {
        state.showEmptyPageListAffiliater = true;
      }
      state.isFirstListAffiliater = false;
      state.loading = false;
    },
    getDataTopAffiliater(state, _action) {
      state.loading = isEmpty(state.dataTopAffiliater.data);
    },
    getDataTopAffiliaterDone(state, action) {
      const repos = action.payload;
      state.dataTopAffiliater = repos.data;
      state.loading = false;
    },

    getDataStatisticalAffiliate(state, _action) {
      state.loading = isEmpty(state.dataStatisticalAffiliate.data);
    },
    getDataStatisticalAffiliateDone(state, action) {
      const repos = action.payload;
      state.dataStatisticalAffiliate = repos;
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

    getTimeline(state, _action) {
      state.loading = true;
    },
    getTimelineDone(state, action) {
      const timeline = action.payload;
      state.timeline = timeline;
      state.loading = false;
    },
    TransferStatusAffilliateDetail(state, _action) {
      state.loading = true;
    },
    getDataListOrderSeller(state, _action) {
      state.loading = true;
    },
    getDataListOrderSellerDone(state, action) {
      const repos = action.payload;
      state.dataListOrderSeller = repos;
      state.loading = false;
    },
  },
});

export const { actions: AffiliateActions } = slice;

export const useAffiliateSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: AffiliateSaga });
  return { actions: slice.actions };
};
