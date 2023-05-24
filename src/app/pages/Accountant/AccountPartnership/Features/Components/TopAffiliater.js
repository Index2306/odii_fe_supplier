import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Skeleton, Divider } from 'antd';
import styled from 'styled-components/macro';
// import { EmptyPage, Select } from 'app/components';
import { SectionWrapper, CustomH3, CustomStyle } from 'styles/commons';
import { formatDate, formatMoney } from 'utils/helpers';
import {
  selectDataTopAffiliater,
  selectDataListPeriodPayout,
  // selectShowEmptyPageListPayout,
} from '../../slice/selectors';
import { useAffiliateSlice } from '../../slice';
import { isEmpty } from 'lodash';
import { formatDateRange } from 'utils/helpers';
import { transaction } from 'assets/images/empty';

// const { Option } = Select;

export default function TopPartnerAffiliate({ t, messages, isLoading }) {
  const dispatch = useDispatch();
  const { actions } = useAffiliateSlice();

  const dataTopAffiliater = useSelector(selectDataTopAffiliater);
  const listPeriodTime = useSelector(selectDataListPeriodPayout);
  // const showEmptyPage = useSelector(selectShowEmptyPageListPayout);

  const [payoutPeriodTime, setPayoutPeriodTime] = useState(0);

  useEffect(() => {
    dispatch(actions.getDataTopAffiliater({}));
    dispatch(actions.getDataListPeriodPayout());
  }, []);

  useEffect(() => {
    dispatch(actions.getDataTopAffiliater(payoutPeriodTime));
  }, [payoutPeriodTime]);

  const listPayoutPeriodSelect = useMemo(
    () =>
      (listPeriodTime || []).map(period => ({
        text: formatDateRange(period.startDate, period.endDate),
        value: period.key,
      })),
    [listPeriodTime],
  );

  // const handleChose = value => {
  //   setPayoutPeriodTime(value);
  // };
  const pageContent = (
    <>
      <CustomDivTopPartnerAffiliate>
        <div className="header d-flex justify-content-between">
          <CustomH3 className="title text-left" mb={{ xs: 's4' }}>
            {
              t(messages.topPartnerAffiliate())
              // .toUpperCase()
            }
          </CustomH3>
          {/* <CustomStyle>
            <Select
              // color="primary"
              size="medium"
              value={payoutPeriodTime || 0}
              onSelect={handleChose}
              style={{ width: 220, fontWeight: 'bold' }}
            >
              <Option value={'all'}>Từ trước đến nay</Option>
              <Option value={0}>Chu kỳ hiện tại</Option>
              {listPayoutPeriodSelect.map(
                (payoutPeriod, index) =>
                  // index === 0 ? (
                  //   <Option value={payoutPeriod.value} key={payoutPeriod.value}>
                  //     Chu kỳ hiện tại
                  //   </Option>
                  // ) : (
                  //   <Option value={payoutPeriod.value} key={payoutPeriod.value}>
                  //     {payoutPeriod.text}
                  //   </Option>
                  // ),
                  index !== 0 && (
                    <Option value={payoutPeriod.value} key={payoutPeriod.value}>
                      {payoutPeriod.text}
                    </Option>
                  ),
              )}
            </Select>
          </CustomStyle> */}
          <CustomStyle className="d-flex">
            <div style={{ fontSize: '12px', lineHeight: '20px' }}>
              Chu kỳ hiện tại: &ensp;
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>
              {listPayoutPeriodSelect.map(
                (payoutPeriod, index) => index === 0 && payoutPeriod.text,
              )}
            </div>
          </CustomStyle>
        </div>
        {isEmpty(dataTopAffiliater) ? (
          <>
            <div className="text-center">
              {/* <img src={transaction} alt=""></img> */}
            </div>
            <div className="text-center">
              Chu kỳ hiện tại chưa có đối tác nào có doanh thu !
            </div>
          </>
        ) : (
          <Row gutter={[8, 8]} className="list-top-affiliate">
            {!isEmpty(dataTopAffiliater) &&
              dataTopAffiliater?.map((item, index) => (
                <>
                  <Col span={24} style={{ height: '32px' }}>
                    <Row gutter={8} className="item">
                      <Col span={8} className="info-user">
                        <div className="stt">{index + 1}</div>
                        <div className="avatar">
                          <img src={item?.from_user?.avatar?.origin} alt="" />
                        </div>
                        <div className="full_name">
                          {item?.from_user?.full_name
                            ? item?.from_user?.full_name
                            : item?.from_user?.email}
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
                  {index !== dataTopAffiliater.length - 1 && (
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
        )}
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
  height: 250px;
`;
const CustomDivTopPartnerAffiliate = styled.div`
  .tooltip {
    margin-left: 6px;
    margin-bottom: 6px;
  }
  .list-top-affiliate {
    overflow-y: auto;
    overflow-x: hidden;
    /* height: 310px;
    max-height: 310px; */
    /* height: 165px; */
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
