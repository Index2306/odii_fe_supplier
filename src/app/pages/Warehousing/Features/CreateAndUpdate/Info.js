import React from 'react';
import styled from 'styled-components';
import { Input, Form } from 'app/components';
import { Row, Col } from 'antd';
import { Avatar } from 'app/components/Uploads';
import { CustomStyle } from 'styles/commons';
import { CustomSectionWrapper, CustomInputNumber } from '../../styled';
import { validatePhoneNumberVN } from 'utils/helpers';

const Item = Form.Item;
const { TextArea } = Input;

function Info({ layout }) {
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };
  return (
    <div>
      <CustomStyle mt={{ xs: 's4' }}>
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
                    name="name"
                    label="Tên kho hàng"
                    {...layout}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tên kho hàng!',
                      },
                    ]}
                  >
                    <Input placeholder="Nhập tên kho hàng" />
                  </Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Item name="id" label="Mã kho hàng" {...layout}>
                    <CustomInputNumber disabled placeholder="Mã kho hàng" />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item
                    name="phone"
                    label="Điện thoại"
                    {...layout}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số điện thoại!',
                      },
                      validatePhoneNumberVN,
                    ]}
                  >
                    <Input placeholder="Điện thoại" type="number" />
                  </Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={24}>
                  <Item
                    name="description"
                    label="Mô tả kho"
                    {...layout}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: 'Please input your low_retail_price!',
                    //   },
                    // ]}
                  >
                    <TextArea
                      showCount
                      maxLength={500}
                      rows={4}
                      placeholder="Nhập nôi dung mô tả ngắn gọn về kho hàng"
                    />
                  </Item>
                </Col>
              </Row>
            </CustomSectionWrapper>
          </Col>
          <Col xs={24} md={7}>
            <CustomSectionWrapper
              className="h-100 d-flex flex-column align-items-center justify-content-center"
              borderTopLeftRadius={0}
              borderBottomLeftRadius={0}
              mb={{ md: 0 }}
              borderLeft="none"
              textAlign="center"
            >
              {/* <Image size="100x100" src={item?.thumb?.location} /> */}
              <CustomItemImage
                name="thumb"
                label=""
                valuePropName="data"
                getValueFromEvent={normFile}
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your status!',
                //   },
                // ]}
              >
                <Avatar />
              </CustomItemImage>
              <CustomStyle
                fontSize={{ xs: 'f3' }}
                mb={{ xs: 's2' }}
                fontWeight="bold"
              >
                Ảnh đại diện kho hàng
              </CustomStyle>
              <CustomStyle
                fontSize={{ xs: 'f1' }}
                mb={{ xs: 's4' }}
                color="gray3"
              >
                Định dạng PNG, JPG. Dung lượng tối đa 5Mb
              </CustomStyle>
              {/* <Button
                className="btn-sm"
                context="secondary"
                width="100%"
                onClick={goDetail(item.id)}
              >
                Xem chi tiết
              </Button> */}
            </CustomSectionWrapper>
          </Col>
        </Row>
      </CustomStyle>
    </div>
  );
}

const CustomItemImage = styled(Item)`
  width: 80px;
  img,
  .ant-upload.ant-upload-select-picture-card {
    border-radius: 50%;
  }
`;

export default Info;
