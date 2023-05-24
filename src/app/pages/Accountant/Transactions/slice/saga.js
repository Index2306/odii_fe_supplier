import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { message } from 'antd';
import { transactionsActions as actions } from '.';

const USER_SERVICE = 'user-service/';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/transactions${payload}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* transferStatus({ payload, history }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/transactions/${payload.data.id}/update-status-pending-transaction`;
  try {
    const repos = yield call(
      request,
      ...[
        requestURL,
        {
          method: 'put',
          data: payload.data,
        },
      ],
    );
    message.success('Cập nhật thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.getDone(repos));
      const url = '?page=1&page_size=10';
      yield put(actions.getData(url));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}
export function* transferStatusDetail({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/transactions/${payload.data.id}/update-status-pending-transaction`;
  try {
    const repos = yield call(
      request,
      ...[
        requestURL,
        {
          method: 'put',
          data: payload.data,
        },
      ],
    );
    message.success('Cập nhật thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.getDone(repos));
      yield put(actions.getDetail(payload.data.id));
      yield put(actions.getTimeline(payload.data.id));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* getDetail({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/transactions/${payload}`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDetailDone(repos));
    } else {
      yield put(actions.getDetailError());
    }
  } catch (err) {
    yield put(actions.getDetailError());
  }
}

export function* getTimeline({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}transactions/${payload}/timeline`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getTimelineDone(repos));
    } else {
      yield put(actions.getTimelineError());
    }
  } catch (err) {
    yield put(actions.getTimelineError());
  }
}

export function* transactionsSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.transferStatus.type, transferStatus);
  yield takeLatest(actions.transferStatusDetail.type, transferStatusDetail);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.getTimeline.type, getTimeline);
}
