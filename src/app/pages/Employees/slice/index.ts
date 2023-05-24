import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { employeesSaga } from './saga';
import { EmployeesState } from './types';
import { isEmpty } from 'lodash';

export const initialState: EmployeesState = {
  loading: false,
  detail: {},
  listSelected: [],
  data: {
    pagination: {
      page: 1,
      total: 0,
    },
    data: [],
  },
  dataSourceIds: {},
  dataRole: {},
};

const slice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setListSelected(state, action) {
      state.listSelected = action.payload;
    },
    getData(state, _action) {
      state.loading = isEmpty(state.data.data);
    },
    getDone(state, action) {
      const repos = action.payload;
      state.data = repos;
      state.loading = false;
    },
    getError(state) {
      state.loading = false;
    },

    getDataRole(state, _action: PayloadAction) {
      state.loading = true;
    },
    getDataRoleDone(state, action: PayloadAction) {
      const repos = action.payload;
      state.dataRole = repos;
      state.loading = false;
    },
    getDataRoleError(state) {
      state.loading = false;
    },

    inviteUser(state, _action: PayloadAction) {
      state.loading = true;
    },
    inviteUserDone(state, action: PayloadAction) {
      const repos = action.payload;
      state.data = repos;
      state.loading = false;
    },
    inviteUserError(state) {
      state.loading = false;
    },

    deleteEmployee(state, _action: PayloadAction) {
      state.loading = true;
    },
    deleteEmployeeDone(state, action: PayloadAction) {
      // const repos = action.payload;
      // state.data = repos;
      state.loading = false;
    },
    deleteEmployeeError(state) {
      state.loading = false;
    },

    getDetail(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    getDetailDone(state, action: PayloadAction) {
      const detail = action.payload;
      state.detail = detail;
      state.loading = false;
    },
    getDetailError(state) {
      // state.error = action.payload;
      state.loading = false;
    },

    updateUser(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },

    getUpdateDetailDone(state, action: PayloadAction) {
      state.loading = false;
    },

    updateStatusUser(state, _action: PayloadAction) {
      state.loading = true;
      // state.data = {};
    },
    getDataSourceIds(state, _action: PayloadAction) {
      // state.loading = true;
    },
    getDataSourceIdsDone(state, action: PayloadAction) {
      const repos = action.payload;
      state.dataSourceIds = repos;
      state.loading = false;
    },
    getDataSourceIdsError(state) {
      state.loading = false;
    },
  },
});

export const { actions: employeesActions } = slice;

export const useEmployeesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: employeesSaga });
  return { actions: slice.actions };
};
