import React, { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectLoading,
  selectTransactions,
  selectTransactionsPagination,
} from '../slice/selectors';
import { Skeleton } from 'antd';
import { useAccountDebtPeriodOverviewSlice } from '../slice';
import { Row, Col, Spin } from 'antd';
import { CustomH3, SectionWrapper } from 'styles/commons';
import styled from 'styled-components/macro';
import { Table, BoxColor, Button } from 'app/components';
// import { FilterBar } from '../Features';
import * as moment from 'moment';
import constants from 'assets/constants';
import { formatVND } from 'utils/helpers';
export default function TableListTransaction() {
  const history = useHistory();
  const location = useLocation();
  const debt_period_key = new URLSearchParams(history.location.search).get(
    'debt_period_key',
  );
  const dispatch = useDispatch();
  const { actions } = useAccountDebtPeriodOverviewSlice();
  const data = useSelector(selectTransactions);
  const [isLoading, setIsLoading] = useState(true);
  const pagination = useSelector(selectTransactionsPagination);

  const gotoPage = (data = '', isReload) => {
    let payload = isReload ? location.search : data;
    dispatch(actions.getTransactions(payload));
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    gotoPage('', true);
  }, []);

  const normalizeData = data => {
    return data.map(debtPeriod => ({
      ...debtPeriod,
    }));
  };

  const getRowAction = data => {
    return (
      <Button
        className="btn-sm"
        onClick={() => {
          history.push(
            `/accountant/detail-debt-transaction/${data.id}?user_id=${data.by_user_id}&debt_period_key=${debt_period_key}`,
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
            <div className="title-box">Ngày giao dịch</div>
          </div>
        ),
        dataIndex: 'created_at',
        key: 'created_at',
        width: 160,
        render: (text, record) => (
          <>{moment(text).format('HH:mm DD/MM/YYYY')}</>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Mã giao dịch</div>
          </div>
        ),
        dataIndex: 'long_code',
        key: 'long_code',
        width: 140,
        render: (text, record) => <>#{text}</>,
      },
      // {
      //   title: (
      //     <div className="custome-header">
      //       <div className="title-box">Loại giao dịch</div>
      //     </div>
      //   ),
      //   dataIndex: 'type',
      //   key: 'type',
      //   width: 120,
      //   render: (text, record) => (
      //     <>{t(`accountant.type_transaction.${text}`)}</>
      //   ),
      // },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Mã đơn hàng</div>
          </div>
        ),
        width: 120,
        render: (_, record) => {
          return <>#{record.order_code || record.shop_order_id}</>;
        },
      },
      // {
      //   title: (
      //     <div className="custome-header">
      //       <div className="title-box text-right">Số sản phẩm</div>
      //     </div>
      //   ),
      //   dataIndex: 'number_of_order',
      //   key: 'number_of_order',
      //   width: 100,
      //   render: (text, record) => {
      //     return <div className="text-right">{text}</div>;
      //   },
      // },
      {
        title: (
          <div className="custome-header">
            <div className="title-box text-right ">Số tiền</div>
          </div>
        ),
        dataIndex: 'amount',
        key: 'amount',
        width: 140,
        align: 'end',
        render: (text, record) => {
          return (
            <div
              style={{
                color: record?.type === 'deposit' ? 'green' : 'red',
              }}
            >
              {record?.type === 'deposit' ? '+' : '-'} &nbsp;
              {formatVND(Math.abs(text))} đ
            </div>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box text-right text-space">
              Ghi chú giao dịch
            </div>
          </div>
        ),
        dataIndex: 'note',
        key: 'note',
        width: 240,
        render: (text, record) => {
          return <div className="text-space">{text}</div>;
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">TT Thanh toán</div>
          </div>
        ),
        dataIndex: 'status',
        key: 'status',
        width: 160,
        align: 'center',
        render: (text, record) => {
          const currentStatus = constants.TRANSACTION_STATUS.find(
            v => v.id === text,
          );
          return (
            <>
              {currentStatus && (
                <>
                  <BoxColor
                    fontWeight="medium"
                    colorValue={currentStatus?.color}
                    width="120px"
                  >
                    {currentStatus?.name || ''}
                  </BoxColor>
                  <div className="action-wrapper">{getRowAction(record)}</div>
                </>
              )}
            </>
          );
        },
      },
    ],
    [data],
  );

  const pageContent = (
    <>
      <div>
        <CustomH3>Danh sách giao dịch</CustomH3>
      </div>

      <CustomH3 className="title text-left" mb={{ xs: 's5' }}>
        {/* <FilterBar isLoading={isLoading} gotoPage={gotoPage} /> */}
      </CustomH3>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Row gutter={24}>
          <Col span={24}>
            <div>
              <TableWrapper
                className="table-custom"
                columns={columns}
                searchSchema={{
                  partner_id: {
                    required: false,
                  },
                  debt_period_key: {
                    required: false,
                  },
                  user_id: {
                    required: false,
                  },
                }}
                data={{ data: normalizeData(data), pagination }}
                scroll={{ x: 1100, y: 5000 }}
                actions={gotoPage}
                rowKey={record => record.id}
              />
            </div>
          </Col>
        </Row>
      </Spin>
    </>
  );
  return (
    <SectionWrapper className="box-df" style={{ marginTop: '10px' }}>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 10 }} className="loading" />
      ) : (
        pageContent
      )}
    </SectionWrapper>
  );
}

export const TableWrapper = styled(Table)`
  .text-space {
    padding-left: 35px;
  }
  tr:hover {
    .action-wrapper {
      display: inline-flex;
    }
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
`;
