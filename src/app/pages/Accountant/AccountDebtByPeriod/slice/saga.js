import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { AccountDebtByPeriodActions as actions } from '.';

const ACCOUNTANT_SERVICE = 'oms/accountant';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${ACCOUNTANT_SERVICE}/debt-by-period/users${payload}`;
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

export function* getDetail({ payload }) {
  yield delay(500);
  const requestURL = `${ACCOUNTANT_SERVICE}/debt-period-by-key?key=${payload}`;
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

export function* getCurrDebtPeriod({ payload }) {
  yield delay(500);
  const requestURL = `${ACCOUNTANT_SERVICE}/current-debt-period`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getCurrDebtPeriodDone(repos));
    } else {
      yield put(actions.getCurrDebtPeriodError());
    }
  } catch (err) {
    yield put(actions.getCurrDebtPeriodError());
  }
}

export function* getOverviewStats({ payload }) {
  yield delay(500);
  const requestURL = `${ACCOUNTANT_SERVICE}/debt-by-period?debt_period_key=${payload}`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getOverviewStatsDone(repos));
    } else {
      yield put(actions.getOverviewStatsError());
    }
  } catch (err) {
    yield put(actions.getOverviewStatsError());
  }
}

export function* AccountDebtByPeriodSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.getCurrDebtPeriod.type, getCurrDebtPeriod);
  yield takeLatest(actions.getOverviewStats.type, getOverviewStats);
}
