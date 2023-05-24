import React, { useState, useEffect, memo } from 'react';
import { CustomStyle, CustomH3 } from 'styles/commons';
import { Row, Col, Space } from 'antd';
import request from 'utils/request';
// import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { formatCash } from 'utils/helpers';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  // Line,
} from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { box, layerGroup } from 'assets/images/dashboards';
import { FilterBar } from '../Component';
// import { selectListStores } from '../slice/selectors';
import {
  //  CustomSectionWrapper,
  ChartWrapper,
  CustomRow,
} from '../styles';

export const COLORS = [
  '#A08FF5',
  '#F4C356',
  '#6CEB79',
  '#EC7C7C',
  '#6C798F',
  '#fab1b3',
  '#6c8490',
  '#95dafd',
  '#cef77e',
  '#f67305',
  '#5f385f',
  '#495d28',
  '#fae477',
  '#a8c671',
  '#d96681',
  '#5260af',
  '#f07bdc',
  '#cbc0fa',
  '#944059',
];

const renderActiveShape = props => {
  const { cx, cy, fill, payload } = props;
  const { percentage } = payload;
  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontWeight="bold"
        fontSize="22px"
      >
        {`${percentage}%`}
      </text>
    </g>
  );
};

const totalProduct = [
  {
    title: 'Tổng sản phẩm',
    key: 'total_product',
    icon: box,
  },
  {
    title: 'Đang duyệt',
    key: 'total_product_pending',
    status: 'Updating...',
    // icon: wave,
  },
  {
    title: 'Đã duyệt',
    key: 'total_product_active',
    icon: layerGroup,
  },
];

const dataPieChartFormat = [
  {
    name: 'Group A',
    status: 'Đã duyệt',
    key: 'total_product_active',
    color: 'gray',
  },
  {
    name: 'Group B',
    status: 'Đang duyệt',
    key: 'total_product_pending',
    color: 'yellow',
  },
  {
    name: 'Group C',
    status: 'Từ chối',
    key: 'total_product_rejected',
    color: 'green',
  },
  {
    name: 'Group D',
    status: 'Dừng bán',
    key: 'total_product_inactive',
    color: 'pink',
  },
];

const formatterToolTip = (value, name) => [formatCash(value), name];

export default memo(function ChartAnalysis() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataTotalProduct, setDataTotalProduct] = useState({});
  const [dataPieChart, setDataPieChart] = useState([]);

  const fetchData = params => {
    setIsLoading(true);
    request(`oms/seller/order-stats-by-days`, { params })
      .then(result => {
        setIsLoading(false);
        const formatData = result?.data.map(v => ({
          ...v,
          local_date: moment(v.local_date).format('MMM DD'),
          'Chi phí NCC': v.total_items_price,
          'Lợi nhuận': v.total_retail_price,
          // 'Lợi nhuận': v.total_profit_amount,
        }));
        setData(formatData ?? []);
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  const fetchDataTotalProduct = params => {
    setIsLoading(true);
    request(`common-service/supplier/product-statistics`, { params })
      .then(result => {
        setIsLoading(false);
        setDataTotalProduct(result?.data ?? {});
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchDataTotalProduct();
  }, []);

  useEffect(() => {
    if (dataTotalProduct) {
      const temp = dataPieChartFormat.map(v => ({
        ...v,
        percentage:
          dataTotalProduct['total_product'] !== 0
            ? (
                (dataTotalProduct[v.key] * 100) /
                dataTotalProduct['total_product']
              ).toFixed() * 1
            : 25,
      }));
      setDataPieChart(temp ?? []);
    }
  }, [dataTotalProduct]);

  return (
    <>
      <CustomH3 className="title">Sản phẩm đã tạo</CustomH3>
      <CustomRow gutter={8}>
        <Col className="left" xs={24} lg={12} xl={14}>
          <CustomStyle
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={{ xs: 's4' }}
            ml={{ xs: 's4' }}
          >
            <CustomStyle>
              <FilterBar isLoading={isLoading} getData={fetchData} />
            </CustomStyle>
          </CustomStyle>
          <ChartWrapper>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  // left: 20,
                }}
                width={400}
                height={300}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="local_date" />
                <YAxis
                  tickFormatter={tick => {
                    return formatCash(tick);
                  }}
                  label={{
                    value: '',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <Tooltip
                  // itemStyle={{ fontSize: 12 }}
                  // labelStyle={{ fontSize: 12 }}
                  formatter={formatterToolTip}
                />
                <Legend wrapperStyle={{ bottom: 0 }} />
                <Bar
                  dataKey="Lợi nhuận"
                  fill="#27AE60"
                  barSize={20}
                  // position="inside"
                  // label={{ position: 'insideTop' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </Col>
        <Col className="right" xs={24} lg={12} xl={10}>
          <div className="top">
            <div className="title">Tổng sản phẩm</div>
            <Row>
              <Space className="justify-content-between w-100">
                {totalProduct.map(item => (
                  <Col className="item">
                    <div className="box">
                      {item.key === 'total_product_pending' ? (
                        <>
                          <div className="effect-wave">
                            <div></div>
                          </div>
                          <div className="number-percent">
                            {dataTotalProduct['total_product'] !== 0
                              ? (
                                  (dataTotalProduct[item.key] * 100) /
                                  dataTotalProduct['total_product']
                                ).toFixed()
                              : 0}
                            %
                          </div>
                        </>
                      ) : (
                        <div className="image">
                          <img src={item.icon} alt="" />
                        </div>
                      )}
                    </div>

                    <div className="title">{item.title}</div>
                    {item.status ? (
                      <div className="status">{item.status}</div>
                    ) : (
                      <div className="number">
                        {dataTotalProduct[item.key] || 0}
                      </div>
                    )}
                  </Col>
                ))}
              </Space>
            </Row>
          </div>
          <div className="bottom">
            <div className="title">Trạng thái sản phẩm</div>
            <div className="pie d-flex">
              <PieChart width={160} height={160}>
                <Pie
                  activeShape={renderActiveShape}
                  data={dataPieChart || []}
                  // cx={10}
                  // cy={10}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={0}
                  dataKey="percentage"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
              <div className="desc-chart w-100">
                {dataPieChart.map(item => (
                  <div className="d-flex line">
                    <div className={'color ' + item.color}></div>
                    <div className=" d-flex justify-content-between w-100 content-percent">
                      <div>{item.status}</div>
                      <div>
                        {dataTotalProduct['total_product'] !== 0
                          ? (
                              (dataTotalProduct[item.key] * 100) /
                              dataTotalProduct['total_product']
                            ).toFixed()
                          : 0}
                        %
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>
      </CustomRow>
    </>
  );
});
