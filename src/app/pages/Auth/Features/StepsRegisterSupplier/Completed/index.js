import * as React from 'react';
import IMGCompleted from 'assets/images/completed.svg';
import { Spin } from 'antd';
import { Button } from 'app/components';
import styled from 'styled-components';

export default function Completed() {
  const goLogin = () => {
    localStorage.clear();
    window.location.href = '/auth/signin';
  };

  const goSeller = () => {
    localStorage.clear();
    window.location.href = 'http://seller.odii.xyz';
  };

  return (
    <>
      <img src={IMGCompleted} alt="" />
      <div className="registered__title">
        Đăng ký Odii - Nhà cung cấp thành công
      </div>
      <div className="registered__desc">
        Hệ thống sẽ xác thực thông tin trước khi chấp nhận bạn trở thành nhà
        cung cấp. <br />
        Vui lòng đợi hoặc liên hệ bộ phận Chăm sóc khác hàng để được tư vấn !
      </div>
      <CustomSpin />
      <Customspan>Đang xử lý</Customspan>
      <CustomDiv>
        <Button
          className="auth__form-button btn-sm"
          context="secondary"
          color="default"
          onClick={goLogin}
        >
          Quay về Đăng nhập
        </Button>
        <Button
          className="auth__form-button btn-sm"
          type="primary"
          color="blue"
          onClick={goSeller}
        >
          Đến trang Seller
        </Button>
      </CustomDiv>
    </>
  );
}

const CustomSpin = styled(Spin)`
  margin-top: 16px;
  .ant-spin-dot-item {
    background-color: #6c798f;
  }
`;

const Customspan = styled.span`
  color: #6c798f;
  margin-bottom: 24px;
`;

const CustomDiv = styled.div`
  min-width: 600px;
  max-width: 1000px;
  display: flex;
  padding-top: 24px;
  text-align: right;
  border-top: 1px solid #ebebf0;
  justify-content: space-between;
`;
