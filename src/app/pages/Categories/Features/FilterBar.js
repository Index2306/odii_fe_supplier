import React, { memo } from 'react';
import { Space, Row, Col } from 'antd';
import { Button, Input } from 'app/components';

const initState = {
  keyword: '',
};

const FilterBar = memo(function FilterBar({ gotoPage, isLoading }) {
  const [filter, setFilter] = React.useState(initState);

  const handleFilter = type => e => {
    setFilter({
      ...filter,
      [type]: (e?.target?.value ?? e) || '',
    });
  };

  const onFilter = () => {
    gotoPage(filter);
  };

  const clearFilter = () => {
    setFilter(initState);
    gotoPage(initState);
  };

  return (
    <Row>
      <Col xs={24} lg={8}>
        <Space>
          Tên:
          <Input
            allowClear
            placeholder="Nhập tên"
            value={filter.keywordName}
            onChange={handleFilter('keyword')}
          />
        </Space>
      </Col>
      <Col xs={24} lg={8}>
        <Space>
          Mô tả:
          <Input
            allowClear
            placeholder="Nhập mô tả"
            value={filter.keywordDesc}
            onChange={handleFilter('keyword')}
          />
        </Space>
      </Col>
      <Col xs={24} lg={8} className="d-flex justify-content-end">
        <Space align="end">
          <Button
            // rounded
            className="btn-sm"
            onClick={clearFilter}
            context="secondary"
            disabled={isLoading}
          >
            Xoá
          </Button>
          <Button
            // rounded
            className="btn-sm"
            onClick={onFilter}
            color="green"
            disabled={isLoading}
          >
            Tìm kiếm
          </Button>
          {/* <Button
          onClick={toggleQueue}
          className="mr-3 btn-md text-blue4"
          context="secondary"
          color="transparent"
        >
          {showQueue ? 'Ẩn' : 'Hiện'}
        </Button> */}
        </Space>
      </Col>
    </Row>
  );
});

export default FilterBar;
