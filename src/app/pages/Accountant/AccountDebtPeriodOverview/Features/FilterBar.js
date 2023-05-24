import React, { memo, useRef, useState, useMemo } from 'react';
import { Row, Col, Space } from 'antd';
import { Input, Select, DatePicker, Button } from 'app/components';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { selectListDebtPeriodTime } from '../slice/selectors';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { CustomStyle } from 'styles/commons';
import Filter from 'app/hooks/Filter';
import { useAccountDebtPeriodOverviewSlice } from '../slice';
import { formatDateRange } from 'utils/helpers';
import { downloadFile } from 'utils/request';
import moment from 'moment';

const { Option } = Select;

const initState = {
  debt_period_key: '',
  payout_period_key: '',
};

const FilterBar = memo(function FilterBar({ isLoading }) {
  const [filter, setFilter] = React.useState(initState);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const { actions } = useAccountDebtPeriodOverviewSlice();
  const listDebtPeriodTime = useSelector(selectListDebtPeriodTime);
  const listDebtPeriodSelect = useMemo(
    () =>
      (listDebtPeriodTime || []).map(debtPeriod => ({
        text: formatDateRange(debtPeriod.startTime, debtPeriod.endTime, true),
        value: debtPeriod.key,
      })),
    [listDebtPeriodTime],
  );

  const listPayoutPeriodSelect = useMemo(
    () =>
      (listDebtPeriodTime || []).map(debtPeriod => ({
        text: formatDateRange(
          debtPeriod.payoutStartTime,
          debtPeriod.payoutEndTime,
          true,
        ),
        value: debtPeriod.payoutPeriodKey,
      })),
    [listDebtPeriodTime],
  );

  React.useEffect(() => {
    fetchListDebtPeriodTime();
  }, []);

  const fetchListDebtPeriodTime = () => {
    dispatch(actions.getListDebtPeriodTime());
  };

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

  const exportFile = async () => {
    const requestUrl = 'oms/accountant/supplier/export-debt';
    const dateFormat = 'YYYY-MM-DD-HH-mm-ss';
    const fileName = 'debt-period';
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
      <CustomRow gutter={8}>
        <Col xs={24} flex="auto">
          <div className="d-flex">
            <div className="d-flex">
              <Space size={20}>
                <CustomStyle w="110px">
                  <Select
                    name="debt_period_key"
                    value={filter?.debt_period_key || 0}
                    onSelect={handleFilter('debt_period_key', true)}
                    style={{ width: 200 }}
                  >
                    <Option value={0}>Chu kỳ công nợ</Option>
                    {listDebtPeriodSelect.map(debtPeriod => (
                      <Option value={debtPeriod.value} key={debtPeriod.value}>
                        {debtPeriod.text}
                      </Option>
                    ))}
                  </Select>
                </CustomStyle>
                <CustomStyle w="110px">
                  <Select
                    value={filter?.payout_period_key || 0}
                    onSelect={handleFilter('payout_period_key', true)}
                    style={{ width: 200 }}
                  >
                    <Option value={0}>Chu kỳ thanh toán</Option>
                    {listPayoutPeriodSelect.map(payoutPeriod => (
                      <Option
                        value={payoutPeriod.value}
                        key={payoutPeriod.value}
                      >
                        {payoutPeriod.text}
                      </Option>
                    ))}
                  </Select>
                </CustomStyle>
              </Space>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Space>
                <CustomStyle w="94px">
                  <Button
                    className="btn-export"
                    color="white"
                    onClick={exportFile}
                  >
                    <DownloadOutlined /> &nbsp; Export
                  </Button>
                </CustomStyle>
              </Space>
            </div>
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
`;
export default FilterBar;
