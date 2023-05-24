import React, { memo } from 'react';
import { Row, Col, Form as F, Tooltip } from 'antd';
import { Tags } from 'app/components';
import styled from 'styled-components';
import { tooltip } from 'assets/images/dashboards';

import { CustomSectionWrapper } from './styled';
const Item = F.Item;

export default memo(function TagList({ layout }) {
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };

  return (
    <Warper mt={{ xs: 's4' }}>
      <div className="title d-flex">
        Tag sản phẩm &nbsp;
        <Tooltip placement="right" title="Keyword theo tên sản phẩm">
          <img className="tooltip" src={tooltip} alt="" />
        </Tooltip>
      </div>
      <Row gutter={24}>
        <Col span={24}>
          <Item
            name="tags"
            label=""
            valuePropName="data"
            getValueFromEvent={normFile}
            {...layout}
          >
            <Tags max={5} minLength={2} />
          </Item>
        </Col>
      </Row>
    </Warper>
  );
});

const Warper = styled(CustomSectionWrapper)`
  .edit-tag,
  .site-tag-plus,
  .tag-input {
    height: 32px;
    margin-bottom: 5px;
  }
`;
