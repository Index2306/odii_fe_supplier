import React, { Component, memo, useMemo, useState } from 'react';
import { Col, Collapse, Menu, Row, Space, Tooltip } from 'antd';
import { sum, isEmpty } from 'lodash';
import styled from 'styled-components';
import {
  Table,
  Button,
  Select,
  InputNumber,
  DatePicker,
  Modal,
  Dropdown,
} from 'app/components';
import { CustomSectionWrapper } from './styled';
import { formatMoney, genImgUrl } from 'utils/helpers';
import ListProductModal from './ListProductModal';
import { DeleteOutlined, DownOutlined } from '@ant-design/icons';
import { logoSmall } from 'assets/images';
import { QRCodeSVG } from 'qrcode.react';
import moment from 'moment';
import { InputMoney } from 'app/components/DataEntry/InputNumber';
import EditAll from './EditAll';

const { Option } = Select;
const { Panel } = Collapse;
const PRODUCT_IMG_SIZE = 36;

export default memo(function ListProduct({
  id,
  productList,
  setselectedProducts,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleQR, setIsVisibleQR] = useState(false);
  const [qrCode, setQrCode] = useState();
  const [products, setProducts] = useState();
  const [listSelected, setListSelected] = useState([]);
  const [StatusModal, setStatusModal] = useState('');

  React.useEffect(() => {
    if (products) {
      setselectedProducts(products);
    }
  }, [products]);

  React.useEffect(() => {
    if (productList) {
      setProducts(productList);
    }
  }, [productList]);

  const columns = useMemo(
    () => [
      {
        title: 'STT',
        width: '5%',
        align: 'center',
        render: (_, v, i) => i + 1,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Tên sản phẩm</div>
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
                  title={`${record?.variation?.productName}`}
                >
                  <div className="product-name">
                    {record?.variation?.productName}
                  </div>
                </Tooltip>
                <div className="product-name">{record?.variation?.name}</div>
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
            <div className="title-box">Số lượng</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'total_quantity',
        key: 'total_quantity',
        width: '12%',
        render: (text, record, index) => (
          <InputNumber
            placeholder="Số lượng nhập"
            value={text}
            onChange={handleChangeValue(index, 'total_quantity')}
          />
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Đơn giá</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'total_price',
        key: 'total_price',
        width: '14%',
        render: (text, record, index) => (
          <InputMoney
            placeholder="Đơn giá"
            value={text}
            onChange={handleChangeValue(index, 'total_price')}
          />
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Ngày sản xuất</div>
          </div>
        ),
        dataIndex: 'production_date',
        key: 'production_date',
        width: '16%',
        render: (text, record, index) => (
          <DatePicker
            value={text ? moment(text) : null}
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            placeholder="Nếu có"
            onChange={handleChangeValue(index, 'production_date')}
          />
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Ngày hết hạn</div>
          </div>
        ),
        dataIndex: 'expiry_date',
        key: 'expiry_date',
        width: '16%',
        render: (text, record, index) => (
          <DatePicker
            value={text ? moment(text) : null}
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            placeholder="Nếu có"
            onChange={handleChangeValue(index, 'expiry_date')}
          />
        ),
      },
      {
        title: id && (
          <div className="custome-header center">
            <div className="title-box">Mã QR</div>
          </div>
        ),
        key: 'code',
        dataIndex: 'code',
        width: id ? '7%' : '0%',
        render: (text, _, index) => {
          return (
            <div
              className="center"
              style={{ cursor: 'pointer' }}
              onClick={() => openModalQR(text)}
            >
              {text && (
                <QRCodeSVG
                  value={text}
                  size={35}
                  bgColor={'#ffffff'}
                  fgColor={'#000000'}
                  level={'L'}
                  includeMargin={false}
                  imageSettings={{
                    src: logoSmall,
                    x: undefined,
                    y: undefined,
                    height: 10,
                    width: 10,
                    excavate: true,
                  }}
                />
              )}
            </div>
          );
        },
      },
      {
        title: '',
        width: !id ? '3%' : '0%',
        render: (text, _, index) =>
          !id && <DeleteOutlined onClick={() => handleDeleteItem(index)} />,
      },
    ],
    [products],
  );

  const openModalQR = code => {
    setIsVisibleQR(true);
    setQrCode(code);
  };

  const handleDeleteItem = i => {
    setProducts(products.filter((item, index) => index !== i));
  };

  const handleChangeValue = (index, type) => e => {
    const value = e?.target?.value ?? e;
    const newDataSend = products.slice(0);
    if (type === 'total_quantity' || type === 'total_price') {
      newDataSend[index] = { ...newDataSend[index], [type]: value };
    } else {
      newDataSend[index] = {
        ...newDataSend[index],
        [type]: value ? moment(value) : null,
      };
    }
    setProducts(newDataSend);
  };

  const handleModalProduct = () => {
    setIsVisible(true);
  };

  const handleMenuClick = Type => () => {
    setStatusModal(Type);
  };

  const handleModalShow = () => {
    const listModal = [
      {
        title: 'số lượng',
        type: 'total_quantity',
      },
      {
        title: 'Đơn giá',
        type: 'total_price',
      },
      {
        title: 'ngày sản xuất',
        type: 'production_date',
      },
      {
        title: 'ngày hết hạn',
        type: 'expiry_date',
      },
    ];
    return (
      <Menu>
        {listModal.map(({ title, type }) => (
          <Menu.Item
            key={title}
            onClick={handleMenuClick(
              <EditAll
                title={title}
                type={type}
                callBackCancel={handleMenuClick('')}
                data={products}
                setProducts={setProducts}
              />,
            )}
          >
            Sửa {title}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <div className="title-head">Danh sách sản phẩm nhập kho</div>
        {id && (
          <>
            <div className="total_quantity_info">
              Số lượng: {sum(products?.map(item => item.total_quantity))} sản
              phẩm
            </div>
            <div className="total_quantity_info">
              Giá trị lô hàng:{' '}
              {formatMoney(
                sum(
                  products?.map(item => item.total_price * item.total_quantity),
                ),
              )}
            </div>
          </>
        )}
        {!id && (
          <div className="d-flex justify-content-end align-items-center">
            <Space>
              <Button
                className="btn-sm mr-2"
                color="blue"
                onClick={handleModalProduct}
              >
                Chọn sản phẩm
              </Button>
            </Space>
          </div>
        )}
        {isEmpty(listSelected) || (
          <div className="d-flex align-items-center justify-content-between">
            <div style={{ fontWeight: 'bold' }}>
              Đã chọn {listSelected.length} Biến thể
            </div>
            <Dropdown overlay={handleModalShow()}>
              <Button className="btn-sm" color="default" context="secondary">
                Sửa hàng loạt &nbsp; <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        )}
        <CustomTable
          className="custom"
          columns={columns}
          rowSelection={{
            selectedRowKeys: listSelected,
            type: 'checkbox',
            onChange: selectedRowKeys => {
              // setListOption([]);
              setListSelected(selectedRowKeys);
            },
          }}
          dataSource={products}
          pagination={false}
          scroll={{ y: 1000 }}
          rowKey={(record, index) => index}
        />
      </CustomSectionWrapper>
      {isVisible && (
        <ListProductModal
          visible={isVisible}
          onCancel={() => setIsVisible(false)}
          selectedProducts={products}
          setselectedProductList={value => {
            const newData = products.concat(value);
            setProducts(newData);
          }}
        />
      )}
      {StatusModal}
      {qrCode && (
        <Modal
          visible={isVisibleQR}
          onCancel={() => setIsVisibleQR(false)}
          footer={false}
          width={472}
          bodyStyle={{
            padding: '24px 24px 0px',
          }}
          closeIcon={<></>}
        >
          <div style={{ textAlign: 'center', width: 424 }}>
            <QRCodeSVG
              value={qrCode}
              size={424}
              bgColor={'#ffffff'}
              fgColor={'#000000'}
              level={'L'}
              includeMargin={false}
              imageSettings={{
                src: logoSmall,
                x: undefined,
                y: undefined,
                height: 40,
                width: 121,
                excavate: true,
              }}
            />
            <div style={{ fontSize: 27 }}>{qrCode}</div>
          </div>
        </Modal>
      )}
    </>
  );
});

const CustomTable = styled(Table)`
  .ant-table-body > table {
    table-layout: auto !important;
  }
  .center{
    text-align: center;
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

  .ant-input-number-input{
    border: 1px solid #d9d9d9;
    height: 40px;
  }

  .ant-table-tbody > tr.ant-table-row > td {
    background: #fff;
  }
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: #fff;
  }
  .ant-table-container {
    table {
      .ant-table-expanded-row {
        .ant-table-cell {
          padding: 0;
          background: #fff;

          .card-variant {
            display: flex;
            justify-content: center;
            cursor: pointer;
          }
        }
      }

      .ant-table-row-expand-icon-cell {
        padding: 0 !important;
        width: 0%;
      }

      .add-variant-action {
        .ant-collapse-content {
          height: auto !important;
        }
      }

      .ant-collapse {
        width: 100%;
        background: #fff;
        border: none;

        .ant-collapse-header{

          padding: 8px 65px;
          margin: 8px 12px 8px 12px;
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
            overflow: hidden;
            // max-height: 300px;

            .ant-collapse-content-box {
              padding: 0;
            }
          }
        }
      }
    }
  }
`;
