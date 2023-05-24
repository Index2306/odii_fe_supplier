import React, { memo } from 'react';
import { Row, Col, Space } from 'antd';
import { Input, Select, Button } from 'app/components';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { CustomStyle } from 'styles/commons';
import constants from 'assets/constants';

const { Option } = Select;

export const DEFAULT_FILTER = {
  page: 1,
  page_size: 10,
  keyword: '',
  status: '',
};

const LIST_USER_STATUS_ID = ['active', 'inactive'];

const FilterBar = memo(function FilterBar({ isLoading, filter, updateFilter }) {
  const onChangeField = fieldName => e => {
    const newValue = (e?.target?.value ?? e) || '';
    updateFilter({ [fieldName]: newValue });
  };

  const account_status = constants?.USER_STATUS_SEARCH?.filter(status =>
    LIST_USER_STATUS_ID.includes(status.id),
  );

  return (
    <Div>
      <Row gutter={[8, 8]}>
        <Col xs={24} xl={8}>
          <Input
            allowClear
            style={{ width: '100%' }}
            placeholder="Nhập từ khóa ?"
            disabled={isLoading}
            prefix={<SearchOutlined />}
            value={filter.keyword}
            size="medium"
            onChange={onChangeField('keyword')}
          />
        </Col>
        <Col xs={24} flex="auto">
          <div className="d-flex justify-content-end">
            <Space>
              <CustomStyle>
                <Select
                  // color="primary"
                  value={filter?.status || 0}
                  onSelect={onChangeField('status')}
                  size="medium"
                  style={{ width: 210 }}
                >
                  <Option value={0}>Tất cả trạng thái tài khoản</Option>
                  {account_status?.map(v => (
                    <Option value={v.id}>{v.name}</Option>
                  ))}
                </Select>
              </CustomStyle>
              <CustomStyle className="btn-wrapper">
                <Button
                  className="btn-export"
                  color="white"
                  // onClick={exportFile}
                >
                  Export&nbsp;
                  <DownloadOutlined />
                </Button>
              </CustomStyle>
            </Space>
          </div>
        </Col>
      </Row>
    </Div>
    // </Filter>
  );
});
const Div = styled.div`
  margin-bottom: 24px;
  .btn-wrapper {
    display: flex;
    justify-content: end;
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
`;
const ButtonExport = styled(Button)`
  padding: ${({ theme }) => theme.space.s4 / 2}px
    ${({ theme }) => theme.space.s4}px!important;
  line-height: ${({ theme }) => theme.lineHeight}!important;
  height: auto !important;
  /* color: ${({ theme }) => theme.primary}!important; */
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius}px;
  border: solid 1px ${({ theme }) => theme.stroke}!important;
  .anticon {
    vertical-align: 0;
  }
`;
export default FilterBar;
