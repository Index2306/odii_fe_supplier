import React, { useState, useEffect } from 'react';
import { Skeleton } from 'antd';
import { Row, Col, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Form, Select, Button } from 'app/components';
import { SectionWrapper } from 'styles/commons';
import { isEmpty } from 'lodash';
import { useInfoBusinessSlice } from '../slice';
import { selectDataBanksSupplier } from '../slice/selectors';
// import constants from 'assets/constants';
import request from 'utils/request';
import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';

const Item = Form.Item;

const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};

export default function InfoPay({ data, isLoading }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { actions } = useInfoBusinessSlice();
  const banksSupplier = useSelector(selectDataBanksSupplier);
  // const isLoading = useSelector(selectLoading);

  // const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [dataBankVN, setDataBankVN] = useState('');
  const [bankDefault, setBankDefault] = useState('');

  const { setFieldsValue, getFieldsValue, resetFields } = form;

  useEffect(() => {
    // setIsLoading(true);

    dispatch(actions.getBanksSupplier({}));
    request(`user-service/banks-info?page=1&page_size=100`, {})
      .then(result => {
        setDataBankVN(result?.data ?? {});
      })
      .catch(err => {});

    // setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isEmpty(banksSupplier)) {
      banksSupplier.map(item => {
        if (item.is_default) {
          setBankDefault(item);
        }
      });
    }
  }, [banksSupplier]);

  useEffect(() => {
    setFieldsValue({
      bank_info_id: bankDefault?.bank_info_id,
      account_number: bankDefault?.account_number,
      account_name: bankDefault?.account_name,
      sub_title: bankDefault?.sub_title,
    });
  }, [bankDefault]);

  const onClear = () => {
    if (data) {
      setFieldsValue({
        bank_info_id: bankDefault?.bank_info_id,
        account_number: bankDefault?.account_number,
        account_name: bankDefault?.account_name,
        sub_title: bankDefault?.sub_title,
      });
    } else {
      resetFields({});
    }
  };

  const handleFinish = async values => {
    setIsLoadingButton(true);

    if (isEmpty(banksSupplier)) {
      dispatch(
        actions.SupplierAddBank({
          data: {
            bank_info_id: values.bank_info_id,
            sub_title: values.sub_title.trim(),
            account_name: values.account_name.trim(),
            account_number: values.account_number.trim(),
            // exp_date: values.exp_date,
          },
        }),
      );
    } else {
      dispatch(
        actions.SupplierUpdateBank({
          id: bankDefault.id,
          data: {
            bank_info_id: values.bank_info_id,
            sub_title: values.sub_title.trim(),
            account_name: values.account_name.trim(),
            account_number: values.account_number.trim(),
            // exp_date: values.exp_date,
          },
        }),
      );
    }

    setIsLoadingButton(false);
  };

  const pageContent = (
    <>
      <Form
        form={form}
        name="form-info-pay"
        className="form-info-pay"
        onFinish={handleFinish}
      >
        <Row>
          <Col xs={24}>
            <Row gutter={24}>
              <Col span={12}>
                <CustomItem
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
                </CustomItem>
                <CustomItem
                  name="account_number"
                  label="Số tài khoản"
                  {...layout}
                  className="odii-form-item"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập số tài khoản',
                    },
                  ]}
                >
                  <Input placeholder="Nhập số tài khoản" type="number" />
                </CustomItem>
              </Col>
              <Col span={12}>
                <CustomItem
                  name="sub_title"
                  label="Chi nhánh"
                  {...layout}
                  className="odii-form-item"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên chi nhánh ngân hàng',
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên chi nhánh ngân hàng" />
                </CustomItem>
                <CustomItem
                  name="account_name"
                  label="Tên chủ tài khoản"
                  {...layout}
                  className="odii-form-item"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập đầy đủ Họ Tên chủ tài khoản',
                    },
                  ]}
                >
                  <Input placeholder="Nhập Họ Tên chủ tài khoản" />
                </CustomItem>
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
              onClick={onClear}
            >
              Hủy
            </Button>
            <Button
              className="btn-sm"
              type="primary"
              color="blue"
              width="100px"
              htmlType="submit"
              disabled={isLoadingButton}
            >
              {isLoadingButton && (
                <>
                  <LoadingOutlined />
                  &ensp;
                </>
              )}
              Lưu
            </Button>
          </Space>
        </Row>
      </Form>
    </>
  );

  return (
    <CustomSection>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 1 }} className="loading" />
      ) : (
        <>
          <div className="section__title">Thông tin thanh toán</div>
          <div className="section__desc">
            Tài khoản ngân hàng nhận thanh toán của bạn. Odii sẽ chuyển khoản
            doanh thu kinh doanh của bạn vào tài khoản này
          </div>
        </>
      )}
      <SectionWrapper className="box-df">
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} className="loading" />
        ) : (
          pageContent
        )}
      </SectionWrapper>
    </CustomSection>
  );
}

export const CustomItem = styled(Item)`
  display: block;
  .ant-form-item {
    &-label {
      margin-bottom: 6px;
      label {
        &::after {
          content: '';
        }
      }
      font-weight: 500;
      margin-bottom: $spacer/2;
    }
  }
  label.ant-form-item-required {
    height: unset;
    &::before {
      content: '' !important;
    }
    &::after {
      display: inline-block;
      margin-left: 4px;
      color: #ff4d4f;
      font-size: 18px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }
`;

export const CustomSection = styled.div`
  margin-top: 26px;
  .section__title {
    font-weight: bold;
    font-size: 14px;
    line-height: 19px;
  }
  .section__desc {
    font-size: 14px;
    line-height: 19px;
    margin-top: 4px;
    margin-bottom: 12px;
  }
`;
