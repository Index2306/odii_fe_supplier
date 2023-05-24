import * as React from 'react';
import url from 'url';
import { Alert } from 'antd';
// import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import request from 'utils/request';
import RegisteredIMG from 'assets/images/registered.svg';
import styled from 'styled-components';
import { Button } from 'app/components';
import constants from 'assets/constants';
import { saveToken } from 'app/pages/AppPrivate/utils';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { ComponentAuthRegister, FormAlert } from '../../styled';

function ActiveUser() {
  const [isUserActived, setIsUserActived] = React.useState(false);
  const [isUserActivedBefore, setIsUserActivedBefore] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const dispatch = useDispatch();

  // const history = useHistory();

  const URL = url.parse(window.location.href);
  const params = new URLSearchParams(URL.query);
  const token = params.get('token');
  // const isLoading = useSelector(selectLoading);

  React.useEffect(() => {
    if (!token) {
      goLogin();
    } else {
      activeUser();
    }
  }, []);

  const goLogin = () => {
    localStorage.clear();
    window.location.href = '/auth/signin';
  };

  const activeUser = async () => {
    const url = 'user-service/active-user';
    const response = await request(url, {
      method: 'post',
      data: { active_token: token },
      requireAuth: false,
    })
      .then(response => response)
      .catch(err => err);
    if (response.is_success) {
      setIsUserActived(true);
      if (response?.data) {
        await saveToken(response?.data);
        await dispatch(
          globalActions.changeAccessToken(response?.data?.access_token),
        );
      }
    } else {
      const error = response?.data?.error_code || response?.data?.error;
      const messageError = constants.ERRORS__AUTH[error] || error;
      setAlert(<Alert message={messageError} type="error" />);
    }
  };

  return (
    <ComponentAuthRegister>
      {isUserActivedBefore ? (
        <>
          <div className="registered__title">
            <CustomImg className="registered__img">
              <img src={RegisteredIMG} alt="" />
            </CustomImg>
            Tài khoản đã xác thực
          </div>
          {alert && <FormAlert>{alert}</FormAlert>}
          <CustomDiv>
            <Button
              className="btn-sm btn-login"
              type="primary"
              color="blue"
              width="200px"
              onClick={goLogin}
            >
              ĐĂNG NHẬP
            </Button>
          </CustomDiv>
        </>
      ) : (
        <>
          <div className="registered__title">
            {isUserActived ? (
              <>
                <CustomImg className="registered__img">
                  <img src={RegisteredIMG} alt="" />
                </CustomImg>
                Xác thực tài khoản thành công
              </>
            ) : (
              'Đường dẫn xác thực không chính xác hoặc đã hết hạn.'
            )}
          </div>
          <div className="registered__desc">
            {isUserActived ? (
              <>
                Chúc mừng bạn đã tạo và xác thực thành công tài khoản Odii - Nhà
                cung cấp.
                <br /> Vui lòng đăng nhập và hoàn tất một số thông tin quan
                trọng cho việc kinh doanh của bạn.
              </>
            ) : (
              'Xác thực tài khoản không thành công, vui lòng nhập lại email để lấy mã xác thực khác.'
            )}
          </div>
          {/* <div className="registered__form">
            <button
              className="form-button"
              onClick={() => history.push('/auth/supplier-setting')}
            >
              BẮT ĐẦU CÀI ĐẶT
            </button>
          </div> */}
          <CustomDiv>
            <Button
              className="btn-sm btn-login"
              type="primary"
              color="blue"
              onClick={goLogin}
            >
              ĐĂNG NHẬP
            </Button>
          </CustomDiv>
        </>
      )}
    </ComponentAuthRegister>
  );
}

export default ActiveUser;

const CustomImg = styled.div`
  display: flex;
  img {
    margin: auto;
  }
`;

const CustomDiv = styled.div`
  .btn-login {
    margin: auto;
    /* width: 100%; */
    margin-top: 24px;
    font-weight: 500;
    font-size: 16px;
  }
`;
