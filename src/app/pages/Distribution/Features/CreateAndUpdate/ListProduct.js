import React, { memo, useMemo, useState } from 'react';
import { Collapse, Space, Tooltip } from 'antd';
import styled from 'styled-components';
import { Table, Button, Select, Switch } from 'app/components';
import { InputMoney } from 'app/components/DataEntry/InputNumber';
import { CustomSectionWrapper, WrapperCheckbox } from './styled';
import ListProductModal from '../Detail/ListProductModal';
import notification from 'utils/notification';
import { formatMoney, genImgUrl } from 'utils/helpers';
import request from 'utils/request';

const { Option } = Select;
const { Panel } = Collapse;
const PRODUCT_IMG_SIZE = 36;

export default memo(function ListProduct({ form, setselectedProducts }) {
  const [isVisible, setIsVisible] = useState(false);
  const [keywordFilter, setKeywordFilter] = useState('');
  const [products, setProducts] = useState([]);
  const [warehouseId, setWarehouseId] = useState(null);
  const { getFieldValue } = form;

  React.useEffect(() => {
    if (products) {
      setselectedProducts(products);
    }
  }, [products]);

  const columns = useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Sản phẩm</div>
          </div>
        ),
        dataIndex: 'variation',
        key: 'variation',
        render: (text, record, index) => {
          return (
            <div className="product-name-wrapper">
              <img
                alt=""
                className="product-image"
                src={genImgUrl({
                  location:
                    record?.variation?.thumb?.location ||
                    record?.product?.thumb?.location,
                  width: PRODUCT_IMG_SIZE,
                  height: PRODUCT_IMG_SIZE,
                })}
              />
              <div className="product-name__text">
                <Tooltip
                  placement="bottomLeft"
                  title={`${record?.variation?.name}`}
                >
                  <div className="product-name">{record?.variation?.name}</div>
                </Tooltip>
                <div className="product-sku">
                  {record?.variation?.sku || record?.product?.sku}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Danh mục sản phẩm</div>
          </div>
        ),
        dataIndex: 'top_category',
        key: 'top_category',
        width: '25%',
        render: (text, record) => record?.variation?.top_category.name,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Biến thể</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'number_of_variation',
        key: 'number_of_variation',
        width: '20%',
        className: 'text-center',
        render: (text, record) => record?.variation?.number_of_variation,
      },
      {
        title: '',
        key: 'status',
        dataIndex: 'status',
        fixed: 'right',
        width: '10%',
        render: (text, _, index) => {
          return <div className=""></div>;
        },
      },
    ],
    [products],
  );

  const handleModalProduct = () => {
    // if (getFieldValue('supplier_warehousing')) {
    //   setWarehouseId(getFieldValue('supplier_warehousing').id)
    setIsVisible(true);
    // } else {
    //   notification('error', '', 'Xin vui lòng chọn kho lấy hàng!');
    // }
  };

  return (
    <div style={{ width: '97.5%', margin: '0 12px' }}>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <div></div>
        <div className="d-flex justify-content-end align-items-center">
          <CustomStyle>
            <Space>
              <Button
                className="btn-sm mr-2"
                color="blue"
                onClick={handleModalProduct}
              >
                Chọn sản phẩm
              </Button>
            </Space>
          </CustomStyle>
        </div>
        <CustomTable
          className="custom"
          columns={columns}
          dataSource={products}
          scroll={{ x: 900, y: 1000 }}
          pagination={false}
          notNeedRedirect={true}
          rowKey={(record, index) => record.id}
        />
      </CustomSectionWrapper>
      {isVisible && (
        <ListProductModal
          keywordFilter={keywordFilter}
          setKeywordFilter={setKeywordFilter}
          visible={isVisible}
          onCancel={() => setIsVisible(false)}
          selectedProducts={products}
          setselectedProducts={setProducts}
          warehouseId={warehouseId}
        />
      )}
    </div>
  );
});

const CustomTable = styled(Table)`
  .ant-table-body > table {
    table-layout: auto !important;
  }
  color: #4d4d4d;
  .product-name-wrapper {
    display: flex;
    align-items: center;
    .product-image {
      width: ${PRODUCT_IMG_SIZE}px;
      height: ${PRODUCT_IMG_SIZE}px;
      flex-grow: 0;
      flex-shrink: 0;
      border-radius: 4px;
      border: 1px solid #f0efef;
      background: #eee;
    }
    .product-name__text {
      letter-spacing: 0.02rem;
      margin-left: 8px;
      .product-name {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
      }
    }
    .product-sku {
      font-size: 12px;
      color: ${({ theme }) => theme.gray3};
    }
  }
  .ant-checkbox-wrapper {
    visibility: visible;
  }

  .icon-edit{
    color: #5245e5;
    margin-left: 5px;
    font-size: 12px;

    &:hover{
      cursor: pointer;
      color: #3D56A6;
    }
  }

  .ant-table-tbody > tr.ant-table-row > td {
    background: #fff;
  }
  .ant-table-container {
    table {
      .ant-table-expanded-row-fixed {
        padding: 0
      }
      .ant-table-row-expand-icon-cell {
        padding: 0 !important;
        width: 0%;
      }
      .ant-collapse {
        width: 100%;
        background: #fff;
        border: none;

        .ant-collapse-header{
          font-size: 12px;
          color: #9d9d9d;
          background: #f9f9fa;

          &:hover{
            background: #f6f6fb;
          }

          .ant-collapse-arrow{
            display: none;
          }

          .see-more{
            display: flex;
            align-items: center;

            .btn-more{
              padding-right: 20px;
              border-right: 1px solid #5245e5;

              .btn-sm{
                font-size: 12px;
                height: 24px;
                min-width: 48px;
                padding: 0 8px;
                background-color: #fff;
                border: 1px solid #5245e5;
                border-radius: 4px;
                color: #5245e5;

                &:hover{
                  color: #766df2;
                  border-color: #766df2;
                }
              }
            }

            .text-see-more{
              margin-right: 2px;
              color: #5245e5;
              min-width: 76px;
              text-align: center;
            }
            .icon-see-more {
              transform: rotate(-180deg);
              transition: all .3s ease;

              span{
                font-size: 12px;
                color: #5245e5;
              }
            }

            .icon-see{
              transition: all .3s ease;
              display: flex;
              align-items: center;

              span{
                font-size: 12px;
                color: #5245e5;
              }
            }

            .btn-action-collape{
              display: flex;
              margin-left: 10px;

              .btn-sm{
                margin-left: 10px;
                height: 24px;
                font-size: 12px;
                padding: 0 8px;
                background-color: #fff;
                border: 1px solid #5245e5;
                border-radius: 4px;
                color: #5245e5;
                min-width: 48px;

                &:hover{
                  color: #766df2;
                  border-color: #766df2;
                }
              }

              .btn-cancel{
                color: #474e66;
                border: 1px solid #dde2f0;
              }
            }
          }
        }

          .ant-collapse-content {
            width: 100%;
            border: none;
            overflow: hidden scroll;
            max-height: 300px;

            .ant-collapse-content-box {
              padding: 0;
            }
          }
        }
      }
    }
  }
`;

const CustomStyle = styled.div``;
