import React, { useState } from 'react';
import { Row, Col, Tooltip } from 'antd';
// import { useDispatch } from 'react-redux';
import { Button } from 'app/components';
import { isEmpty } from 'lodash';
import styled from 'styled-components/macro';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

import { formatMoney } from 'utils/helpers';
import { CustomStyle } from 'styles/commons';
import {
  totalDeposit,
  totalWithdrawal,
  boxCheck,
  wallet,
  tooltip,
} from 'assets/images/dashboards';
import { checkCircle } from 'assets/images/icons';
import { ModalDetailBank } from '.';

const dataHistoryBalance = [
  {
    icon: totalDeposit,
    title: 'Tổng tiền đã nạp',
    hint: 'Tổng tiền bạn đã nạp vào Ví Odii từ trước đến hiện tại.',
    total: 'deposit_amount',
  },
  {
    icon: totalWithdrawal,
    title: 'Tổng tiền đã rút',
    hint:
      'Tổng tiền đã rút thành công từ Ví Odii về tài khoản cá nhân của bạn từ trước tới hiện tại.',
    total: 'withdrawal_amount',
  },
  {
    icon: boxCheck,
    title: 'Tổng tiền đã thanh toán',
    hint:
      'Tổng số tiền đã dùng để thanh toán đơn hàng thành công, hoặc thanh toán tiền cho nhà cung cấp từ trước tới hiện tại.',
    total: 'spend_amount',
  },
  // {
  //   icon: null,
  //   title: null,
  //   hint: null,
  //   total: null,
  // },
];
const dataBalanceTooltip = {
  title: 'Số dư tạm tính',
  hint:
    'Tổng tiền khả dụng hiện tại của ví (Tổng tiền đã nạp - Tổng tiền đã rút - Tổng tiền thanh toán).',
};

