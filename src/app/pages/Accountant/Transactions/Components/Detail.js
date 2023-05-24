import React from 'react';
// import { Row, Col, Switch } from 'antd';
// import { useDispatch } from 'react-redux';
import { Link, Avatar } from 'app/components';
import { isEmpty } from 'lodash';
import styled from 'styled-components/macro';
import { CustomH4 } from 'styles/commons';
import { UserOutlined } from '@ant-design/icons';
import { formatVND, formatDate } from 'utils/helpers';

const host = 'https://i.odii.xyz/';

export default function DetailComponent({ data, t, isLoading, showInfo }) {
  const pageContent = (
    <>
      <CustomH4 mb={{ xs: 's4' }}>Thông tin giao dịch</CustomH4>
      <Div>
        <p className="label">Dịch vụ</p>
        <p>Chuyển tiền {data?.method === 'bank' ? 'Ngân Hàng' : ''}</p>
      </Div>
      <Div>
        <p className="label">Loại giao dịch</p>
        <p
          style={{
            fontWeight: 'bold',
            color: data?.type === 'deposit' ? 'green' : 'red',
          }}
        >
          {t(`user.transaction.${data?.type}`)}
        </p>
      </Div>
      <Div>
        <p className="label">Người gửi</p>
        <div className=" d-flex justify-items-end">
          <Link
            style={{
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
            onClick={() => showInfo(data)}
          >
            {data?.from_user?.full_name
              ? data?.from_user?.full_name
              : data?.from_user?.email}
          </Link>
          <CustomAvatar
            src={
              data?.from_user?.avatar?.location
                ? host + data?.from_user?.avatar?.location
                : data?.from_user?.avatar?.origin
            }
            icon={<UserOutlined />}
          />
        </div>
      </Div>
      <Div>
        <p className="label">Nguồn tiền</p>
        <p
          style={{
            fontWeight: 'bold',
            color:
              data?.source === 'supplier'
                ? 'green'
                : data?.source === 'seller'
                ? 'blue'
                : 'blue',
          }}
        >
          {data?.source === 'supplier'
            ? 'Nhà cung cấp'
            : data?.source === 'seller'
            ? 'Nhà bán lẻ'
            : ''}
        </p>
      </Div>
      <Div>
        <p className="label">Số tiền chuyển</p>
        <p
          style={{
            fontWeight: 'bold',
            color: data?.type === 'deposit' ? 'green' : 'red',
          }}
        >
          {formatVND(data?.amount)} VNĐ
        </p>
      </Div>
      <Div>
        <p className="label">Ngân hàng nhận</p>
        {!isEmpty(data?.to_bank) && (
          <div className=" d-flex justify-items-end">
            <p>
              {data?.to_bank?.bank_info
                ? data?.to_bank?.bank_info?.title
                : 'N/A'}
            </p>
          </div>
        )}
      </Div>
      {/* <Div>
                      <p className="label">Người nhận</p>
                      <p>{data?.to_bank?.account_number}</p>
                    </Div> */}
      <Div>
        <p className="label">Số Tài khoản nhận</p>
        <p>{data?.to_bank?.account_number}</p>
      </Div>
      <Div>
        <p className="label">Mã giao dịch</p>
        <p>
          {/* {data?.action_type === 'seller_deposit'
                          ? data?.short_code
                          : data?.action_type === 'supplier_deposit'
                          ? data?.short_code
                          : ''} */}
          {data?.short_code ? data?.short_code : data?.long_code}
        </p>
      </Div>
      <Div>
        <p className="label">Thời gian giao dịch</p>
        <p>{formatDate(data?.created_at)}</p>
      </Div>
      <Div className="end">
        <p className="label">Nội dung</p>
        <p>{data?.note}</p>
      </Div>
    </>
  );

  return <>{pageContent}</>;
}

const Div = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  border-bottom: 1px solid #f0f0f0;

  .label {
    font-size: 14px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.4);
  }
  &.end {
    border-bottom: none;
  }
  .logo-bank {
    width: 45px;
    height: 21px;
    margin-left: 8px;
  }
`;

const CustomAvatar = styled(Avatar)`
  width: 36px;
  height: 36px;
  margin-left: 8px;
  margin-top: -6px;
`;
