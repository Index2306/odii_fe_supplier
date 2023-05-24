import React, { memo, useRef } from 'react';
import { Row, Col, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Select, DatePicker } from 'app/components';
import { SearchOutlined } from '@ant-design/icons';
import Filter from 'app/hooks/Filter';
import constants from 'assets/constants';
import moment from 'moment';
import { CustomStyle } from 'styles/commons';
import { omitBy, identity } from 'lodash';
import { formatDateForSend } from 'utils/helpers';
import { v4 } from 'uuid';

const { Option } = Select;
const { RangePicker } = DatePicker;

const initState = {
  from_date: moment().subtract(7, 'd'),
  to_date: moment(),
};

const FilterBar = memo(function FilterBar({ isLoading, showAction, getData }) {
  const [filter, setFilter] = React.useState(initState);
  const ref = useRef(null);

  React.useEffect(() => {
    handleGetData(filter);
  }, []);

  const handleFilter = (type, needRefresh) => e => {
    const value = (e?.target?.value ?? e) || '';
    const values = { ...filter, [type]: value };
    if (e.type === 'click' || needRefresh) {
      handleGetData(values);
      if (ref.current) {
        // ref.current.callBack(values);
      }
    }
    setFilter(values);
  };

  const setTimeRanger = value => {
    const values = { ...filter };
    if (value) {
      values.from_date = value[0];
      values.to_date = value[1];
    } else {
      values.from_date = '';
      values.to_date = '';
      values.timezone = '';
    }
    handleGetData(values);
    // ref.current.callBack(values);
  };

  const handleGetData = params => {
    const dataSend = omitBy(params, v => !v);
    if (dataSend.from_date) {
      dataSend.from_date = formatDateForSend(dataSend.from_date);
      dataSend.timezone = 'Asia/Ho_Chi_Minh';
    }
    if (dataSend.to_date) {
      dataSend.to_date = formatDateForSend(dataSend.to_date, true);
    }

    getData(dataSend);
  };

  const handleAction = e => {
    switch (e) {
      case 1:
        // history.push('/selected-products/update');
        break;

      default:
        break;
    }
  };

  // const disabledDate = current => {
  //   // const dates = [filter.from_date, filter.to_date];
  //   if (!dates || dates.length === 0) {
  //     return false;
  //   }
  //   // const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
  //   // const tooEarly = dates[1] && dates[1].diff(c, 'days') > 7;
  //   const tooLate = dates[0] && dates[0] > dates[1];
  //   // if(dates[0]) return
  //   const tooEarly = dates[1] && (dates[1] >= moment() || dates[1] < dates[0]);
  //   return tooEarly || tooLate;
  // };

  // const onOpenChange = open => {
  //   if (!open && filter.from_date && filter.to_date) {
  //     // setHackValue([]);
  //     ref?.current?.callBack(filter);
  //     // setDates([]);
  //   } else {
  //     // setHackValue(undefined);
  //   }
  // };

  return (
    <Filter
      initState={initState}
      filter={filter}
      // setFilter={setFilter}
      ref={ref}
    >
      <Row gutter={8}>
        <Col xs={24} flex="auto">
          <div className="d-flex justify-content-end">
            <Space>
              <CustomStyle w="130px">
                <RangePicker
                  color="primary"
                  className="range-picker"
                  format="DD/MM/YYYY"
                  allowClear={false}
                  // size="large"
                  // onOpenChange={onOpenChange}
                  value={[filter.from_date, filter.to_date]}
                  onChange={setTimeRanger}
                />
              </CustomStyle>
            </Space>
          </div>
        </Col>
      </Row>
    </Filter>
  );
});

export default FilterBar;
