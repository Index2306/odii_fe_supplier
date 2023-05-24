import React from 'react';
import { Skeleton, Select, Input, Form, Row, Space } from 'antd';
import Modal from './index';
import Styled from 'styled-components';
import Button from 'app/components/Button';
import { useGlobalSlice } from 'app/pages/AppPrivate/slice';
import { useDispatch } from 'react-redux';
const { Option } = Select;
const { TextArea } = Input;

function Confirm({
  data,
  isModalVisible,
  isFullWidthBtn,
  isLoading,
  handleCancel,
  handleConfirm,
  callBackConfirm,
  title,
  title1,
  submitText,
  color,
  reasonList,
  cancelWarning,
}) {
  const { actions } = useGlobalSlice();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const CustomCancel = () => {
    if (handleCancel) handleCancel();
    else dispatch(actions.hideModal());
  };

  const CustomConfirm = () => {
    if (handleConfirm) handleConfirm();
    else {
      if (callBackConfirm) callBackConfirm();
      dispatch(actions.hideModal());
    }
  };
  const onReasonFormSubmit = values => {
    console.log('onReasonFormSubmit', values);
    if (handleConfirm) handleConfirm(values.reason, values.comment);
    else {
      if (callBackConfirm) callBackConfirm();
      dispatch(actions.hideModal());
    }
  };
  if (isFullWidthBtn) {
    const modalContent = isLoading ? (
      <Skeleton active paragraph={{ rows: 4 }} />
    ) : (
      <div>
        <div className="modal-title">{title || 'Xác nhận'}</div>
        {!reasonList && (
          <div className="modal-content">
            <div className="content__message">{data.message}</div>
          </div>
        )}
        {cancelWarning && (
          <div className="modal-content">
            <div className="content__message">{cancelWarning}</div>
          </div>
        )}
        {reasonList && (
          <Form
            name="confirmReason"
            id="confirmReason"
            layout="vertical"
            initialValues={{ remember: false }}
            form={form}
            onFinish={onReasonFormSubmit}
            style={{ marginTop: '10px' }}
          >
            <Form.Item
              name="reason"
              label="Lý do hủy"
              rules={[
                {
                  required: true,
                  message: 'Lý do hủy là bắt buộc',
                },
              ]}
            >
              <Select
                style={{ width: '100%', textAlign: 'left' }}
                value={null}
                // onSelect={handleAction}
                placeholder="Vui lòng chọn lý do hủy đơn"
              >
                {reasonList.map(reason => {
                  return (
                    <Option value={reason.id} disabled={false} key={reason.id}>
                      {reason.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="comment"
              label="Nhận xét"
              rules={[
                {
                  required: true,
                  message: 'Nhận xét là bắt buộc',
                },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Row className="d-flex justify-content-end">
              <Space align="end">
                <Button
                  context="secondary"
                  className="btn-sm"
                  color="default"
                  style={{
                    color: 'white',
                    background: '#6C798F',
                  }}
                  onClick={CustomCancel}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  className="btn-sm"
                  color="blue"
                  htmlType="submit"
                >
                  Xác nhận
                </Button>
              </Space>
            </Row>
          </Form>

          // <CustomStyle textAlign="left">
          //   <div>Lý do hủy</div>
          //   <Select
          //     style={{ width: '100%' }}
          //     value={null}
          //     // onSelect={handleAction}
          //     placeholder="Vui lòng chọn lý do hủy đơn"
          //   >
          //     <Option value={1} disabled={false} key={1}>
          //       lý do 1
          //     </Option>
          //   </Select>
          //   <div>Nhận xét</div>
          //   <TextArea rows={4} />
          // </CustomStyle>
        )}
        {!reasonList && (
          <div className="modal-footer">
            <Button
              color={color || 'blue'}
              needWait
              width="100%"
              mb={{ xs: 's4' }}
              onClick={CustomConfirm}
              className="btn-approve btn-md "
            >
              <span>{submitText || 'Đồng ý'}</span>
            </Button>
            <Button
              className="btn-cancel btn-md mr-2"
              context="secondary"
              width="100%"
              onClick={CustomCancel}
              color="blue"
            >
              <span>Bỏ qua</span>
            </Button>
          </div>
        )}
      </div>
    );

    return (
      <ModalFullWidthBtnWrapper
        // visible={isModalVisible}
        onCancel={CustomCancel}
        footer={null}
      >
        {modalContent}
      </ModalFullWidthBtnWrapper>
    );
  }

  return (
    <Modal
      title=""
      visible={isModalVisible}
      onCancel={CustomCancel}
      footer={null}
    >
      <Wrapper>
        {title && <div className="title">{title}</div>}
        <div className="mb-5 title">{data.name}</div>
        {title1 && <div className="text-danger font-weight-bold">{title1}</div>}
        <div className="font-weight-bold mb-4">Tiếp tục?</div>
        <div className="row justify-content-center">
          <div className="d-flex justify-content-between col-12 col-xl-6">
            <Button
              // onClick={onMenuClick(null, 2)}
              className="btn-md mr-2"
              context="secondary"
              onClick={CustomCancel}
              color="blue"
            >
              <span>Hủy</span>
            </Button>
            <Button
              color={color || 'green'}
              // type="primary"
              needWait
              onClick={CustomConfirm}
              className="btn-md"
            >
              <span>Đồng ý</span>
            </Button>
          </div>
        </div>
      </Wrapper>
    </Modal>
  );
}

const Wrapper = Styled.div`
text-align: center;
.title {
  color: #172B4D;
  font-weight: 700;
  font-size: 24px;
}
`;

const ModalFullWidthBtnWrapper = Styled(Modal)`
text-align: center;

.ant-modal-content {
  border-radius: 6px!important
}
.modal-title {
  font-size: 18px;
  font-weight: 700;
  margin-top: 20px;
}
.modal-content {
  .content__message {
    margin-top: 11px;
    white-space: pre-line;
  }
}
.modal-footer {
  margin-top: 31px;
  /* display: flex; */
  /* flex-direction: row-reverse; */
  text-align: right;
  .footer__action {
    width: 100%;
  }
  .btn-cancel {
    margin-right: 11px;
  }
}
`;

export default Confirm;
