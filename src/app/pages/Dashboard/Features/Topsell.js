import React, { memo } from 'react';
import { CustomStyle } from 'styles/commons';
import request from 'utils/request';
import styled from 'styled-components';
import { Col, Row, Spin, Table } from 'antd';
import BoxList from 'app/components/BoxList';
import { RightOutlined } from '@ant-design/icons';
// import { Table } from 'app/components';

import { modeborder, totalAdd, totalMode } from 'assets/images/dashboards';
import { formatMoney, GetTime } from 'utils/helpers';
import constants from 'assets/constants';
import { Link } from 'react-router-dom';
import moment from 'moment';

const dataPayment = [
  {
    icon: modeborder,
    title: 'Số dư khả dụng',
    total: 'amount',
  },
  {
    icon: totalAdd,
    title: 'Tổng tiền đã nạp',
    total: 'deposit_amount',
  },
  {
    icon: totalMode,
    title: 'Tổng tiền đã rút',
    total: 'withdrawal_amount',
  },
];

export default memo(function TopProduct(history) {
  const [pay, setPay] = React.useState({});
  const [dataTop, setDataTop] = React.useState(null);

  React.useEffect(() => {
    getDataPayment();
    getTopData({
      from_time: moment(GetTime('twoweek')?.[0]).format('YYYY-MM-DD'),
      to_time: moment(GetTime('twoweek')?.[1]).format('YYYY-MM-DD 23:59'),
    });
  }, []);

  const getDataPayment = params => {
    request(`user-service/me/balance`, { params }).then(result => {
      setPay(result?.data);
    });
  };
  const getTopData = params => {
    request(`oms/supplier/top-seller-report`, { params }).then(request => {
      if (request) setDataTop(request.data_seller);
    });
  };

  const columns = [
    {
      title: <div className="title-box">STT</div>,
      dataIndex: 'store',
      key: 'store',
      width: '10%',
      render: (text, record, index) => (
        <div className="text-center">{index + 1}</div>
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
            <img src={record.avatar.origin || null} />
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
      width: '18%',
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

  return (
    <CustomTopProduct>
      <Row>
        <Col flex="auto" className="content-table">
          <CustomStyle
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            className="header"
          >
            <CustomStyle className="title">
              Top nhà bán
              <CustomStyle className="small-title">14 ngày qua</CustomStyle>
            </CustomStyle>
            <CustomStyle className="see-more">
              <Link to="/report" style={{ color: '#3d56a6' }}>
                Xem thêm
              </Link>
              <RightOutlined style={{ marginLeft: 5 }} />
            </CustomStyle>
          </CustomStyle>
          <CustomStyle>
            <Spin tip="Đang tải..." spinning={!dataTop}>
              <Row gutter={24}>
                <Col span={24}>
                  <TableWrapper>
                    <Table
                      columns={columns}
                      dataSource={dataTop || []}
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
            initData={dataPayment}
            data={pay}
            title="Ví của tôi"
            row="column"
            goto="/mywallet?page=1"
            money
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
  }

  .content-box {
    width: 320px;
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
