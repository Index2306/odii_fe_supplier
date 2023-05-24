import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { globalSaga } from './saga';
import { GlobalState } from './types';
import { getTokenFromStorage } from '../utils';

function _isPresent(current) {
  return !!current.modalType;
}

function _newModal(action) {
  const { payload } = action;
  return {
    modalType: payload.modalType,
    modalProps: payload.modalProps,
  };
}

export const initialState: GlobalState = {
  accessToken: getTokenFromStorage()?.access_token || '',
  tokens: getTokenFromStorage() || {},
  userInfo: {},
  breadcrumb: {},
  loading: false,
  error: null,
  modalQ: [],
  currentModal: { modalType: null, modalProps: {} },
};

const slice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setDataBreadcrumb(state, action: PayloadAction<any>) {
      state.breadcrumb = action.payload;
    },
    changeAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    changeTokens(state, action: PayloadAction<object>) {
      state.tokens = action.payload;
    },
    getUserInfo(state, _action: PayloadAction) {
      state.loading = true;
      state.error = null;
      state.userInfo = {};
    },
    getUserInfoDone(state, action: PayloadAction<object>) {
      const repos = action.payload;
      state.userInfo = repos;
      state.loading = false;
    },
    getUserInfoError(state, action: PayloadAction) {
      state.error = action.payload;
      state.loading = false;
    },

    showModal(state, action) {
      const newModal = _newModal(action);
      const newQ = state.modalQ.slice();
      newQ.push(newModal);
      const _currentModal = _isPresent(state.currentModal)
        ? state.currentModal
        : newQ.shift();
      state.modalQ = newQ;
      state.currentModal = _currentModal;
    },
    hideModal(state) {
      const newQ = state.modalQ.slice();
      const nextModal = newQ.shift();
      const _currentModal = nextModal || initialState.currentModal;
      state.modalQ = newQ;
      state.currentModal = _currentModal;
    },
    stackModal(state, action) {
      const newModal = _newModal(action);
      const oldModal = { ...state.currentModal };
      const newQ = state.modalQ.slice();
      newQ.unshift(oldModal);
      const _currentModal = newModal;
      state.modalQ = newQ;
      state.currentModal = _currentModal;
    },
    topModal(state, action) {
      const newModal = _newModal(action);
      const newQ = state.modalQ.slice();
      newQ.unshift(newModal);
      const _currentModal = _isPresent(state.currentModal)
        ? state.currentModal
        : newQ.shift();
      state.modalQ = newQ;
      state.currentModal = _currentModal;
    },
    replaceModal(state, action) {
      const newModal = _newModal(action);
      state.currentModal = newModal;
    },
  },
});

export const { actions: globalActions } = slice;

export const useGlobalSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: globalSaga });
  return { actions: slice.actions };
};
