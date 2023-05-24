import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { productSourceSaga } from './saga';

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
};

const slice = createSlice({
  name: 'source',
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
    updateAndCreate(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    updateAndCreateDone(state, _action) {
      state.loading = false;
    },
    updateAndCreateError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: productSourceActions, reducer } = slice;

export const useProductSourceSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: productSourceSaga });
  return { actions: slice.actions };
};
