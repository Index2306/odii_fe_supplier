/**
 *
 * Accountant Handle Debt Period
 *
 */
import React, {
  //  useState, useEffect,
  useMemo,
} from 'react';
// import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin } from 'antd';
import { Table, PageWrapper, Button, BoxColor } from 'app/components';
// import constants from 'assets/constants';
import { CustomH3, SectionWrapper } from 'styles/commons';
import { useAccountDebtPeriodOverviewSlice } from './slice';
import { selectLoading, selectData, selectPagination } from './slice/selectors';
import { formatDateRange, formatVND } from 'utils/helpers';
import styled from 'styled-components';
import { OverviewStats } from './Components/OverviewStats';
import { FilterBar } from './Features';
import moment from 'moment';

export function AccountDebtPeriodOverview({ history }) {
  // const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useAccountDebtPeriodOverviewSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);

  const gotoPage = (data = '') => {
    dispatch(actions.getData(data));
  };

  const getRowAction = data => {
    return (
      <Button
        className="btn-sm"
        onClick={() => {
          history.push(
            `/accountant/detail-user-debt?debt_period_key=${data.debt_period_key}`,
          );
        }}
      >
        Chi tiết
      </Button>
    );
  };

  const normalizeData = data => {
    return data.map(debtPeriod => ({
      ...debtPeriod,
      debtTimeRange: formatDateRange(
        debtPeriod.debt_period_start,
        debtPeriod.debt_period_end,
      ),
      payoutTimeRange: formatDateRange(
        debtPeriod.payout_period_start,
        debtPeriod.payout_period_end,
      ),
    }));
  };
  const getPaymentStatus = (record, titleAppend) => {
    let color;
    let title;
    if (record?.is_all_paid) {
      title = 'Đã';
      color = 'greenMedium1';
    } else if (record?.total_paid_partner > 0) {
      title = 'Đang';
      color = 'darkBlue1';
    } else {
      title = 'Chờ';
      color = 'secondary2';
    }
    return (
      <BoxColor className="payout-status" notBackground colorValue={color}>
        {title} {titleAppend}
      </BoxColor>
    );
  };

  const getPeriodStatus = (status, titleAppend) => {
    let color;
    let title;
    if (status === 'pending') {
      title = 'Chờ';
      color = 'secondary2';
    } else if (status === 'confirmed') {
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
            <div className="title-box">Chu kỳ công nợ</div>
          </div>
        ),
        // width: 200,
        // align: 'center',
        render: (_, record) => {
          return <span>{record.debtTimeRange}</span>;
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Chu kỳ thanh toán</div>
          </div>
        ),
        // width: 170,
        // align: 'center',
        render: (_, record) => {
          return <span>{record.payoutTimeRange}</span>;
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box text-right">Tổng đơn hàng</div>
          </div>
        ),
        dataIndex: 'number_of_order',
        key: 'number_of_order',
        // width: 140,
        render: (text, record) => {
          return <div className="text-right">{text}</div>;
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box text-right ">Tổng giá trị đơn hàng</div>
          </div>
        ),
        dataIndex: 'total_revenue',
        key: 'total_revenue',
        // width: 140,
        render: (text, record) => {
          return (
            <div className="text-right total-amount">{formatVND(text)} đ</div>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box text-right">Phí</div>
          </div>
        ),
        dataIndex: 'total_fee',
        key: 'total_fee',
        // width: 140,
        render: (text, record) => {
          return (
            <div className="text-right  total-fee">{formatVND(text)} đ</div>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box text-right custom-pd-r">
              Tổng thanh toán
            </div>
          </div>
        ),
        dataIndex: 'payout_amount',
        key: 'payout_amount',
        // width: 240,
        render: (text, record) => {
          return (
            <>
              <div className="text-right custom-pd-r total-payment">
                {formatVND(text)} đ
              </div>
            </>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">TT Đối soát</div>
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        // width: 240,
        render: (text, record) => {
          return getPeriodStatus(record?.debt_status, 'đối soát');
        },
      },
      {
        title: (
          <div className="custome-header th-last-child">
            <div className="title-box">TT Thanh toán</div>
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        // width: 240,
        render: (text, record) => {
          return (
            <>
              {getPeriodStatus(record?.payout_status, 'thanh toán')}
              <div className="action-wrapper">{getRowAction(record)}</div>
            </>
          );
        },
      },
    ],
    [data],
  );

  return (
    <>
      <OverviewStats></OverviewStats>
      <PageWrapper>
        <CustomSectionWrapper>
          <div className="header">
            <CustomH3 className="title text-left" mb={{ xs: 's6' }}>
              Danh sách công nợ theo chu kỳ
            </CustomH3>
          </div>
          <CustomH3 className="title text-left" mb={{ xs: 's5' }}>
            <FilterBar isLoading={isLoading} gotoPage={gotoPage} />
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
                    data={{ data: normalizeData(data), pagination }}
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
    left: 0;
    right: 0;
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
    button {
      margin: auto;
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
  .custom-pd-r {
    padding-right: 30px;
  }
  .th-last-child,
  .table-custom table tbody > tr > td:last-child {
    padding-right: 25px;
  }
  .total-amount {
    color: #27ae60;
  }
  .total-fee {
    color: #eb5757;
  }
  .total-payment {
    color: #2f80ed;
  }
  .payout-status {
    top: 0;
    white-space: nowrap;
  }
  .ant-table-cell {
    padding: 16px 5px !important;
  }
`;
