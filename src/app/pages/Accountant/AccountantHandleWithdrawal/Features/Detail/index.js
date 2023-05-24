import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { isEmpty } from 'lodash';
import constants from 'assets/constants';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { Row, Col, Spin, Space, Modal, Form as F, Input, Checkbox } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { selectLoading, selectDetail } from '../../slice/selectors';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { useAccountantHandleWithdrawalSlice } from '../../slice';
import { PageWrapper, Form, Button } from 'app/components';
import { HistoryStepbyStep, PaymentInfo, DetailInfo } from '../../Components';
const { roles } = constants;
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

const DEPOSITE_ROLE = [
  {
    confirm_status: 'pending',
    required_roles: [
      roles.superAdmin,
      roles.adminAccountant,
      roles.adminChiefAccountant,
    ],
  },
  {
    confirm_status: 'accountant_confirm',
    required_roles: [roles.superAdmin, roles.adminChiefAccountant],
  },
  {
    confirm_status: 'accountant_confirmed',
    required_roles: [roles.superAdmin, roles.adminChiefAccountant],
  },
];
export function Detail({ match }) {
  const { t } = useTranslation();
  const id = match?.params?.id;
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { setFieldsValue, getFieldsValue } = form;

  setFieldsValue({
    note: '',
  });

  const { actions } = useAccountantHandleWithdrawalSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);
  const currentUser = useSelector(selectCurrentUser);
  const [reasonReject, setReasonReject] = useState('');
  const [RoleAccountant, setRoleAccountant] = useState('');
  const [visibleModal, setVisibleModal] = useState('');
  const [visibleModalReject, setVisibleModalReject] = useState('');
  const [hasRole, setHasRole] = useState(false);
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
    let hasRole = false;
    if (data && data.confirm_status) {
      const actionData = DEPOSITE_ROLE.find(
        item => item.confirm_status === data.confirm_status,
      );
      if (actionData) {
        for (let reqRole of actionData.required_roles) {
          if (currentUser?.roles.includes(reqRole)) {
            hasRole = true;
            break;
          }
        }
      }
    }
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Yêu cầu rút tiền',
          link: '/accountant/withdrawal',
        },
        {
          name: 'Chi Tiết',
        },
      ],
      title: '',
      status: '',
      fixWidth: true,
      actions: hasRole ? action() : '',
    };
    if (!isEmpty(data)) {
      dataBreadcrumb.title =
        (data?.from_user?.full_name ? data?.from_user?.full_name : 'N/A') +
        ' - #' +
        data?.long_code;
      dataBreadcrumb.status = data?.confirm_status;
    } else {
      if (id) {
        dispatch(actions.getDetail(id));
        dispatch(actions.getTimeline(id));
      }
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
    setHasRole(hasRole);
  }, [data]);

  const action = () => {
    return (
      <Item className="m-0" shouldUpdate>
        <div className="d-flex justify-content-between">
          <Space>
            <Button
              context="secondary"
              color="orange"
              onClick={() => handleReject()}
              className="btn-sm"
            >
              <span>Từ chối</span>
            </Button>
            <Button
              className="btn-sm"
              onClick={() => handleAccept()}
              width="80px"
            >
              <span>Duyệt</span>
            </Button>
          </Space>
        </div>
      </Item>
    );
  };

  const onFinishAccept = values => {
    if (RoleAccountant === 'Accountant') {
      dispatch(
        actions.AccountantUpdateConfirm({
          id,
          data: {
            ...data,
            confirm_status: 'accountant_confirmed',
            note: values.note.trim(),
          },
          onSuccessCallback: () => dispatch(actions.getDetail(id)),
        }),
      );
    } else if (RoleAccountant === 'ChiefAccountant') {
      // dispatch(
      //   actions.AccountantUpdateConfirm({
      //     id,
      //     data: {
      //       ...data,
      //       confirm_status: 'accountant_confirmed',
      //       note: values.note.trim(),

      //     },
      //   }),
      // );
      dispatch(
        actions.ChiefAccountantUpdateConfirm({
          id,
          data: {
            ...data,
            confirm_status: 'chief_accountant_confirmed',
            note: values.note.trim(),
          },
          onSuccessCallback: () => dispatch(actions.getDetail(id)),
        }),
      );
    }
    onClose();
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
          onSuccessCallback: () => dispatch(actions.getDetail(id)),
        }),
      );
    } else if (RoleAccountant === 'ChiefAccountant') {
      // dispatch(
      //   actions.AccountantUpdateConfirm({
      //     id,
      //     data: {
      //       confirm_status: 'accountant_rejected',
      //       note: reasonReject + ', ' + getFieldsValue().note,
      //     },
      //   }),
      // );
      dispatch(
        actions.ChiefAccountantUpdateConfirm({
          id,
          data: {
            confirm_status: 'chief_accountant_rejected',
            note: reasonReject + ', ' + getFieldsValue().note,
          },
          onSuccessCallback: () => dispatch(actions.getDetail(id)),
        }),
      );
    }
    onClose();
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
            <PaymentInfo data={data} isLoading={isLoading}></PaymentInfo>
            <HistoryStepbyStep
              data={data}
              isLoading={isLoading}
            ></HistoryStepbyStep>
          </Col>
          <Col span={8}>
            <DetailInfo
              t={t}
              data={data}
              isLoading={isLoading}
              currentUser={currentUser}
              RoleAccountant={RoleAccountant}
              handleAccept={handleAccept}
              handleCancel={handleReject}
              hasRole={hasRole}
            ></DetailInfo>
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
                <div className="title-modal">
                  Xác nhận: Duyệt yêu cầu Nạp tiền
                </div>
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
                <div className="title-modal">
                  Xác nhận: Từ Chối yêu cầu Nạp tiền.
                </div>
                <div className="desc-modal">
                  Hành động này không thể thu hồi. Bạn chắc chắn vẫn duyệt?
                </div>
              </div>
            </CustomDiv>
            <CustomItem name="reason">
              <div className="title-reason">Lý do từ chối ?</div>
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