export default function OverViewMyWallet({
  data,
  t,
  layout,
  history,
  isLoading,
  dataBalance,
  BanksSupplier,
  bankDefault,
  handleAddBank,
}) {
  const [isShowModalDetailBank, setIsShowModalDetailBank] = useState(false);
  // const [isHideNumber, setIsHideNumber] = useState(true);

  const showModalDetailBank = record => {
    setIsShowModalDetailBank(true);
  };

  const goRechrge = () => {
    history.push(`/mywallet/deposit`);
  };

  const goWithDrawal = () => {
    history.push(`/mywallet/withdrawal`);
  };

  const pageContent = (
    <>
      <Row gutter={[8, 8]} className="section-balance__available">
        <Col xs={24} md={12} className="left">
          <div className="box-icon">
            <img src={wallet} alt="logo Wallet"></img>
          </div>
          <div>
            <div className="text mb-8">
              <CustomStyle color="#828282" fontWeight={400}>
                {dataBalanceTooltip.title}
                <Tooltip placement="right" title={dataBalanceTooltip.hint}>
                  <img
                    className="tooltip"
                    style={{ marginLeft: '6px', marginBottom: '6px' }}
                    src={tooltip}
                    alt=""
                  />
                </Tooltip>
              </CustomStyle>
            </div>
            <div className="belance">
              {dataBalance?.amount ? formatMoney(dataBalance?.amount) : '0 đ'}
            </div>
          </div>
        </Col>
        <Col xs={24} md={12} className="right justify-content-end">
          <Button
            context="secondary"
            color="default"
            className="btn-sm"
            onClick={goRechrge}
          >
            <PlusOutlined />
            Nạp tiền
          </Button>
          <Button
            context="secondary"
            color="default"
            className="btn-sm"
            // onClick={openNotification}
            onClick={goWithDrawal}
          >
            <MinusOutlined />
            Rút tiền
          </Button>
        </Col>
      </Row>
      <div className="section-balance__history">
        <CustomDivBalance>
          <Row gutter={[8, 8]}>
            {dataHistoryBalance.map(item => (
              <Col xs={24} md={8}>
                {item.icon && (
                  <div className="item">
                    <div className="box-icon" marginRight={{ xs: 's4' }}>
                      <img src={item.icon} alt="" />
                    </div>
                    <CustomStyle
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                    >
                      <CustomStyle color="#828282" fontWeight={400}>
                        {item.title}
                        <Tooltip placement="right" title={item.hint}>
                          <img className="tooltip" src={tooltip} alt="" />
                        </Tooltip>
                      </CustomStyle>
                      <CustomStyle display="flex">
                        <span className="number">
                          {dataBalance
                            ? formatMoney(dataBalance[item.total])
                            : '0 đ'}
                        </span>
                      </CustomStyle>
                    </CustomStyle>
                  </div>
                )}
              </Col>
            ))}
          </Row>
        </CustomDivBalance>
      </div>

      <div className="section-balance__bank">
        {isEmpty(BanksSupplier) ? (
          <div className="empty-bank">
            <Button
              // context="secondary"
              color="blue"
              className="btn-sm"
              onClick={handleAddBank}
            >
              <PlusOutlined />
              &nbsp;Thêm tài khoản
            </Button>
          </div>
        ) : (
          <Row gutter={[8, 8]} className="item-bank">
            <Col xs={24} md={12}>
              {bankDefault && (
                <Row gutter={[8, 8]}>
                  <Col className="d-flex">
                    <div className="bank-logo">
                      <img
                        className="logo"
                        src={bankDefault?.bank_data?.logo?.origin}
                        alt=""
                      />
                    </div>
                    <div className="bank-account__number">
                      {'**** **** ' + bankDefault?.account_number?.slice(-4)}
                      <div className="bank-title">
                        {bankDefault?.bank_data?.title}
                        {/* - {bankDefault.sub_title} */}
                      </div>
                    </div>
                  </Col>
                  <Col flex="auto" className="d-flex">
                    {bankDefault?.confirm_status === 'confirmed' ? (
                      <span className="verified">
                        <img src={checkCircle} alt="" /> Đã xác thực
                      </span>
                    ) : (
                      ''
                    )}
                    <div className="bank-default">Mặc định</div>
                    {/* <div>
                      {isHideNumber
                        ? '**** ****' + bankDefault?.account_number?.slice(-4)
                        : bankDefault?.account_number}
                    </div>
                    <div>
                      {isHideNumber ? (
                        <EyeOutlined onClick={() => setIsHideNumber(false)} />
                      ) : (
                        <EyeInvisibleOutlined
                          onClick={() => setIsHideNumber(true)}
                        />
                      )}
                    </div> */}
                  </Col>
                </Row>
              )}
            </Col>
            <Col xs={24} md={12} className="action justify-content-end">
              <Button
                context="secondary"
                className="btn-detail-bank btn-sm"
                style={{
                  width: '127px',
                }}
                onClick={() => showModalDetailBank(bankDefault)}
              >
                Chi tiết
              </Button>
              <Button
                color="blue"
                className="btn-detail-bank btn-sm"
                style={{
                  width: '127px',
                }}
                onClick={() => history.push('mywallet/withdrawal')}
              >
                Danh sách
              </Button>
            </Col>
          </Row>
        )}
      </div>

      <ModalDetailBank
        layout={layout}
        bankDefault={bankDefault}
        isShowModalDetailBank={isShowModalDetailBank}
        setIsShowModalDetailBank={setIsShowModalDetailBank}
      />
    </>
  );

  return <>{pageContent}</>;
}
const CustomDivBalance = styled.div`
  .tooltip {
    margin-left: 6px;
    margin-bottom: 6px;
  }
  .item {
    display: flex;
  }
  .number {
    line-height: 25px;
    font-size: 22px;
    margin-right: 6px;
    font-weight: 900;
  }
  .ant-row {
    .ant-col:not(:last-child) {
      .item {
        border-right: 1px solid ${({ theme }) => theme.stroke};
      }
    }
    .ant-col:nth-child(2) {
      .item {
        justify-content: center;
      }
    }
    .ant-col:last-child {
      .item {
        justify-content: end;
      }
    }
  }
`;
