import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { isEmpty } from 'lodash';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectLoading,
  selectDetail,
  selectTimeline,
} from '../../slice/selectors';
import { useAffiliateSlice } from '../../slice/index';
import { formatDate, formatVND } from 'utils/helpers';
import {
  Row,
  Col,
  Spin,
  Space,
  Modal,
  Form as F,
  Input,
  Checkbox,
  Breadcrumb,
  Divider,
  Skeleton,
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { PageWrapper, Form, Button, Image } from 'app/components';
import { CustomH3, CustomStyle, SectionWrapper } from 'styles/commons';
// import techcombankImg from 'assets/images/techcombank.png';
import History from '../Components/History';
import HanleTransaction from '../Components/HandleTransaction';

const { TextArea } = Input;
const Item = F.Item;

export function DetailAccountPartnership({ match }) {
  const id = match?.params?.id;
  console.log('render??');
  const dispatch = useDispatch();
  const { actions } = useAffiliateSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);
  console.log(data);
  const dataTimeline = useSelector(selectTimeline);
  const [dataTimelineFormat, setDataTimelineFormat] = useState([]);
  // const [isLoading, setIsLoading] = useState('');

  const [form] = Form.useForm();
  const { setFieldsValue, getFieldsValue } = form;

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
      dispatch(actions.getTimelineDone({}));
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
          name: 'Chi tiết thanh toán',
        },
      ],
      // fixWidth: true,
      title: '',
    };
    if (!isEmpty(data)) {
      dataBreadcrumb.title = data?.from_user?.full_name
        ? data?.from_user?.full_name
        : data?.from_user?.email;
    } else {
      if (id) {
        dispatch(actions.getDetail(id));
        dispatch(actions.getTimeline(id));
      }
    }

    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  return (
    <div>
      {/* <SectionWrapper>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/accountant/partnership">Đối tác</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Chi tiết thanh toán</Breadcrumb.Item>
        </Breadcrumb>
      </SectionWrapper> */}

      <CustomPageWrapper>
        <div className="wrapper">
          <Row gutter={24} className="row-wrapper">
            <Col span={14}>
              <SectionWrapper mt={{ xs: 's4' }}>
                <CustomH3 className="title">Thông tin đối tác</CustomH3>
                {isLoading ? (
                  <Skeleton
                    active
                    paragraph={{ rows: 1 }}
                    className="loading"
                  />
                ) : (
                  <div className="info-partner__user-account">
                    <Row gutter={24} style={fixPosition}>
                      <Col>
                        <li>Loại tài khoản</li>
                      </Col>
                      <Col>
                        <span className="info-partner__username">SELLER</span>
                      </Col>
                    </Row>
                    <Divider />
                    <Row gutter={24}>
                      <Col>
                        <li>Mã tài khoản</li>
                      </Col>
                      <Col>
                        <span>{data?.from_user?.id}</span>
                      </Col>
                    </Row>
                  </div>
                )}
              </SectionWrapper>
              <SectionWrapper mt={{ xs: 's4' }}>
                <CustomH3 className="title">Thông tin giao dịch</CustomH3>
                {isLoading ? (
                  <Skeleton
                    active
                    paragraph={{ rows: 10 }}
                    className="loading"
                  />
                ) : (
                  <div>
                    <Row gutter={24} style={{ justifyContent: 'left' }}>
                      <Col>
                        <div className="infotransaction__img-wrapper">
                          <img src={data?.bank_data?.bank_info?.logo?.origin} />
                        </div>
                      </Col>
                      <Col>
                        <CustomStyle className="infotransaction__text-wrapper">
                          <span className="infotransaction__text-id">
                            {data?.order_code}
                          </span>

                          {data?.bank_data?.status === 'active' ? (
                            <div>
                              <span className="infotransaction__auth-id">
                                {' '}
                                <CheckCircleOutlined /> Đã xác thực{' '}
                              </span>
                              <div className="infotransaction__user">
                                <span>{data?.bank_data?.account_name}</span>
                                <span>
                                  {data?.bank_data?.bank_info?.title} -{' '}
                                  {data?.bank_data?.sub_title}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="infotransaction__auth-id-deny">
                              <CloseCircleOutlined />
                              Chưa xác thực
                            </span>
                          )}
                          {/* <div className="infotransaction__user">
                            <span>{data?.bank_data?.account_name}</span>
                            <span>{data?.bank_data?.sub_title}</span>
                          </div> */}
                        </CustomStyle>
                      </Col>
                    </Row>
                    <Divider />
                    <Row gutter={24}>
                      <Col>
                        <li>Ngày đăng ký</li>
                      </Col>
                      <Col>
                        <span>{formatDate(data?.created_at)}</span>
                      </Col>
                    </Row>
                    <Divider />
                    <Row gutter={24}>
                      <Col>
                        <li>Khách hàng giới thiệu</li>
                      </Col>
                      <Col>
                        <span>{data?.partner_id}</span>
                      </Col>
                    </Row>
                    <Divider />
                    <Row gutter={24}>
                      <Col>
                        <li>Chiết khấu nhận được</li>
                      </Col>
                      <Col>
                        <span className="info-transaction__discount-received">
                          {formatVND(data?.commission)} đ
                        </span>
                      </Col>
                    </Row>
                    <Divider />
                    <Row gutter={24}>
                      <Col>
                        <li>Số tiền phải chuyển</li>
                      </Col>
                      <Col>
                        <span className="info-transaction__amount-transfer">
                          {formatVND(data?.commission)} đ
                        </span>
                      </Col>
                    </Row>
                  </div>
                )}
              </SectionWrapper>
              {/* day la noi de history */}
              {/* <History isLoading={isLoading} /> */}
            </Col>
            <Col span={6}>
              <HanleTransaction data={data} isLoading={isLoading} />
            </Col>
          </Row>
        </div>
      </CustomPageWrapper>
    </div>
  );
}

