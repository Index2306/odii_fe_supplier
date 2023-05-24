import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Skeleton, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import { PageWrapper } from 'app/components';
import { CustomH3, CustomStyle, SectionWrapper } from 'styles/commons';
import { profile, call } from 'assets/images/icons';

export default function StaticInfoPartner() {
  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <CustomH3>Thông tin đối tác</CustomH3>
      <Row gutter={24}>
        <Col span={6}>
          <div className="order-img__container">
            <div className="order-img__wrapper">
              {/* <i class="far fa-user"></i> */}
              {/* <img src={profile} alt="" /> */}
            </div>
            <div className="order-text__wrapper">
              <div className="order-text">Đối tác</div>
              <div className="order-number">
                <span>Bùi hoàng nguyên</span>
              </div>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="order-img__container">
            <div className="order-img__wrapper">
              <i class="far fa-envelope"></i>
            </div>
            <div className="order-text__wrapper">
              <div className="order-text">Email</div>
              <div className="order-number">
                <span>abc@gmail.com</span>
              </div>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="order-img__container">
            <div className="order-img__wrapper">
              {/* <i class="far fa-phone"></i> */}
              {/* <img src={call} alt="" /> */}
            </div>
            <div className="order-text__wrapper">
              <div className="order-text">Số điện thoại</div>
              <div className="order-number">
                <span>012345667789</span>
              </div>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="order-img__container" style={{ borderRight: 'none' }}>
            <div className="order-img__wrapper">
              <i class="far fa-map-marker-alt"></i>
            </div>
            <div className="order-text__wrapper">
              <div className="order-text">Địa chỉ</div>
              <div className="order-number">
                <span>số 9 ngõ 11 duy tân</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </CustomSectionWrapper>
  );
}

const CustomSectionWrapper = styled(SectionWrapper)`
  height: 126px;
  background: #ffffff;
  margin-top: 35px;
  .order-img__container {
    display: flex;
    justify-content: left;
    align-items: center;
    margin-top: 7px;
    border-right: 1px solid rgb(235, 235, 240);
    margin-right: 25px;
    .order-img__wrapper {
      border: 1px solid #e6e6e9;
      border-radius: 7px;
      width: 50px;
      height: 50px;
      margin-right: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      & i {
        font-size: 28px;
      }
      & img {
        width: 50%;
      }
    }
  }
  .order-text__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .order-text {
      color: rgb(130, 130, 130);
      font-weight: 400;
    }
    .order-number {
      display: flex;
      & span {
        line-height: 25px;
        font-size: 18px;
        margin-right: 6px;
        font-weight: 900;
      }
    }
  }
`;
