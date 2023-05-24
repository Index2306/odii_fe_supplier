import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { promotionActions as actions } from '.';
import { message } from 'antd';
import notification from 'utils/notification';

const SERVICE = 'user-service/supplier/promotion';

export function* getDataListDiscount({ payload }) {
  const { id, param } = payload;
  yield delay(500);
  const requestURL = `${SERVICE}/list-discount/${id}${param}`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    // const repos = {}
    if (!isEmpty(repos)) {
      yield put(actions.getDataListDiscountDone(repos));
    } else {
      yield put(actions.getDataListDiscountError());
    }
  } catch (err) {
    yield put(actions.getDataListDiscountError());
  }
}

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
  const requestURL = `${SERVICE}${id ? `/${id}` : ''}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(
      request,
      ...[requestURL, { method: id ? 'put' : 'post', data }],
    );
    message.success('Thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.updateAndCreateDone());
      if (onSuccess) onSuccess();
    } else {
      yield put(actions.updateAndCreateError());
    }
  } catch (err) {
    yield put(actions.updateAndCreateError());
  }
}

export function* updatePayoutPromotion({ payload }) {
  const { id, data, onSuccess } = payload;
  const requestURL = `${SERVICE}/${id}/promotional-payment`;
  try {
    const repos = yield call(request, ...[requestURL, { method: 'put', data }]);
    message.success('Thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.updatePayoutPromotionDone());
      if (onSuccess) onSuccess();
    } else {
      yield put(actions.updatePayoutPromotionError());
    }
  } catch (err) {
    yield put(actions.updatePayoutPromotionError());
  }
}

export function* delPromotion({ payload }) {
  const { id, push, onSuccessCallback } = payload;
  const requestURL = `${SERVICE}/${id}`;
  try {
    const repos = yield call(request, ...[requestURL, { method: 'delete' }]);
    if (!isEmpty(repos)) {
      yield put(actions.delPromotionDone());
      if (onSuccessCallback) onSuccessCallback();
    } else {
      yield put(actions.delPromotionError());
    }
    // const repos = {}
    notification('success', 'Thành công !');
    push('/promotion');
  } catch (err) {
    yield put(actions.delPromotionError());
  }
}

export function* updateState({ payload }) {
  const { id, data, onSuccess } = payload;
  const requestURL = `${SERVICE}/publishstate/${id}`;

  try {
    const repos = yield call(request, ...[requestURL, { method: 'put', data }]);
    // const repos = {}
    notification('success', 'Cập nhật trạng thái thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.updateStateDone());
      if (onSuccess) onSuccess();
    } else {
      yield put(actions.updateStateError());
    }
  } catch (err) {
    onSuccess();
    yield put(actions.updateStateError());
  }
}

export function* promotionSaga() {
  yield takeLatest(actions.getDataListDiscount.type, getDataListDiscount);
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.updateAndCreate.type, updateAndCreate);
  yield takeLatest(actions.delPromotion.type, delPromotion);
  yield takeLatest(actions.updateState.type, updateState);
  yield takeLatest(actions.updatePayoutPromotion.type, updatePayoutPromotion);
}
