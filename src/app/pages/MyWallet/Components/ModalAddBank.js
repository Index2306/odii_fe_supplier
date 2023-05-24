import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Space } from 'antd';
import { Form, Button, Input, Select } from 'app/components';
import { useMyWalletSlice } from '../slice';
import { CustomModalAddBank } from '../styles';
import { isEmpty } from 'lodash';
import { Avatar } from 'app/components/Uploads';

const Item = Form.Item;

export default memo(function ModalAddBank({
  layout,
  dataBankVN,
  isShowModalAddBank,
  setIsShowModalAddBank,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { actions } = useMyWalletSlice();

  const handleCloseModal = () => {
    form.resetFields();
    setIsShowModalAddBank(false);
  };

  const onFinishAddBank = values => {
    dispatch(
      actions.SupplierAddBank({
        data: {
          bank_info_id: values.bank_info_id,
          sub_title: values.sub_title.trim(),
          account_name: values.account_name.trim(),
          account_number: values.account_number.trim(),
          // exp_date: values.exp_date,
          thumb: values.thumb,
        },
      }),
    );
    onClear();
    setIsShowModalAddBank(false);
  };
  const onClear = () => {
    form.resetFields();
  };
  return (
    <CustomModalAddBank
      form={form}
      name="modal-add_bank"
      visible={isShowModalAddBank}
      footer={null}
      onCancel={handleCloseModal}
      destroyOnClose={true}
    >
      <Form
        name="form-add_bank"
        fields={[
          {
            name: ['bank_info_id'],
            value: null,
          },
          {
            name: ['sub_title'],
            value: '',
          },
          {
            name: ['account_name'],
            value: '',
          },
          {
            name: ['account_number'],
            value: '',
          },
          {
            name: ['thumb'],
            value: null,
          },
        ]}
        onFinish={onFinishAddBank}
      >
        <div className="modal-header">
          <div className="title">Thêm tài khoản ngân hàng</div>
          <div className="desc">
            Vui lòng nhập chính xác các thông tài khoản ngân hàng dưới đây
          </div>
        </div>
        <Row>
          <Col xs={24}>
            <Row gutter={24}>
              <Col span={12}>
                <Item
                  name="bank_info_id"
                  label="Ngân hàng "
                  {...layout}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn ngân hàng',
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn ngân hàng "
                    // filterOption={(input, option) =>
                    //   option.props.children
                    //     .toLowerCase()
                    //     .indexOf(input.toLowerCase()) >= 0
                    // }
                  >
                    {!isEmpty(dataBankVN) &&
                      dataBankVN?.map(v => (
                        <Select.Option key={v.id} value={v.id}>
                          {v.title}
                        </Select.Option>
                      ))}
                  </Select>
                </Item>
                <Item
                  name="account_number"
                  label="Số tài khoản"
                  {...layout}
                  className="odii-form-item"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập số tài khoản',
                    },
                    { max: 20, message: 'Số tài khoản không quá 20 ký tự' },
                  ]}
                >
                  <Input placeholder="Nhập số tài khoản" type="number" />
                </Item>
              </Col>
              <Col span={12}>
                <Item
                  name="sub_title"
                  label="Chi nhánh"
                  {...layout}
                  className="odii-form-item"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên chi nhánh ngân hàng',
                    },
                    { max: 40, message: 'Tên chi nhánh không quá 40 ký tự' },
                  ]}
                >
                  <Input placeholder="Nhập tên chi nhánh ngân hàng" />
                </Item>
                <Item
                  name="account_name"
                  label="Tên chủ tài khoản"
                  {...layout}
                  className="odii-form-item"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập đầy đủ Họ Tên chủ tài khoản',
                    },
                    {
                      max: 30,
                      message: 'Tên chủ tài khoản không quá 30 ký tự',
                    },
                  ]}
                >
                  <Input placeholder="Nhập Họ Tên chủ tài khoản" />
                </Item>
              </Col>
              <Col span={12}>
                <div className="text-bold">Mã Qr</div>
                <Item
                  name="thumb"
                  valuePropName="data"
                  className="odii-form-item flex-custom"
                >
                  <Avatar />
                </Item>
              </Col>
            </Row>
          </Col>
        </Row>
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
              onClick={handleCloseModal}
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
    </CustomModalAddBank>
  );
});
