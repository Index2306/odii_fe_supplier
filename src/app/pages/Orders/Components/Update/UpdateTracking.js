import React, { useState, useEffect, useCallback, memo } from 'react';
import { Form, Input, Button, Checkbox } from 'app/components';
import { Modal, Row, Col, Spin } from 'antd';

import { isEmpty } from 'lodash';
import request from 'utils/request';
import notification from 'utils/notification';
import styled from 'styled-components/macro';

const formItemLayout = {
  labelCol: {
    span: 24,
  },
};

export default memo(function Updatetracking({
  order,
  onCancel,
  onFinish,
  ...rest
}) {
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  // const [isRts, setRts] = useState(true);

  useEffect(() => {
    setdefaultValues();
  }, []);

  const setdefaultValues = async () => {
    form.setFieldsValue({
      tracking_id: order?.tracking_id,
      invoice_number: order?.invoice_number,
    });
  };

  const updateOrder = async () => {
    const { tracking_id, invoice_number } = form.getFieldsValue();
    if (isEmpty(tracking_id) && isEmpty(invoice_number)) {
      notification(
        'warning',
        '',
        'Vui lòng nhập ít nhất 1 trong 2 thông tin: mã vận chuyển, hóa đơn.',
      );
      return;
    }
    setLoading(true);
    const orderId = order?.id;
    const body = {
      ...(tracking_id ? { tracking_id } : {}),
      ...(invoice_number ? { invoice_number } : {}),
      // is_rts: isRts || false,
    };

    if (isEmpty(body)) {
      onFinish();
      return;
    }
    try {
      await request(`oms/supplier/orders/${orderId}/update-traking-info`, {
        method: 'put',
        data: body,
      });
      onFinish();
    } finally {
      setLoading(false);
    }
  };

  // const isEnableUpdateReadToShip = ![
  //   'ready_to_ship',
  //   'sup_rejected',
  //   'sup_cancelled',
  //   'cancel',
  // ].includes(order?.fulfillment_status);

  return (
    <UpdatetrackingModal
      transitionName=""
      width={640}
      className="box-df"
      title={
        <>
          <div className="modal-title__main">
            <span>Cập nhật thông tin đơn hàng</span>
          </div>
          <div className="modal-title__desc">
            Vui lòng nhập các thông tin dưới đây để lưu thông tin đơn hàng
          </div>
        </>
      }
      footer={null}
      onCancel={onCancel}
      {...rest}
    >
      <Spin spinning={isLoading}>
        <Form name="save-customer" {...formItemLayout} form={form}>
          <div className="form-group">
            <div className="tracking-block-title">Thông tin tracking</div>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item name="tracking_id" label="Mã vận chuyển">
                  <Input placeholder="Nhập mã vận chuyển" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item name="invoice_number" label="Hóa đơn">
                  <Input placeholder="Nhập hóa đơn" />
                </Form.Item>
              </Col>
            </Row>
            {/* {isEnableUpdateReadToShip && (
              <Row>
                <Col span={24}>
                  <Form.Item className="checkbox-status" label="Trạng thái">
                    <Checkbox
                      checked={isRts}
                      onChange={e => setRts(e.target.checked)}
                    >
                      Sẵn sàng giao hàng
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            )} */}
          </div>
          <div className="form-action form-group">
            <Button
              className="btn-cancel btn-sm"
              color="grayBlue"
              width="60px"
              onClick={onCancel}
            >
              Hủy
            </Button>
            <Button
              className="btn-ok btn-sm"
              width="100px"
              onClick={updateOrder}
            >
              Xác nhận
            </Button>
          </div>
        </Form>
      </Spin>
    </UpdatetrackingModal>
  );
});

export const UpdatetrackingModal = styled(Modal)`
  min-height: 550px;
  top: 50%;
  transform: translateY(-50%) !important;
  padding-bottom: 0;
  .modal-title__main {
    font-size: 18px;
    font-weight: bold;
  }
  .modal-title__desc {
    font-weight: normal;
    font-size: 14px;
    color: #828282;
    margin-top: 2px;
  }
  .ant-modal-header {
    border-bottom: none;
    padding: 21px 25px 14px 24px;
  }
  .ant-modal-content {
    height: 100%;
  }
  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
  }
  .ant-spin-nested-loading > div > .ant-spin {
    min-height: unset;
  }
  .ant-modal-body {
    padding: 0;
    margin-top: 2px;
  }
  .form-group {
    padding: 0 25px;
  }
  .ant-form {
    .ant-form-item-label {
      padding-bottom: 9px;
      label {
        line-height: 1;
        font-weight: 500;
        height: unset;
      }
    }
    .ant-input,
    .ant-select-selection-search-input,
    .ant-select-selection-item,
    .ant-select-selection-placeholder {
      height: 40px !important;
      font-size: 14px !important;
    }
    .checkbox-status .ant-form-item-control-input {
      min-height: unset;
    }
    .divider {
      margin: 6px 0 20px 0;
    }
    .ant-form-item {
      margin-bottom: 15px;
    }
    .tracking-block-title {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 17px;
      line-height: 1;
    }
    .form-action {
      display: flex;
      text-align: right;
      margin-top: 12px;
      padding-bottom: 21px;
      .btn-cancel {
        margin-left: auto;
      }
      .btn-ok {
        margin-left: 14px;
      }
    }
  }
`;
