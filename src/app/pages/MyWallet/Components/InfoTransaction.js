import React from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'antd';
import { CustomH3, SectionWrapper } from 'styles/commons';
import styled from 'styled-components/macro';
import { Input } from 'app/components';
import { formatDate, formatVND } from 'utils/helpers';

export default function InfoTransaction({ data, isLoading }) {
  const { t } = useTranslation();

  const pageContent = (
    <>
      <div>
        <CustomH3 className="section-title">Chi tiết giao dịch</CustomH3>
      </div>
      <SectionDiv>
        <CustomItemBank>
          <div className="label">
            {data?.action_type === 'deposit'
              ? 'Chuyển tiền tới ngân hàng của Admin'
              : 'Rút tiền về ngân hàng của bạn'}
          </div>
          <div className="left">
            <div className="bank-avatar">
              <img
                className="logo"
                src={data?.to_bank?.bank_info?.logo?.origin}
                alt=""
              />
            </div>

            <div className="account">
              <div className="account-number">
                {data?.to_bank?.account_number}
              </div>
              <div className="account-name">{data?.to_bank?.account_name}</div>
              <div className="bank-info">
                {data?.to_bank?.bank_info?.title}-{data?.to_bank?.sub_title}
              </div>
            </div>
          </div>
        </CustomItemBank>
        <Item>
          <div className="label">Ngày giao dịch</div>
          <div>{formatDate(data?.created_at)}</div>
        </Item>
        <Item>
          <div className="label">Mã giao dịch</div>
          <div
            style={{
              fontWeight: 'bold',
            }}
          >
            #{data?.long_code}
          </div>
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
          <div className="label">Số tiền</div>
          <div
            style={{
              fontWeight: 'bold',
              color: data?.type === 'deposit' ? 'green' : 'red',
            }}
          >
            {(data?.type === 'deposit' ? '+' : '') + formatVND(data?.amount)}đ
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
    <SectionWrapperInfo className="box-df">
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 9 }} className="loading" />
      ) : (
        pageContent
      )}
    </SectionWrapperInfo>
  );
}

const SectionWrapperInfo = styled(SectionWrapper)`
  max-width: 660px;
  margin-left: auto;
  margin-right: auto;
`;

const CustomItemBank = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 24px;
  .label {
    margin-top: 24px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.4);
  }
  .left {
    display: flex;
    .bank-avatar {
      width: 80px;
      height: 80px;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      padding: 6px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .account {
      margin-left: 12px;
      margin-top: 10px;
      .account-number {
        font-weight: 500;
        font-size: 14px;
        line-height: 18px;
      }
      .account-name {
        font-weight: 500;
        font-size: 10px;
        line-height: 18px;
        color: #828282;
      }
      .bank-info {
        font-weight: 500;
        font-size: 10px;
        line-height: 18px;
        color: #828282;
      }
    }
  }
`;

const Item = styled.div`
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

const SectionDiv = styled.div`
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
