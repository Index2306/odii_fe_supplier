import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { warehouseImportSaga } from './saga';

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
  name: 'warehouse_import',
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
    updateState(state, _action) {
      state.loading = true;
    },
    updateStateDone(state, _action) {
      state.loading = false;
    },
    updateStateError(state, _action) {
      state.loading = false;
    },
    cancelWarehouseImport(state, _action) {
      state.loading = true;
    },
    cancelWarehouseImportDone(state, _action) {
      state.loading = false;
    },
    cancelWarehouseImportError(state, _action) {
      state.loading = false;
    },
  },
});

export const { actions: warehouseImportActions, reducers } = slice;

export const useWarehouseImportSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: warehouseImportSaga });
  return { actions: slice.actions };
};
