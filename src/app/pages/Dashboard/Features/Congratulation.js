import React, { memo } from 'react';
// import { SectionWrapper } from 'styles/commons';
import { CustomStyle } from 'styles/commons';
// import request from 'utils/request';
import {
  congratulation,
  StepRegisterSupplier,
} from 'assets/images/congratulation';
// import { FilterBar } from '../Component';
import styled from 'styled-components';

const dataStepbyStep = [
  {
    id: 1,
    icon: congratulation,
    title: 'ĐĂNG KÝ TÀI KHOẢN',
    content: 'Thực hiện đăng ký và xác thực tài khoản trên hệ thống',
  },
  {
    id: 2,
    icon: congratulation,
    title: 'Xác thực thông tin Doanh nghiệp',
    content:
      'Thực hiện cung cấp và chỉnh sửa chính xác thông tin doanh nghiệp ',
  },
  {
    id: 3,
    icon: congratulation,
    title: 'Khai báo địa chỉ Kho vận',
    content: 'Thực hiện cung cấp thông tin kho hàng',
  },
  {
    id: 4,
    icon: congratulation,
    title: 'Tạo và đăng bán sản phẩm',
    content:
      'Thực hiện chọn, tạo và chỉnh sửa sản phẩm, sau đó đăng bán lên hệ thống',
  },
  {
    id: 5,
    icon: congratulation,
    title: 'Bán hàng và quản lý đơn hàng',
    content:
      'Thực hiện bán sản phẩm và quản lý các đơn hàng với các người bán ',
  },
];

export default memo(function Congratulation() {
  // const [order, setOrder] = React.useState({});
  // const [isLoading, setIsLoading] = React.useState(true);

  return (
    <CustomDiv>
      <div className="congratulation-image">
        <img src={congratulation} alt="" />
      </div>
      {/* <div className="congratulation-title">
        <CustomStyle color="#ff7879" fontSize={{ xs: 'f7' }} mb={{ xs: 's4' }}>
          Chúc mừng
        </CustomStyle>
        <CustomStyle
          color="#328ed1"
          // color="grayBlue"
          // fontSize={{ xs: 'f6' }}
          // mb={{ xs: 's' }}
        >
          bạn đã đăng ký thành công tài khoản
        </CustomStyle>

        <CustomStyle
          color="#328ed1"
          // fontSize={{ xs: 'f6' }}
        >
          Nhà cung cấp - Odii
        </CustomStyle>
      </div> */}
      <Banner>
        <CustomStyle mb={{ xs: 's2' }}>Xin chào,</CustomStyle>
        <CustomStyle fontWeight="medium" fontSize={{ xs: 'f5' }}>
          Chào mừng bạn đến với hệ thống Odii - Nhà cung cấp.
        </CustomStyle>
      </Banner>
      <div className="step-title">5 bước để trở thành nhà cung cấp - Odii</div>
      <div className="step-image">
        <img src={StepRegisterSupplier} alt="" />
      </div>
      <div className="step-content">
        {dataStepbyStep.map(item => (
          <div className={!(item.id % 2 === 0) ? 'item up' : 'item'}>
            <div className="item-title">{item.title}</div>
            <div className="item-content">{item.content}</div>
          </div>
        ))}
      </div>
    </CustomDiv>
  );
});

const CustomDiv = styled.div`
  height: 100vh;

  .congratulation {
    &-image {
      /* position: relative; */
      img {
        width: 100%;
      }
    }
    /* &-title {
      position: absolute;
      left: 0;
      right: 0;
      top: 220px;
      margin-left: 12%;
      font-weight: 800;
      text-align: center;
      text-transform: uppercase;
      color: black;
    } */
  }
  .step {
    &-image {
      text-align: center;
      img {
        width: 60%;
      }
    }
    &-title {
      font-weight: 800;
      font-size: 24px;
      line-height: 24px;
      text-align: center;
      text-transform: uppercase;
      color: #328ed1;
      /* margin-top: -36px; */
      margin-bottom: 36px;
    }
    &-content {
      text-align: center;
      display: flex;
      width: 60%;
      margin: auto;
      .up {
        margin-top: -80px;
      }
      .item {
        text-align: start;
        min-width: 160px;

        &-title {
          font-weight: bold;
          font-size: 16px;
          line-height: 24px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        &-content {
          font-size: 16px;
          line-height: 24px;
          color: #3b4351;
          opacity: 0.6;
        }
        &:not(:first-child) {
          margin-left: 28px;
        }
        &:last-child {
        }
      }
    }
  }
`;

const Banner = styled.div`
  max-width: 1000px;
  z-index: 9;
  color: #fff;
  padding-left: 56px;
  display: flex;
  height: 120px;
  justify-content: center;
  flex-direction: column;
  /* margin-bottom: 35px; */
  margin: -150px auto 35px;
  background-image: url('https://i.odii.xyz/0x200/90804354752d49c6a7591e7025a74aaf-bannerdai.png');
  background-size: cover;
  background-color: transparent;
`;
