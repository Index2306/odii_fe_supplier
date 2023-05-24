import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { Row, Col, Spin } from 'antd';
import { Modal, Form as F, Input } from 'antd';
import styled from 'styled-components/macro';
import { useLocation } from 'react-router';
import { PageWrapper, Form, Button, HistoryStepByStep } from 'app/components';
import request from 'utils/request';
import { useAccountDebtPeriodOverviewSlice } from '../../slice';
import { selectDebtTimeline } from '../../slice/selectors';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import {
  TableListTransaction,
  InfoPartner,
  InfoPeriod,
  ProcessInfo,
  ProcessInfoStep,
} from '../../Components';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const Item = F.Item;
const DEPT_ACTION_ACTOR = {
  accountant_confirm: 'Kế toán viên',
  partner_confirm: 'Nhà cung cấp',
  chief_accountant_confirm: 'Kế toán trưởng',
};
export function UserDebtDetail({ match }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const dataTimeline = useSelector(selectDebtTimeline);
  const { actions } = useAccountDebtPeriodOverviewSlice();
  const currentUser = useSelector(selectCurrentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState({});
  const [confirmModel, setConfirmModel] = useState({
    visible: false,
  });
  const uRLSearchParams = new URLSearchParams(location.search);
  const debtPeriodKey = uRLSearchParams.get('debt_period_key');
  // const partnerId = uRLSearchParams.get('partner_id');
  const partnerId = currentUser?.partner_id;
  const [form] = Form.useForm();

  const { setFieldsValue, getFieldsValue } = form;
  setFieldsValue({
    note: '',
  });

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Công nợ',
          link: '/accountant/debt-overview',
        },
        {
          name: 'Danh sách giao dịch',
        },
      ],
      title: '',
      status: '',
      // fixWidth: true,
    };
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
    };
  }, []);

  useEffect(() => {
    if (partnerId) {
      setIsLoading(true);
      fetchTotalAmount();
      setIsLoading(false);
    }
  }, [partnerId]);

  const fetchTotalAmount = async () => {
    if (!partnerId || !debtPeriodKey) {
      return;
    }
    const { data } = await request(
      `oms/accountant/partner/overview-stats-by-period?debt_period_key=${debtPeriodKey}&partner_id=${partnerId}`,
    );
    setTotalAmount(data);
    dispatch(actions.getDebtTimeline({ id: data.id }));
  };

  const handleConfirm = (isAccept, type) => {
    setConfirmModel({
      visible: true,
      isAccept,
      type,
    });
  };
  const submitConfirm = values => {
    if (values.note.trim()) {
      const payloadData = {
        is_accept: confirmModel.isAccept,
        action_type: confirmModel.type,
        note: values.note.trim(),
      };
      dispatch(
        actions.updateDebtProgress({
          id: totalAmount.id,
          data: payloadData,
          onSuccessCallback: data => {
            setTotalAmount({ ...data });
            dispatch(actions.getDebtTimeline({ id: data.id }));
          },
        }),
      );
      setConfirmModel(data => ({
        ...data,
        visible: false,
      }));
    }
  };
  const onSubmitNote = async (note, onSuccessCallback) => {
    setIsLoading(true);
    const response = await request(
      `oms/accountant/debt/${totalAmount.id}/comment`,
      {
        method: 'post',
        data: {
          note: note,
        },
      },
    );
    if (response.is_success) {
      dispatch(actions.getDebtTimeline({ id: totalAmount.id }));
      setIsLoading(false);
      if (onSuccessCallback) onSuccessCallback();
    } else {
      setIsLoading(false);
    }
  };
  return (
    <PageWrapper>
      <Spin tip="Đang tải..." spinning={false}>
        {/* <Row gutter="24">
          <Col span={16} offset={4}>
            <ProcessInfo deptInfo={totalAmount} handleConfirm={handleConfirm} />
          </Col>
        </Row> */}
        <Row gutter="24">
          <Col span={8}>
            <InfoPartner></InfoPartner>
          </Col>
          <Col span={8}>
            <InfoPeriod
              totalAmount={totalAmount}
              isLoading={isLoading}
            ></InfoPeriod>
          </Col>
          <Col span={8}>
            <ProcessInfoStep
              deptInfo={totalAmount}
              handleConfirm={handleConfirm}
            />
          </Col>
        </Row>
        <Row gutter="24">
          <Col span={24}>
            <TableListTransaction />
          </Col>
        </Row>
        <Row gutter="24">
          <Col span={24}>
            <HistoryStepByStep
              dataTimeline={dataTimeline}
              isLoading={isLoading}
              onSubmitNote={onSubmitNote}
            />
          </Col>
        </Row>
        <Modal
          name="modal-accept"
          visible={confirmModel.visible}
          footer={null}
          onCancel={() => {
            setConfirmModel({ visible: false });
          }}
        >
          <Form
            form={form}
            name="form-approve"
            initialValues={{
              remember: true,
            }}
            onFinish={submitConfirm}
          >
            <CustomDiv>
              {confirmModel.isAccept ? (
                <CheckCircleOutlined className="icon icon-check" />
              ) : (
                <CloseCircleOutlined className="icon icon-close" />
              )}
              <div>
                <div className="title-modal">
                  {DEPT_ACTION_ACTOR[confirmModel.type]} Xác nhận{' '}
                  {confirmModel.isAccept ? 'duyệt' : 'từ chối'}
                </div>
              </div>
            </CustomDiv>
            <CustomItem
              name="note"
              rules={[
                {
                  required: true,
                  message: 'Nội dung không được để trống!',
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
