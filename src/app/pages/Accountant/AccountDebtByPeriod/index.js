/**
 *
 * Accountant Handle Request Deposit
 *
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, Form as F } from 'antd';
import { Table, PageWrapper, Link, Button, BoxColor } from 'app/components';
import { CustomH3, SectionWrapper } from 'styles/commons';
import { useAccountDebtByPeriodSlice } from './slice';
import { selectLoading, selectData, selectPagination } from './slice/selectors';
import { formatVND } from 'utils/helpers';
import styled from 'styled-components';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { OverviewStats } from './Components/OverviewStats';
import { useLocation } from 'react-router';
import { DebtPeriodInfo } from './Components/DebtPeriodInfo';

const Item = F.Item;

export function AccountDebtByPeriod({ history }) {
  const location = useLocation();
  const key = new URLSearchParams(location.search).get('debt_period_key');
  const dispatch = useDispatch();
  const { actions } = useAccountDebtByPeriodSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);

  const gotoPage = (data = '') => {
    dispatch(actions.getData(data));
  };

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Danh sách chu kỳ',
          link: '/accountant/debt-overview',
        },
        {
          name: 'Chi tiết chu kỳ',
        },
      ],
      fixWidth: false,
      actions: (
        <Item className="m-0" shouldUpdate>
          <div className="d-flex justify-content-between"></div>
        </Item>
      ),
    };
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
    };
  }, []);

  const normalizeData = data => {
    return data?.map(debtPeriod => ({
      ...debtPeriod,
    }));
  };
  const getRowAction = data => {
    return (
      <Button
        className="btn-sm"
        onClick={() => {
          history.push(
            `/accountant/detail-user-debt?debt_period_key=${key}&partner_id=${data.partner_id}&user_id=${data.user.id}`,
          );
        }}
      >
        Chi tiết
      </Button>
    );
  };
  const columns = useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">STT</div>
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        width: 80,
        render: (_, record, index) => (
          <>
            {/* <Link
              to={`/accountant/deposit/${record.id}/detail`}
              style={{ fontWeight: 'bold', margin: '0' }}
            >
              #{record?.long_code}
            </Link> */}
            <span>{index + 1}</span>
          </>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Tài khoản</div>
          </div>
        ),
        // width: 200,
        // align: 'center',
        render: (_, record) => {
          return (
            <>
              <div className="user__email">{record.user.email}</div>
              <div className="user__phone">
                {record.user.phone || 'Không SĐT'}
              </div>
            </>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Loại TK</div>
          </div>
        ),
        // width: 170,
        // align: 'center',
        render: (_, record) => {
          return <span className="user__type">Supplier</span>;
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box text-right">Doanh thu</div>
          </div>
        ),
        dataIndex: 'total_revenue',
        key: 'total_revenue',
        // width: 140,
        render: (text, record) => {
          return (
            <div className="text-right total-revenue">{formatVND(text)} đ</div>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box text-right ">Tổng phí</div>
          </div>
        ),
        dataIndex: 'total_fee',
        key: 'total_fee',
        // width: 140,
        render: (text, record) => {
          return (
            <div className="text-right total-fee">{formatVND(text)} đ</div>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box text-right th-last-child">
              Tổng tiền phải TT
            </div>
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        // width: 140,
        render: (text, record) => {
          return (
            <div className="text-right total-payment">
              {formatVND(record.total_revenue + record.total_fee)} đ
              <div className="action-wrapper">{getRowAction(record)}</div>
            </div>
          );
        },
      },
    ],
    [data],
  );
  return (
    <>
      <PageWrapper style={{ marginTop: 0, marginBottom: 0 }}>
        <Row gutter={25}>
          <Col span={12}>
            <DebtPeriodInfo debtPeriodKey={key}></DebtPeriodInfo>
          </Col>
          <Col span={12}>
            <OverviewStats debtPeriodKey={key}></OverviewStats>
          </Col>
        </Row>
      </PageWrapper>
      <PageWrapper>
        <CustomSectionWrapper>
          <div className="header">
            <CustomH3 className="title text-left" mb={{ xs: 's6' }}>
              Danh sách công nợ theo chu kỳ
            </CustomH3>
          </div>
          <CustomH3 className="title text-left" mb={{ xs: 's5' }}>
            {/* <FilterBar isLoading={isLoading} gotoPage={gotoPage} /> */}
          </CustomH3>
          <Spin tip="Đang tải..." spinning={isLoading}>
            <Row gutter={24}>
              <Col span={24}>
                <div>
                  <Table
                    className="table-custom"
                    actions={gotoPage}
                    columns={columns}
                    searchSchema={{
                      payout_period_key: {
                        required: false,
                      },
                      debt_period_key: {
                        required: false,
                      },
                    }}
                    data={{ data: normalizeData(data), pagination: pagination }}
                    scroll={{ x: 1100, y: 5000 }}
                    rowKey={record => record.id}
                  />
                </div>
              </Col>
            </Row>
          </Spin>
        </CustomSectionWrapper>
      </PageWrapper>
    </>
  );
}
const CustomSectionWrapper = styled(SectionWrapper)`
  p {
    margin-top: 14px;
  }
  .hide {
    visibility: hidden;
  }
  .action-wrapper {
    display: none;
    position: absolute;
    padding: 0;
    top: 50%;
    right: 0px;
    transform: translateY(-50%);
    white-space: nowrap;
    word-break: keep-all;
    > div {
      display: inline-flex;
      > button {
        margin-left: 11px;
      }
    }
    .btn-cancel {
      background: #fff;
      &:hover {
        color: #fff;
        background: red;
      }
    }
  }
  tr:hover {
    .action-wrapper {
      display: inline-flex;
    }
  }
  .text-right {
    text-align: right;
  }
  .th-last-child,
  .table-custom table tbody > tr > td:last-child {
    padding-right: 25px;
  }
  .total-revenue {
    color: #27ae60;
  }
  .total-fee {
    color: #eb5757;
  }
  .total-payment {
    color: #2f80ed;
  }
  .action-wrapper {
    display: none;
    position: absolute;
    padding: 0;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    white-space: nowrap;
    word-break: keep-all;
    > div {
      display: inline-flex;
      > button {
        margin-left: 11px;
      }
    }
    .btn-cancel {
      background: #fff;
    }
  }
  .user__email {
  }
  .user__phone {
    color: #828282;
    font-size: 12px;
  }
  .user__type {
    font-weight: bold;
  }
  .payout-status {
    font-size: 14px;
    white-space: nowrap;
  }
`;
