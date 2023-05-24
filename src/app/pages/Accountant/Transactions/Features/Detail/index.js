import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { isEmpty } from 'lodash';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { Row, Col, Spin, Modal, Skeleton } from 'antd';
import {
  selectLoading,
  selectDetail,
  selectTimeline,
} from '../../slice/selectors';
import { useTransactionsSlice } from '../../slice';
import { PageWrapper, Form, Link, Avatar } from 'app/components';
import { UserOutlined } from '@ant-design/icons';
import { SectionWrapper } from 'styles/commons';

import { HistoryStepbyStep, DetailComponent, InfoFee } from '../../Components';

const host = 'https://i.odii.xyz/';

export function Detail({ match }) {
  const { t } = useTranslation();
  const id = match?.params?.id;
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { actions } = useTransactionsSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);
  const dataTimeline = useSelector(selectTimeline);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataTimelineFormat, setDataTimelineFormat] = useState([]);

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
          name: 'Giao dịch',
          link: '/transactions',
        },
        {
          name: 'Chi Tiết',
        },
      ],
      title: '',
      status: '',
    };
    if (!isEmpty(data)) {
      dataBreadcrumb.title =
        (data?.from_user?.full_name ? data?.from_user?.full_name : 'N/A') +
        ' - #' +
        data?.long_code;
      dataBreadcrumb.status =
        data?.type === 'deposit' || data?.type === 'withdrawal'
          ? data?.status
          : data?.type === 'debt'
          ? data?.confirm_status
          : '';
    } else {
      if (id) {
        dispatch(actions.getDetail(id));
        dispatch(actions.getTimeline(id));
      }
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  useEffect(() => {
    if (!isEmpty(dataTimeline)) {
      const temp = dataTimeline.map(item => {
        return {
          ...item,
          title:
            item.metadata?.status === 'created'
              ? 'Khởi tạo giao dịch'
              : item.metadata?.status === 'pending'
              ? 'Giao dịch đang chờ xử lý'
              : item.metadata?.status === 'succeeded'
              ? 'Giao dịch thành công'
              : item.metadata?.status === 'failed'
              ? 'Giao dịch bị từ chối'
              : item.metadata?.action_type === 'seller_set_delivered_order'
              ? 'Người bán xác nhận đơn hàng đã giao thành công'
              : // : item.metadata?.status === 'failed'
                // ? 'Giao dịch bị từ chối'
                // : item.metadata?.status === 'failed'
                // ? 'Giao dịch bị từ chối'
                '',
        };
      });
      setDataTimelineFormat(temp);
    }
  }, [dataTimeline]);

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const showInfo = data => {
    setIsModalVisible(true);
  };

  return (
    <CustomPageWrapper>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Form form={form} name="normal_login" className="login-form">
          <>
            <Row gutter={24}>
              <Col xs={24} lg={7}>
                <SectionWrapper>
                  {isLoading ? (
                    <Skeleton active paragraph={{ rows: 6 }} />
                  ) : (
                    <HistoryStepbyStep
                      data={data}
                      t={t}
                      isLoading={isLoading}
                      dataTimelineFormat={dataTimelineFormat}
                    ></HistoryStepbyStep>
                  )}
                </SectionWrapper>
              </Col>
              <Col xs={24} lg={10}>
                <SectionWrapper>
                  {isLoading ? (
                    <Skeleton active paragraph={{ rows: 20 }} />
                  ) : (
                    <DetailComponent
                      data={data}
                      t={t}
                      isLoading={isLoading}
                      showInfo={showInfo}
                    ></DetailComponent>
                  )}
                </SectionWrapper>
              </Col>
              <Col xs={24} lg={7}>
                <SectionWrapper>
                  {isLoading ? (
                    <Skeleton active paragraph={{ rows: 4 }} />
                  ) : (
                    <InfoFee data={data} t={t} isLoading={isLoading}></InfoFee>
                  )}
                </SectionWrapper>
              </Col>
            </Row>
          </>
        </Form>
      </Spin>
      <Modal
        title="Thông tin người gửi"
        visible={isModalVisible}
        onCancel={handleClose}
        footer={null}
      >
        <Div>
          <p className="label">Tên người gửi</p>
          <div className=" d-flex justify-items-end">
            <Link
              style={{ textDecoration: 'none' }}
              onClick={() => showInfo(data)}
            >
              {data?.from_user?.full_name}
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
          <p className="label">Họ</p>
          <p>{data?.from_user?.last_name}</p>
        </Div>
        <Div>
          <p className="label">Email</p>
          <p>{data?.from_user?.email}</p>
        </Div>
        <Div>
          <p className="label">Số điện thoại</p>
          <p>{data?.from_user?.phone}</p>
        </Div>
        <Div className="end">
          <p className="label">Trạng thái</p>
          <p>
            {data?.from_user?.status === 'active'
              ? 'Hoạt động'
              : 'Không hoạt động'}
          </p>
        </Div>
      </Modal>
    </CustomPageWrapper>
  );
}

const CustomPageWrapper = styled(PageWrapper)`
  margin-left: 0;
  margin-right: 0;
`;

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
  width: 45px;
  height: 35px;
  margin-left: 8px;
  margin-top: -6px;
`;
