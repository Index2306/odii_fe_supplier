import { createSelector } from '@reduxjs/toolkit';
import { initialState } from '.';

const selectSlice = state => state.promotions || initialState;

export const selectPromorion = createSelector([selectSlice], state => state);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectData = createSelector(
  [selectSlice],
  state => state.data.data,
);

export const selectPaginationListPromotion = createSelector(
  [selectSlice],
  state => state.data.pagination,
);

export const selectDetail = createSelector(
  [selectSlice],
  state => state.detail,
);

export const selectDataListDiscount = createSelector(
  [selectSlice],
  state => state.DataListDiscount.data,
);
export const selectPaginationListDiscount = createSelector(
  [selectSlice],
  state => state.DataListDiscount.pagination,
);