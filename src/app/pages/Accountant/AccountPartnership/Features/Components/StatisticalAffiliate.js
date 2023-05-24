import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Tooltip, Skeleton, Divider } from 'antd';
import styled from 'styled-components/macro';
import { SectionWrapper, CustomStyle } from 'styles/commons';
import {
  // totalDeposit,
  // totalWithdrawal,
  people,
  boxCheck,
  totalMoney,
  totalOrder,
  tooltip,
} from 'assets/images/dashboards';
import { selectDataStatisticalAffiliate } from '../../slice/selectors';
import { useAffiliateSlice } from '../../slice';
import { formatMoney } from 'utils/helpers';
import { isEmpty } from 'lodash';

const dataOverViewAffiliate = [
  {
    count: true,
    icon: people,
    side: 'left',
    title: 'Tổng đối tác Affiliater',
    hint: 'Tổng số người tham gia chương trình Affiliate',
    total: 'number_of_affs',
    // growth: 'deposit_amount',
  },
  {
    count: true,
    icon: people,
    side: 'left',
    title: 'Đối tác chưa thanh toán',
    hint:
      'Tổng số người tham gia chương trình Affiliate chưa được thanh toán trong chu kỳ',
    total: 'number_of_unpaid_affs',
    // growth: 'deposit_amount',
  },
  {
    icon: people,
    side: 'right',
    title: 'Tổng tiền đã trả',
    hint: 'Tổng tiền hoa hồng đã trả cho Seller giới thiệu từ trước đến nay',
    total: 'total_commissions',
  },
  {
    icon: boxCheck,
    side: 'right',
    title: 'Tổng tiền chưa thanh toán',
    hint:
      'Tổng tiền hoa hồng chưa thanh toán trong chu kỳ này và phải được thanh toán trong 7 ngày tiếp theo khi hết chu kỳ',
    total: 'total_unpaid_commissions',
  },
];

export default function OverViewAffiliate({ t, isLoading }) {
  const dispatch = useDispatch();
  const { actions } = useAffiliateSlice();

  const dataStatisticalAffiliate = useSelector(selectDataStatisticalAffiliate);

  useEffect(() => {
    dispatch(actions.getDataStatisticalAffiliate({}));
  }, []);

  const pageContent = (
    <>
      <CustomDivOverViewAffiliate>
        <Row gutter={[8, 8]}>
          <Col xs={24} lg={11}>
            <Row gutter={[8, 8]}>
              {dataOverViewAffiliate.map(
                (item, index) =>
                  item.side === 'left' && (
                    <>
                      <Col xs={24} lg={24}>
                        <div className="item">
                          <div className="box-icon" marginRight={{ xs: 's4' }}>
                            <img src={item.icon} alt="" />
                          </div>
                          <CustomStyle
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                          >
                            <CustomStyle color="#828282" fontWeight={400}>
                              {item.title}
                              <Tooltip placement="right" title={item.hint}>
                                <img className="tooltip" src={tooltip} alt="" />
                              </Tooltip>
                            </CustomStyle>
                            <CustomStyle display="flex">
                              <span className="number">
                                {!isEmpty(dataStatisticalAffiliate) &&
                                  (!isEmpty(
                                    dataStatisticalAffiliate[item?.total],
                                  )
                                    ? item?.count
                                      ? dataStatisticalAffiliate[item?.total]
                                      : formatMoney(
                                          dataStatisticalAffiliate[item?.total],
                                        )
                                    : '0')}
                              </span>
                            </CustomStyle>
                          </CustomStyle>
                        </div>
                      </Col>
                      {index === 0 && <CustomDivider />}
                    </>
                  ),
              )}
            </Row>
          </Col>
          <Col flex="auto" className="d-flex justify-content-center">
            <Divider type="vertical" style={{ height: '100%' }} />
          </Col>
          <Col xs={24} lg={11}>
            <Row gutter={[8, 8]}>
              {dataOverViewAffiliate.map(
                (item, index) =>
                  item.side === 'right' && (
                    <>
                      <Col xs={24} lg={24}>
                        <div className="item">
                          <div className="box-icon" marginRight={{ xs: 's4' }}>
                            <img src={item.icon} alt="" />
                          </div>
                          <CustomStyle
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                          >
                            <CustomStyle color="#828282" fontWeight={400}>
                              {item.title}
                              <Tooltip placement="right" title={item.hint}>
                                <img className="tooltip" src={tooltip} alt="" />
                              </Tooltip>
                            </CustomStyle>
                            <CustomStyle display="flex">
                              <span className="number">
                                {!isEmpty(dataStatisticalAffiliate) &&
                                  (!isEmpty(
                                    dataStatisticalAffiliate[item?.total],
                                  )
                                    ? item?.count
                                      ? dataStatisticalAffiliate[item?.total]
                                      : formatMoney(
                                          dataStatisticalAffiliate[item?.total],
                                        )
                                    : '0')}
                              </span>
                            </CustomStyle>
                          </CustomStyle>
                        </div>
                      </Col>
                      {index === 2 && <CustomDivider />}
                    </>
                  ),
              )}
            </Row>
          </Col>
        </Row>
      </CustomDivOverViewAffiliate>
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
  min-height: 250px;
`;

const CustomDivider = styled(Divider)`
  margin: 14px 0 16px;
`;

const CustomDivOverViewAffiliate = styled.div`
  padding: 30px 10px;
  .tooltip {
    margin-left: 6px;
    margin-bottom: 6px;
  }
  .item {
    display: flex;
  }
  .number {
    line-height: 21px;
    font-size: 22px;
    margin-right: 6px;
    font-weight: 900;
  }
  /* .ant-col {
    padding-left: 0 !important;
    padding-right: 0 !important;
  } */
  .box-icon {
    width: 50px;
    height: 50px;
    padding: 14px;
    background: #ffffff;
    border: 1px solid #ebebf0;
    border-radius: 10px;
    margin-right: 12px;
    img {
      width: 20px;
      height: 20px;
    }
  }
  .growth-period {
    font-size: 12px;
    line-height: 14px;
    color: #828282;
    align-self: end;
  }
`;
