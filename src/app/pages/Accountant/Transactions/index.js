/**
 *
 * Transactions
 *
 */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin } from 'antd';
import { Button, Table, PageWrapper, Link, BoxColor } from 'app/components';
import constants from 'assets/constants';
import { CustomH3, SectionWrapper } from 'styles/commons';
import { useTransactionsSlice } from './slice';
import { FilterBar } from './Features';
import { selectLoading, selectData, selectPagination } from './slice/selectors';
import { messages } from './messages';
import { formatDate, formatVND } from 'utils/helpers';

import styled from 'styled-components';

export function Transactions({ history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useTransactionsSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);

  const gotoPage = (data = '', isReload) => {
    dispatch(actions.getData(isReload ? history.location.search : data));
  };

  React.useEffect(() => {
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

  const goDetail = record => {
    history.push(`/transactions/${record.id}/detail`);
  };

  const columns = React.useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">ID</div>
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        width: 160,
        render: (_, record) => (
          <>
            <Link
              to={`/transactions/${record.id}/detail`}
              style={{ fontWeight: 'bold', margin: '0' }}
            >
              #{record?.long_code}
              {/* #{record?.long_code?.slice(0, 14).toUpperCase()} */}
            </Link>
            <div style={{ fontSize: '12px', color: '#828282' }}>
              {formatDate(record?.created_at)}
            </div>
          </>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Người thực hiện</div>
          </div>
        ),
        width: 170,
        align: 'center',
        render: (_, record) => {
          return (
            <p>
              {record?.from_user?.full_name
                ? record?.from_user?.full_name
                : 'N/A'}
            </p>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Loại tài khoản</div>
          </div>
        ),
        width: 120,
        render: (_, record) => {
          return (
            <>
              <div
                style={{
                  fontWeight: 'bold',
                  color:
                    record?.source === 'supplier'
                      ? 'green'
                      : record?.source === 'seller'
                      ? 'blue'
                      : '',
                }}
              >
                {record?.source?.charAt(0).toUpperCase() +
                  record?.source?.slice(1)}
              </div>
            </>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Loại giao dịch</div>
          </div>
        ),
        dataIndex: 'action_type',
        key: 'action_type',
        width: 140,
        render: (text, record) => {
          return (
            <div
              style={{
                fontWeight: 'bold',
                color:
                  text === 'deposit'
                    ? 'green'
                    : text === 'withdrawal'
                    ? 'red'
                    : text === 'confirmed_order'
                    ? 'red'
                    : '#5573e0',
              }}
            >
              {t(`accountant.type_transaction.${text}`)}
            </div>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Hình thức</div>
          </div>
        ),
        dataIndex: 'method',
        key: 'method',
        width: 200,
        render: text => {
          return <p>{t(`user.transaction.${text}`)}</p>;
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Biến động</div>
          </div>
        ),
        dataIndex: 'amount',
        key: 'amount',
        width: 160,
        render: (text, record) => {
          return (
            <div
              style={{
                color: record?.type === 'deposit' ? 'green' : 'red',
              }}
            >
              {record?.type === 'deposit' ? '+' : '-'} &nbsp;
              {formatVND(Math.abs(text))} VNĐ
            </div>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Nội dung</div>
          </div>
        ),
        dataIndex: 'note',
        key: 'note',
        width: 240,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Trạng thái</div>
          </div>
        ),
        dataIndex: 'confirm_status',
        key: 'confirm_status',
        width: 160,
        align: 'center',
        render: (text, record) => {
          const currentStatus = constants.TRANSACTION_STATUS.find(
            v => v.id === text,
          );
          return (
            <>
              <BoxColor colorValue={currentStatus?.color}>
                {currentStatus?.name || ''}
              </BoxColor>
              <div className="action-wrapper">{getRowAction(record)}</div>
            </>
          );
        },
      },
    ],
    [data],
  );

  const getRowAction = record => {
    return (
      <Button color="blue" className="btn-sm" onClick={() => goDetail(record)}>
        Chi tiết
      </Button>
    );
  };

  return (
    <PageWrapper>
      <CustomSectionWrapper>
        <div className="header">
          <CustomH3 className="title text-left" mb={{ xs: 's6' }}>
            {t(messages.title())}
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
                  className="custom"
                  columns={columns}
                  searchSchema={{
                    keyword: {
                      required: false,
                    },
                    status: {
                      required: false,
                    },
                  }}
                  data={{ data, pagination }}
                  scroll={{ x: 1100, y: 5000 }}
                  actions={gotoPage}
                  rowKey={record => record.id}
                />
              </div>
            </Col>
          </Row>
        </Spin>
      </CustomSectionWrapper>
    </PageWrapper>
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
`;
