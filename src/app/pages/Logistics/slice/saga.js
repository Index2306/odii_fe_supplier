import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { warehouseImportActions as actions } from '.';
import { message } from 'antd';

const SERVICE = 'user-service/supplier/warehouse/import';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${SERVICE}${payload}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, ...[requestURL, {}]);
    // const repos = {}
    if (!isEmpty(repos)) {
      yield put(actions.getDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* getDetail({ payload }) {
  yield delay(500);
  const requestURL = `${SERVICE}/${payload}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, ...[requestURL, {}]);
    // const repos = {}
    if (!isEmpty(repos)) {
      yield put(actions.getDetailDone(repos.data));
    } else {
      yield put(actions.getDetailError());
    }
  } catch (err) {
    yield put(actions.getDetailError());
  }
}

export function* updateAndCreate({ payload }) {
  const { id, data, onSuccess } = payload;
  const requestURL = `${SERVICE}${id ? `/${id}` : '/create'}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(
      request,
      ...[requestURL, { method: id ? 'put' : 'post', data }],
    );
    message.success('Thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.updateAndCreateDone());
      if (onSuccess) onSuccess(repos.id);
    } else {
      yield put(actions.updateAndCreateError());
    }
  } catch (err) {
    yield put(actions.updateAndCreateError());
  }
}

export function* updateState({ payload }) {
  const { id, data, onSuccess } = payload;
  const requestURL = `${SERVICE}/state/${id}`;

  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(
      request,
      ...[requestURL, { method: 'put', data: data }],
    );
    // const repos = {}
    message.success('Cập nhật trạng thái thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.updateStateDone());
      if (onSuccess) onSuccess();
    } else {
      yield put(actions.updateStateError());
    }
  } catch (err) {
    yield put(actions.updateStateError());
  }
}

export function* cancelWarehouseImport({ payload }) {
  const { id, onSuccess } = payload;
  const requestURL = `${SERVICE}/${id}`;

  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, ...[requestURL, { method: 'delete' }]);
    // const repos = {}
    message.success('Xóa phiếu nhập kho thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.cancelWarehouseImportDone());
      if (onSuccess) onSuccess();
    } else {
      yield put(actions.cancelWarehouseImportError());
    }
  } catch (err) {
    yield put(actions.cancelWarehouseImportError());
  }
}

export function* warehouseImportSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.updateAndCreate.type, updateAndCreate);
  yield takeLatest(actions.updateState.type, updateState);
  yield takeLatest(actions.cancelWarehouseImport.type, cancelWarehouseImport);
}
