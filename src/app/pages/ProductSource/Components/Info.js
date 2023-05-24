import React from 'react';
import styled from 'styled-components';
import { Input, Form } from 'app/components';
import { Row, Col } from 'antd';
import { Avatar } from 'app/components/Uploads';
import { CustomStyle } from 'styles/commons';
import { CustomSectionWrapper } from 'app/pages/Dashboard/styles';

const Item = Form.Item;
const { TextArea } = Input;

function Info({ layout }, form) {

  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };
  return (
    <div>
      <CustomStyle mt={{ xs: 's4' }} mb={{ xs: 's4' }}>
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
                    label="Tên nguồn hàng"
                    {...layout}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tên nguồn hàng!',
                      },
                    ]}
                  >
                    <Input placeholder="Nhập tên nguồn hàng" />
                  </Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={24}>
                  <Item
                    name="phone"
                    label="Số điện thoại"
                    {...layout}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập Số điện thoại',
                      },
                      {
                        min: 10,
                        max: 11,
                        message: 'Số điện thoại không hợp lệ',
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số diện thoại" />
                  </Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={24}>
                  <Item
                    name="address"
                    label="Địa chỉ"
                    {...layout}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập địa chỉ!',
                      },
                    ]}
                  >
                    <Input placeholder="Địa chỉ" type="text" />
                  </Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={24}>
                  <Item name="description" label="Mô tả nguồn hàng" {...layout}>
                    <TextArea
                      showCount
                      maxLength={500}
                      rows={4}
                      placeholder="Nhập nôi dung mô tả ngắn gọn về nguồn hàng"
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
              <CustomItemImage
                name="thumb"
                label=""
                valuePropName="data"
                getValueFromEvent={normFile}
                {...layout}
              >
                <Avatar />
              </CustomItemImage>
              <CustomStyle
                fontSize={{ xs: 'f3' }}
                mb={{ xs: 's2' }}
                fontWeight="bold"
              >
                Ảnh đại diện nguồn hàng
              </CustomStyle>
              <CustomStyle
                fontSize={{ xs: 'f1' }}
                mb={{ xs: 's4' }}
                color="gray3"
              >
                Định dạng PNG, JPG. Dung lượng tối đa 5Mb
              </CustomStyle>
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
