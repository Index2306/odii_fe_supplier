import React, { memo } from 'react';
import { Row, Col, Form as F } from 'antd';
import { Select } from 'app/components';
// import constants from 'assets/constants';
import { CustomSectionWrapper } from './styled';
const Item = F.Item;

export default memo(function WareHousing({ layout }) {
  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <div className="title">Kho hàng</div>
      <Row gutter={24}>
        <Col span={24}>
          <Item name="supplier_warehousing" label="" {...layout}>
            <Select

            // labelInValue
            // optionFilterProp="children"
            // tagRender={tagRender}
            // value={newStatus?.id === detail?.id ? newStatus?.name : text}
            // style={{ width: 120 }}
            // onSelect={handleShowConfirm(record)}
            // filterOption={(input, option) =>
            //   option.props.children
            //     .toLowerCase()
            //     .indexOf(input.toLowerCase()) >= 0
            // }
            >
              {[{ id: 1, name: 'Hieu' }]?.map(v => (
                <Select.Option key={v.id} value={v.id}>
                  {v.name}
                </Select.Option>
              ))}
            </Select>
          </Item>
        </Col>
      </Row>
    </CustomSectionWrapper>
  );
});
