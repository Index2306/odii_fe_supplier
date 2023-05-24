import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Spin } from 'antd';
import url from 'url';
import { useHistory } from 'react-router-dom';
import request from 'utils/request';
import RegisteredIMG from 'assets/images/registered.svg';
import { Button } from 'app/components';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { isEmpty } from 'lodash';
import { saveToken } from 'app/pages/AppPrivate/utils';
import { globalActions } from 'app/pages/AppPrivate/slice';
import styled from 'styled-components';
import constants from 'assets/constants';

function VerifyInvite() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const history = useHistory();

  const URL = url.parse(window.location.href);
  const params = new URLSearchParams(URL.query);
  const token = params.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState('');
  const [isEmailExist, setIsEmailExitst] = useState(false);

  useEffect(() => {
    if (!token) {
      window.location.href = '/auth/signin';
    } else {
      setIsLoading(true);

      VerifyInvite();

      setIsLoading(false);
    }
  }, []);

  const VerifyInvite = async () => {
    const url = 'user-service/verify-invite-user';
    const response = await request(url, {
      method: 'post',
      data: { active_token: token },
      requireAuth: false,
    })
      .then(response => response)
      .catch(err => err);
    if (response?.is_success) {
      await setIsSuccess(true);
      if (response?.data) {
        await setIsEmailExitst(true);
        await saveToken(response?.data);
        await dispatch(
          globalActions.changeAccessToken(response?.data?.access_token),
        );
      }
    } else {
      await setIsSuccess(false);
      const code = response?.data?.error_code || response?.data?.error;
      const messageError = constants.ERRORS__AUTH[code] || code;
      await setError(messageError);
    }
  };
  return (
    <ComponentVerify>
      <Spin tip="Đang tải..." spinning={isLoading}>
        {isSuccess && (
          <div>
            <div className="verify-invite__img">
              <img src={RegisteredIMG} alt="" />
            </div>

            <div className="verify-invite__title">
              Xác nhận tham gia thành công
            </div>

            <div className="verify-invite__desc">
              Chúc mừng bạn đã tham gia thành công chuỗi bán hàng trên nền tảng
              thương mại
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: '#3d56a6',
                }}
              >
                {' '}
                Odii - Nhà cung cấp.
              </span>
              <br />
              {isEmailExist && (
                <span style={{ fontWeight: 'bold' }}>
                  Một mật khẩu tạm thời đã gửi vào email của bạn.
                </span>
              )}
              <br /> Chúc bạn và team của bạn kinh doanh thành công !
              <br />
            </div>
            <div className="verify-invite__button">
              {!isEmpty(currentUser) ? (
                <Button
                  className="btn-sm"
                  onClick={() => history.push('/dashboard')}
                >
                  SỬ DỤNG HỆ THỐNG
                </Button>
              ) : (
                <Button
                  className="btn-sm"
                  onClick={() => history.push('/auth/signin')}
                >
                  ĐĂNG NHẬP
                </Button>
              )}
            </div>
          </div>
        )}
        {!isSuccess && (
          <div>
            <div className="verify-invite__img">
              <img src={RegisteredIMG} alt="" />
            </div>
            <div className="verify-invite__title">
              Tham gia không thành công
            </div>
            <Alert message={error} type="error" />
            <div className="verify-invite__button">
              <Button
                className="btn-sm"
                onClick={() => history.push('/auth/signin')}
              >
                ĐĂNG NHẬP
              </Button>
            </div>
          </div>
        )}
      </Spin>
    </ComponentVerify>
  );
}

export default VerifyInvite;

const ComponentVerify = styled.div`
  .verify-invite {
    background: #f4f6fd;
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    &__title {
      font-size: 30px;
      color: #3d56a6;
      font-weight: 700;
      text-align: center;
      margin-bottom: 12px;
    }
    &__title .false {
      color: #eb5757;
    }
    &__desc {
      text-align: center;
    }

    &__img {
      display: flex;
      justify-content: center;
    }
    &__button {
      display: flex;
      justify-content: center;
      margin-top: 12px;
    }
  }
`;
