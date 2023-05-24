import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CustomH3, SectionWrapper } from 'styles/commons';
import styled from 'styled-components/macro';
import { Button, Input } from 'app/components';
import { checkCircle } from 'assets/images/icons';
import * as moment from 'moment';
import { Skeleton } from 'antd';
import { formatVND } from 'utils/helpers';

// const status = [
//   {
//     id: 1,
//     status: 'created',
//     name: 'status-created',
//     content: 'Khởi tạo',
//   },
//   {
//     id: 2,
//     status: 'pending',
//     name: 'status-pending',
//     content: 'Đang chờ',
//   },
//   {
//     id: 3,
//     status: 'successed',
//     name: 'status-successed',
//     content: 'Đã thanh toán',
//   },
//   {
//     id: 4,
//     status: 'confirmed',
//     name: 'status-confirmed',
//     content: 'Đang kiểm tra',
//   },
//   {
//     id: 5,
//     status: 'cancelled',
//     name: 'status-cancelled',
//     content: 'Đã từ chối',
//   },
// ];

export default function InfoTransaction({ data, isLoading }) {
  const { t } = useTranslation();

  const pageContent = (
    <>
      <SectionTitle>
        <CustomH3>Thông tin giao dịch</CustomH3>
        {/* {status.map(v => {
          if (data?.confirm_status === v.confirm_status) {
            return <div className={v.name}>{v.content}</div>;
          }
        })} */}
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
                  {/* - {infoTransaction?.sub_title} */}
                </div>
              </div>
            </div>
          </Item>
        )}
        <Item>
          <div className="label">Ngày giao dịch</div>
          <div>{moment(data?.created_at).format('hh:mm - DD/MM/YYYY')}</div>
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
                <div
                  style={{
                    fontWeight: 'bold',
                    color: ' #2F80ED',
                  }}
                >
                  {t(`accountant.type_transaction.${data?.action_type}`)}
                </div>
              )
            ) : (
              <div
                style={{
                  fontWeight: 'bold',
                  color: ' #2F80ED',
                }}
              >
                {t(`accountant.type_transaction.${data?.action_type}`)}
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
            #{data?.order_code || data?.shop_order_id}
          </Link>
        </Item>
        {/* <Item>
          <div className="label">Số sản phẩm</div>
          <div>1</div>
        </Item> */}
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
    <SectionWrapper className="box-df">
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 10 }} className="loading" />
      ) : (
        pageContent
      )}
    </SectionWrapper>
  );
}

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
  .status-successed {
    color: #27ae60;
    &::before {
      content: '';
      text-align: left;
      height: 6px;
      margin-right: 6px;
      width: 6px;
      background-color: #27ae60;
      border-radius: 50%;
      display: inline-block;
      top: -1px;
      position: relative;
    }
  }
  .status-confirmed {
    color: #f2994a;
    &::before {
      content: '';
      text-align: left;
      height: 6px;
      margin-right: 6px;
      width: 6px;
      background-color: #f2994a;
      border-radius: 50%;
      display: inline-block;
      top: -1px;
      position: relative;
    }
  }
  .status-cancelled {
    color: red;
    &::before {
      content: '';
      text-align: left;
      height: 6px;
      margin-right: 6px;
      width: 6px;
      background-color: red;
      border-radius: 50%;
      display: inline-block;
      top: -1px;
      position: relative;
    }
  }
  .status-pending {
    color: #3d56a6;
    &::before {
      content: '';
      text-align: left;
      height: 6px;
      margin-right: 6px;
      width: 6px;
      background-color: #3d56a6;
      border-radius: 50%;
      display: inline-block;
      top: -1px;
      position: relative;
    }
  }
  .status-created {
    color: red;
    &::before {
      content: '';
      text-align: left;
      height: 6px;
      margin-right: 6px;
      width: 6px;
      background-color: #3d56a6;
      border-radius: 50%;
      display: inline-block;
      top: -1px;
      position: relative;
    }
  }
`;
