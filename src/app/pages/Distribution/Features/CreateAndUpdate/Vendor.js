import React, { memo } from 'react';
import { Row, Col, Form as F, Tooltip } from 'antd';
import { tooltip } from 'assets/images/dashboards';

import { Input } from 'app/components';
import { CustomSectionWrapper } from './styled';

const Item = F.Item;

export default memo(function Vendor({ layout }) {
  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <div className="title d-flex">
        Thương hiệu sản phẩm &nbsp;
        <Tooltip placement="right" title="Tên nhãn hiệu sản phẩm">
          <img className="tooltip" src={tooltip} alt="" />
        </Tooltip>
      </div>
      <Row gutter={24}>
        <Col span={24}>
          <Item name="vendor" label="" {...layout}>
            <Input placeholder="Nhập thương hiệu sản phẩm" />
          </Item>
        </Col>
      </Row>
    </CustomSectionWrapper>
  );
});
