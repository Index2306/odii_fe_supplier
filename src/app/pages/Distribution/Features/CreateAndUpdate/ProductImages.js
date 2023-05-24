import React, { memo } from 'react';
import { Row, Col, Form as F, Tooltip } from 'antd';
import { PicturesWall } from 'app/components/Uploads';
import { Avatar } from 'app/components/Uploads';
import { tooltip } from 'assets/images/dashboards';
import { CustomSectionWrapper } from './styled';
const Item = F.Item;

export default memo(function ProductImages({ layout }) {
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };

  return (
    <div style={{ width: '100%', margin: '0 12px' }}>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <div className="title">
          Hình ảnh sản phẩm &nbsp;
          <Tooltip
            placement="right"
            title="Hình ảnh đăng tải lên Odii, có định dạng jpg hoặc png, kích thước tối đa 2MB"
          >
            <img className="tooltip" src={tooltip} alt="" />
          </Tooltip>
        </div>
        <Row gutter={12}>
          <Col span={8}>
            <Item
              name="thumb"
              label=""
              valuePropName="data"
              getValueFromEvent={normFile}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng thêm ảnh thumb',
                },
              ]}
              {...layout}
            >
              <Avatar />
            </Item>
          </Col>
          <Col span={16}>
            <Item
              name="product_images"
              label=""
              valuePropName="data"
              getValueFromEvent={normFile}
              {...layout}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng thêm ảnh vào danh sách',
                },
              ]}
            >
              <PicturesWall
                maxImages={8}
                multiple
                url="product-service/product/upload-product-image"
              />
            </Item>
          </Col>
        </Row>
        <div className="title">
          Bảng quy đổi kích cỡ &nbsp;
          <Tooltip
            placement="right"
            title="Hình ảnh đăng tải lên Odii, có định dạng jpg hoặc png, kích thước tối đa 2MB"
          >
            <img className="tooltip" src={tooltip} alt="" />
          </Tooltip>
        </div>
        <Row gutter={12}>
          <Col span={4}>
            <Item
              name="size_chart"
              label=""
              valuePropName="data"
              getValueFromEvent={normFile}
              // rules={[
              //   {
              //     required: true,
              //     message: 'Vui lòng thêm ảnh thumb',
              //   },
              // ]}
              {...layout}
            >
              <Avatar type="img_size_chart" />
            </Item>
          </Col>
        </Row>
      </CustomSectionWrapper>
    </div>
  );
});
