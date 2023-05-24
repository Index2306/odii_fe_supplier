import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.AccountDeabtPeriodOverview || initialState;

export const AccountDeabtPeriodOverview = createSelector(
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
export const selectListDebtPeriodTime = createSelector(
  [selectSlice],
  state => state.listDebtPeriodTime.data,
);
export const selectOverviewStats = createSelector(
  [selectSlice],
  state => state.overviewStats.data,
);

export const selectTimeline = createSelector(
  [selectSlice],
  state => state.timeline.data,
);

export const selectTransactions = createSelector(
  [selectSlice],
  state => state.transactions.data,
);

export const selectTransactionsPagination = createSelector(
  [selectSlice],
  state => state.transactions.pagination,
);

export const selectDebtTimeline = createSelector(
  [selectSlice],
  state => state.debt_timeline?.data || [],
);
