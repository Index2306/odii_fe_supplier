import React, { memo } from 'react';
import { Row, Col, Form as F } from 'antd';
import { Avatar } from 'app/components/Uploads';
import { CustomSectionWrapper } from './styled';
const Item = F.Item;

export default memo(function AvatarProduct({ layout }) {
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };

  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <div className="title">Ảnh đại diện</div>
      <Row gutter={24}>
        <Col span={24}>
          <Item
            name="thumb"
            label=""
            valuePropName="data"
            getValueFromEvent={normFile}
            {...layout}
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please input Vui lòng nhập thông tin!',
            //   },
            // ]}
          >
            <Avatar />
          </Item>
        </Col>
      </Row>
    </CustomSectionWrapper>
  );
});
