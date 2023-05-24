import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { infobusinessActions as actions } from '.';
import { message } from 'antd';

const USER_SERVICE = 'user-service/';

export function* getDataRegisterSupplier() {
  yield delay(500);
  const requestURL = `${USER_SERVICE}supplier/profile`;
  try {
    const repos = yield call(request, ...[requestURL]);
    if (!isEmpty(repos)) {
      yield put(actions.getDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* getBanksSupplier() {
  yield delay(500);
  const requestURL = `${USER_SERVICE}banks`;
  try {
    const repos = yield call(request, ...[requestURL]);
    if (!isEmpty(repos)) {
      yield put(actions.getBanksSupplierDone(repos));
    } else {
      yield put(actions.getBanksSupplierError());
    }
  } catch (err) {
    yield put(actions.getBanksSupplierError());
  }
}

export function* SupplierAddBank({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}banks`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'post', data: payload.data }],
    );
    message.success('Thêm thông tin thanh toán thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.SupplierAddBankDone(repos));
      yield put(actions.getBankSupplier());
    } else {
      yield put(actions.SupplierAddBankError());
    }
  } catch (err) {
    yield put(actions.SupplierAddBankError());
  }
}

export function* SupplierUpdateBank({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}bank/${payload.id}`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'put', data: payload.data }],
    );
    message.success('Cập nhật thông tin thanh toán thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.SupplierUpdateBankDone(repos));
      yield put(actions.getBanksSupplier());
    } else {
      yield put(actions.SupplierUpdateBankError());
    }
  } catch (err) {
    yield put(actions.SupplierUpdateBankError());
  }
}

export function* infobusinessSaga() {
  yield takeLatest(
    actions.getDataRegisterSupplier.type,
    getDataRegisterSupplier,
  );
  yield takeLatest(actions.getBanksSupplier.type, getBanksSupplier);

  yield takeLatest(actions.SupplierAddBank.type, SupplierAddBank);
  yield takeLatest(actions.SupplierUpdateBank.type, SupplierUpdateBank);
}
