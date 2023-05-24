import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { CustomStyle } from 'styles/commons';
import { Row, Col, Table, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell } from 'recharts';
import { sumBy } from 'lodash';

import { Input } from 'app/components';
import { formatMoney } from 'utils/helpers';
import constants from 'assets/constants';

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

export default memo(function RevenueBuy(props) {
  const { dataPie, dataTable, setSearch, filter, pagination, gotoPage } = props;
  const columns = [
    {
      title: <div className="title-box">STT</div>,
      dataIndex: 'store',
      key: 'store',
      width: '12%',
      render: (text, record, index) => (
        <div className="text-center">
          {index + 1 + (pagination?.page - 1) * pagination?.page_size}
        </div>
      ),
    },
    {
      title: <div className="title-box ">Seller</div>,
      dataIndex: 'full_name',
      key: 'full_name',
      // width: '44%',
      render: (store, record) => (
        <div className="name-avatar">
          <div className="img-name">
            <img src={record.avatar.origin || null} alt="" />
          </div>
          <div className="title-name">
            <div className="name-buyer">{store}</div>
            <div className="name-store">
              {/* <img src={constants.SALE_CHANNEL.filter(item => item.id === record.platform?.toUpperCase())[0]?.icon || null} /> */}
              <div className="store">{record.name}</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: <div className="title-box text-right">Số lượng</div>,
      dataIndex: 'order_cnt',
      key: 'order_cnt',
      width: '20%',
      render: (store, record) => <div className="text-right">{store}</div>,
    },
    {
      title: <div className="title-box text-right">Doanh thu</div>,
      dataIndex: 'revenue',
      key: 'revenue',
      width: '24%',
      render: (store, record) => (
        <div className="text-right" style={{ color: '#219737' }}>
          {formatMoney(store)}
        </div>
      ),
    },
  ];

  const columnsFlatform = [
    {
      title: <div className="title-box">Sàn</div>,
      dataIndex: 'platform',
      key: 'platform',
      width: '35%',
      render: (text, record) => (
        <div
          className="text-left"
          style={{
            color: `${record.color}`,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="icon-platform">
            <img src={record.icon || null} alt="" />
          </div>
          {text}
        </div>
      ),
    },
    {
      title: <div className="title-box text-center">Số lượng</div>,
      dataIndex: 'order_cnt',
      key: 'order_cnt',
      width: '30%%',
      render: (text, record) => <div className="text-center">{text}</div>,
    },
    {
      title: <div className="title-box text-right">Doanh thu</div>,
      dataIndex: 'revenue',
      key: 'revenue',
      width: '35%',
      render: (text, record) => (
        <div className="text-right" style={{ color: '#219737' }}>
          {formatMoney(text || 0)}
        </div>
      ),
    },
  ];

  const convertPieData = () => {
    const pie = [];
    const keyValue = [];
    dataPie?.forEach(item => {
      for (const entry of Object.entries(item)) {
        const [course, value] = entry;
        if (course === 'platform')
          if (!value) {
            keyValue.push('other');
          } else {
            keyValue.push(value);
          }
      }
    });
    constants.SALE_CHANNEL?.forEach(e => {
      dataPie?.forEach(item => {
        if (
          e.id === item.platform?.toUpperCase() ||
          (!item.platform && e.id === 'OTHER')
        ) {
          pie.push({
            platform: e.name,
            order_cnt: item.order_cnt * 1,
            revenue: item.revenue * 1,
            icon: e.icon,
            color: e.color,
          });
        }
      });
      if (!keyValue.includes(e.id.toLowerCase())) {
        pie.push({
          platform: e.name,
          order_cnt: 0,
          revenue: 0,
          icon: e.icon,
          color: e.color,
        });
      }
    });

    return pie;
  };

  const handleFilter = type => e => {
    const value = (e?.target?.value ?? e) || '';
    let values = {};
    if (value.length >= 2) {
      values = { ...filter, [type]: value };
      setSearch(values);
    } else {
      delete filter.keyword;
      setSearch({ ...filter, page_size: 6 });
    }
  };

  const onChangePage = page => {
    gotoPage({ ...filter, page: page, page_size: 6 });
  };

  return (
    <CustomRevenue>
      <Row gutter={16}>
        <Col span={12}>
          <CustomStyle className="tablesell">
            <CustomStyle
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              className="header"
            >
              <CustomStyle className="title">
                Doanh thu theo nhà bán
              </CustomStyle>
              <CustomStyle className="see-more">
                <Input
                  placeholder="Tìm kiếm nhà bán"
                  allowClear
                  size="medium"
                  // color="#7C8DB5"
                  color="primary"
                  prefix={<SearchOutlined />}
                  onChange={handleFilter('keyword')}
                />
              </CustomStyle>
            </CustomStyle>
            <CustomStyle>
              <Spin tip="Đang tải..." spinning={!dataTable}>
                <Row gutter={24}>
                  <Col span={24}>
                    <TableWrapper>
                      <Table
                        columns={columns}
                        dataSource={dataTable || []}
                        rowSelection={false}
                        pagination={
                          pagination?.last_page > 1 && {
                            showSizeChanger: false,
                            hideOnSinglePage: false,
                            current: pagination?.page,
                            total: pagination?.total,
                            defaultPageSize: pagination?.page_size,
                            onChange: e => onChangePage(e),
                            showTotal: (total, range) =>
                              `${range[0]}-${range[1]} trên tổng ${total} bản ghi`,
                          }
                        }
                      ></Table>
                    </TableWrapper>
                  </Col>
                </Row>
              </Spin>
            </CustomStyle>
          </CustomStyle>
        </Col>
        <Col span={12}>
          <CustomStyle className="tablesell">
            <div className="title title-pie">Doanh thu theo sàn</div>
            <div className="d-flex">
              <div className="pie">
                <div className="total-label">
                  <div>Total</div>
                  <div className="total">
                    {sumBy(convertPieData(), 'order_cnt')}
                  </div>
                </div>
                <div className="pie-chart">
                  <PieChart width={165} height={165}>
                    <Pie
                      activeShape={renderActiveShape}
                      data={convertPieData() || []}
                      // cx={10}
                      // cy={10}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={0}
                      dataKey="order_cnt"
                    >
                      {convertPieData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry['color']} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>
              </div>
              <div className="desc-chart">
                {convertPieData().map((item, index) => (
                  <div className="d-flex line">
                    <div className="d-flex justify-content-between w-100 content-percent">
                      <div className="text">
                        <div
                          className="dots"
                          style={{ background: `${item['color']}` }}
                        ></div>
                        {item.platform}
                      </div>
                      <div className="percent">
                        {item['order_cnt']
                          ? (
                              (item['order_cnt'] * 100) /
                              sumBy(convertPieData(), 'order_cnt')
                            ).toFixed()
                          : 0}
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="table-pie">
              <Spin tip="Đang tải..." spinning={false}>
                <Row gutter={24}>
                  <Col span={24}>
                    <TableWrapper>
                      <Table
                        columns={columnsFlatform}
                        dataSource={convertPieData()}
                        pagination={false}
                        rowSelection={false}
                      ></Table>
                    </TableWrapper>
                  </Col>
                </Row>
              </Spin>
            </div>
          </CustomStyle>
        </Col>
      </Row>
    </CustomRevenue>
  );
});

const CustomRevenue = styled.div`
    margin-bottom: 18px;

    .table-pie{
        margin-top: 40px;
    }

    .pie{
        position: relative;

        .total-label{
            width: 165px;
            height: 165px;
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            font-weight: 400;
            font-size: 12px;
            line-height: 20px;
            color: #4E5969;

            .total{
                font-weight: 500;
                font-size: 24px;
                line-height: 32px;
                color: #1D2129;
            }
        }
        .pie-chart{
            position; absolute;
            z-index: 1;
        }
    }

    .tablesell{
        padding: 24px 21.15px 26px;
        background: #FFFFFF;
        box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        height: 100%;
    
        .header{
          margin-bottom: 20px;
    
          .see-more{
              display: flex;
              align-items: center;
              color: #3D56A6;
    
              &:hover{
                  cursor: pointer;
                  text-decoration: underline;
              }
        }
    }

    .title-pie{
        margin-bottom: 40px;
    }
    .desc-chart{
        padding: 10px 0px 10px 36px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 35%;

        .text{
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
            display: flex;
            align-items: center;
            color: #4F4F4F;
        }
        .dots{
            width: 12px;
            height: 12px;
            border-radius: 100px;
            margin-right: 8px;
        }
        .percent{
            font-weight: 500;
            font-size: 20px;
            line-height: 28px;
            color: #333333;

            span{
                font-weight: 400;
                font-size: 12px;
                line-height: 28px;
                color: #86909C;
            }
        }
    }
`;

const TableWrapper = styled.div`
  table {
    border: 1px solid #ebebf0;
  }
  .ant-list-item {
    padding: 5px 30px;
  }
  .ant-table-tbody > tr {
    height: 50px;
  }
  .ant-table-cell {
    &:before {
      display: none;
    }
  }
  .ant-table-thead > tr .ant-table-cell {
    padding: 10px 16px;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #6c798f;
    border-radius: 4px 4px 0px 0px;
  }

  .ant-table-tbody > tr .ant-table-cell {
    padding: 8px 16px;
  }

  .text-right {
    text-align: right;
    font-weight: 500;
  }
  .text-center {
    text-align: center;
    font-weight: 500;
  }
  .text-left {
    text-align: left;
    font-weight: 500;
  }
  .icon-platform {
    margin-right: 6px;
    img {
      width: 24px;
    }
  }
  .name-avatar {
    display: flex;
    align-items: center;

    .img-name {
      border-radius: 50%;
      margin-right: 12px;

      img {
        width: 40px;
        height: 40px;
        border: 1px solid #e6e9ec;
        border-radius: 72px;
      }
    }
    .title-name {
      .name-buyer {
        color: #181918;
        font-weight: 500;
      }

      .name-store {
        display: flex;
        align-items: center;

        img {
          width: 12px;
          height: 12px;
          margin-right: 4px;
        }

        .store {
          color: #8d8d8d;
          font-size: 12px;
        }
      }
    }
  }
`;
