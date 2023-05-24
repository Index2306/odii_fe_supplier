import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { message } from 'antd';
import { AccountantHandleDepositActions as actions } from '.';

const USER_SERVICE = 'user-service/';
const url = '?page=1&page_size=10';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/transactions${payload}&transaction_type=deposit`;
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

export function* AccountantUpdateConfirm({ payload }) {
  const { id, onSuccessCallback } = payload;
  yield delay(500);
  const requestURL = `oms/accountant/${id}/acc-update-status`;
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
      if (onSuccessCallback) onSuccessCallback();
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* ChiefAccountantUpdateConfirm({ payload }) {
  const { id, onSuccessCallback } = payload;
  yield delay(500);
  const requestURL = `oms/accountant/${id}/chief-update-status`;
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
      if (onSuccessCallback) onSuccessCallback();
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* AccountantHandleDepositSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(
    actions.AccountantUpdateConfirm.type,
    AccountantUpdateConfirm,
  );
  yield takeLatest(
    actions.ChiefAccountantUpdateConfirm.type,
    ChiefAccountantUpdateConfirm,
  );
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.getTimeline.type, getTimeline);
}
