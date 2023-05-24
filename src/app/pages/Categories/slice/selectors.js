import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = state => state.categories || initialState;

export const selectCategories = createSelector([selectSlice], state => state);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectData = createSelector([selectSlice], state => {
  const data = state.data.data;
  return data;
});
export const selectPagination = createSelector([selectSlice], state => {
  const data = state.data.data;
  const converData = [];
  data.forEach(category => {
    converData.push(category, ...category.children);
  });
  const pagination = converData.length;
  return pagination;
});
export const selectDetail = createSelector(
  [selectSlice],
  state => state.detail.data,
);
