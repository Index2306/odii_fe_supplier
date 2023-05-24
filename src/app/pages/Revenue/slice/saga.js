import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { revenueActions as actions } from '.';
// import { message } from 'antd';

const USER_SERVICE = 'user-service/';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}supplier/transactions${payload}&transaction_type=sup_revenue`;
  try {
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

export function* getDetail({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}transactions/${payload}`;
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

export function* getBalance({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}me/balance`;
  try {
    const repos = yield call(request, ...[requestURL]);
    if (!isEmpty(repos)) {
      yield put(actions.getBalanceDone(repos));
    } else {
      yield put(actions.getBalanceError());
    }
  } catch (err) {
    yield put(actions.getBalanceError());
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

export function* revenueSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.getBalance.type, getBalance);
  yield takeLatest(actions.getTimeline.type, getTimeline);
}
