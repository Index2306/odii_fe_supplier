import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.infobusiness || initialState;

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectDataRegisterSupplier = createSelector(
  [selectSlice],
  state => {
    const data = state.data.data;
    return data;
  },
);
export const selectPagination = createSelector(
  [selectSlice],
  state => state.data.pagination,
);

export const selectDataBanksSupplier = createSelector([selectSlice], state => {
  const dataBanksSupplier = state.dataBanksSupplier.data;
  return dataBanksSupplier;
});
// export const selectDetail = createSelector(
//   [selectSlice],
//   state => state.detail.data,
// );
