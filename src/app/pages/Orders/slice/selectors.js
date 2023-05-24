import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.orders || initialState;

export const selectOrders = createSelector([selectSlice], state => state);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectShowEmptyPage = createSelector(
  [selectSlice],
  state => state.showEmptyPage,
);

export const selectOrderId = createSelector(
  [selectSlice],
  state => state.orderId,
);
export const selectData = createSelector(
  [selectSlice],
  state => state.data.data,
);
export const selectPagination = createSelector(
  [selectSlice],
  state => state.data.pagination,
);
export const selectDetail = createSelector(
  [selectSlice],
  state => state.detail,
);
export const selectListStores = createSelector(
  [selectSlice],
  state => state.listStores,
);

export const selectSelectedOrders = createSelector(
  [selectSlice],
  state => state.selectedOrders,
);

export const selectSummary = createSelector(
  [selectSlice],
  state => state.data.summary,
);

export const selectsystemTime = createSelector(
  [selectSlice],
  state => state.data.system_time,
);
