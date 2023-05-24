import React, { memo, useRef } from 'react';
import { Row, Col } from 'antd';
import { Input, Select, Tabs } from 'app/components';
import { SearchOutlined } from '@ant-design/icons';
import Filter from 'app/hooks/Filter';
import styled from 'styled-components';
import { COMBINE_STATUS } from '../constants';
import { CustomStyle } from 'styles/commons';
const { Option } = Select;
const { TabPane } = Tabs;

const initState = {
  keyword: '',
  status: '',
  publish_status: '',
  quantity: '',
};

const listSelect = [];
let countItem = 0;
for (const property in COMBINE_STATUS) {
  const current = COMBINE_STATUS[property];
  if (current.label && !listSelect.some(item => item.name === current.label)) {
    countItem++;
    listSelect.push({
      id: property,
      name: current.label,
      color: current.colorLabel,
      count: countItem,
    });
  }
}

const FilterBar = memo(function FilterBar({ isLoading, summary, history }) {
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

  const handleChangStatus = value => {
    let v = ['', ''];
    // eslint-disable-next-line eqeqeq
    if (value != 0) {
      v = value.split('/');
    } else {
    }
    const values = { ...filter, status: v[0], publish_status: v[1] };
    setFilter(values);
    ref.current.callBack(values);
  };

  // React.useEffect(() => {
  //   if (history.location.search == '?page=1&page_size=10') {
  //     const values = {
  //       ...filter,
  //       status: 'inactive',
  //       publish_status: 'pending_for_review',
  //     };
  //     setFilter(values);
  //     ref.current.callBack(values);
  //   }
  // }, []);

  const countStatus = id => {
    const itemCount = summary?.find(item => item.state == id);
    return itemCount?.record_cnt;
  };

  return (
    <Filter
      initState={initState}
      filter={filter}
      setFilter={setFilter}
      ref={ref}
      // component={
      //   <Row>
      //     <Col xs={24} lg={20}>
      //       <Input
      //         placeholder="Nhập từ khoá"
      //         allowClear
      //         disabled={isLoading}
      //         prefix={<SearchOutlined />}
      //         // onPressEnter={onSearch}
      //         value={filter.keyword}
      //         onChange={handleFilter('keyword')}
      //       />
      //     </Col>
      //     <Col xs={24} lg={8}></Col>
      //   </Row>
      // }
    >
      <Tabs
        defaultActiveKey={0}
        onChange={handleChangStatus}
        activeKey={
          filter?.status ? `${filter?.status}/${filter?.publish_status}` : '0'
        }
      >
        <TabPane tab="Tất cả" key="0"></TabPane>
        {listSelect?.map(v => {
          if ([1, 2, 3].includes(v.count)) {
            return (
              <>
                <TabPane
                  tab={`${v.name} (${countStatus(v.count) || 0})`}
                  key={v.id}
                ></TabPane>
              </>
            );
          } else {
            return (
              <>
                <TabPane tab={v.name} key={v.id}></TabPane>
              </>
            );
          }
        })}
      </Tabs>
      <Row gutter={[4, 8]} className="d-flex">
        <Col xs={24} lg={8}>
          <Input
            color="#7C8DB5"
            placeholder="Tên sản phẩm, danh mục, kho lấy hàng"
            allowClear
            size="medium"
            disabled={isLoading}
            prefix={<SearchOutlined />}
            // onPressEnter={onSearch}
            value={filter.keyword}
            onChange={handleFilter('keyword')}
          />
        </Col>
        {filter.status == 'active' && filter.publish_status == 'active' && (
          <div
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <CustomStyle width="180px" marginLeft="5px">
              <Select
                color="primary"
                size="medium"
                value={filter?.quantity || 0}
                onSelect={handleFilter('quantity', true)}
              >
                <Option value={0}>Trạng thái kho</Option>
                <Option key={'low'} value={'low'}>
                  Tồn kho thấp
                </Option>
                <Option key={'zero'} value={'zero'}>
                  Hết hàng
                </Option>
              </Select>
            </CustomStyle>
          </div>
        )}
      </Row>
    </Filter>
  );
});

const CustomOption = styled(Option)`
  color: yellow;
  background: red;
`;

export default FilterBar;
