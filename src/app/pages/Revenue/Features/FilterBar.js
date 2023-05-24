import React, { memo, useRef } from 'react';
import { Row, Col, Space } from 'antd';
import { Input, Select, DatePicker } from 'app/components';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { CustomStyle } from 'styles/commons';
import Filter from 'app/hooks/Filter';
import moment from 'moment';
import constants from 'assets/constants';

const { Option } = Select;
const { RangePicker } = DatePicker;

const initState = {
  keyword: '',
  confirm_status: '',
  action_type: '',
  from_time: '',
  to_time: '',
};

const FilterBar = memo(function FilterBar({ isLoading }) {
  const [filter, setFilter] = React.useState(initState);

  const ref = useRef(null);
  const handleFilter = (type, needRefresh) => e => {
    const value = (e?.target?.value ?? e) || '';
    const values = { ...filter, [type]: value };
    if (e.type === 'click' || needRefresh) {
      if (ref.current) {
        ref.current.callBack(values);
      }
    }
    setFilter(values);
  };

  const setTimeRanger = value => {
    const values = {
      ...filter,
      from_time: value?.[0].toISOString(true),
      to_time: value?.[1].toISOString(true),
    };
    ref.current.callBack(values);
  };

  return (
    <Filter
      initState={initState}
      filter={filter}
      setFilter={setFilter}
      ref={ref}
    >
      <Div>
        <Row gutter={[8, 8]}>
          <Col xs={24} xl={8}>
            <Input
              allowClear
              style={{ width: '100%' }}
              placeholder="Tìm kiếm giao dịch ?"
              disabled={isLoading}
              prefix={<SearchOutlined />}
              value={filter.keyword}
              size="medium"
              onChange={handleFilter('keyword')}
            />
          </Col>
          <Col xs={24} flex="auto">
            <div className="d-flex justify-content-end">
              <Space>
                <CustomStyle>
                  <Select
                    color="primary"
                    value={filter?.action_type || 0}
                    onSelect={handleFilter('action_type', true)}
                    size="medium"
                    style={{ width: 180 }}
                  >
                    <Option value={0}>Tất cả giao dịch</Option>
                    {constants?.DEBT_TYPES?.map(v => (
                      <Option value={v.id}>{v.name}</Option>
                    ))}
                  </Select>
                </CustomStyle>
                <CustomStyle>
                  <Select
                    color="primary"
                    value={filter?.confirm_status || 0}
                    onSelect={handleFilter('confirm_status', true)}
                    size="medium"
                    style={{ width: 180 }}
                  >
                    <Option value={0}>Tất cả trạng thái</Option>
                    {constants?.REVENUE_STATUS_SEARCH?.map(v => (
                      <Option value={v.id}>{v.name}</Option>
                    ))}
                  </Select>
                </CustomStyle>
                <CustomStyle>
                  <RangePicker
                    color="primary"
                    className="range-picker"
                    format="DD/MM/YYYY"
                    // size="large"
                    // onOpenChange={onOpenChange}
                    value={[
                      filter.from_time && moment(filter.from_time),
                      filter.to_time && moment(filter.to_time),
                    ]}
                    onChange={setTimeRanger}
                  />
                </CustomStyle>
              </Space>
            </div>
          </Col>
        </Row>
      </Div>
    </Filter>
  );
});
const Div = styled.div`
  .ant-input-prefix {
    color: #6489ff;
  }
  .anticon-search {
    vertical-align: 0;
    color: #7c8db5;
  }
  .ant-input {
    color: #7c8db5;
    &::placeholder {
      color: #7c8db5;
    }
  }
  .ant-picker-input {
    input {
      font-weight: 500;
    }
  }
  .ant-select-selection-item {
    font-weight: 500;
  }
`;
export default FilterBar;
