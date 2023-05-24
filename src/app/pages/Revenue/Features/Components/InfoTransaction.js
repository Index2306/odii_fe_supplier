import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import { CustomH3, SectionWrapper } from 'styles/commons';
import styled from 'styled-components/macro';
import { Button, Input } from 'app/components';
import { checkCircle } from 'assets/images/icons';
import * as moment from 'moment';
import { formatVND } from 'utils/helpers';
import constants from 'assets/constants';

export default function InfoTransaction({ data, isLoading }) {
  const { t } = useTranslation();

  const pageContent = (
    <>
      <SectionTitle>
        <CustomH3>Thông tin giao dịch</CustomH3>
        {constants.REVENUE_STATUS.map(v => {
          if (data?.confirm_status === v.id) {
            return <div className={v.color + ' item-color'}>{v.name}</div>;
          }
        })}
      </SectionTitle>

      <SectionDiv>
        {data?.bank_data && (
          <Item>
            <div className="d-flex">
              <div className="bank-logo">
                <img
                  className="logo"
                  src={data?.bank_data?.logo?.origin}
                  alt=""
                />
              </div>
              <div>
                <div className="bank-account__number">
                  <div>{data?.account_number}</div>
                  {data?.confirm_status === 'confirmed' ? (
                    <span className="verified">
                      <img src={checkCircle} alt="" /> Đã xác thực
                    </span>
                  ) : (
                    ''
                  )}
                  {/* <span className="bank-default">Mặc định</span> */}
                </div>
                <div className="bank-title">
                  {data?.bank_data?.title}
                  {/* - {data?.sub_title} */}
                </div>
              </div>
            </div>
          </Item>
        )}
        <Item>
          <div className="label">Ngày giao dịch</div>
          <div>{moment(data?.created_at).format('HH:mm - DD/MM/YYYY')}</div>
        </Item>
        <Item>
          <div className="label">Mã giao dịch</div>
          <div>#{data?.long_code}</div>
        </Item>
        <Item>
          <div className="label">Loại giao dịch</div>
          <div>
            {data?.method === 'debt' ? (
              data?.action_type === 'supplier_confirmed_order' ? (
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
                  color: data?.type === 'deposit' ? 'green' : 'red',
                }}
              >
                {t(`revenue.transaction.${data?.type}`)}
              </div>
            )}
          </div>
        </Item>
        <Item>
          <div className="label">Đơn hàng</div>
          <Link
            to={`/orders/update/${data?.order_id}`}
            style={{
              fontWeight: 'bold',
              color: 'black',
            }}
          >
            #{data?.order_id}
          </Link>
        </Item>
        <Item>
          <div className="label">Số tiền</div>
          <div
            style={{
              fontWeight: 'bold',
              color: '#2F80ED',
            }}
          >
            {formatVND(data?.amount)}đ
          </div>
        </Item>
      </SectionDiv>
      <SectionDiv>
        <CustomH3>Nội dung</CustomH3>
        <Input value={data?.note} disabled></Input>
      </SectionDiv>
    </>
  );

  return (
    <SectionWrapperInfo className="box-df" style={{ width: '660px' }}>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 9 }} className="loading" />
      ) : (
        pageContent
      )}
    </SectionWrapperInfo>
  );
}

export const SectionWrapperInfo = styled(SectionWrapper)`
  width: 660px;
  margin-left: auto;
  margin-right: auto;
`;

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
  &.end {
    border-bottom: none;
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
`;

export const CustomButton = styled(Button)`
  width: 100%;
  margin-top: 16px;
  border-radius: 4px;
`;

export const SectionDiv = styled.div`
  margin-top: 28px;

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
  justify-content: space-between;
  .item-color {
    &::before {
      content: '';
      text-align: left;
      height: 6px;
      margin-right: 6px;
      width: 6px;
      border-radius: 50%;
      display: inline-block;
      top: -1px;
      position: relative;
    }
  }
  .greenMedium {
    color: #27ae60;
    &::before {
      background-color: #27ae60;
    }
  }
  .primary {
    color: #3d56a6;
    &::before {
      background-color: #3d56a6;
    }
  }
  .secondary2 {
    color: red;
    &::before {
      background-color: red;
    }
  }
  .blackPrimary {
    color: black;
    &::before {
      background-color: black;
    }
  }
  .greenMedium {
    color: #3d56a6;
    &::before {
      background-color: #3d56a6;
    }
  }
`;
