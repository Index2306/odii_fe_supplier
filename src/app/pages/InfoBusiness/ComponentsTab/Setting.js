import React, { useState, useEffect } from 'react';
import { Skeleton, message, Row, Col, Space, Radio } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Input, InputNumber, Form, Button } from 'app/components';
import { InputMoney } from 'app/components/DataEntry/InputNumber';
import { SectionWrapper } from 'styles/commons';

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

export default function Setting({ data, isLoading }) {
  const [form] = Form.useForm();
  // const isLoading = useSelector(selectLoading);

  // const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const { setFieldsValue, getFieldsValue, resetFields } = form;

  const [lowPriceOption, setLowPriceOption] = useState(0);
  const [recommendPriceOption, setRecommendOption] = useState(0);
  console.log('setting data', data);
  useEffect(() => {
    if (data) {
      setLowPriceOption(data?.min_price_selected_type);
      setRecommendOption(data?.recommend_price_selected_type);
      setFieldsValue({
        min_price_selected_type: data?.min_price_selected_type,
        recommend_price_selected_type: data?.recommend_price_selected_type,
        min_price_percent: data?.min_price_percent,
        min_price_money: data?.min_price_money,
        recommend_price_ratio: data?.recommend_price_ratio,
        recommend_price_plus: data?.recommend_price_plus,
        low_quantity_thres: data?.low_quantity_thres,
      });
    }
  }, [data]);

  const onClear = () => {
    if (data) {
      setFieldsValue({
        min_price_selected_type: 0,
        recommend_price_selected_type: 0,
        min_price_percent: 0,
        min_price_money: 0,
        recommend_price_ratio: 0,
        recommend_price_plus: 0,
        low_quantity_thres: 0,
      });
    } else {
      resetFields({});
    }
  };

  const handleFinish = async values => {
    setIsLoadingButton(true);
    const payload = {
      min_price_selected_type: values.min_price_selected_type,
      recommend_price_selected_type: values.recommend_price_selected_type,
      min_price_percent: values.min_price_percent,
      min_price_money: values.min_price_money,
      recommend_price_ratio: values.recommend_price_ratio,
      recommend_price_plus: values.recommend_price_plus,
      low_quantity_thres: values.low_quantity_thres,
    };
    const response = await request('/user-service/supplier/setting', {
      method: 'put',
      data: payload,
    })
      .then(response => response)
      .catch(error => error);
    if (response.is_success) {
      message.success('Chỉnh sửa thông tin xác thực Nhà cung cấp thành công !');
    } else {
      message.error(
        'Chỉnh sửa thông tin xác thực Nhà cung cấp không thành công, vui lòng kiểm tra và thử lại !',
      );

      console.log(response.data.message || response.data.error_code);
    }
    setIsLoadingButton(false);
  };
  const onChangeMinPriceOption = e => {
    setLowPriceOption(e.target.value);
  };
  const onChangeRecommendPriceOption = e => {
    setRecommendOption(e.target.value);
  };
  const pageContent = (
    <>
      <Form
        form={form}
        name="form-setting"
        className="form-setting"
        onFinish={handleFinish}
      >
        <Row>
          <Col xs={24}>
            <Row gutter={24}>
              <Col span={12}>
                <CustomItem
                  name="low_quantity_thres"
                  label="Ngưỡng tồn kho thấp"
                  {...layout}
                  className="odii-form-item"
                  tooltip={{
                    title:
                      'Áp dụng cho tất cả sản phẩm. Có thể chỉnh sửa trong từng sản phẩm',
                    icon: <InfoCircleOutlined />,
                  }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập ngưỡng tồn kho thấp',
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập ngưỡng tồn kho thấp"
                    type="number"
                    min="0"
                  />
                </CustomItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <CustomItem
                  name="min_price_selected_type"
                  label="Giá bán thấp nhất cho phép"
                  {...layout}
                  className="odii-form-item"
                  tooltip={{
                    title:
                      'Áp dụng cho tất cả sản phẩm. Có thể chỉnh sửa trong từng sản phẩm',
                    icon: <InfoCircleOutlined />,
                  }}
                >
                  <Radio.Group
                    onChange={onChangeMinPriceOption}
                    value="min_price_selected_type"
                  >
                    <Radio value={0}>Thấp hơn giá NCC (%)</Radio>
                    <Radio value={1}>Thấp hơn giá NCC (VNĐ)</Radio>
                  </Radio.Group>
                </CustomItem>
              </Col>
              <Col span={12}>
                <CustomItem
                  name={
                    lowPriceOption === 0
                      ? 'min_price_percent'
                      : 'min_price_money'
                  }
                  label={`Giá bán thấp nhất cho phép ${
                    lowPriceOption === 0 ? '(%)' : '(VNĐ)'
                  }`}
                  {...layout}
                  className="odii-form-item"
                  rules={[
                    {
                      required: true,
                      message: `Xin vui lòng nhập ${
                        lowPriceOption === 0 ? '%' : 'số tiền'
                      }`,
                    },
                  ]}
                >
                  {lowPriceOption === 1 ? (
                    <InputMoney
                      size="large"
                      placeholder="Nhập số tiền"
                      min="0"
                    />
                  ) : (
                    <InputNumber placeholder="Nhập %" min="0" />
                  )}
                </CustomItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <CustomItem
                  name="recommend_price_selected_type"
                  label="Giá bán gợi ý"
                  {...layout}
                  className="odii-form-item"
                  tooltip={{
                    title:
                      'Áp dụng cho tất cả sản phẩm. Có thể chỉnh sửa trong từng sản phẩm',
                    icon: <InfoCircleOutlined />,
                  }}
                >
                  <Radio.Group
                    onChange={onChangeRecommendPriceOption}
                    value="recommend_price_selected_type"
                  >
                    <Radio value={0}>Nhân với giá NCC</Radio>
                    <Radio value={1}>Cộng với giá NCC (VNĐ)</Radio>
                  </Radio.Group>
                </CustomItem>
              </Col>
              <Col span={12}>
                <CustomItem
                  name={
                    recommendPriceOption === 0
                      ? 'recommend_price_ratio'
                      : 'recommend_price_plus'
                  }
                  label={`Giá gợi ý ${
                    recommendPriceOption === 0
                      ? '(nhân với hệ số)'
                      : '(cộng thêm VNĐ)'
                  }`}
                  {...layout}
                  className="odii-form-item"
                  rules={[
                    {
                      required: true,
                      message: `Xin vui lòng nhập ${
                        recommendPriceOption === 0 ? 'hệ số' : 'số tiền'
                      }`,
                    },
                  ]}
                >
                  {recommendPriceOption === 1 ? (
                    <InputMoney
                      size="large"
                      placeholder="Nhập số tiền"
                      min="0"
                    />
                  ) : (
                    <InputNumber placeholder="Nhập hệ số" min="0" />
                  )}
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
      {/* {isLoading ? (
        <Skeleton active paragraph={{ rows: 1 }} className="loading" />
      ) : (
        <>
          <div className="section__title">Thông tin thanh toán</div>
          <div className="section__desc">
            Tài khoản ngân hàng nhận thanh toán của bạn. Odii sẽ chuyển khoản
            doanh thu kinh doanh của bạn vào tài khoản này
          </div>
        </>
      )} */}
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
