/**
 *
 * Revenue
 *
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin } from 'antd';
import request from 'utils/request';
import { Table, BoxColor, Button, EmptyPage } from 'app/components';
import constants from 'assets/constants';
import { formatMoney } from 'utils/helpers';

import {
  CustomH3,
  SectionWrapper,
  // CustomStyle,
  // CustomTitle,
} from 'styles/commons';
import { useRevenueSlice } from './slice';
import { FilterBar } from './Features';
import {
  selectLoading,
  selectData,
  selectPagination,
  selectShowEmptyPage,
} from './slice/selectors';
import { messages } from './messages';
// import { isEmpty } from 'lodash';
// import { checkCircle } from 'assets/images/icons';
import styled from 'styled-components';
import * as moment from 'moment';
import { OverViewRevenue } from './Components';

// const layout = {
//   labelCol: { xs: 24, sm: 24 },
//   wrapperCol: { xs: 24, sm: 24, md: 24 },
//   labelAlign: 'left',
// };

export function Revenue({ history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useRevenueSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);
  const showEmptyPage = useSelector(selectShowEmptyPage);

  const [debtBelanceInfo, setDebtBelanceInfo] = useState('');

  useEffect(() => {
    request(`user-service/me/supplier/debt-balance-info`, {})
      .then(result => {
        setDebtBelanceInfo(result?.data ?? {});
      })
      .catch(err => {});
  }, []);

  const gotoPage = (data = '', isReload) => {
    dispatch(actions.getData(isReload ? history.location.search : data));
  };

  useEffect(() => {
    const delaySecond = 10000;
    let reloadPageInterval;
    let reloadPageTimeout;
    reloadPageTimeout = setTimeout(() => {
      reloadPageInterval = setInterval(() => {
        gotoPage('', true);
      }, delaySecond);
    }, delaySecond);
    return () => {
      clearInterval(reloadPageInterval);
      clearTimeout(reloadPageTimeout);
    };
  }, []);

  useEffect(() => {
    dispatch(actions.getBalance({}));
    return () => {
      dispatch(actions.resetWhenLeave());
    };
  }, []);

  const columns = React.useMemo(
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
        dataIndex: 'id',
        key: 'id',
        width: 200,
        render: (text, record) => (
          <>
            <div>
              {/* <div style={{ fontWeight: 'bold', margin: '0' }}> */}
              {record?.long_code}
            </div>
            {/* <div style={{ fontSize: '12px', color: '#828282' }}>
              {formatDate(record?.created_at)}
            </div> */}
          </>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Loại giao dịch</div>
          </div>
        ),
        dataIndex: 'type',
        key: 'type',
        width: 100,
        render: (text, record) => {
          return record?.method === 'debt' ? (
            record?.action_type === 'confirmed_order' ? (
              <div
                style={{
                  fontWeight: 'bold',
                  color: ' #2F80ED',
                }}
              >
                Chi phí CC
              </div>
            ) : (
              ''
            )
          ) : (
            <div
              style={{
                fontWeight: 'bold',
                color: record?.type === 'deposit' ? 'green' : 'red',
              }}
            >
              {t(`revenue.transaction.${text}`)}
            </div>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Đơn hàng</div>
          </div>
        ),
        dataIndex: 'order_code',
        key: 'order_code',
        width: 140,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Số tiền</div>
          </div>
        ),
        dataIndex: 'amount',
        key: 'amount',
        width: 120,
        align: 'end',
        render: (text, record) => {
          return record?.status === 'cancelled' ? (
            <div
              style={{
                color: 'gray',
              }}
            >
              {formatMoney(Math.abs(text))}
            </div>
          ) : (
            <div
              style={{
                color: record?.type === 'deposit' ? 'green' : 'red',
              }}
            >
              {record?.type === 'deposit' ? '+' : '-'} &nbsp;
              {formatMoney(Math.abs(text))}
            </div>
          );
        },
      },
      // {
      //   title: (
      //     <div className="custome-header">
      //       <div className="title-box">Hình thức</div>
      //     </div>
      //   ),
      //   dataIndex: 'method',
      //   key: 'method',
      //   width: 160,
      //   render: text => {
      //     return <div>{text ? t(`revenue.transaction.${text}`) : '-'}</div>;
      //   },
      // },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Chu kỳ công nợ</div>
          </div>
        ),
        width: 160,
        render: record => {
          const debt_period_day = record?.debt_period_key?.split('_');
          return (
            <>
              {record?.debt_period_key && (
                <div>
                  {moment(debt_period_day[0]).format('DD/MM')} {' - '}
                  {moment(debt_period_day[1]).format('DD/MM/YYYY')}
                </div>
              )}
            </>
          );
        },
      },
      // {
      //   title: (
      //     <div className="custome-header">
      //       <div className="title-box">Ghi chú giao dịch</div>
      //     </div>
      //   ),
      //   dataIndex: 'note',
      //   key: 'note',
      //   width: 200,
      // },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Trạng thái</div>
          </div>
        ),
        dataIndex: 'confirm_status',
        key: 'confirm_status',
        width: 170,
        align: 'center',
        render: (text, record) => {
          const currentStatus = constants.REVENUE_STATUS.find(
            v => v.id === text,
          );
          return (
            <>
              {currentStatus && (
                <>
                  <BoxColor
                    fontWeight="medium"
                    colorValue={currentStatus?.color}
                    width={140}
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

  const getRowAction = record => {
    return (
      <>
        <Button
          color="blue"
          className="btn-sm btn-action"
          onClick={() => goDetail(record)}
        >
          Chi tiết
        </Button>
      </>
    );
  };
  const goDetail = record => {
    window.location.href = `/revenue/${record.id}/detail`;
  };

  if (showEmptyPage) {
    return (
      <MainWrapper>
        <OverViewRevenue
          isLoading={isLoading}
          debtBelanceInfo={debtBelanceInfo}
        />
        <CustomDivEmpty>
          <EmptyPage style={{ height: 'calc(100vh - 200px)' }}></EmptyPage>
        </CustomDivEmpty>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <OverViewRevenue
          isLoading={isLoading}
          debtBelanceInfo={debtBelanceInfo}
        />
        <SectionWrapperHistoryTransaction>
          <div className="header">
            <CustomH3 className="title text-left" mb={{ xs: 's6' }}>
              {t(messages.list())}
            </CustomH3>
          </div>
          <CustomH3 className="title text-left" mb={{ xs: 's5' }}>
            <FilterBar
              isLoading={isLoading}
              gotoPage={gotoPage}
              history={history}
            />
          </CustomH3>
          <Row gutter={24}>
            <Col span={24}>
              <div>
                <Table
                  className="custom"
                  columns={columns}
                  searchSchema={{
                    keyword: {
                      required: false,
                    },
                    confirm_status: {
                      required: false,
                    },
                    action_type: {
                      required: false,
                    },
                    from_time: {
                      required: false,
                    },
                    to_time: {
                      required: false,
                    },
                  }}
                  data={{ data, pagination }}
                  scroll={{ x: 1100, y: 1000 }}
                  actions={gotoPage}
                  rowKey={record => record.id}
                  onRow={record => ({
                    onClick: () => goDetail(record),
                  })}
                />
              </div>
            </Col>
          </Row>
        </SectionWrapperHistoryTransaction>
      </Spin>
    </MainWrapper>
  );
}

const MainWrapper = styled.div`
  padding: ${({ theme }) => theme.space.s4 * 3}px
    ${({ theme }) => theme.space.s4 * 2}px;
  /* width: ${({ theme }) => `calc(999px + ${theme.space.s4 * 4}px)`}; */
  margin: 0 auto;

  @media screen and (min-width: 1600px) {
    width: ${({ theme }) => `calc(1257px + ${theme.space.s4 * 4}px)`};
  }
`;

const SectionWrapperHistoryTransaction = styled(SectionWrapper)`
  min-height: 630px;
  p {
    margin-top: 14px;
  }
  table {
    tr:hover {
      cursor: pointer;
    }
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
    .btn-action {
      margin: auto;
    }
  }
  tr:hover {
    .action-wrapper {
      display: inline-flex;
    }
  }
`;

const CustomDivEmpty = styled.div`
  .style-1 {
    height: calc(100vh - 210px);
  }
`;
