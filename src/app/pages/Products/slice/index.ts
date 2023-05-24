import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { productsSaga } from './saga';
import { ProductsState } from './types';

export const initialState: ProductsState = {
  loading: false,
  detail: {},
  total_detail: [],
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
    summary: [],
  },
};

const slice = createSlice({
  name: 'products',
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
    getDetail(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    getDetails(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    getDetailDone(state, action: PayloadAction) {
      const detail = action.payload;
      state.detail = detail;
      state.loading = false;
    },
    getDetailsDone(state, action: PayloadAction) {
      const details = action.payload;
      state.total_detail = details;
      state.loading = false;
    },
    getDetailError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
    getDetailsError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
    updateAndCreate(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    updateAndCreateDone(state, _action: PayloadAction) {
      state.loading = false;
    },
    updateAndCreateError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
    cloneProduct(state, _action: PayloadAction) {
      state.loading = true;
    },
    cloneProductDone(state, _action: PayloadAction) {
      state.loading = false;
    },
    cloneProductError(state, _action: PayloadAction) {
      state.loading = false;
    },
    cancelProduct(state, _action: PayloadAction) {
      state.loading = true;
    },
    cancelProductDone(state, _action: PayloadAction) {
      state.loading = false;
    },
    cancelProductError(state, _action: PayloadAction) {
      state.loading = false;
    },
    updateQuantity(state, _action: PayloadAction) {
      state.loading = false;
    },
    updateQuantityDone(state, _action: PayloadAction) {
      state.loading = false;
    },
    updateQuantityError(state, _action: PayloadAction) {
      state.loading = false;
    },
    updateState(state, _action: PayloadAction) {
      state.loading = true;
    },
    updateStateDone(state, _action: PayloadAction) {
      state.loading = false;
    },
    updateStateError(state, _action: PayloadAction) {
      state.loading = false;
    },
  },
});

export const { actions: productsActions } = slice;

export const useProductsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: productsSaga });
  return { actions: slice.actions };
};
