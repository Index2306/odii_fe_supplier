import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { isEmpty } from 'lodash';
// import { useAuthSlice } from '../../slice';
// import { selectUsername } from './selectors';
import { globalActions as actions } from '.';
// import { message } from 'antd';

const USER_SERVICE = 'user-service';

export function* getUserInfo() {
  try {
    const repos: any = yield call(
      request,
      // ...[`${USER_SERVICE}/users/me/profile`, { isAnonymusUser: true }],
      ...[`${USER_SERVICE}/users/me/profile`, { isCheckRefresh: true }],
    );
    // message.success('Đăng nhập thành công!');
    if (!isEmpty(repos)) {
      yield put(actions.getUserInfoDone(repos.data));
    } else {
      yield put(actions.getUserInfoError());
    }
  } catch (err) {
    yield put(actions.getUserInfoError());
  }
}

export function* globalSaga() {
  yield takeLatest(actions.getUserInfo.type, getUserInfo);
}
