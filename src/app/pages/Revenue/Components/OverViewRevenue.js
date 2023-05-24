import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Skeleton, Tooltip } from 'antd';
import { SectionWrapper } from 'styles/commons';
import styled from 'styled-components/macro';
import {
  totalDeposit,
  totalWithdrawal,
  tooltip,
} from 'assets/images/dashboards';
import { messages } from '../messages';
import { formatMoney } from 'utils/helpers';
import * as moment from 'moment';

const dataHistoryRevenue = [
  {
    icon: totalDeposit,
    title: 'Chờ xử lý',
    hint: 'Tổng số dư tạm tính đang có ở chu kỳ hiện tại',
    key: 'wait_for_confirmation',
    color: '#EF5816',
  },
  {
    icon: totalWithdrawal,
    title: 'Chờ đối soát & thanh toán',
    hint:
      'Tổng số dư kỳ trước đang được đối soát và thanh toán đến tài khoản ngân hàng của bạn',
    key: 'payout_on_progress',
    color: '#1B78D4',
  },
  {
    icon: totalWithdrawal,
    title: 'Đã thanh toán',
    hint: 'Tổng số tiền Odii đã thanh toán cho tới hiện tại',
    key: 'total_paid',
    color: '#219737',
  },
];

export default function OverViewRevenue({ isLoading, debtBelanceInfo }) {
  const { t } = useTranslation();

  const pageContent = (
    <>
      <div className="title " mb={{ xs: 's6' }}>
        {t(messages.title())}
      </div>
      <div className="section-revenue__history">
        <Row gutter={[8, 8]}>
          {dataHistoryRevenue.map(item => (
            <Col xs={24} md={8}>
              <div className={'item ' + item.key}>
                <div className="item-title">
                  {item.title}
                  <Tooltip placement="right" title={item.hint}>
                    <img className="tooltip" src={tooltip} alt="" />
                  </Tooltip>
                </div>
                <div className="amount" style={{ color: item.color }}>
                  {isLoading ? (
                    <Skeleton active paragraph={false} />
                  ) : debtBelanceInfo[item.key]?.amount ? (
                    formatMoney(debtBelanceInfo[item.key]?.amount)
                  ) : (
                    '0 đ'
                  )}
                </div>
                <div className="cycle">
                  Chu kỳ:{'  '}
                  {debtBelanceInfo
                    ? moment(debtBelanceInfo[item.key]?.start_date).format(
                        'DD/MM',
                      ) +
                      ' - ' +
                      moment(debtBelanceInfo[item.key]?.end_date).format(
                        'DD/MM/YYYY',
                      )
                    : ''}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );

  return (
    <SectionOverViewRevenue>
      {
        // isLoading ? (
        //   <Skeleton active paragraph={{ rows: 4 }} className="loading" />
        // ) : (
        pageContent
        // )
      }
    </SectionOverViewRevenue>
  );
}

const SectionOverViewRevenue = styled(SectionWrapper)`
  padding: 20px 24px;
  .mb-8 {
    margin-bottom: 8px;
  }
  .hide {
    visibility: hidden;
  }
  .title {
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    margin-bottom: 16px;
  }
  .ant-skeleton-title {
    margin-top: 0;
    margin-bottom: 8px;
    width: 32%;
  }
  .section-revenue__history {
    .item {
      width: -webkit-fill-available;
      border: 1px solid #e6e6e9;
      box-sizing: border-box;
      border-radius: 6px;
      height: 118px;
      .tooltip {
        margin-left: 6px;
        margin-bottom: 6px;
      }
      padding: 14px 20px;
      &-title {
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        margin-bottom: 16px;
      }
      .amount {
        font-weight: 500;
        font-size: 18px;
        line-height: 21px;
        letter-spacing: 0.01em;
        margin-bottom: 8px;
      }
      .cycle {
        font-size: 12px;
        line-height: 18px;
        color: #828282;
      }
    }
    .wait_for_confirmation {
      border-top: 5px solid #ef5816;
    }
    .payout_on_progress {
      border-top: 5px solid #1b78d4;
    }
    .total_paid {
      border-top: 5px solid #219737;
    }
  }
  .section-balance__bank {
    .empty-bank {
      padding: 18px 25px;
      display: flex;
      justify-content: center;
    }
    .item-bank {
      display: flex;
      justify-content: space-between;
      padding: 18px 25px;
      .action {
        display: flex;
        .btn-detail-bank {
          align-self: center;
          margin-right: 8px;
        }
        img {
          width: 16px;
          height: 16px;
          align-self: center;
          &:hover {
            cursor: pointer;
          }
        }
      }
      .bank-logo {
        width: 75px;
        height: 45px;
        background: #ffffff;
        padding: 4px;
        border: 1px solid #ebebf0;
        border-radius: 6px;
        margin-right: 12px;
        img {
          width: 100%;
          height: auto;
          border-radius: 6px;
        }
      }
      .bank-account__number {
        display: flex;
        font-weight: 500;
        line-height: 18px;
        margin-top: 4px;
        margin-bottom: 2px;
      }
      .bank-account__number .verified {
        margin-left: 22px;
        font-weight: 500;
        font-size: 12px;
        line-height: 18px;
        color: #27ae60;
      }
      .bank-title {
        font-weight: 500;
        font-size: 12px;
        line-height: 18px;
        color: #828282;
      }
    }
  }
`;
