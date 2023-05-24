import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import { SectionWrapper } from 'styles/commons';
import styled from 'styled-components/macro';
import { Button } from 'app/components';
import request from 'utils/request';
import { isEmpty } from 'lodash';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
export default function InfoPartner({ data }) {
  const location = useLocation();
  // const partnerId = new URLSearchParams(location.search).get('user_id');
  const [dataPartner, setDataPartner] = useState({});
  const [accountType, setAccountType] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const currentUser = useSelector(selectCurrentUser);
  const partnerId = currentUser?.id;
  // const isSupplier = partner?.is_supplier;
  // const isSeller = partner?.is_seller;
  // const isAdmin = partner?.is_admin;

  useEffect(() => {
    if (partnerId > 0) fetchPartner();
  }, [partnerId]);

  const fetchPartner = async () => {
    setIsLoading(true);
    if (!partnerId) {
      setIsLoading(false);
      return;
    }
    const { data } = await request(
      `user-service/accountant/partner/users/${partnerId}`,
    );
    setDataPartner(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isEmpty(dataPartner)) {
      setAccountType(dataPartner?.account_type);
    }
  }, [dataPartner]);

  const pageContent = (
    <>
      <SectionTitle>
        <div className="title">Thông tin đối tác</div>
      </SectionTitle>

      <SectionDiv>
        <Item>
          <div className="label">Loại tài khoản</div>
          <div
            style={{
              color:
                accountType === 'supplier'
                  ? 'green'
                  : accountType === ' seller'
                  ? 'blue'
                  : accountType === 'admin'
                  ? 'red'
                  : '',
            }}
          >
            {/* {t(`user.${data?.account_type}`)} */}
            {accountType === 'supplier'
              ? 'Supplier'
              : accountType === ' seller'
              ? 'Seller'
              : accountType === 'admin'
              ? 'Admin'
              : ''}
          </div>
        </Item>
        <Item>
          <div className="label">Tên tài khoản</div>
          <div>{dataPartner?.email}</div>
        </Item>
        <Item>
          <div className="label">Họ tên</div>
          <div>{dataPartner?.full_name}</div>
        </Item>
        <Item>
          <div className="label">SĐT</div>
          <div>{dataPartner?.phone}</div>
        </Item>
      </SectionDiv>
    </>
  );

  return (
    <SectionWrapper className="box-df" style={{ minHeight: '260px' }}>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} className="loading" />
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
  margin-top: 16px;

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
  .title {
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    color: #333333;
  }
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
`;
