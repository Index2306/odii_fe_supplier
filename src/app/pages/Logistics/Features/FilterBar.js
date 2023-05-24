import React, { useRef, memo } from 'react';
import { Space, Row, Col } from 'antd';
import { Input, Select } from 'app/components';
import styled from 'styled-components';
import Filter from 'app/hooks/Filter';
import { SearchOutlined } from '@ant-design/icons';
const { Option } = Select;

const initState = {
  keyword: '',
};

const FilterBar = memo(function FilterBar({ isLoading, showAction }) {
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

  return (
    <>
      <Filter
        initState={initState}
        filter={filter}
        setFilter={setFilter}
        ref={ref}
      >
        <CusRow gutter={[8, 8]}>
          <Col xs={24} lg={6}>
            <Input
              allowClear
              size="medium"
              style={{ width: '100%' }}
              placeholder="Nhập từ khóa..."
              prefix={<SearchOutlined />}
              disabled={isLoading}
              onChange={handleFilter('keyword')}
            />
          </Col>
        </CusRow>
      </Filter>
    </>
  );
});

export default FilterBar;

const CusRow = styled(Row)`
  .anticon-search {
    vertical-align: 0;
  }
`;
