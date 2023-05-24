import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, PageWrapper, Link, BoxColor } from 'app/components';

import { Row, Col, Spin } from 'antd';
import styled from 'styled-components';
import { formatDateRange, formatVND } from 'utils/helpers';
import { useAccountDebtByPeriodSlice } from '../slice';
import { selectOverviewStats } from '../slice/selectors';

export function OverviewStats({ history, debtPeriodKey }) {
  const dispatch = useDispatch();
  const { actions } = useAccountDebtByPeriodSlice();
  const overviewStats = useSelector(selectOverviewStats);

  React.useEffect(() => {
    fetchOverviewStats();
  }, []);

  const fetchOverviewStats = () => {
    dispatch(actions.getOverviewStats(debtPeriodKey));
  };

  return (
    <OverviewWrapper>
      <h3 className="overview__title">Thanh toán</h3>
      <div className="overview__content">
        <div className="info-wrapper">
          <span className="info_title">Tổng đơn hàng</span>
          <span className="info_value">
            {formatVND(overviewStats?.number_of_order || 0)}
          </span>
        </div>
        <div className="info-wrapper">
          <span className="info_title">Tổng giá trị</span>
          <span className="info_value">
            {formatVND(overviewStats?.debt_amount || 0)} đ
          </span>
        </div>
        <div className="info-wrapper">
          <span className="info_title">Tổng phí</span>
          <span className="info_value">
            {formatVND(overviewStats?.total_fee || 0)} đ
          </span>
        </div>
      </div>
      <div className="overview_bottom">
        <div className="info-wrapper">
          <span className="info_title">Tổng số tiền thanh toán</span>
          <span className="info_value">
            {formatVND(overviewStats?.payout_amount || 0)} đ
          </span>
        </div>
      </div>
    </OverviewWrapper>
  );
}

const OverviewWrapper = styled('div')`
  margin-top: 25px;
  margin-bottom: 5px;
  background: #ffffff;
  border: 1px solid #ebebf0;
  padding: 20px 25px;
  border-radius: 4px;
  .info-wrapper {
    padding: 12px 0;
    display: flex;
    justify-content: space-between;
  }
  .overview__content .info-wrapper {
    border-bottom: 1px solid #ebebf0;
    .info_title {
      position: relative;
      color: #828282;
      padding-left: 15px;
      :before {
        content: '';
        position: absolute;
        width: 4px;
        height: 4px;
        top: 50%;
        background: #9b9b9b;
        border-radius: 100%;
        left: 0;
        transform: translateY(-50%);
      }
    }
    .info_value {
      color: #333333;
    }
  }
  .overview_bottom .info-wrapper {
    padding-bottom: 0;
    font-weight: 500;
    .info_value {
      font-size: 16px;
      color: #2f80ed;
    }
  }
`;
