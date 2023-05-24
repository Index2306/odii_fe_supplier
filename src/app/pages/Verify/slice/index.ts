import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { verifySaga } from './saga';
import { VerifyState, RepoErrorType } from './types';

export const initialState: VerifyState = {
  loading: false,
  error: null,
  repositories: {},
};

const slice = createSlice({
  name: 'verify',
  initialState,
  reducers: {
    signin(state, _action: PayloadAction<object>) {
      state.loading = true;
      state.error = null;
      state.repositories = {};
    },
    signinDone(state, action: PayloadAction<object>) {
      const repos = action.payload;
      state.repositories = repos;
      state.loading = false;
    },
    signinError(state, action: PayloadAction<RepoErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: verifyActions, reducer } = slice;

export const useVerifySlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: verifySaga });
  return { actions: slice.actions };
};
