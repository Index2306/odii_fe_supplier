import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { productSourceActions as actions } from '.';
import { message } from 'antd';

const SERVICE = 'user-service/supplier/supplier-source';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = SERVICE;
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
  const { id, data, push } = payload;
  const requestURL = `user-service/supplier/supplier-source${
    id ? `/${id}` : ''
  }`;
  // const requestURL = `${SERVICE}supplier/product/${id}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(
      request,
      ...[requestURL, { method: id ? 'put' : 'post', data }],
    );
    // const repos = {}
    message.success('Thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.updateAndCreateDone());
    } else {
      yield put(actions.updateAndCreateError());
    }
    if (!id) push('/infobusiness');
  } catch (err) {
    yield put(actions.updateAndCreateError());
  }
}

export function* productSourceSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.updateAndCreate.type, updateAndCreate);
}
