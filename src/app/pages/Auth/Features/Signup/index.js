/**
 *
 * Signup
 *
 */
import React, { useState } from 'react';
import {
  //  useSelector,
  useDispatch,
} from 'react-redux';
// import { useTranslation } from 'react-i18next';
// import { messages } from './messages';
// import { useAuthSlice } from '../../slice';
import { useGoogleLogin } from '@react-oauth/google';
import { saveToken } from 'app/pages/AppPrivate/utils';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { message } from 'antd';
import { Form, Input, Alert } from 'antd';
import constants from 'assets/constants';
import { useHistory } from 'react-router-dom';
// import GoogleLogin from 'react-google-login';
import { Link } from 'app/components';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleIMG from 'assets/images/icon/google.svg';
import FacebookIMG from 'assets/images/icon/facebook.svg';
import request from 'utils/request';
import { Button } from 'app/components';
import {
  LoadingOutlined,
  MailOutlined,
  EyeFilled,
  EyeInvisibleOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
// import { Input, Form } from 'app/components';
import { ComponentAuthMain, Icon, FormAlert } from '../styled';
import { validatePassWord, validatePhoneNumberVN } from 'utils/helpers';

const Item = Form.Item;

export function Signup(props) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const history = useHistory();

  // const { t } = useTranslation();
  const dispatch = useDispatch();
  // const { actions } = useAuthSlice();

  // const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;

  const requestURLSignIn = 'user-service/signin';
  const requestURLSignUp = 'user-service/signup';

  const handleSignup = async data => {
    setIsLoading(true);
    const response = await request(requestURLSignUp, {
      method: 'post',
      data: data,
      requireAuth: false,
    })
      .then(response => response)
      .catch(err => err);

    if (response.is_success) {
      history.push({
        pathname: '/auth/registered',
        state: data,
      });
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
    setIsLoading(false);
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
  const login = async data => {
    setIsLoading(true);

    const response = await request(requestURLSignIn, {
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

  // const responseGoogle = async response => {
  //   if (response.tokenId) {
  //     message.success('Đăng ký tài khoản thành công !');
  //     await login({
  //       token: response.tokenAccess,
  //       social_type: 'google',
  //     });
  //   } else {
  //     message.error('Đăng ký tài khoản không thành công, vui lòng thử lại !');
  //   }
  // };

  const responseFacebook = async response => {
    setIsLoading(true);

    await login({
      token: response.accessToken,
      social_type: 'facebook',
    });

    setIsLoading(false);
  };
  const onFinish = async values => {
    await delete values.repassword;
    await handleSignup(values);
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
      message.error('Đăng ký tài khoản không thành công, vui lòng thử lại!');
      console.log('connect google error', errorResponse);
    },
    flow: 'auth-code',
  });
  return (
    <ComponentAuthMain>
      <div className="main-body-page">Tạo mới tài khoản</div>

      {alert && <FormAlert>{alert}</FormAlert>}

      <Form
        name="signup"
        form={form}
        // initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Item
          name="full_name"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập họ và tên',
            },
            { whitespace: true, message: 'Không được để trống' },
            {
              max: 100,
              message: 'Họ và tên của bạn quá 100 ký tự, vui lòng nhập lại',
            },
          ]}
        >
          <Input
            className="odii-input"
            placeholder="Nhập họ và tên"
            prefix={<UserOutlined />}
          />
        </Item>
        <Item
          name="phone"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số điện thoại của bạn',
            },
            validatePhoneNumberVN,
          ]}
        >
          <Input
            className="odii-input"
            type="number"
            placeholder="Nhập SĐT"
            prefix={<PhoneOutlined />}
          />
        </Item>
        <Item
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
        </Item>

        <Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu',
            },
            { min: 8, message: 'Mật khẩu ít nhất 8 kí tự' },
            validatePassWord,
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
        </Item>

        <Form.Item
          name="repassword"
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập lại mật khẩu',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không trùng khớp'));
              },
            }),
          ]}
        >
          <Input.Password
            className="odii-input"
            placeholder="Nhập lại mật khẩu"
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
          ĐĂNG KÝ
        </Button>
      </Form>

      <div className="form-divider">
        <span>Hoặc đăng ký bằng</span>
      </div>

      <div className="form-social">
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
        <span>Bạn đã có tài khoản?</span>

        <Link to={'/auth/signin'}>Đăng nhập ngay</Link>
      </div>
    </ComponentAuthMain>
  );
}
