import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { promotionSaga } from './saga';

export const initialState = {
  loading: false,
  detail: {},
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
  DataListDiscount: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
};

const slice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {
    getData(state, _action) {
      state.loading = true;
    },
    getDone(state, action) {
      const repos = action.payload;
      state.data = repos;
      state.loading = false;
    },
    getError(state) {
      state.loading = false;
    },
    getDataListDiscount(state, _action) {
      state.loading = true;
    },
    getDataListDiscountDone(state, action) {
      const repos = action.payload;
      state.DataListDiscount = repos;
      state.loading = false;
    },
    getDataListDiscountError(state) {
      state.loading = false;
    },
    getDetail(state, _action) {
      state.loading = true;
    },
    getDetailDone(state, action) {
      const detail = action.payload;
      state.detail = detail;
      state.loading = false;
    },
    getDetailError(state) {
      state.loading = false;
    },
    updateAndCreate(state, _action) {
      state.loading = true;
    },
    updateAndCreateDone(state, _action) {
      state.loading = false;
    },
    updateAndCreateError(state) {
      state.loading = false;
    },
    updatePayoutPromotion(state, _action) {
      state.loading = true;
    },
    updatePayoutPromotionDone(state, _action) {
      state.loading = false;
    },
    updatePayoutPromotionError(state) {
      state.loading = false;
    },
    delPromotion(state, _action) {
      state.loading = true;
    },
    delPromotionDone(state, _action) {
      state.loading = false;
    },
    delPromotionError(state) {
      state.loading = false;
    },
    updateState(state, _action) {
      state.loading = true;
    },
    updateStateDone(state, _action) {
      state.loading = false;
    },
    updateStateError(state) {
      state.loading = false;
    },
  },
});

export const { actions: promotionActions, reducers } = slice;

export const usePromotionSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: promotionSaga });
  return { actions: slice.actions };
};
