import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { isEmpty } from 'lodash';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { Row, Col, Spin, Modal, Form as F, Input, Checkbox } from 'antd';
import { selectLoading, selectDetail } from '../../slice/selectors';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { useAccountDebtPeriodOverviewSlice } from '../../slice';
import { PageWrapper, Form, Button } from 'app/components';
// import request from 'utils/request';
import {
  HistoryStepbyStep,
  InfoTransaction,
  HandleTransaction,
  InfoPartner,
} from '../../Components';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const Item = F.Item;

const Reasons = [
  {
    id: 2,
    label: 'Chưa nhận được số tiền chuyển khoản',
    value: 'Chưa nhận được số tiền chuyển khoản',
  },
  {
    id: 3,
    label: 'Thông tin tên và số tài khoản không khớp',
    value: 'Thông tin tên và số tài khoản không khớp',
  },
  {
    id: 4,
    label: 'Số tiền chưa được đối soát',
    value: 'Số tiền chưa được đối soát',
  },
  { id: 1, label: 'Lí do khác', value: 'Lí do khác' },
];

export function DetailTransaction({ match, history }) {
  const { t } = useTranslation();
  const id = match?.params?.id;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const debt_period_key = new URLSearchParams(history.location.search).get(
    'debt_period_key',
  );
  const { setFieldsValue, getFieldsValue } = form;
  setFieldsValue({
    note: '',
  });

  const { actions } = useAccountDebtPeriodOverviewSlice();
  const isLoading = useSelector(selectLoading);
  const dataDetail = useSelector(selectDetail);
  const currentUser = useSelector(selectCurrentUser);
  const [reasonReject, setReasonReject] = useState('');
  const [RoleAccountant, setRoleAccountant] = useState('');
  const [visibleModal, setVisibleModal] = useState('');
  const [visibleModalReject, setVisibleModalReject] = useState('');

  useEffect(() => {
    if (isEmpty(currentUser)) dispatch(globalActions.getUserInfo({}));
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(currentUser)) {
      setRoleAccountant(
        currentUser?.roles?.includes('admin_chief_accountant')
          ? 'ChiefAccountant'
          : currentUser?.roles?.includes('admin_accountant')
          ? 'Accountant'
          : '',
      );
    }
  }, [currentUser]);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Công nợ',
          link: '/accountant/debt-overview',
        },
        {
          name: 'Danh sách giao dịch',
          link: `/accountant/detail-user-debt?debt_period_key=${debt_period_key}&page=1&page_size=10`,
        },
        {
          name: 'Chi tiết giao dịch',
        },
      ],
      title: '',
      status: '',
      // fixWidth: true,
      // actions:
      //   dataDetail?.confirm_status === 'pending'
      //     ? action()
      //     : dataDetail?.confirm_status === 'accountant_confirm'
      //     ? action()
      //     : '',
    };
    if (!isEmpty(dataDetail)) {
      // dataBreadcrumb.title =
      //   (dataDetail?.from_user?.full_name ? dataDetail?.from_user?.full_name : 'N/A') +
      //   ' - #' +
      //   dataDetail?.long_code;
      // dataDetailBreadcrumb.status = dataDetail?.confirm_status;
    } else {
      if (id) {
        dispatch(actions.getDetail(id));
        dispatch(actions.getTimeline(id));
      }
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [dataDetail]);
  const onFinishAccept = values => {
    if (RoleAccountant === 'Accountant') {
      dispatch(
        actions.AccountantUpdateConfirm({
          id,
          data: {
            confirm_status: 'accountant_confirmed',
            note: values.note.trim(),
          },
        }),
      );
    } else if (RoleAccountant === 'ChiefAccountant') {
      dispatch(
        actions.ChiefAccountantUpdateConfirm({
          id,
          data: {
            confirm_status: 'chief_accountant_confirmed',
            note: values.note.trim(),
          },
        }),
      );
    }
  };

  const onFinishReject = () => {
    if (RoleAccountant === 'Accountant') {
      dispatch(
        actions.AccountantUpdateConfirm({
          id,
          data: {
            confirm_status: 'accountant_rejected',
            note: reasonReject + ', ' + getFieldsValue().note,
          },
        }),
      );
    } else if (RoleAccountant === 'ChiefAccountant') {
      dispatch(
        actions.ChiefAccountantUpdateConfirm({
          id,
          data: {
            confirm_status: 'chief_accountant_rejected',
            note: reasonReject + ', ' + getFieldsValue().note,
          },
        }),
      );
    }
  };

  const onChangeReason = reasons => {
    setReasonReject(reasons);
  };

  const handleAccept = () => {
    setVisibleModal(true);
  };

  const handleReject = () => {
    setVisibleModalReject(true);
  };

  const onClose = () => {
    setVisibleModal(false);
    setVisibleModalReject(false);
  };

  return (
    <PageWrapper fixWidth>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Row gutter="26">
          <Col span={16}>
            <InfoPartner data={dataDetail} isLoading={isLoading}></InfoPartner>
            <InfoTransaction
              data={dataDetail}
              isLoading={isLoading}
            ></InfoTransaction>
            <HistoryStepbyStep
              data={dataDetail}
              isLoading={isLoading}
            ></HistoryStepbyStep>
          </Col>
          <Col span={8}>
            <HandleTransaction
              t={t}
              data={dataDetail}
              isLoading={isLoading}
              currentUser={currentUser}
              RoleAccountant={RoleAccountant}
              handleAccept={handleAccept}
              handleReject={handleReject}
            ></HandleTransaction>
          </Col>
        </Row>
        <Modal
          name="modal-accept"
          visible={visibleModal}
          footer={null}
          onCancel={onClose}
        >
          <Form
            form={form}
            name="form-approve"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinishAccept}
          >
            <CustomDiv>
              <CheckCircleOutlined className="icon icon-check" />
              <div>
                <div className="title-modal">Xác nhận đã thanh toán</div>
                <div className="desc-modal">
                  Hành động này không thể thu hồi. Bạn chắc chắn vẫn duyệt?
                </div>
              </div>
            </CustomDiv>
            <CustomItem name="note">
              <TextArea
                className="textArea"
                showCount
                maxLength={300}
                rows={4}
                placeholder="Nhập nội dung"
              />
            </CustomItem>

            <CustomItem>
              <Button
                type="primary"
                className="btn-sm btn-action"
                color="blue"
                htmlType="submit"
              >
                Xác nhận
              </Button>
            </CustomItem>
          </Form>
        </Modal>
        <Modal
          name="modal-reject"
          visible={visibleModalReject}
          footer={null}
          onCancel={onClose}
        >
          <Form
            form={form}
            name="form-reject"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinishReject}
          >
            <CustomDiv>
              <CloseCircleOutlined className="icon icon-close" />
              <div>
                <div className="title-modal">Giao dịch cần kiểm tra.</div>
                <div className="desc-modal">
                  Hành động này không thể thu hồi. Bạn chắc chắn vẫn duyệt?
                </div>
              </div>
            </CustomDiv>
            <CustomItem name="reason">
              <div className="title-reason">Lý do ?</div>
              <Checkbox.Group options={Reasons} onChange={onChangeReason} />
            </CustomItem>
            <CustomItem
              name="note"
              // label="Nội dung"
              // rules={[
              //   {
              //     required: true,
              //     message: 'Bắt buộc!',
              //   },
              // ]}
            >
              <TextArea
                className="textArea"
                showCount
                maxLength={300}
                rows={4}
                placeholder="Nhập nội dung"
              />
            </CustomItem>

            <CustomItem>
              <Button
                type="primary"
                context="secondary"
                className="btn-sm btn-action"
                color="orange"
                htmlType="submit"
              >
                Từ chối
              </Button>
            </CustomItem>
          </Form>
        </Modal>
      </Spin>
    </PageWrapper>
  );
}

const CustomDiv = styled.div`
  display: flex;
  margin-bottom: 12px;
  .icon {
    margin-right: 8px;
    svg {
      width: 20px;
      height: 20px;
    }
  }
  .icon-check {
    color: #27ae60;
  }
  .icon-close {
    color: #eb5757;
  }
  .title-modal {
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    margin-bottom: 6px;
  }
  .desc-modal {
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
  }
`;

const CustomItem = styled(Item)`
  margin-top: 24px;
  .title-reason {
    margin-bottom: 10px;
  }
  .ant-checkbox-group {
    .ant-checkbox-group-item {
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 20px;
      }
    }
    .ant-checkbox-inner {
      border-radius: 4px;
    }
    .ant-checkbox-checked .ant-checkbox-inner {
      background-color: #3d56a6;
      border-color: #3d56a6;
    }
    .ant-checkbox-group-item + .ant-checkbox-group-item {
      width: 100%;
    }
  }
  textarea {
    border-radius: 6px;
    border: 1px solid #ebebf0;
  }
  .btn-action {
    margin-left: auto;
  }
`;
