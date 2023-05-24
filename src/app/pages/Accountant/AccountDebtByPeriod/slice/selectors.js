import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.AccountDebtByPeriod || initialState;

export const AccountDeabtByPeriod = createSelector(
  [selectSlice],
  state => state,
);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
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
export const selectCurrDebtPeriod = createSelector(
  [selectSlice],
  state => state.currDebtPeriod.data,
);
export const selectOverviewStats = createSelector(
  [selectSlice],
  state => state.overviewStats.data?.[0] || {},
);
