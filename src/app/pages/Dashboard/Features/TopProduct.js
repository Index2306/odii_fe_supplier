import React, { memo } from 'react';
import { CustomStyle } from 'styles/commons';
import request from 'utils/request';
import styled from 'styled-components';
import { Col, Row, Spin, Table, Tabs, Tooltip } from 'antd';
import BoxList from 'app/components/BoxList';
import { RightOutlined } from '@ant-design/icons';
// import { Table } from 'app/components';

import {
  totalProd,
  waitProd,
  sellProd,
  denyProd,
} from 'assets/images/dashboards';
import { defaultImage } from 'assets/images';
import { formatMoney, GetTime } from 'utils/helpers';
import { Link } from 'react-router-dom';
import moment from 'moment';

const { TabPane } = Tabs;

const dataStatus = [
  {
    icon: totalProd,
    title: 'Tổng sản phẩm',
    total: 'product_all',
  },
  {
    icon: waitProd,
    title: 'Chờ duyệt',
    total: 'product_awaitting',
  },
  {
    icon: sellProd,
    title: 'Đang bán',
    total: 'product_selling',
  },
  {
    icon: denyProd,
    title: 'Bị tự chối',
    total: 'product_rejected',
  },
];

const tabsData = [
  {
    id: 0,
    name: 'Top tồn kho thấp',
  },
  {
    id: 1,
    name: 'Top sản phẩm 14 ngày qua',
  },
];

export default memo(function TopProduct(props) {
  const [data, setData] = React.useState([]);
  const [dataInventory, setDataInventory] = React.useState([]);
  const [tab, setTab] = React.useState('1');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    getDataProdct({
      page_size: 5,
      from_time: moment(GetTime('twoweek')?.[0]).format('YYYY-MM-DD'),
      to_time: moment(GetTime('twoweek')?.[1]).format('YYYY-MM-DD 23:59'),
    });
    getDataInvntory({ page_size: 5 });
  }, []);

  const columns = [
    {
      title: <div className="title-box">Sản phẩm</div>,
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="d-flex alignCenter">
          <div className="report-image">
            <img src={record?.thumb || defaultImage} />
          </div>
          <div className="">
            <div className="inline-block name-prod">
              <Tooltip
                title={
                  record.option1_value
                    ? `${text} ( ${
                        record.option1_value != null ? record.option1_value : ''
                      } 
                ${record.option2_value != null ? record.option2_value : ''} 
                ${record.option3_value != null ? record.option3_value : ''} )`
                    : `${text}`
                }
              >
                {text}
                {record.option1_value && (
                  <span>
                    ( {record.option1_value} {record.option2_value}{' '}
                    {record.option3_value})
                  </span>
                )}
              </Tooltip>
            </div>
            <div className="inventory">{record.supplier_warehousing}</div>
          </div>
        </div>
      ),
    },
    {
      title: <div className="title-box text-right">Doanh thu</div>,
      dataIndex: 'total_money',
      key: 'total_money',
      width: '25%',
      render: text => (
        <div className="text-right" style={{ color: '#219737' }}>
          {formatMoney(text)}
        </div>
      ),
    },
  ];

  const columni = [
    {
      title: <div className="title-box">Sản phẩm</div>,
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="d-flex alignCenter">
          <div className="report-image">
            <img src={record?.thumb?.origin || defaultImage} />
          </div>
          <div className="">
            <div className="inline-block name-prod">
              <Tooltip
                title={
                  record.option1_value
                    ? `${text} ( ${
                        record.option1_value != null ? record.option1_value : ''
                      } 
                ${record.option2_value != null ? record.option2_value : ''} 
                ${record.option3_value != null ? record.option3_value : ''} )`
                    : `${text}`
                }
              >
                {text}
                {record.option1_value && (
                  <span>
                    ( {record.option1_value} {record.option2_value}{' '}
                    {record.option3_value})
                  </span>
                )}
              </Tooltip>
            </div>
            <div className="inventory">{record.supplier_warehousing}</div>
          </div>
        </div>
      ),
    },
    {
      title: <div className="title-box text-right">Tồn kho</div>,
      dataIndex: 'total_quantity',
      key: 'total_quantity',
      width: '25%',
      render: text => <div className="text-right">{text}</div>,
    },
  ];

  const getDataProdct = params => {
    setIsLoading(true);
    request(`oms/supplier/product-sold-report`, { params })
      .then(result => {
        setIsLoading(false);
        setData(result?.data ?? []);
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  const getDataInvntory = params => {
    setIsLoading(true);
    request(`oms/supplier/product-low-quantity-report`, { params })
      .then(result => {
        setIsLoading(false);
        setDataInventory(result?.data ?? []);
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  return (
    <CustomTopProduct>
      <Row>
        <Col flex="1" className="content-table">
          <CustomStyle
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            className="header"
          >
            <CustomStyle className="title">Sản phẩm</CustomStyle>
            <CustomStyle className="see-more">
              <Link to="/report?tabs=1" style={{ color: '#3d56a6' }}>
                Xem thêm
              </Link>
              <RightOutlined style={{ marginLeft: 5 }} />
            </CustomStyle>
          </CustomStyle>
          <CustomStyle>
            <Tabs defaultActiveKey={'1'} onChange={value => setTab(value)}>
              {tabsData.map(v => {
                return <TabPane tab={v.name} key={v.id}></TabPane>;
              })}
            </Tabs>
          </CustomStyle>
          <CustomStyle>
            <Spin tip="Đang tải..." spinning={isLoading}>
              <Row gutter={24}>
                <Col span={24}>
                  <TableWrapper>
                    <Table
                      columns={tab === '1' ? columns : columni}
                      dataSource={tab === '1' ? data : dataInventory}
                      pagination={false}
                      rowSelection={false}
                    ></Table>
                  </TableWrapper>
                </Col>
              </Row>
            </Spin>
          </CustomStyle>
        </Col>
        <Col className="content-box">
          <BoxList
            initData={dataStatus}
            data={props.data}
            title="Trạng thái sản phẩm"
            row="column"
            goto="/products?page=1"
          />
        </Col>
      </Row>
    </CustomTopProduct>
  );
});

const TableWrapper = styled.div`
  table {
    border: 1px solid #ebebf0;
  }
  .ant-table-tbody > tr > td {
    padding: 8px 16px;
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

  .text-right {
    text-align: right;
  }
  .alignCenter {
    align-items: center;
  }
  .inline-block {
    display: inline-block;
  }
  .attribute {
    margin-left: 8px;
  }
  .name-prod {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    color: #181918;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 370px;
  }
  .inventory {
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #828282;
  }
  .report-image {
    width: 40px;
    height: 40px;
    margin-right: 13px;

    img {
      width: 100%;
    }
  }
`;

const CustomTopProduct = styled.div`
  margin-bottom: 24px;

  .content-table {
    padding: 24px 21.15px 26px;
    background: #ffffff;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    margin-right: 20px;

    .header {
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

    .title {
      color: #333333;
      font-weight: 500;
      font-size: 18px;
      line-height: 21px;
    }
  }

  .content-box {
    width: 320px;
  }

  .ant-tabs-tab-active {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;

    .ant-tabs-tab-btn {
      color: #3d56a6 !important;
    }
  }
  .ant-tabs-ink-bar {
    background: #3d56a6 !important;
  }

  .ant-tabs-tab {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #4f4f4f !important;
  }
`;
