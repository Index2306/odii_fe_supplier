import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { infobusinessSaga } from './saga';
import { InfoBusinessState } from './types';
export const initialState: InfoBusinessState = {
  loading: false,
  detail: {},
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
  dataBanksSupplier: [],
};

const slice = createSlice({
  name: 'infobusiness',
  initialState,
  reducers: {
    getDataRegisterSupplier(state, _action: PayloadAction) {
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

    getBanksSupplier(state, _action) {
      state.loading = true;
    },
    getBanksSupplierDone(state, action) {
      const repos = action.payload;
      state.dataBanksSupplier = repos;
      state.loading = false;
    },
    getBanksSupplierError(state) {
      state.loading = false;
    },

    //Supplier Add Bank
    SupplierAddBank(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    SupplierAddBankDone(state, action) {
      // const repos = action.payload;
      // state.data = repos;
      state.loading = false;
    },
    SupplierAddBankError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    //Supplier Update Bank
    SupplierUpdateBank(state, _action) {
      state.loading = true;
      // state.data = {};
    },
    SupplierUpdateBankDone(state, action) {
      // const repos = action.payload;
      // state.data = repos;
      state.loading = false;
    },
    SupplierUpdateBankError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: infobusinessActions } = slice;

export const useInfoBusinessSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: infobusinessSaga });
  return { actions: slice.actions };
};
