/**
 *
 * Accountant Handle Request Withdrawal
 *
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, Modal, Form as F, Input, Checkbox } from 'antd';
import {
  Table,
  PageWrapper,
  Link,
  BoxColor,
  Button,
  Form,
} from 'app/components';
import constants from 'assets/constants';
import { CustomH3, SectionWrapper } from 'styles/commons';
import { useAccountantHandleWithdrawalSlice } from './slice';
import { FilterBar } from './Features';
import {
  selectLoading,
  selectData,
  selectPagination,
  selectListSelected,
} from './slice/selectors';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { messages } from './messages';
import { isEmpty } from 'lodash';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { formatDate, formatVND } from 'utils/helpers';

import styled from 'styled-components';

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

export function AccountantHandleWithdrawal({ history }) {
  const [form] = Form.useForm();

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useAccountantHandleWithdrawalSlice();
  const isLoading = useSelector(selectLoading);
  const listSelected = useSelector(selectListSelected);
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);
  const currentUser = useSelector(selectCurrentUser);

  const { setFieldsValue, getFieldsValue } = form;

  setFieldsValue({
    note: '',
  });

  const [curentRecord, setCurentRecord] = useState('');
  const [reasonReject, setReasonReject] = useState('');
  const [roleAccountant, setRoleAccountant] = useState('');

  const [visibleModal, setVisibleModal] = useState('');
  const [visibleModalReject, setVisibleModalReject] = useState('');

  const gotoPage = (data = '', isReload) => {
    let payload = isReload ? history.location.search : data;
    if (!payload) {
      payload = '?page=1&page_size=10';
    }
    dispatch(actions.getData(payload));
  };

  React.useEffect(() => {
    const delaySecond = 10000;
    let reloadPageInterval;
    let reloadPageTimeout;
    reloadPageTimeout = setTimeout(() => {
      reloadPageInterval = setInterval(() => {
        gotoPage('', true);
      }, delaySecond);
    }, delaySecond);
    return () => {
      clearInterval(reloadPageInterval);
      clearTimeout(reloadPageTimeout);
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

  const rowSelection = {
    onChange: selectedRowKeys => {
      // setListOption([]);'
      dispatch(actions.setListSelected(selectedRowKeys));
    },
    getCheckboxProps: record => ({
      // disabled: listOwner.includes(record.id) || record.id === '1',
      name: record.name,
    }),
  };

  const onFinishAccept = values => {
    if (roleAccountant === 'Accountant') {
      dispatch(
        actions.AccountantUpdateConfirm({
          isList: true,
          id: curentRecord.id,
          data: {
            confirm_status: 'accountant_confirmed',
            note: values.note.trim(),
          },
        }),
      );
    } else if (roleAccountant === 'ChiefAccountant') {
      dispatch(
        actions.ChiefAccountantUpdateConfirm({
          isList: true,
          id: curentRecord.id,
          data: {
            confirm_status: 'chief_accountant_confirmed',
            note: values.note.trim(),
          },
        }),
      );
    }
    onClose();
  };

  const onFinishReject = () => {
    if (roleAccountant === 'Accountant') {
      dispatch(
        actions.AccountantUpdateConfirm({
          isList: true,
          id: curentRecord.id,
          data: {
            confirm_status: 'accountant_rejected',
            note: reasonReject + ', ' + getFieldsValue().note,
          },
        }),
      );
    } else if (roleAccountant === 'ChiefAccountant') {
      dispatch(
        actions.ChiefAccountantUpdateConfirm({
          isList: true,
          id: curentRecord.id,
          data: {
            confirm_status: 'chief_accountant_rejected',
            note: reasonReject + ', ' + getFieldsValue().note,
          },
        }),
      );
    }
    onClose();
  };

  const onChangeReason = reasons => {
    setReasonReject(reasons);
  };

  const handleAccept = record => {
    setVisibleModal(true);
    setCurentRecord(record);
  };

  const handleReject = record => {
    setVisibleModalReject(true);
    setCurentRecord(record);
  };
  const onClose = () => {
    setCurentRecord('');
    setVisibleModal(false);
    setVisibleModalReject(false);
  };
  const renderAction = (text, record) => {
    const actionData = DEPOSITE_ROLE.find(item => item.confirm_status === text);
    if (!actionData) {
      return getActionDetail(record);
    }
    let hasRole = false;
    for (let reqRole of actionData.required_roles) {
      if (currentUser?.roles.includes(reqRole)) {
        hasRole = true;
        break;
      }
    }
    if (!hasRole) {
      return getActionDetail(record);
    }
    return getRowAction(record);
  };
  const columns = React.useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Mã giao dịch</div>
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        width: 180,
        render: (_, record) => (
          <>
            <Link
              to={`/accountant/withdrawal/${record.id}/detail`}
              style={{ fontWeight: 'bold', margin: '0' }}
            >
              #{record?.long_code}
            </Link>
            <div style={{ fontSize: '12px', color: '#828282' }}>
              {formatDate(record?.created_at)}
            </div>
          </>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Người thực hiện</div>
          </div>
        ),
        width: 170,
        // align: 'center',
        render: (_, record) => {
          return (
            <>
              <div>
                {record?.from_user?.full_name
                  ? record?.from_user?.full_name
                  : 'N/A'}
              </div>
              <div style={{ fontSize: '12px', color: '#828282' }}>
                {record?.from_user?.phone ? record?.from_user?.phone : ''}
              </div>
            </>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Loại tài khoản</div>
          </div>
        ),
        width: 120,
        render: (_, record) => {
          return (
            <>
              <div
                style={{
                  fontWeight: 'bold',
                  color:
                    record?.source === 'supplier'
                      ? 'green'
                      : record?.source === 'seller'
                      ? 'blue'
                      : '',
                }}
              >
                {record?.source.charAt(0).toUpperCase() +
                  record?.source.slice(1)}
              </div>
              {/* <div style={{ fontSize: '12px', color: '#828282' }}>
                Odii Shop
              </div> */}
            </>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Loại giao dịch</div>
          </div>
        ),
        dataIndex: 'type',
        key: 'type',
        width: 140,
        render: (text, record) => {
          return (
            <p
              style={{
                fontWeight: 'bold',
                color: 'red',
              }}
            >
              {t(`user.transaction.${text}`)}
            </p>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Hình thức</div>
          </div>
        ),
        dataIndex: 'method',
        key: 'method',
        width: 200,
        render: text => {
          return <p>{t(`user.transaction.${text}`)}</p>;
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Số tiền</div>
          </div>
        ),
        dataIndex: 'amount',
        key: 'amount',
        width: 160,
        render: (text, record) => {
          return (
            <div
              style={{
                color: 'red',
              }}
            >
              -&nbsp;
              {formatVND(Math.abs(text))} đ
            </div>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Nội dung</div>
          </div>
        ),
        dataIndex: 'note',
        key: 'note',
        width: 200,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Trạng thái</div>
          </div>
        ),
        dataIndex: 'confirm_status',
        key: 'confirm_status',
        width: 160,
        align: 'center',
        render: (text, record) => {
          const currentStatus = constants.ACCOUNTANT_STATUS.find(
            v => v.id === text,
          );
          return (
            <>
              {currentStatus && (
                <>
                  <BoxColor
                    fontWeight="medium"
                    colorValue={currentStatus?.color}
                  >
                    {currentStatus?.name || ''}
                  </BoxColor>
                  {renderAction(text, record)}
                </>
              )}
            </>
          );
        },
      },
    ],
    [data],
  );

  const getRowAction = record => {
    return (
      <div className="action-wrapper l-30">
        <Button
          context="secondary"
          color="orange"
          className="btn-sm"
          onClick={() => handleReject(record)}
        >
          Từ chối
        </Button>
        <Button
          color="blue"
          className="btn-sm"
          onClick={() => handleAccept(record)}
        >
          Xác nhận
        </Button>
      </div>
    );
  };

  const getActionDetail = record => {
    return (
      <div className="action-wrapper">
        <Button
          className="btn-sm"
          onClick={() => {
            history.push(`/accountant/withdrawal/${record.id}/detail`);
          }}
        >
          Chi tiết
        </Button>
      </div>
    );
  };

  return (
    <PageWrapper>
      <CustomSectionWrapper>
        <div className="header">
          <CustomH3 className="title text-left" mb={{ xs: 's6' }}>
            {t(messages.title()).toUpperCase()}
          </CustomH3>
        </div>
        <CustomH3 className="title text-left" mb={{ xs: 's5' }}>
          <FilterBar isLoading={isLoading} gotoPage={gotoPage} />
        </CustomH3>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <Row gutter={24}>
            <Col span={24}>
              <div>
                <Table
                  className="custom"
                  rowSelection={{
                    selectedRowKeys: listSelected,
                    type: 'checkbox',
                    ...rowSelection,
                  }}
                  columns={columns}
                  searchSchema={{
                    keyword: {
                      required: false,
                    },
                    status: {
                      required: false,
                    },
                  }}
                  data={{ data, pagination }}
                  scroll={{ x: 1100, y: 5000 }}
                  actions={gotoPage}
                  rowKey={record => record.id}
                />
              </div>
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
              <CustomItem
                name="note"
                rules={[
                  {
                    required: true,
                    message: 'Bắt buộc!',
                  },
                ]}
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
                rules={[
                  {
                    required: true,
                    message: 'Bắt buộc!',
                  },
                ]}
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
      </CustomSectionWrapper>
    </PageWrapper>
  );
}
const CustomSectionWrapper = styled(SectionWrapper)`
  p {
    margin-top: 14px;
  }
  .hide {
    visibility: hidden;
  }
  .action-wrapper {
    display: none;
    position: absolute;
    padding: 0;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    white-space: nowrap;
    word-break: keep-all;
    > div {
      display: inline-flex;
      > button {
        margin-left: 11px;
      }
    }
    .btn-cancel {
      background: #fff;
      &:hover {
        color: #fff;
        background: red;
      }
    }
    button {
      margin: auto;
    }
  }
  .l-30 {
    left: -32px;
  }
  tr:hover {
    .action-wrapper {
      display: inline-flex;
    }
  }
`;

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
