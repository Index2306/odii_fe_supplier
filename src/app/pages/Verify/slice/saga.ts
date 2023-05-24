import { call, put, takeLatest, delay } from 'redux-saga/effects';
import request from 'utils/request';
import { isEmpty } from 'lodash';
import { saveToken } from 'app/pages/AppPrivate/utils';
import { globalActions } from 'app/pages/AppPrivate/slice';
// import { useVerifySlice } from '../../slice';
// import { selectUsername } from './selectors';
import { verifyActions as actions } from '.';
import { message } from 'antd';
import { RepoErrorType } from './types';

const USER_SERVICE = 'user-service';

export function* verifySaga() {}
