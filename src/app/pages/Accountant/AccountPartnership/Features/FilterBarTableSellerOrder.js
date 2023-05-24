import React, { memo, useRef, useState, useMemo, useEffect } from 'react';
import { Row, Col, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Select, Button } from 'app/components';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
import { CustomStyle } from 'styles/commons';
import Filter from 'app/hooks/Filter';
import constants from 'assets/constants';
import { isEmpty } from 'lodash';
import { useAffiliateSlice } from '../slice';
import { selectDataListPayout } from '../slice/selectors';
import { formatDateRange } from 'utils/helpers';
import moment from 'moment';
import { downloadFile } from 'utils/request';

const { Option } = Select;

const initState = {
  keyword: '',
  type: '',
  status: '',
  isPaid: '',
  to_time: '',
  payout_affiliate_key: '',
};

const FilterBar = memo(function FilterBar({ isLoading }) {
  const ref = useRef(null);

  const [filter, setFilter] = useState(initState);
  const dispatch = useDispatch();
  const { actions } = useAffiliateSlice();
  const listPeriodTime = useSelector(selectDataListPayout);

  const listPayoutPeriodSelect = useMemo(
    () =>
      (listPeriodTime || []).map(period => ({
        text: formatDateRange(period.startDate, period.endDate),
        value: period.key,
      })),
    [listPeriodTime],
  );

  // useEffect(() => {
  //   dispatch(actions.getDataListPayout());
  // }, []);

  useEffect(() => {
    if (!isEmpty(listPayoutPeriodSelect))
      setFilter({
        ...filter,
        payout_affiliate_key: listPayoutPeriodSelect[0]?.value,
      });
  }, [listPayoutPeriodSelect]);

  const handleFilter = (type, needRefresh) => e => {
    const value = (e?.target?.value ?? e) || '';
    const values = { filter, [type]: value };
    if (e.type === 'click' || needRefresh) {
      if (ref.current) {
        ref.current.callBack(values);
      }
    }
    setFilter(values);
  };

  const exportFile = async () => {
    const requestUrl = 'user-service/accountant/export-debt';
    const dateFormat = 'YYYY-MM-DD';
    const fileName = 'list-order-seller';
    const unixName = moment().format(dateFormat);
    const separatorName = '-';
    const fileExt = '.xlsx';
    const fullName = fileName + separatorName + unixName + fileExt;
    await downloadFile(requestUrl, fullName);
  };
  return (
    <Filter
      initState={initState}
      filter={filter}
      setFilter={setFilter}
      ref={ref}
    >
      <CustomRow gutter={[8, 8]}>
        {/* <Col xs={24} xl={8}>
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
        </Col> */}
        <Col xs={24} flex="auto">
          <div className="d-flex justify-content-end">
            <Space>
              {/* <CustomStyle>
                <Select
                  // color="primary"
                  size="medium"
                  value={filter?.payout_affiliate_key || 0}
                  onSelect={handleFilter('payout_affiliate_key', true)}
                  style={{ width: 220 }}
                >
                  <Option value={0}>Chu kỳ tiếp thị </Option>
                  {listPayoutPeriodSelect.map(payoutPeriod => (
                    <Option value={payoutPeriod.value} key={payoutPeriod.value}>
                      {payoutPeriod.text}
                    </Option>
                  ))}
                </Select>
              </CustomStyle> */}
              <CustomStyle>
                <Select
                  value={'Tất cả trạng thái' || 0}
                  onSelect={handleFilter('isPaid', true)}
                  color="primary"
                  size="medium"
                  style={{ width: 150 }}
                >
                  <Option value={0}>Tất cả trạng thái</Option>
                  {constants.ACCOUNTANT_PARTNERSHIP_FULFILLMENT_STATUS?.map(
                    v => (
                      <Option value={v.id}>{v.name}</Option>
                    ),
                  )}
                </Select>
              </CustomStyle>
              <CustomStyle className="btn-wrapper">
                <Button
                  className="btn-export"
                  color="white"
                  onClick={exportFile}
                >
                  Export&nbsp;
                  <DownloadOutlined />
                </Button>
              </CustomStyle>
            </Space>
          </div>
        </Col>
      </CustomRow>
    </Filter>
  );
});

const CustomRow = styled(Row)`
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

export default FilterBar;
