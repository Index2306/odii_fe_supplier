import React, { memo } from 'react';
import { Space, Row, Col, Tooltip } from 'antd';
import { Button, Input, Select } from 'app/components';
import styled from 'styled-components';
import { CustomStyle } from 'styles/commons';
import constants from 'assets/constants';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const FilterBarDiscount = memo(function FilterBarDiscount({
  filter,
  isLoading,
  updateFilter,
  handleOkPayout,
  isShow,
}) {
  const onChangeField = fieldName => e => {
    const newValue = (e?.target?.value ?? e) || '';
    updateFilter({ [fieldName]: newValue });
  };

  return (
    <>
      <CusRow gutter={[8, 8]}>
        <Col xs={24} lg={6}>
          <Input.Search
            // enterButton="Search"
            allowClear
            size="medium"
            style={{ width: '100%' }}
            placeholder="Nhập từ khóa..."
            // prefix={<SearchOutlined />}
            disabled={isLoading}
            onSearch={onChangeField('keyword')}
          />
        </Col>
        <Col xs={24} flex="auto">
          <div className="d-flex justify-content-end">
            <Space>
              {isShow && (
                <Button
                  color="blue"
                  className="btn-sm"
                  onClick={handleOkPayout}
                >
                  <Tooltip
                    placement="top"
                    title="Lưu ý Thanh toán Chiết khấu sau 5 ngày chương trình Khuyến mại hết hiệu lực."
                  >
                    Thanh toán CK
                  </Tooltip>
                </Button>
              )}
              <CustomStyle w="140px">
                <Select
                  value={filter?.payment_status || ''}
                  size="medium"
                  style={{ width: 140 }}
                  onSelect={onChangeField('payment_status')}
                >
                  <Option value={''}>Tất cả</Option>
                  <Option value="confirmed">Đã thanh toán</Option>
                  <Option value="pending">Chờ thanh toán</Option>
                </Select>
              </CustomStyle>
            </Space>
          </div>
        </Col>
      </CusRow>
    </>
  );
});

export default FilterBarDiscount;

const CusRow = styled(Row)`
  .anticon-search {
    vertical-align: 0;
  }
`;
