import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { myprofileActions as actions } from '.';
import { message } from 'antd';

const USER_SERVICE = 'user-service/';

export function* getData() {
  yield delay(500);
  const requestURL = `${USER_SERVICE}users/me/profile`;
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

export function* updateMyProfile({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}users/me/profile`;
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
    message.success('Cập nhật thông tin thành công!');
    if (!isEmpty(repos)) {
      yield put(actions.getData());
      yield put(actions.updateDone(repos));
    } else {
      yield put(actions.updateError());
    }
  } catch (err) {
    yield put(actions.updateError());
  }
}

export function* myprofileSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.updateMyProfile.type, updateMyProfile);
}
