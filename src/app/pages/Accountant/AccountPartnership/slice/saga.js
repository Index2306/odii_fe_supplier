import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
// import { message } from 'antd';
import { AffiliateActions as actions } from '.';
import { message } from 'antd';

const USER_SERVICE = 'user-service/';
// const url = '?page=1&page_size=10';

export function* getDataListPeriodPayout({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}partner-affiliate/list-payout`;

  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDataListPeriodPayoutDone(repos));
    } else {
      yield put(actions.getDataError());
    }
  } catch (err) {
    yield put(actions.getDataError());
  }
}

//Get data Statistical Affiliate
export function* getDataStatisticalAffiliate({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/statistical-affiliate-periods`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDataStatisticalAffiliateDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* getDataListPayout({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/affiliate-periods${payload}`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDataListPayoutDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}
export function* getDataTopAffiliater({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/affiliate-periods?page=1&page_size=20&order_by=commission`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDataTopAffiliaterDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* getDataListAffiliater({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/partner-affiliate?is_verified=true`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDataListAffiliaterDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* getDetail({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/affiliate-periods/${payload}`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDetailDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
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
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* TransferStatusAffilliateDetail({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/affiliate-periods/${payload.id}`;
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
      yield put(actions.getDetail(payload.data.id));
      yield put(actions.getDataAffiliateSellerDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* getDataListOrderSeller({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/partner-affiliate/list-commission-order${payload}`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDataListOrderSellerDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* AffiliateSaga() {
  yield takeLatest(
    actions.getDataStatisticalAffiliate.type,
    getDataStatisticalAffiliate,
  );
  yield takeLatest(
    actions.TransferStatusAffilliateDetail.type,
    TransferStatusAffilliateDetail,
  );
  yield takeLatest(
    actions.getDataListPeriodPayout.type,
    getDataListPeriodPayout,
  );
  yield takeLatest(actions.getDataListPayout.type, getDataListPayout);
  yield takeLatest(actions.getDataListAffiliater.type, getDataListAffiliater);
  yield takeLatest(actions.getDataTopAffiliater.type, getDataTopAffiliater);

  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.getTimeline.type, getTimeline);
  yield takeLatest(actions.getDataListOrderSeller.type, getDataListOrderSeller);
}
