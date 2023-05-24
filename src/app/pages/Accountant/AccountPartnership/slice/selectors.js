import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.affiliate || initialState;

export const selectAffiliate = createSelector([selectSlice], state => state);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectShowEmptyPageListPayout = createSelector(
  [selectSlice],
  state => state.showEmptyPageListPayout,
);

export const selectShowEmptyPageListAffiliater = createSelector(
  [selectSlice],
  state => state.showEmptyPageListAffiliater,
);

export const selectListSelected = createSelector(
  [selectSlice],
  state => state.listSelected,
);

export const selectDataListPeriodPayout = createSelector(
  [selectSlice],
  state => {
    const dataListPeriodPayout = state.dataListPeriodPayout.data;
    return dataListPeriodPayout;
  },
);

export const selectDataStatisticalAffiliate = createSelector(
  [selectSlice],
  state => {
    const dataStatisticalAffiliate = state.dataStatisticalAffiliate.data;
    return dataStatisticalAffiliate;
  },
);
export const selectDataListPayout = createSelector([selectSlice], state => {
  const dataListPayout = state.dataListPayout.data;
  return dataListPayout;
});
export const selectDataListAffiliater = createSelector([selectSlice], state => {
  const dataListAffiliater = state.dataListAffiliater.data;
  return dataListAffiliater;
});
export const selectDataTopAffiliater = createSelector([selectSlice], state => {
  const dataTopAffiliater = state.dataTopAffiliater;
  return dataTopAffiliater;
});

export const selectPaginationListPayout = createSelector(
  [selectSlice],
  state => state.dataListPayout.pagination,
);
export const selectPaginationListAffiliater = createSelector(
  [selectSlice],
  state => state.dataListAffiliater.pagination,
);

export const selectDetail = createSelector(
  [selectSlice],
  state => state.detail.data,
);
export const selectTimeline = createSelector(
  [selectSlice],
  state => state.timeline.data,
);

export const TransferStatusAffilliateDetail = createSelector(
  [selectSlice],
  state => state.TransferStatusAffilliateDetail.data,
);

export const selectDataListOrderSeller = createSelector(
  [selectSlice],
  state => state.dataListOrderSeller.data,
);

export const selectPaginationListOrderSeller = createSelector(
  [selectSlice],
  state => state.dataListOrderSeller.pagination,
);
