import React from 'react';
// import { Row, Col, Switch } from 'antd';
// import { useDispatch } from 'react-redux';
// import { Form } from 'app/components';
// import { isEmpty } from 'lodash';
import { CustomH4 } from 'styles/commons';
import { formatVND } from 'utils/helpers';
import styled from 'styled-components/macro';

export default function InfoFee({ data, t, isLoading }) {
  const pageContent = (
    <>
      <CustomH4 mb={{ xs: 's4' }}>Thông tin phí</CustomH4>
      <Div>
        <p className="label">Số tiền:</p> {formatVND(data?.amount)} VNĐ
      </Div>
      <Div>
        <p className="label">Phí dịch vụ:</p> 0 VNĐ
        {/* <p className="label">Phí dịch vụ:</p> {formatVND(0)} VNĐ */}
      </Div>
      <Div className="end">
        <b style={{ lineHeight: '30px' }}>Tổng thanh toán:</b>
        <p
          style={{
            color: '#65A1C3',
            fontWeight: '500',
            fontSize: '20px',
            lineHeight: '28px',
          }}
        >
          {formatVND(data?.amount + 0)} VNĐ
        </p>
      </Div>
    </>
  );

  return <>{pageContent}</>;
}

const Div = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  border-bottom: 1px solid #f0f0f0;

  .label {
    font-size: 14px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.4);
  }
  &.end {
    border-bottom: none;
  }
  .logo-bank {
    width: 45px;
    height: 21px;
    margin-left: 8px;
  }
`;
