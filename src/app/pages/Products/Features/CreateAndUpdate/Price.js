import React from 'react';
import styled from 'styled-components/macro';
import { bgWarehousing } from 'assets/images';
import { money } from 'assets/images/icons';
import { Row, Col, Form as F, Tooltip } from 'antd';
import { InputMoney } from 'app/components/DataEntry/InputNumber';
import { tooltip } from 'assets/images/dashboards';
import { CustomStyle } from 'styles/commons';
import { CustomSectionWrapper } from './styled';
import { CalcRecommendPrice, CalcMinPrice } from 'utils/helpers';

const Item = F.Item;

function Price({
  layout,
  hasVariation,
  isActive,
  supplierInfo,
  setFieldsValue,
  setFormValues,
}) {
  const onChangeSupplierPrice = e => {
    // const { value: inputValue } = e.target;
    // console.log('onChangeSupplierPrice', inputValue);
    const value = e?.target?.value ?? e;
    const recommendPrice = CalcRecommendPrice(value, supplierInfo);
    const lowPrice = CalcMinPrice(value, supplierInfo);
    setFieldsValue({
      low_retail_price: lowPrice,
      recommend_retail_price: recommendPrice,
    });
    setFormValues();
    console.log('e', e, recommendPrice, lowPrice);
  };
  return (
    <div style={{ width: '100%', margin: '0 12px' }}>
      <CustomStyle mt={{ xs: 's4' }}>
        {/* <div className="title">Giá tiền</div> */}
        <Row>
          <Col xs={24} md={17}>
            <CustomSectionWrapper
              borderTopRightRadius={0}
              borderBottomRightRadius={0}
              className="h-100"
              borderRight="1px solid"
              borderColor="stroke"
            >
              <Row gutter={24}>
                <Col span={24}>
                  <Item
                    name="origin_supplier_price"
                    label={
                      <>
                        {`${
                          hasVariation
                            ? 'Giá bán thấp nhất'
                            : 'Giá nhà cung cấp'
                        }`}
                        &nbsp;{' '}
                        <Tooltip
                          placement="right"
                          title={
                            !hasVariation
                              ? 'Giá mong muốn thu về của NCC'
                              : 'Mức giá thấp nhất của biến thể sản phẩm'
                          }
                        >
                          <img className="tooltip" src={tooltip} alt="" />
                        </Tooltip>
                      </>
                    }
                    {...layout}
                    rules={[
                      {
                        required: !hasVariation || !isActive,
                        message: 'Vui lòng nhập giá nhà cung cấp!',
                      },
                    ]}
                  >
                    <InputMoney
                      disabled={hasVariation || isActive}
                      size="large"
                      placeholder="Giá nhà cung cấp"
                      onChange={onChangeSupplierPrice}
                    />
                  </Item>
                </Col>
                {/* <Col span={12}>
              <Item
                name="currency_code"
                label="Đơn vị tiền tệ"
                {...layout}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập thông tin!',
                  },
                ]}
              >
                <Select
                // defaultValue={text}
                // value={newStatus?.id === detail?.id ? newStatus?.name : text}
                // onSelect={handleShowConfirm(record)}
                // filterOption={(input, option) =>
                //   option.props.children
                //     .toLowerCase()
                //     .indexOf(input.toLowerCase()) >= 0
                // }
                >
                  {constants?.CURRENCY_LIST?.map(v => (
                    <Select.Option key={v.id} value={v.id}>
                      {v.name}
                    </Select.Option>
                  ))}
                </Select>
              </Item>
            </Col> */}
              </Row>

              <Row gutter={24}>
                <Col span={24}>
                  <Item
                    name="recommend_retail_price"
                    label={
                      <>
                        Giá bán gợi ý &nbsp;
                        <Tooltip
                          placement="right"
                          title="Giá bán đề xuất tốt nhất (tự động tính theo giá nhà cung cấp và hệ số trong thiết lập)"
                        >
                          <img className="tooltip" src={tooltip} alt="" />
                        </Tooltip>
                      </>
                    }
                    {...layout}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập giá tối thiểu!',
                      },
                    ]}
                  >
                    <InputMoney size="large" placeholder="Giá bán tối thiểu" />
                  </Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={24}>
                  <Item
                    name="low_retail_price"
                    label={
                      <>
                        Giá bán thấp nhất cho phép &nbsp;
                        <Tooltip
                          placement="right"
                          title="Nếu seller thiết lập giá bán nhỏ hơn giá trị này, Phần mềm sẽ không cho phép đẩy sản phẩm lên sàn! (tự động tính theo giá nhà cung cấp và hệ số trong thiết lập)"
                        >
                          <img className="tooltip" src={tooltip} alt="" />
                        </Tooltip>
                      </>
                    }
                    {...layout}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập giá tối thiểu!',
                      },
                    ]}
                  >
                    <InputMoney size="large" placeholder="Giá bán tối thiểu" />
                  </Item>
                </Col>
              </Row>
              {/* <div className="title">Hiển thị khuyến mại</div> */}
              {/* <div className="">
          <Item
            name="showDiscount"
            label=""
            {...layout}
            // rules={[
            //   {
            //     required: true,
            //     message: 'Vui lòng nhập thông tin!',
            //   },
            // ]}
          >
            <Radio.Group onChange={onChange}>
              <Space direction="vertical">
                <Radio value={1}>Tự động: (14%)</Radio>
                <Radio value={2}>Tự set</Radio>
              </Space>
            </Radio.Group>
          </Item>
        </div> */}
            </CustomSectionWrapper>
          </Col>
          <Col xs={24} md={7}>
            <IncludeImage
              className="h-100 d-flex flex-column align-items-center justify-content-center"
              borderTopLeftRadius={0}
              borderBottomLeftRadius={0}
              mb={{ md: 0 }}
              borderLeft="none"
              textAlign="center"
            >
              <img src={money} alt="" />
              <CustomStyle
                mb={{ xs: 's4' }}
                color="primary"
                fontWeight="medium"
              >
                Chính sách giá cho NCC
              </CustomStyle>
              <CustomStyle
                fontSize={{ xs: 'f1' }}
                mb={{ xs: 's4' }}
                color="gray3"
              >
                Odii sẽ dựa trên giá bán của Nhà Cung Cấp để thương lượng đưa ra
                một mức chi phí phù hợp
              </CustomStyle>
              {/* <Button
                className="btn-sm"
                context="secondary"
                width="100%"
                onClick={goDetail(item.id)}
              >
                Xem chi tiết
              </Button> */}
            </IncludeImage>
          </Col>
        </Row>
      </CustomStyle>
    </div>
  );
}

export const IncludeImage = styled(CustomSectionWrapper)`
  background-image: url(${bgWarehousing});
  background-size: cover;
  background-color: transparent;
  img {
    margin-bottom: 12px;
    /* width: 80px;
    height: 80px; */
  }
`;

export default Price;
