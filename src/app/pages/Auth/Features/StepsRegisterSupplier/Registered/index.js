import React, { useState, useEffect } from 'react';
import RegisteredLoadIMG from 'assets/images/registered-load.svg';
import { Alert, Spin } from 'antd';
import { useLocation } from 'react-router-dom';
import { Link } from 'app/components';
import request from 'utils/request';
// import { saveToken } from 'app/pages/AppPrivate/utils';
import { isEmpty } from 'lodash';
// import { globalActions } from 'app/pages/AppPrivate/slice';
import styled from 'styled-components';
import { ComponentAuthRegister, FormAlert } from '../../styled';

export default function Registered() {
  // const dispatch = useDispatch();
  const location = useLocation();
  const data = location.state;

  const [isLoading, setIsLoading] = useState('');
  const [dataUser, setDataUser] = useState(data);
  const [alert, setAlert] = React.useState(null);

  useEffect(() => {
    if (isEmpty(data)) window.location.href = '/auth/signin';
  }, []);

  const handleResendMail = async () => {
    setIsLoading(true);
    const response = await request('user-service/resend-email-active-user', {
      method: 'post',
      data: dataUser,
      requireAuth: false,
    })
      .then(response => response)
      .catch(err => err);
    if (response.is_success) {
      setAlert(
        <Alert
          message={
            <>
              Đã gửi lại email kích hoạt, bạn hãy kiểm tra lại hòm thư của bạn
              !!!
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
    setIsLoading(false);
  };

  return (
    <ComponentAuthRegister>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <CustomImg className="registered__img">
          <img src={RegisteredLoadIMG} alt="" />
        </CustomImg>

        <div className="registered__title">Xác thực tài khoản</div>

        <div className="registered__desc">
          Cảm ơn bạn đã đăng ký và sử dụng dịch vụ của Odii. Chúng tôi đã gửi
          một email xác thực đến <br />
          <Link href="">{dataUser?.email}</Link>. Vui lòng truy cập email và làm
          theo hướng dẫn
          <br />
          <br /> Gửi lại email kích hoạt.{' '}
          <Link href="" onClick={handleResendMail}>
            Gửi lại
          </Link>
          <br />
          <br />
          <Link to={'/auth/signin'} style={{ cursor: 'pointer' }}>
            Về trang Đăng nhập
          </Link>
        </div>
        {alert && <FormAlert>{alert}</FormAlert>}
      </Spin>
    </ComponentAuthRegister>
  );
}

const CustomImg = styled.div`
  display: flex;
  img {
    margin: auto;
  }
`;
