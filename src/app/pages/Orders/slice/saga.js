import { call, put, takeLatest, delay, throttle } from 'redux-saga/effects';
import { isEmpty, groupBy, sumBy, forOwn } from 'lodash';
import request from 'utils/request';
import { ordersActions as actions } from '.';
import { message } from 'antd';

const SERVICE = 'oms/supplier/orders';

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
  const requestURL = `${SERVICE}/${payload}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, ...[requestURL, {}]);
    // const repos = {}
    if (!isEmpty(repos)) {
      const grpItems = groupBy(repos.data.order_items, 'product_variation_id');
      const items = [];
      forOwn(grpItems, function (value, key) {
        const totalItem = sumBy(value, 'quantity');
        items.push({ ...value[0], quantity: totalItem });
      });
      repos.data.order_items = items;
      console.log('get detai', repos);
      yield put(actions.getDetailDone(repos.data));
    } else {
      yield put(actions.getDetailError());
      console.log('actions.getDetailError 1', repos);
    }
  } catch (err) {
    yield put(actions.getDetailError(err));
    console.log('actions.getDetailError 2', err);
  }
}

export function* updateAndCreate({ payload }) {
  const { id, data, push } = payload;
  const requestURL = `user-service/supplier/supplier-warehousing${
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
    if (!id) push('/warehousing');
  } catch (err) {
    yield put(actions.updateAndCreateError());
  }
}

export function* updateQrChecked({ payload }) {
  const { id, data, onSuccess } = payload;
  const requestURL = `${SERVICE}/update-status-qr/${id}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(
      request,
      ...[requestURL, { method: 'post', data }],
    );
    // const repos = {}
    if (!isEmpty(repos)) {
      yield put(actions.updateQrCheckedDone());
      if (onSuccess) onSuccess();
    } else {
      yield put(actions.updateQrCheckedError());
    }
  } catch (err) {
    yield put(actions.updateQrCheckedError());
  }
}

export function* ordersSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield throttle(2000, actions.updateAndCreate.type, updateAndCreate);
  yield throttle(2000, actions.updateQrChecked.type, updateQrChecked);
}
