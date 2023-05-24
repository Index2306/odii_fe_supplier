import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.verify || initialState;

export const selectVerify = createSelector([selectSlice], state => state);

export const selectLoading = createSelector(
  [selectSlice],
  verify => verify.loading,
);
