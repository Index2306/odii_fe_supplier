import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.revenue || initialState;

export const selectRevenue = createSelector([selectSlice], state => state);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectShowEmptyPage = createSelector(
  [selectSlice],
  state => state.showEmptyPage,
);

export const selectData = createSelector([selectSlice], state => {
  const data = state.data.data;
  return data;
});

export const selectDataBalance = createSelector([selectSlice], state => {
  const dataBalance = state.dataBalance.data;
  return dataBalance;
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
