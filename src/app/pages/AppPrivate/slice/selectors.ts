import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.global || initialState;

export const selectGlobal = createSelector([selectSlice], state => state);

export const selectAccessToken = createSelector(
  [selectSlice],
  globalFormState => globalFormState.accessToken,
);

export const selectBreadcrumb = createSelector(
  [selectSlice],
  globalFormState => globalFormState.breadcrumb,
);

export const selectRoles = createSelector(
  [selectSlice],
  globalFormState => globalFormState.userInfo?.roles ?? [],
);

export const selectCurrentUser = createSelector(
  [selectSlice],
  globalFormState => globalFormState.userInfo || {},
);

export const selectCurrentModal = createSelector(
  [selectSlice],
  globalFormState => globalFormState.currentModal || [],
);

export const selectLoading = createSelector(
  [selectSlice],
  globalFormState => globalFormState.loading,
);
