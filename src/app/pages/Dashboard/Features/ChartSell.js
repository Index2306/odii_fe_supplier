import React, { memo, useMemo } from 'react';
import { CustomStyle } from 'styles/commons';
import { Row, Col, Spin } from 'antd';
import styled from 'styled-components';
import { RightOutlined } from '@ant-design/icons';
import Chart from 'app/components/Chart';
import request from 'utils/request';
import { GetTime } from 'utils/helpers';
import { Link } from 'react-router-dom';
import moment from 'moment';

export default memo(function ChartSell() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    getData({
      from_time: moment(GetTime('twoweek')?.[0]).format('YYYY-MM-DD'),
      to_time: moment(GetTime('twoweek')?.[1]).format('YYYY-MM-DD 23:59'),
    });
  }, []);

  const getData = params => {
    request(`oms/supplier/status-dashbroad-report`, { params }).then(result => {
      setData(result.data_detail);
    });
  };

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

  const ChartRender = () => {
    return useMemo(() => {
      if (data) {
        return <Chart data={data} lineData={initalLine} hideY={false} />;
      }
    }, [data]);
  };

  return (
    <CustomChart>
      <CustomStyle className="header">
        <Row>
          <Col span={12}>
            <CustomStyle className="title">
              Phân tích bán hàng
              <CustomStyle className="small-title">14 ngày qua</CustomStyle>
            </CustomStyle>
          </Col>
          <Col span={12}>
            <CustomStyle className="filter">
              <CustomStyle className="see-more">
                <Link to="/report" style={{ color: '#3d56a6' }}>
                  Xem thêm
                </Link>
                <RightOutlined style={{ marginLeft: 5 }} />
              </CustomStyle>
            </CustomStyle>
          </Col>
        </Row>
      </CustomStyle>
      <Spin tip="Đang tải..." spinning={!data}>
        <CustomStyle className="chart">{ChartRender()}</CustomStyle>
      </Spin>
    </CustomChart>
  );
});

const CustomChart = styled.div`
  padding: 16px 24px;
  background: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-bottom: 31.51px;

  .chart {
    min-height: 367px;
  }

  .title {
    color: #333333;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    display: flex;
    align-items: center;

    .small-title {
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      color: #828282;
      margin-left: 8px;
    }
  }
  .filter {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 20px;

    .see-more {
      display: flex;
      align-items: center;
      color: #3d56a6;

      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
`;
