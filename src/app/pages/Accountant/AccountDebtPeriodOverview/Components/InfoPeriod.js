import React, { useEffect, useState } from 'react';

// import { useTranslation } from 'react-i18next';
// import { Link } from 'react-router-dom';
import { SectionWrapper } from 'styles/commons';
import styled from 'styled-components/macro';
import { BoxColor, Button } from 'app/components';
import * as moment from 'moment';
import { Skeleton } from 'antd';
import { formatDateRange, formatMoney } from 'utils/helpers';
import { useLocation } from 'react-router';
import request from 'utils/request';
import { getDebtPeriodByKey } from 'utils/debt-period';

export default function InfoPeriod({ countOrder, totalAmount, isLoading }) {
  const location = useLocation();
  const uRLSearchParams = new URLSearchParams(location.search);
  const partnerId = uRLSearchParams.get('partner_id');
  const debtPeriodKey = uRLSearchParams.get('debt_period_key');
  const debtPeriod = debtPeriodKey && getDebtPeriodByKey(debtPeriodKey);

  const getPeriodStatus = (payoutStatus, titleAppend) => {
    let color;
    let title;
    if (payoutStatus === 'pending') {
      title = 'Chờ';
      color = 'secondary2';
    } else if (payoutStatus === 'confirmed') {
      title = 'Đã';
      color = 'greenMedium1';
    } else {
      title = 'Đang';
      color = 'darkBlue1';
    }

    return (
      <BoxColor className="payout-status" notBackground colorValue={color}>
        {title} {titleAppend}
      </BoxColor>
    );
  };

  const pageContent = (
    <>
      <SectionTitle>
        <div className="title">Chu kỳ công nợ:&nbsp;&nbsp;</div>
        <div>
          {formatDateRange(
            debtPeriod?.debt_period_start,
            debtPeriod?.debt_period_end,
          )}
        </div>
      </SectionTitle>

      <SectionDiv>
        <Item>
          <div className="label">TT Thanh toán</div>
          <div>{getPeriodStatus(totalAmount?.payout_status, 'thanh toán')}</div>
        </Item>
        <Item>
          <div className="label">Tổng đơn hàng</div>
          <div>{totalAmount?.number_of_order}</div>
        </Item>
        <Item>
          <div className="label">Tổng giá trị</div>
          <div>{formatMoney(totalAmount?.total_revenue || 0)}</div>
        </Item>
        <Item>
          <div className="label">Tổng phí thu</div>
          <div
            style={{
              color: 'red',
            }}
          >
            {formatMoney(totalAmount?.total_fee || 0)}
          </div>
        </Item>
        <Item style={{ lineHeight: 1 }}>
          <div className="label">Tổng số tiền thanh toán</div>
          <div
            style={{
              color: '#2F80ED',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            {formatMoney(totalAmount?.payout_amount || 0)}
          </div>
        </Item>
      </SectionDiv>
    </>
  );

  return (
    <SectionWrapper className="box-df" style={{ minHeight: '260px' }}>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 5 }} className="loading" />
      ) : (
        pageContent
      )}
    </SectionWrapper>
  );
}

export const Item = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 38px;
  border-bottom: 1px solid #f0f0f0;
  line-height: 36px;
  .label {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.4);
  }
  .dot {
    &::before {
      content: '';
      width: 7px;
      height: 7px;
      margin-right: 6px;
      margin-bottom: 1px;
      border-radius: 50%;
      background-color: #2f80ed;
      display: inline-block;
    }
  }
  &:last-child {
    padding-top: 12px;
    .label {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: #333333;
    }
    border-bottom: unset;
  }
`;

export const CustomButton = styled(Button)`
  width: 100%;
  margin-top: 16px;
  border-radius: 4px;
`;

export const SectionDiv = styled.div`
  margin-top: 16px;
  .payout-status {
    white-space: nowrap;
    top: 0;
    width: unset;
    padding: 0;
  }
  .bank-logo {
    width: 60px;
    height: 60px;
    img {
      width: 100%;
      height: auto;
    }
    margin-right: 12px;
  }
  .bank-account__number {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    color: #333333;
  }
  .bank-account__name {
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    color: #828282;
  }
  .bank-title {
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    color: #828282;
  }
  .verified {
    font-weight: 500;
    font-size: 12px;
    color: #27ae60;
  }
`;

export const SectionTitle = styled.div`
  display: flex;
  .title {
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    color: #333333;
  }
`;
