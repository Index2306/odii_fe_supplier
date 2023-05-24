import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Space, message, Modal, Checkbox } from 'antd';
import { Form, Button, Select } from 'app/components';
import request from 'utils/request';
import styled from 'styled-components';

const Item = Form.Item;

const LIST_PERCENT = [
  { id: 0, value: 0 },
  { id: 1, value: 1 },
  { id: 2, value: 2 },
  { id: 3, value: 3 },
  { id: 4, value: 4 },
  { id: 5, value: 5 },
  { id: 6, value: 10 },
  { id: 7, value: 20 },
  { id: 8, value: 30 },
  { id: 9, value: 40 },
  { id: 10, value: 50 },
  { id: 11, value: 60 },
  { id: 12, value: 70 },
  { id: 13, value: 80 },
  { id: 14, value: 90 },
];

export default memo(function ModalUpdatePercentCommission({
  layout,
  record,
  fetchData,
  isShowModalUpdatePercentCommision,
  setIsShowModalUpdatePercentCommision,
}) {
  const [form] = Form.useForm();

  const [isVerify, setIsVerify] = useState(false);

  const { setFieldsValue, getFieldsValue } = form;

  useEffect(() => {
    setFieldsValue({
      first_order_percent: record.first_order_percent,
      second_order_percent: record.second_order_percent,
    });
  }, [record]);

  const handleCloseModal = () => {
    setIsShowModalUpdatePercentCommision(false);
    setIsVerify(false);
  };

  const updatePercent = async values => {
    const url = `user-service/admin/partner-affiliate/update-for-percent-commission/${record.id}`;
    const response = await request(url, {
      method: 'put',
      data: {
        ...record,
        first_order_percent: values.first_order_percent,
        second_order_percent: values.second_order_percent,
      },
    })
      .then(response => {
        message.success(
          `Cập nhật tỉ lệ chiết khấu cho tài khoản #${record.id} thành công`,
        );
        fetchData();
      })
      .catch(error => console.log(error));
  };

  const onFinishUpdatePercentCommision = async values => {
    await updatePercent(values);
    await handleCloseModal();
  };

  return (
    <CustomModal
      name="modal-update_percent"
      visible={isShowModalUpdatePercentCommision}
      footer={null}
      onCancel={handleCloseModal}
      destroyOnClose={true}
    >
      <Form
        form={form}
        className="form-update"
        name="form-update"
        // fields={[
        //   {
        //     name: ['first_order_percent'],
        //     value: record.first_order_percent,
        //   },
        //   {
        //     name: ['second_order_percent'],
        //     value: record.second_order_percent,
        //   },
        // ]}
        onFinish={onFinishUpdatePercentCommision}
      >
        <div className="modal-header">
          <div className="title">Cập nhật tỉ lệ chiết khấu hoa hồng</div>
          <div className="desc">
            Vui lòng nhập hoặc lựa chọn chính xác tỉ lệ muốn thay đổi.
            <br />
            Tỉ lệ chiết khấu này sẽ được áp dụng từ chu kỳ tiếp theo cho tài
            khoản này
          </div>
        </div>
        <Row gutter={[8, 8]}>
          <Col xs={24}>
            <Item
              name="first_order_percent"
              label="Chiết khấu lần 1"
              {...layout}
            >
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {LIST_PERCENT?.map((v, index) => (
                  <Select.Option key={v.id} value={v.value}>
                    {v.value} %
                  </Select.Option>
                ))}
              </Select>
            </Item>
          </Col>
          <Col xs={24}>
            <Item
              name="second_order_percent"
              label="Chiết khấu lần 2"
              {...layout}
            >
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {LIST_PERCENT?.map((v, index) => (
                  <Select.Option key={v.id} value={v.value}>
                    {v.value} %
                  </Select.Option>
                ))}
              </Select>
            </Item>
          </Col>
        </Row>
        <Row className="d-flex justify-content-between">
          <Checkbox onChange={() => setIsVerify(!isVerify)}>
            Tôi chắc chắn về hành động này
          </Checkbox>
          <Space align="end">
            <Button
              context="secondary"
              className="btn-sm"
              color="default"
              style={{
                color: 'white',
                background: '#6C798F',
              }}
              onClick={handleCloseModal}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              className="btn-sm"
              color="blue"
              htmlType="submit"
              disabled={!isVerify}
            >
              Xác nhận
            </Button>
          </Space>
        </Row>
      </Form>
    </CustomModal>
  );
});

const CustomModal = styled(Modal)`
  .modal-header {
    margin-bottom: 34px;
    .title {
      font-weight: bold;
      font-size: 18px;
      line-height: 21px;
      margin-bottom: 8px;
    }
    .desc {
      font-size: 12px;
      line-height: 18px;
      color: #828282;
    }
  }
`;
