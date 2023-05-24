import React, { memo } from 'react';
// import { useDispatch } from 'react-redux';
// import { Row, Col, Space } from 'antd';
// import { Form, Button, Input, Select } from 'app/components';
// import { useMyWalletSlice } from '../slice';
import { CustomModalAddBank } from '../styles';
// import { isEmpty } from 'lodash';
import { cardAtm, iconSim } from 'assets/images/icons';
import { backgroundWorld } from 'assets/images';
import styled from 'styled-components/macro';

export default memo(function ModalDetailBank({
  layout,
  bankDefault,
  bank,
  isShowModalDetailBank,
  setIsShowModalDetailBank,
}) {
  const handleCloseModal = () => {
    setIsShowModalDetailBank(false);
  };

  return (
    <CustomModalAddBank
      name="modal-detail_bank"
      visible={isShowModalDetailBank}
      footer={null}
      onCancel={handleCloseModal}
    >
      <div className="modal-header">
        <div className="title">Thông tin tài khoản ngân hàng</div>
        <div className="desc">
          Chi tiết thông tin tài khoản ngân hàng của bạn
        </div>
      </div>

      <CardBank>
        <div className="card-bank-inner">
          <div className="top">
            <div className="info-bank">
              <div className="title">
                {bankDefault?.bank_data?.title || bank?.bank_data?.title}
              </div>
              <div className="sub-title">
                {bankDefault?.sub_title || bank?.sub_title}
              </div>
            </div>
          </div>
          <div className="center">
            <div className="icon-sim">
              <img src={iconSim} alt="" />
            </div>
            {/* <div className="expires-end">
                  <div className="title">Expires End:</div>{' '}
                  <div className="number">01/2021</div>
                </div> */}
          </div>
          <div className="bottom">
            <div className="account-number">
              {bankDefault
                ? bankDefault?.account_number?.substr(0, 4) +
                  ' ' +
                  bankDefault?.account_number?.substr(4, 4) +
                  ' ' +
                  bankDefault?.account_number?.substr(8, 4)
                : bank?.account_number?.substr(0, 4) +
                  ' ' +
                  bank?.account_number?.substr(4, 4) +
                  ' ' +
                  bank?.account_number?.substr(8, 4)}
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <div className="account-name">
                  {bankDefault?.account_name || bank?.account_name}
                </div>
                <div className="status">
                  {bankDefault?.confirm_status === 'confirmed' ||
                  bank?.confirm_status === 'confirmed' ? (
                    <div className="verified">Đã xác thực</div>
                  ) : (
                    ''
                  )}
                  {bankDefault?.is_default || bank?.is_default ? (
                    <div className="default">Mặc định</div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="icon-sim">
                <img src={cardAtm} alt="" />
              </div>
            </div>
          </div>
        </div>
      </CardBank>
    </CustomModalAddBank>
  );
});

const CardBank = styled.div`
  width: 450px;
  height: 285px;
  margin: auto;
  /* background: lightblue; */
  border-radius: 16px;
  /* background: #5d4157; */
  background: -webkit-linear-gradient(to left, #2d4157, #3f4c4d);
  background: linear-gradient(to left, #2d4157, #3f4c4d);
  box-shadow: 2px 2px rgba(0, 0, 0, 0.4);
  .card-bank-inner {
    padding: 30px;
    width: inherit;
    height: inherit;
    background-image: url(${backgroundWorld});
    background-size: 80%;
    background-repeat: no-repeat;
    background-color: transparent;
    background-position: 50px 60px;
    .top {
      display: flex;
      .logo {
        height: 60px;
        width: 45px;
        border-radius: 4px;
        margin-right: 10px;
        img {
          width: 100%;
          height: auto;
          min-height: 50px;
          border-radius: 6px;
        }
      }
      .info-bank {
        .title {
          font-size: 18px;
          font-weight: 500;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.8);
        }
        .sub-title {
          font-size: 14px;
          color: rgb(170 202 221);
        }
      }
    }
    .center {
      margin-top: 12px;
      display: flex;
      .icon-sim {
        height: 45px;
        width: 50px;
        border-radius: 8px;
        img {
          width: 100%;
          height: auto;
          min-height: 32px;
          border-radius: 6px;
        }
      }
      .expires-end {
        display: flex;
        margin-left: 90px;
        .title {
          width: 50px;
          color: #deb887;
          font-size: 12px;
          line-height: 14px;
          text-align: right;
          display: inline-block;
          text-transform: uppercase;
        }
        .number {
          margin-left: 8px;
          font-size: 16px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
    .bottom {
      .account-number {
        font-size: 30px;
        font-weight: 600;
        /* text-align: center; */
        letter-spacing: 4px;
        margin-top: 12px;
        /* margin-bottom: 8px; */
        white-space: nowrap;
        text-shadow: 2px 2px 16px;
        color: rgba(255, 255, 255, 0.8);
      }
      .account-name {
        padding-top: 10px;
        font-size: 22px;
        text-align: start;
        letter-spacing: 2px;
        font-weight: 500;
        /* margin-bottom: 20px; */
        white-space: nowrap;
        text-shadow: 2px 2px 16px;
        color: rgba(255, 255, 255, 0.8);
      }
      .status {
        display: flex;
        .verified {
          font-weight: 500;
          font-size: 12px;
          line-height: 18px;
          color: #27ae60;
          margin-right: 22px;
          /* text-shadow: 1px 1px 30px; */
        }
        .default {
          font-weight: 500;
          font-size: 12px;
          line-height: 18px;
          color: #bfc16a;
          /* text-shadow: 1px 1px 30px; */
        }
      }
      .icon-sim {
        height: 45px;
        width: 60px;
        margin-top: 16px;
        border-radius: 8px;
        img {
          width: 100%;
          height: auto;
          min-height: 32px;
          border-radius: 6px;
        }
      }
    }
  }
`;
