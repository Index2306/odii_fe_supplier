import { call, put, takeLatest, delay } from 'redux-saga/effects';
import request from 'utils/request';
import { isEmpty } from 'lodash';
import { saveToken } from 'app/pages/AppPrivate/utils';
import { globalActions } from 'app/pages/AppPrivate/slice';
// import { useAuthSlice } from '../../slice';
// import { selectUsername } from './selectors';
import { authActions as actions } from '.';
import { message } from 'antd';
import { RepoErrorType } from './types';

const USER_SERVICE = 'user-service';

export function* login(data) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}/signin`;
  try {
    // Call our request helper (see 'utils/request')
    const repos: { access_token: string } = yield call(
      request,
      ...[
        requestURL,
        { method: 'post', data: data.payload, requireAuth: false },
      ],
    );
    message.success('Đăng nhập thành công!');
    if (!isEmpty(repos)) {
      saveToken(repos);
      globalActions.changeAccessToken(repos?.access_token);
      window.location.href = '/dashboard';
      yield put(actions.signinDone(repos));
    } else {
      yield put(actions.signinError(RepoErrorType.RESPONSE_ERROR));
    }
  } catch (err) {
    yield put(actions.signinError(RepoErrorType.RESPONSE_ERROR));
    // if (err.response?.status === 404) {
    //   yield put(actions.repoError(RepoErrorType.USER_NOT_FOUND));
    // } else if (err.message === 'Failed to fetch') {
    //   yield put(actions.repoError(RepoErrorType.GITHUB_RATE_LIMIT));
    // } else {
    //   yield put(actions.repoError(RepoErrorType.RESPONSE_ERROR));
    // }
  }
}

// export function* authSaga() {
//   yield takeLatest(actions.signin.type, login);
// }

export function* regis(data) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}/signup`;
  try {
    // Call our request helper (see 'utils/request')
    const repos: { is_success: boolean } = yield call(
      request,
      ...[
        requestURL,
        { method: 'post', data: data.payload, requireAuth: false },
      ],
    );
    message.success('Đăng ký thành công!');
    if (!isEmpty(repos)) {
      yield put(actions.signupDone(repos));
    } else {
      yield put(actions.signupError(RepoErrorType.RESPONSE_ERROR));
    }
  } catch (err) {
    yield put(actions.signupError(RepoErrorType.RESPONSE_ERROR));
  }
}

export function* forgotpass(data) {
  yield delay(500);
  const requestURL = 'user-service/forgot';
  try {
    // Call our request helper (see 'utils/request')
    const repos: { is_success: boolean } = yield call(
      request,
      ...[
        requestURL,
        {
          method: 'post',
          data: data.payload,
          requireAuth: false,
        },
      ],
    );
    message.success('Lấy lại mật khẩu thành công!');
    if (!isEmpty(repos)) {
      yield put(actions.signupDone(repos));
    } else {
      yield put(actions.signupError(RepoErrorType.RESPONSE_ERROR));
    }
  } catch (err) {
    yield put(actions.signupError(RepoErrorType.RESPONSE_ERROR));
  }
}

export function* changepass(data) {
  yield delay(500);
  const requestURL = 'user-service/users/me/change-password';
  try {
    // Call our request helper (see 'utils/request')
    const repos: { is_success: boolean } = yield call(
      request,
      ...[
        requestURL,
        {
          method: 'post',
          data: data.payload,
        },
      ],
    );
    message.success('Đổi mật khẩu thành công!');
    if (!isEmpty(repos)) {
      yield put(actions.signupDone(repos));
    } else {
      yield put(actions.signupError(RepoErrorType.RESPONSE_ERROR));
    }
  } catch (err) {
    yield put(actions.signupError(RepoErrorType.RESPONSE_ERROR));
  }
}

export function* authSaga() {
  yield takeLatest(actions.signin.type, login);
  yield takeLatest(actions.signup.type, regis);
  yield takeLatest(actions.forgotpass.type, forgotpass);
  yield takeLatest(actions.changepass.type, changepass);
}
