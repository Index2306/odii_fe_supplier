import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAccountDebtPeriodOverviewSlice } from '../slice';
import { selectOverviewStats } from '../slice/selectors';
import { Table, PageWrapper, Link, BoxColor } from 'app/components';

import { Row, Col, Spin, Skeleton } from 'antd';
import styled from 'styled-components';
import { formatDateRange, formatVND } from 'utils/helpers';

export function OverviewStats({ history, isLoading }) {
  const dispatch = useDispatch();
  const { actions } = useAccountDebtPeriodOverviewSlice();
  const overviewStats = useSelector(selectOverviewStats);

  React.useEffect(() => {
    fetchOverviewStats();
  }, []);

  const fetchOverviewStats = () => {
    dispatch(actions.getOverviewStats());
  };

  const listStats = [
    {
      title: 'Tổng công nợ chu kỳ hiện tại',
      color: '#F2994A',
      itemAttr: 'debt_current_period',
    },
    {
      title: 'Tổng công nợ chu kỳ trước',
      color: '#40a9ff',
      itemAttr: 'debt_prev_period',
    },
    {
      title: 'Tổng đối soát và thanh toán chu kỳ trước',
      color: '#2F80ED',
      itemAttr: 'payout_prev_period',
    },
  ];

  const pageContent = (
    <>
      <OverviewWrapper>
        <h3 className="overview-title">Tổng quan công nợ</h3>
        <Row gutter="26">
          {listStats.map((stats, index) => {
            const currStat = overviewStats?.[stats['itemAttr']];
            return (
              <Col xs={12} lg={7} xl={7} key={index}>
                <div
                  className="stats-wrapper"
                  style={{ borderTopColor: stats?.color }}
                >
                  <div className="stats-title">{stats.title}</div>
                  <div className="stats-content">
                    <div
                      className="stats-number"
                      style={{ color: stats?.color }}
                    >
                      {formatVND(currStat?.amount || 0)}
                      <span className="stats-unit">đ</span>
                    </div>
                  </div>
                  <div className="stats-bottom">
                    <div className="stats-time">
                      <span>Chu kỳ: </span>
                      {formatDateRange(
                        currStat?.start_date,
                        currStat?.end_date,
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </OverviewWrapper>
    </>
  );

  return (
    <PageWrapper>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 10 }} className="loading" />
      ) : (
        pageContent
      )}
    </PageWrapper>
  );
}

const OverviewWrapper = styled('div')`
  background: #fff;
  padding: 1.5rem;
  .overview-title {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 700;
    margin-bottom: 16px;
    line-height: 1;
  }
  .stats-wrapper {
    border: 1px solid #e6e6e9;
    border-top-width: 5px;
    border-radius: 6px 6px 0 0;
    padding: 8px 20px 13px 20px;
    .stats-title {
      font-weight: 500;
      font-size: 16px;
    }
    .stats-number {
      display: flex;
      font-weight: 500;
      font-size: 18px;
      line-height: 1;
    }
    .stats-content,
    .stats-bottom {
      margin-top: 13px;
    }
    .stats-time {
      color: #828282;
      font-size: 12px;
    }
    .stats-unit {
      margin-left: 2px;
      font-size: 14px;
      font-weight: normal;
    }
  }
`;
