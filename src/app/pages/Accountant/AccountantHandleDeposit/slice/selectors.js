import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.AccountantHandleDeposit || initialState;

export const selectAccountantHandleDeposit = createSelector(
  [selectSlice],
  state => state,
);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectListSelected = createSelector(
  [selectSlice],
  state => state.listSelected,
);

export const selectData = createSelector([selectSlice], state => {
  const data = state.data.data;
  return data;
});
export const selectPagination = createSelector(
  [selectSlice],
  state => state.data.pagination,
);
export const selectDetail = createSelector(
  [selectSlice],
  state => state.detail.data,
);
export const selectTimeline = createSelector(
  [selectSlice],
  state => state.timeline.data,
);
