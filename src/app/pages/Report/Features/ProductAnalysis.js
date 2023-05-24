import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { CustomStyle } from 'styles/commons';
import { Row, Col, Table, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import request from 'utils/request';
import { formatMoney } from 'utils/helpers';
import { defaultImage } from 'assets/images';

import { Input } from 'app/components';

export default memo(function ProductAnalysis(props) {
  const { filter } = props;
  const [data, setData] = React.useState([]);
  const [search, setSearch] = React.useState(filter);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (search.from_time && search.to_time) {
      getData({ ...search, ...filter, page_size: 6 });
    }
  }, [search, filter]);

  const handleFilter = type => e => {
    const value = (e?.target?.value ?? e) || '';
    let values = {};
    if (value.length >= 2) {
      values = { ...search, [type]: value };
      setSearch(values);
    } else {
      setSearch(filter);
      getData({ ...filter, page_size: 6 });
    }
  };

  const onChangePage = page => {
    getData({ page: page, page_size: 6 });
  };

  const getData = params => {
    setLoading(true);
    request(`oms/supplier/product-sold-report`, { params }).then(result => {
      if (result) {
        setData(result);
        setLoading(false);
      }
    });
  };

  const columns = [
    {
      title: <div className="title-box text-center">STT</div>,
      dataIndex: 'id',
      key: 'id',
      width: '6%',
      render: (text, record, index) => (
        <div className="text-center">
          {index + 1 + (data.pagination.page - 1) * data.pagination.page_size}
        </div>
      ),
    },
    {
      title: <div className="title-box ">Sản phẩm</div>,
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="d-flex alignCenter">
          <div className="report-image">
            <img src={record?.thumb || defaultImage} alt="" />
          </div>
          <div className="">
            <div className="inline-block name-prod">{text}</div>
            <div className="inline-block attribute">
              {record.option1_value && (
                <span>
                  ( {record.option1_value} {record.option2_value}{' '}
                  {record.option3_value})
                </span>
              )}
            </div>
            <div className="inventory">{record.supplier_warehousing}</div>
          </div>
        </div>
      ),
    },
    {
      title: <div className="title-box text-right">Người mua</div>,
      dataIndex: 'total_buyer',
      key: 'total_buyer',
      width: '10%',
      render: text => <div className="text-right">{text}</div>,
    },
    {
      title: <div className="title-box text-right">Số lượng</div>,
      dataIndex: 'total_quantity',
      key: 'total_quantity',
      width: '11%',
      render: text => <div className="text-right">{text}</div>,
    },
    {
      title: <div className="title-box text-right">Doanh thu</div>,
      dataIndex: 'total_money',
      key: 'total_money',
      width: '11%',
      render: text => <div className="text-right">{formatMoney(text)}</div>,
    },
  ];

  return (
    <CustomStyle className="tablesell" style={{ marginBottom: 24 }}>
      <CustomStyle
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="header"
      >
        <CustomStyle className="title">Sản phẩm</CustomStyle>
        <CustomStyle className="see-more" width="250px">
          <Input
            placeholder="Tìm kiếm sản phẩm, kho hàng"
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
        <Spin tip="Đang tải..." spinning={loading}>
          <Row gutter={24}>
            <Col span={24}>
              <TableWrapper>
                <Table
                  columns={columns}
                  dataSource={data.data}
                  pagination={{
                    showSizeChanger: false,
                    hideOnSinglePage: false,
                    current: data?.pagination?.page,
                    total: data?.pagination?.total,
                    defaultPageSize: data?.pagination?.page_size,
                    onChange: e => onChangePage(e),
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} trên tổng ${total} bản ghi`,
                  }}
                  rowSelection={false}
                ></Table>
              </TableWrapper>
            </Col>
          </Row>
        </Spin>
      </CustomStyle>
    </CustomStyle>
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
  }
  .inventory {
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #828282;
  }
  .report-image {
    width: 56px;
    height: 56px;
    margin-right: 14px;

    img {
      width: 100%;
    }
  }
`;
