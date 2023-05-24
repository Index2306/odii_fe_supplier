/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 *
 * Signin
 *
 */
import React, {
  //  useEffect,
  useState,
} from 'react';
// import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Form,
  Input,
  //  Checkbox,
  Alert,
} from 'antd';
import { Link } from 'app/components';
// import GoogleLogin from 'react-google-login';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import axios from 'axios';
// import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { Button } from 'app/components';
import GoogleIMG from 'assets/images/icon/google.svg';
import FacebookIMG from 'assets/images/icon/facebook.svg';
import { saveToken } from 'app/pages/AppPrivate/utils';
import request from 'utils/request';
import constants from 'assets/constants';
import { globalActions } from 'app/pages/AppPrivate/slice';
import {
  EyeFilled,
  EyeInvisibleOutlined,
  LoadingOutlined,
  LockOutlined,
  MailOutlined,
} from '@ant-design/icons';
// import styled from 'styled-components/macro';
import {
  ComponentAuthMain,
  Icon,
  CustomLink,
  CustomModal,
  FormAlert,
} from '../styled';

export function Signin(props) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isShowModalInActive, setIsShowModalInActive] = useState('');
  // const [isRememberLogin, setIsRememberLogin] = useState(true);

  const dispatch = useDispatch();

  // const { t } = useTranslation();

  // const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;

  const requestURL = 'user-service/signin';

  // useEffect(() => {
  //   if (window.localStorage && localStorage.getItem('isRememberLogin')) {
  //     const temp = localStorage.getItem('isRememberLogin');
  //     setIsRememberLogin(temp);
  //   }
  //   // else {
  //   //   setIsRememberLogin(true);
  //   // }
  // }, []);

  // const handleRememberLogin = async () => {
  //   await setIsRememberLogin(!isRememberLogin);
  //   window.localStorage &&
  //     (await localStorage.setItem('isRememberLogin', isRememberLogin));
  // };

  // console.log('isRememberLogin', isRememberLogin);

  const handleLogin = async values => {
    await login(values);
  };

  const onClose = () => {
    setIsShowModalInActive(false);
  };

  const login = async data => {
    setIsLoading(true);

    const response = await request(requestURL, {
      method: 'post',
      data: data,
      requireAuth: false,
    })
      .then(response => response)
      .catch(error => error);
    setIsLoading(false);

    if (response.is_success) {
      await saveToken(response?.data);
      await dispatch(
        globalActions.changeAccessToken(response?.data?.access_token),
      );

      const currentUser = await request(`user-service/users/me/profile`);
      switch (true) {
        case currentUser?.data?.supplier_status !== 'active':
          window.location.href = '/';
          break;
        case currentUser?.data?.roles?.includes('owner'):
          window.location.href = '/dashboard';
          break;
        case currentUser?.data?.roles?.includes('partner_source'):
          window.location.href = '/products';
          break;
        case currentUser?.data?.roles?.includes('partner_warehouse'):
          window.location.href = '/logistics/import';
          break;
        case currentUser?.data?.roles?.includes('partner_chief_warehouse'):
          window.location.href = '/logistics/import';
          break;
        case currentUser?.data?.roles?.includes('partner_product'):
          window.location.href = '/products';
          break;
        case currentUser?.data?.roles?.includes('partner_order'):
          window.location.href = '/orders';
          break;
        case currentUser?.data?.roles?.includes('partner_balance'):
          window.location.href = '/mywallet';
          break;
        case currentUser?.data?.roles?.includes('partner_member'):
          window.location.href = '/employees';
          break;
        default:
          window.location.href = '/dashboard';
          break;
      }
    } else {
      const error = response?.data?.error_code || response?.data?.error;
      if (error === 'pending_for_active') {
        const messageReSendEmail =
          'Vui lòng kiểm tra hộp thư và kích hoạt tài khoản. Nếu bạn chưa nhận được email:';
        setAlert(
          <Alert
            message={messageReSendEmail}
            action={
              <Link href="" onClick={() => handleResendMail(data)}>
                Gửi lại
              </Link>
            }
            type="error"
          />,
        );
      } else {
        const messageError = constants.ERRORS__AUTH[error] || error;
        setAlert(<Alert message={messageError} type="error" />);
      }
    }
  };

  const handleResendMail = async data => {
    const response = await request('user-service/resend-email-active-user', {
      method: 'post',
      data: data,
      requireAuth: false,
    })
      .then(response => response)
      .catch(err => err);
    if (response.is_success) {
      setAlert(
        <Alert
          message={
            <>
              Đã gửi lại email kích hoạt, vui lòng kiểm tra hộp thư của bạn !!!
            </>
          }
          type="success"
        />,
      );
    } else {
      switch (response.data.error_code) {
        case 'user_activated':
          setAlert(
            <Alert
              message={
                <>
                  Tài khoản của bạn đã được kích hoạt. <br />
                  Vui lòng Đăng nhập để hoàn tất thông tin Nhà cung cấp
                </>
              }
              type="error"
            />,
          );
          break;
        default:
          setAlert(
            <Alert
              message={response.data.error_code || response.data.error}
              type="error"
            />,
          );
          break;
      }
    }
  };

  const responseGoogle = async response => {
    console.log('responseGoogle', response);
    if (response.credential) {
      setIsLoading(true);

      await login({
        token: response.credential,
        social_type: 'google',
      });

      setIsLoading(false);
    }
  };

  const responseFacebook = async response => {
    setIsLoading(true);

    await login({
      token: response.accessToken,
      social_type: 'facebook',
    });

    setIsLoading(false);
  };

  const onFinish = values => {
    handleLogin(values);
  };
  const loginGoogle = useGoogleLogin({
    onSuccess: async tokenResponse => {
      setIsLoading(true);
      await login({
        token: tokenResponse.code,
        social_type: 'google',
      });

      setIsLoading(false);
      // console.log(userInfo);
    },
    onError: errorResponse => {
      console.log('connect google error', errorResponse);
    },
    flow: 'auth-code',
  });
  return (
    <ComponentAuthMain>
      <div className="main-body-page">Đăng nhập</div>

      {alert && <FormAlert>{alert}</FormAlert>}

      <CustomModal
        name="modal"
        footer={null}
        visible={isShowModalInActive}
        onCancel={onClose}
      >
        <div className="modal__title">Tài khoản của bạn đã bị vô hiệu hóa</div>
        <div className="modal__desc">
          Vui lòng liên hệ Admin để mở lại hoặc liên hệ CSKH để được hỗ trợ.
        </div>
      </CustomModal>

      <Form
        name="signin"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email',
            },
            {
              type: 'email',
              message: 'Email chưa đúng định dạng',
            },
          ]}
        >
          <Input
            className="odii-input"
            placeholder="Nhập email"
            prefix={<MailOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu',
            },
            { min: 8, message: 'Mật khẩu ít nhất 8 kí tự' },
          ]}
        >
          <Input.Password
            className="odii-input"
            placeholder="Nhập mật khẩu"
            prefix={<LockOutlined />}
            iconRender={visible =>
              visible ? (
                <Icon>
                  <EyeFilled />
                </Icon>
              ) : (
                <Icon>
                  <EyeInvisibleOutlined />
                </Icon>
              )
            }
          />
        </Form.Item>

        <div className="form-action justify-content-end">
          {/* <Checkbox
            defaultChecked={isRememberLogin}
            onChange={handleRememberLogin}
          >
            Ghi nhớ đăng nhập
          </Checkbox> */}

          <CustomLink to={'/auth/forgot-password'}>Quên mật khẩu?</CustomLink>
        </div>

        <Button
          className="btn-md"
          htmlType="submit"
          type="primary"
          width="100%"
          disabled={isLoading}
          fontSize="16px !important"
        >
          {isLoading && (
            <>
              <LoadingOutlined />
              &ensp;
            </>
          )}
          ĐĂNG NHẬP
        </Button>
      </Form>

      <div className="form-divider">
        <span>Hoặc đăng nhập bằng</span>
      </div>

      <div className="form-social">
        {/* <div className="form-social-google">
            <GoogleLogin onSuccess={responseGoogle} onError={responseGoogle} />
          </div> */}
        <button
          className="form-social-btn"
          onClick={loginGoogle}
          // disabled={renderProps.disabled}
        >
          <img src={GoogleIMG} alt="" />
          Google Account
        </button>
        {/* <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          buttonText="Google Account"
          render={renderProps => (
            <button
              className="form-social-btn"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <img src={GoogleIMG} alt="" />
              Google Account
            </button>
          )}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
          scope="profile"
        /> */}
        <FacebookLogin
          appId={FACEBOOK_APP_ID}
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
          render={renderProps => (
            <button className="form-social-btn" onClick={renderProps.onClick}>
              <img src={FacebookIMG} alt="" />
              Facebook Account
            </button>
          )}
        />
      </div>

      <div className="form-action">
        <span>Bạn chưa có tài khoản?</span>

        <CustomLink to={'/auth/signup'}>Đăng ký ngay</CustomLink>
      </div>
    </ComponentAuthMain>
  );
}
