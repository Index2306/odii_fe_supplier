import React, { memo } from 'react';
import { Row, Col, Form as F } from 'antd';
import constants from 'assets/constants';
import { Select } from 'app/components';
import { CustomSectionWrapper } from './styled';
const Item = F.Item;

export default memo(function PublishStatus({ layout }) {
  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <div className="title">Xét duyệt</div>
      <Row gutter={24}>
        <Col span={24}>
          <Item
            name="publish_status"
            label=""
            {...layout}
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn!',
              },
            ]}
          >
            <Select
              disabled
              // defaultValue={text}
              // value={newStatus?.id === detail?.id ? newStatus?.name : text}
              // style={{ width: 120 }}
              // onSelect={handleShowConfirm(record)}
              // filterOption={(input, option) =>
              //   option.props.children
              //     .toLowerCase()
              //     .indexOf(input.toLowerCase()) >= 0
              // }
            >
              {constants?.PUBLISH_STATUS?.map(v => (
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
