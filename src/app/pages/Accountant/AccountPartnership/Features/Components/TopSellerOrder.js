import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Skeleton, Divider } from 'antd';
import styled from 'styled-components/macro';
import { Select } from 'app/components';
import { SectionWrapper, CustomH3 } from 'styles/commons';
import { formatDate, formatMoney } from 'utils/helpers';
import { selectDataTopAffiliater } from '../../slice/selectors';
import { useAffiliateSlice } from '../../slice';
import { isEmpty } from 'lodash';

const { Option } = Select;

export default function TopSellerOrder({ t, messages, isLoading }) {
  const dispatch = useDispatch();
  const { actions } = useAffiliateSlice();

  const dataTopAffiliateSeller = useSelector(selectDataTopAffiliater);

  useEffect(() => {
    dispatch(actions.getDataTopAffiliater({}));
  }, []);

  const pageContent = (
    <>
      <CustomDivTopPartnerAffiliate>
        <div className="header">
          <CustomH3 className="title text-left" mb={{ xs: 's6' }}>
            Top Seller bán đơn hàng
          </CustomH3>
        </div>
        <Row gutter={[8, 8]} className="list-top-affiliate">
          {!isEmpty(dataTopAffiliateSeller) &&
            dataTopAffiliateSeller?.map((item, index) => (
              <>
                <Col span={24}>
                  <Row gutter={8} className="item">
                    <Col span={8} className="info-user">
                      <div className="stt">{index + 1}</div>
                      <div className="avatar">
                        <img src={item?.from_user?.avatar?.origin} alt="" />
                      </div>
                      <div className="full_name">
                        {item?.from_user?.full_name}
                      </div>
                    </Col>
                    <Col span={8} className="date">
                      Đăng ký: {formatDate(item?.created_at)}
                    </Col>
                    <Col span={8} className="money">
                      {formatMoney(item?.commission)}
                    </Col>
                  </Row>
                </Col>
                {index !== dataTopAffiliateSeller.length - 1 && (
                  <Divider
                    style={{
                      width: '80%',
                      minWidth: 'unset',
                      margin: '8px auto',
                    }}
                  />
                )}
              </>
            ))}
        </Row>
      </CustomDivTopPartnerAffiliate>
    </>
  );

  return (
    <CustomSectionWrapper>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} className="loading" />
      ) : (
        pageContent
      )}
    </CustomSectionWrapper>
  );
}

const CustomSectionWrapper = styled(SectionWrapper)`
  /* max-height: 400px; */
  max-height: 250px;
`;
const CustomDivTopPartnerAffiliate = styled.div`
  .tooltip {
    margin-left: 6px;
    margin-bottom: 6px;
  }
  .list-top-affiliate {
    overflow-y: auto;
    /* height: 310px;
    max-height: 310px; */
    height: 165px;
    max-height: 165px;
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .info-user {
      display: flex;
      align-items: center;
      .stt {
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
        color: #6c798f;
        margin-right: 12px;
      }
      .avatar {
        width: 32px;
        height: 32px;

        background: #8691a6;
        border-radius: 4px;
        margin-right: 8px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }
      .full_name {
        font-size: 14px;
        line-height: 16px;
        color: #333333;
      }
    }

    .date {
      font-size: 12px;
      line-height: 14px;
      display: flex;
      align-items: center;
      color: #828282;
    }
    .money {
      font-weight: bold;
      font-size: 12px;
      line-height: 14px;
      text-align: right;
      color: #333333;
    }
  }
`;