const CustomPageWrapper = styled(PageWrapper)`
  .ant-row:first-child {
    display: flex;
    justify-content: center;
  }
  .ant-row {
    display: flex;
    justify-content: space-between;
    & li {
      font-weight: 400;
      line-height: 16.41px;
      color: #828282;
    }
  }
  .info-partner__user-account {
    .info-partner__username {
      color: #333333;
      font-weight: 700;
      text-transform: uppercase;
    }
  }
  & span {
    color: #333333;
  }
  .infotransaction__img-wrapper {
    width: 60px;
    height: 60px;
    border: 1px solid #ebebf0;
    border-box: box-sizing;
    border-radius: 6px;
    padding: 14px 7px;
    & img {
      width: 45px;
      height: 37px;
      image-rendering: pixelated;
    }
  }
  .infotransaction__text-wrapper {
    .infotransaction__text-id {
      color: #333333;
      font-weight: 500;
    }
    .infotransaction__auth-id {
      color: #27ae60;
      font-weight: 500;
      & span {
        color: #27ae60;
      }
      & svg {
        margin: 0 1px 5px 0;
      }
    }

    .infotransaction__auth-id-deny {
      color: red;
      font-weight: 500;
      & span {
        color: red;
      }
      & svg {
        margin: 0 4px 5px 0;
      }
    }

    // .  margin-left: 7px;
    //   color: #27AE60;
    //   font-weight: 500;
    //   & span {
    //   color: #27AE60;
    //   }
    //   & svg {
    //     margin: 0 1px 5px 0;
    //   }
    // }
    .infotransaction__user {
      display: flex;
      flex-direction: column;
      & span {
        font-size: 12px !important;
        color: #828282 !important;
      }
    }
  }
  .info-transaction__discount-received {
    color: #333333 !important;
    font-weight: 700 !important;
  }
  .info-transaction__amount-transfer {
    color: #2f80ed !important;
    font-weight: 700;
  }
`;

const fixPosition = {
  display: 'flex',
  justifyContent: 'space-between',
};
