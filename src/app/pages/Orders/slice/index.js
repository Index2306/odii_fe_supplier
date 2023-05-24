import { createSlice } from 'utils/@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { ordersSaga } from './saga';

export const initialState = {
  loading: false,
  showEmptyPage: false,
  isFirst: true,
  details: [],
  selectedOrders: {},
  listStores: [],
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
    summary: [],
    system_time: '',
  },
};

const slice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setListStores(state, action) {
      state.listStores = action.payload;
    },
    setOrderId(state, action) {
      state.orderId = action.payload;
    },
    getData(state, _action) {
      state.loading = isEmpty(state.data.data);
    },
    getDone(state, action) {
      const repos = action.payload;
      state.data = repos;
      if (repos?.summary && repos.summary[0].record_cnt !== '0') {
        state.showEmptyPage = false;
      } else if (state.isFirst) {
        state.showEmptyPage = true;
      }
      state.isFirst = false;
      state.loading = false;
    },
    getError(state) {
      // state.error = action.payload;
      state.loading = false;
    },
    resetWhenLeave(state) {
      state.isFirst = true;
      state.showEmptyPage = false;
      state.selectedOrders = {};
    },
    setShowEmptyPage(state, action) {
      // state.error = action.payload;
      state.showEmptyPage = action.payload;
    },
    updateLists(state, action) {
      const index = state.data.data.findIndex(
        todo => todo.id === action.payload.id,
      );
      state.data.data[index].fulfillment_status = action.payload.status;
    },
    getDetail(state, _action) {
      state.loading = true;
      state.detail = {};
    },
    getDetailDone(state, action) {
      const detail = action.payload;
      state.detail = detail;
      state.loading = false;
    },
    getDetailError(state, action) {
      // state.error = action.payload;
      if (action.payload.error_code === 'order_not_found') {
        state.showEmptyPage = true;
      }
      state.loading = false;
    },
    clearEmptyPage(state) {
      state.showEmptyPage = false;
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
    setSelectedOrders(state, action) {
      const data = action.payload;
      state.selectedOrders = data;
    },
    updateQrChecked(state, _action) {
      state.loading = true;
    },
    updateQrCheckedDone(state, _action) {
      state.loading = true;
    },
    updateQrCheckedError(state) {
      state.loading = true;
    },
  },
});

export const { actions: ordersActions, reducer } = slice;

export const useOrdersSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: ordersSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useOrdersSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
