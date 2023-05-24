import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { message } from 'antd';
import { AccountDebtPeriodOverviewActions as actions } from '.';
const url = '?page=1&page_size=10';

const ACCOUNTANT_SERVICE = 'oms/accountant';
const USER_SERVICE = 'user-service/';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${ACCOUNTANT_SERVICE}/supplier/debt-by-period${payload}`;
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
  const requestURL = `${USER_SERVICE}admin/partner/transactions/${payload}`;
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

export function* getListDebtPeriodTime({ payload }) {
  yield delay(500);
  const requestURL = `${ACCOUNTANT_SERVICE}/debt-period-times`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getListDebtPeriodTimeDone(repos));
    } else {
      yield put(actions.getListDebtPeriodTimeError());
    }
  } catch (err) {
    yield put(actions.getListDebtPeriodTimeError());
  }
}

export function* getOverviewStats({ payload }) {
  yield delay(500);
  const requestURL = `${ACCOUNTANT_SERVICE}/supplier/overview-stats`;
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

export function* getTransactions({ payload }) {
  yield delay(500);
  const requestURL = `oms/accountant/partner/transactions${payload}&transaction_type=sup_revenue`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getTransactionsDone(repos));
    } else {
      yield put(actions.getTransactionsError());
    }
  } catch (err) {
    yield put(actions.getTransactionsError());
  }
}

export function* AccountantUpdateConfirm({ payload }) {
  yield delay(500);
  const requestURL = `oms/accountant/${payload.id}/acc-update-status`;
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
      if (payload.isList) {
        yield put(actions.getData(url));
      } else {
        yield put(actions.getDetail(payload.id));
        yield put(actions.getTimeline(payload.id));
      }
      yield put(actions.getDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* ChiefAccountantUpdateConfirm({ payload }) {
  yield delay(500);
  const requestURL = `oms/accountant/${payload.id}/chief-update-status`;
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
      if (payload.isList) {
        yield put(actions.getData(url));
      } else {
        yield put(actions.getDetail(payload.id));
        yield put(actions.getTimeline(payload.id));
      }
      yield put(actions.getDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* updateDebtProgress({ payload }) {
  yield delay(500);
  const requestURL = `oms/accountant/partner/debt/${payload.id}/update-progress`;
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
      yield put(actions.updateDebtProgressDone(repos));
      if (payload.onSuccessCallback) payload.onSuccessCallback(repos.data);
    } else {
      yield put(actions.updateDebtProgressError());
    }
  } catch (err) {
    yield put(actions.updateDebtProgressError());
  }
}

export function* getDebtTimeline({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}debt/${payload.id}/timeline`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDebtTimelineDone(repos));
    } else {
      yield put(actions.getDebtTimelineError());
    }
  } catch (err) {
    yield put(actions.getDebtTimelineError());
  }
}

export function* AccountDebtPeriodOverviewSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.getListDebtPeriodTime.type, getListDebtPeriodTime);
  yield takeLatest(actions.getOverviewStats.type, getOverviewStats);
  yield takeLatest(actions.getTimeline.type, getTimeline);
  yield takeLatest(actions.getTransactions.type, getTransactions);

  yield takeLatest(
    actions.AccountantUpdateConfirm.type,
    AccountantUpdateConfirm,
  );
  yield takeLatest(
    actions.ChiefAccountantUpdateConfirm.type,
    ChiefAccountantUpdateConfirm,
  );
  yield takeLatest(actions.updateDebtProgress.type, updateDebtProgress);
  yield takeLatest(actions.getDebtTimeline.type, getDebtTimeline);
}
