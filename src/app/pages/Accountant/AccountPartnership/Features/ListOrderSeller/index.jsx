/**
 *
 * List Order Seller
 *
 */
import React, { useState, useEffect, useMemo } from 'react';
// import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, Form as F } from 'antd';
import { Table, PageWrapper, Link, Button, BoxColor } from 'app/components';
import {
  CustomH1,
  CustomH2,
  CustomH3,
  CustomStyle,
  SectionWrapper,
} from 'styles/commons';
import { useAffiliateSlice } from '../../slice';
import { isEmpty } from 'lodash';
import {
  selectLoading,
  selectDataListOrderSeller,
  selectPaginationListOrderSeller,
} from '../../slice/selectors';
import { formatDate, formatVND, formatDateRange } from 'utils/helpers';
import styled from 'styled-components';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { useLocation } from 'react-router';
import constants from 'assets/constants';
import {
  StatisticalAffiliateSeller,
  TopPartnerAffiliateSeller,
} from '../Components';
import { FilterBarTableSellerOrder } from '../';
import { isEmptyBindingElement } from 'typescript';
import StaticInfoPartner from './Components/StaticInfoPartner';

const Item = F.Item;

export function ListOrderSeller({ match }) {
  const id = match?.params?.id;
  const key = match?.params?.key;

  // console.log(match);
  const fromDateStrKey = key.slice(0, 10);
  const toDateStrKey = key.slice(11, 21);
  const dispatch = useDispatch();
  const { actions } = useAffiliateSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDataListOrderSeller);
  // console.log(data);
  const pagination = useSelector(selectPaginationListOrderSeller);

  // useEffect(() => {
  //   return () => {
  //     setDataRecord(id);
  //   };
  // }, []);

  const gotoPage = (data = '') => {
    dispatch(actions.getDataListOrderSeller(data));
  };

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDataListOrderSellerDone({}));
    };
  }, []);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Đối tác',
          link: '/accountant/partnership',
        },
        {
          name: 'Chi tiết hóa đơn',
        },
      ],
      title: '',
    };
    if (!isEmpty(id)) {
      dataBreadcrumb.title = `Chu kỳ: ${formatDateRange(
        fromDateStrKey,
        toDateStrKey,
      )}`;
      dispatch(actions.getDataListOrderSeller);
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data, match]);

  const normalizeData = data => {
    return data?.map(debtPeriod => ({
      ...debtPeriod,
    }));
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
        width: 50,
        render: (_, record, index) => {
          return (
            <>
              <span>{index + 1}</span>
            </>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Ngày tạo Đơn</div>
          </div>
        ),
        width: 80,
        align: 'center',
        render: (_, record) => {
          return (
            <>
              <div className="user__email">
                {formatDate(record.order_created_at)}
              </div>
            </>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Hoa hồng (%)</div>
          </div>
        ),
        width: 80,
        align: 'center',
        render: (_, record) => {
          return (
            <span className="user__type">
              {record.affiliate_commission_percent}%
            </span>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box text-right">Hoa hồng</div>
          </div>
        ),
        dataIndex: 'total_revenue',
        key: 'total_revenue',
        width: 60,
        render: (text, record) => {
          return (
            <div className="text-right total-revenue">
              {formatVND(record.commission)} đ
            </div>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box text-right ">Tổng tiền đơn hàng</div>
          </div>
        ),
        // dataIndex: 'total_fee',
        // key: 'total_fee',
        width: 100,
        render: (text, record) => {
          return (
            <div className="text-right total-fee">
              {formatVND(record.order_total_price)} đ
            </div>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box status">Trạng thái</div>
          </div>
        ),
        // dataIndex: 'id',
        // key: 'id',
        width: 120,
        // align: 'center',
        render: (_, record) => {
          const currentStatus = constants.ACCOUNTANT_PARTNERSHIP_FULFILLMENT_STATUS.find(
            v => v.id === record.isPaid,
          );
          return (
            <div className="status">
              {isEmpty(currentStatus) || (
                <BoxColor colorValue={currentStatus?.color} width="140px">
                  {currentStatus?.name}
                </BoxColor>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );
  // const getRowAction = data => {
  //   return (
  //     <Button
  //       className="btn-sm"
  //       onClick={() => {
  //         history.push(
  //           `/accountant/detail-user-debt?debt_period_key=${key}&partner_id=${data.partner_id}&user_id=${data.user.id}`,
  //         );
  //       }}
  //     >
  //       Chi tiết
  //     </Button>
  //   );
  // };
  return (
    <>
      <PageWrapper>
        {/* <Col span={12}>
            <StatisticalAffiliateSeller />
          </Col>
          <Col span={12}>
            <TopPartnerAffiliateSeller />
          </Col> */}
        {/* <Row gutter={24}>
          <Col>
            
          </Col>
        </Row> */}
        {/* <CustomH1>
              Chu kỳ hiện tại: {formatDateRange(fromDateStrKey, toDateStrKey)}
            </CustomH1> */}
        <StaticInfoPartner />
      </PageWrapper>
      <PageWrapper>
        <CustomSectionWrapper>
          <div className="header">
            <CustomH3 className="title text-left" mb={{ xs: 's6' }}>
              Danh sách các đơn hàng Seller được nhận hoa hồng
            </CustomH3>
          </div>
          <CustomH3 className="title text-left" mb={{ xs: 's5' }}>
            <FilterBarTableSellerOrder
            // isLoading={isLoading}
            // gotoPage={gotoPage}
            />
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
                      keyword: {
                        required: false,
                      },
                      isPaid: {
                        required: false,
                      },
                    }}
                    data={{ data: normalizeData(data), pagination: pagination }}
                    scroll={{ x: 1100, y: 5000 }}
                    // rowKey={record => record.id}
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
  .status {
    text-align: center;
    .sc-fznWqX {
      margin-left: 30px;
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
