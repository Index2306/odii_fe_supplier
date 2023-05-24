import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { CustomStyle } from 'styles/commons';
import { Row, Col, Table, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { Input } from 'app/components';

export default memo(function RevenueCategories() {
  const columns = [
    {
      title: <div className="title-box">STT</div>,
      dataIndex: 'store',
      key: 'store',
      width: '12%',
      render: (store, record) => <div className="order__create-time"></div>,
    },
    {
      title: <div className="title-box ">Ngành hàng</div>,
      dataIndex: '',
      key: '',
      width: '44%',
    },
    {
      title: <div className="title-box text-right">% Doanh thu</div>,
      dataIndex: '',
      key: '',
      width: '22%',
    },
    {
      title: <div className="title-box text-right">Doanh thu</div>,
      dataIndex: '',
      key: '',
      width: '22%',
    },
  ];

  return (
    <CustomCategory>
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
                Doanh thu theo ngành hàng cấp 1
              </CustomStyle>
              <CustomStyle className="see-more">
                <Input
                  placeholder="Tìm kiếm sản phẩm"
                  allowClear
                  size="medium"
                  // color="#7C8DB5"
                  color="primary"
                  prefix={<SearchOutlined />}
                />
              </CustomStyle>
            </CustomStyle>
            <CustomStyle>
              <Spin tip="Đang tải..." spinning={false}>
                <Row gutter={24}>
                  <Col span={24}>
                    <TableWrapper>
                      <Table
                        columns={columns}
                        dataSource={[]}
                        pagination={true}
                        rowSelection={false}
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
            <CustomStyle
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              className="header"
            >
              <CustomStyle className="title">
                Doanh thu theo ngành hàng cấp 2, 3
              </CustomStyle>
              <CustomStyle className="see-more">
                <Input
                  placeholder="Tìm kiếm nhà bán"
                  allowClear
                  size="medium"
                  // color="#7C8DB5"
                  color="primary"
                  prefix={<SearchOutlined />}
                />
              </CustomStyle>
            </CustomStyle>
            <CustomStyle>
              <Spin tip="Đang tải..." spinning={false}>
                <Row gutter={24}>
                  <Col span={24}>
                    <TableWrapper>
                      <Table
                        columns={columns}
                        dataSource={[]}
                        pagination={true}
                        rowSelection={false}
                      ></Table>
                    </TableWrapper>
                  </Col>
                </Row>
              </Spin>
            </CustomStyle>
          </CustomStyle>
        </Col>
      </Row>
    </CustomCategory>
  );
});

const CustomCategory = styled.div`
    .tablesell{
        padding: 24px 21.15px 26px;
        background: #FFFFFF;
        box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
        border-radius: 4px;

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

  .text-right {
    text-align: right;
  }
`;
