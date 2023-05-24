import { createSelector } from '@reduxjs/toolkit';
import { initialState } from '.';

const selectSlice = state => state.warehouse_export || initialState;

export const selectWarehouseImport = createSelector(
  [selectSlice],
  state => state,
);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
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
