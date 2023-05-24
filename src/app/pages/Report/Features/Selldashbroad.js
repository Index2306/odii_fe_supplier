import React, { memo, useMemo } from 'react';
import styled from 'styled-components/macro';
import { CustomStyle } from 'styles/commons';

import ColorPayBox from 'app/components/ColorPayBox';
import Chart from 'app/components/Chart';
import { Spin } from 'antd';

const initalLine = [
  {
    key: 'revenue',
    label: 'Doanh thu',
    name: 'time_slot',
    location: 'left',
  },
  {
    key: 'order_cnt',
    label: 'Đơn hàng',
    location: 'right',
  },
];

const dataOrder = [
  {
    label: 'Doanh thu',
    total: 'revenue',
    color: '#219737',
    // textColor: '#000',
    tooltip: 'Tổng doanh thu của các đơn hàng thành công',
    money: true,
    percent: '',
  },
  {
    label: 'Đơn hàng',
    total: 'order_cnt',
    color: '#EF5816',
    // textColor: '#000',
    tooltip: 'Tổng số đơn hàng thành công',
    percent: '',
  },
  {
    label: 'Đơn hàng hủy',
    total: 'cancel_order_cnt',
    color: '',
    tooltip: 'Tổng số đơn hàng đã hủy',
    percent: '',
  },
  {
    label: 'Doanh số trên mỗi đơn',
    total: 'avrg_order_revenue',
    color: '',
    money: true,
    tooltip: 'Số tiền trung bình thu về trên mỗi đơn',
    percent: '',
  },
];

export default memo(function Selldashbroad(props) {
  const { dataDetail, dataSummary, time, dataPrevent } = props;

  const ChartRender = () => {
    return useMemo(() => {
      if (dataDetail) {
        return <Chart data={dataDetail} lineData={initalLine} />;
      }
    }, [dataDetail]);
  };

  return (
    <CustomDashbroad>
      <ColorPayBox
        initData={dataOrder}
        data={dataSummary || {}}
        styleBox={{ width: 217, height: 98 }}
        label="Tổng quan"
        time={time}
        predata={dataPrevent || {}}
      />
      <Spin tip="Đang tải..." spinning={!dataDetail}>
        <CustomStyle className="chart">{ChartRender()}</CustomStyle>
      </Spin>
    </CustomDashbroad>
  );
});

const CustomDashbroad = styled.div`
  background: #ffffff;
  padding: 24px 24px 0;

  .chart {
    min-height: 413px;
    padding: 40px 21px 0;
    overflow: scroll;
    margin-bottom: 22px;
  }
`;
