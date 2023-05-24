import React, { memo, useRef } from 'react';
import { Row, Col, Space } from 'antd';
import { Input, Select, DatePicker, Button } from 'app/components';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { CustomStyle } from 'styles/commons';
import Filter from 'app/hooks/Filter';
import moment from 'moment';
import constants from 'assets/constants';

const { Option } = Select;
const { RangePicker } = DatePicker;

const initState = {
  keyword: '',
  type: '',
  status: '',
  to_time: '',
};

const TypeAccount = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Supplier' },
  { id: 3, name: 'Seller' },
];

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
      <CustomRow gutter={[8, 8]}>
        <Col xs={24} lg={8}>
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
              <CustomStyle w="94px">
                <Button className="btn-export" color="white">
                  <DownloadOutlined /> &nbsp; Export
                </Button>
              </CustomStyle>
              <CustomStyle w="110px">
                <Select
                  value={filter?.status || 0}
                  onSelect={handleFilter('status', true)}
                  style={{ width: 150 }}
                >
                  <Option value={0}>Loại tài khoản</Option>
                  {TypeAccount?.map(v => (
                    <Option value={v.name}>{v.name}</Option>
                  ))}
                </Select>
              </CustomStyle>
              <CustomStyle w="130px">
                <RangePicker
                  color="primary"
                  className="range-picker"
                  format="DD/MM/YYYY"
                  value={[
                    filter.from_time && moment(filter.from_time),
                    filter.to_time && moment(filter.to_time),
                  ]}
                  onChange={setTimeRanger}
                />
              </CustomStyle>
              <CustomStyle w="110px">
                <Select
                  value={filter?.status || 0}
                  onSelect={handleFilter('status', true)}
                  style={{ width: 150 }}
                >
                  <Option value={0}>Trạng thái</Option>
                  {constants?.TRANSACTION_STATUS_SEARCH?.map(v => (
                    <Option value={v.id}>{v.name}</Option>
                  ))}
                </Select>
              </CustomStyle>
            </Space>
          </div>
        </Col>
      </CustomRow>
    </Filter>
  );
});
const CustomRow = styled(Row)`
  /* .ant-input-prefix {
    color: #6489ff;
  } */
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
  .btn-export {
    height: 32px;
    font-size: 14px;
    font-weight: 500;
    background: #ffffff;
    border: 1px solid #ebebf0;
    box-sizing: border-box;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
  .ant-picker-input > input {
    &::placeholder {
      /* color: rgb(61, 86, 166); */
      color: #616161;
      font-weight: 500;
      opacity: 1;
    }
  }
`;
export default FilterBar;
