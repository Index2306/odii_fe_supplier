import React, { memo, useMemo, useState } from 'react';
import { Collapse, Space, Tooltip } from 'antd';
import styled from 'styled-components';
import { Table, Button, Select, Switch } from 'app/components';
import { InputMoney } from 'app/components/DataEntry/InputNumber';
import { CustomSectionWrapper, WrapperCheckbox } from './styled';
import { isNumber, isEmpty } from 'lodash';
import ListProductModal from '../features/Detail/ListProductModal';
import { DownOutlined } from '@ant-design/icons';
import { formatMoney, genImgUrl } from 'utils/helpers';
import { EditProduct } from '../components/modal';
import TableOption from './TableOption';
import request from 'utils/request';

const { Option } = Select;
const { Panel } = Collapse;
const PRODUCT_IMG_SIZE = 36;

export default memo(function ListProduct({
  layout,
  products,
  setProducts,
  typeMethod,
  data,
  gotoPage,
}) {
  const [currentOption, setCurrentOption] = useState([]);
  const [listOption, setListOption] = useState([]);
  const [listSelected, setListSelected] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [keywordFilter, setKeywordFilter] = useState('');
  const [isEditProduct, setIsEditProduct] = useState(false);
  const [idChangeCollape, setIdChangeCollape] = useState([]);
  const [option, setOption] = useState([]);
  const [changeCollape, setChangeCollape] = React.useState();
  const [idInventory, setIdInventory] = React.useState();
  const [actionCollape, setActionCollape] = useState(false);

  const rowSelection = {
    onChange: selectedRowKeys => {
      setListSelected(selectedRowKeys);
    },
  };

  React.useEffect(() => {
    if (option && !actionCollape) {
      setActionCollape(true);
    }
  }, [option]);

  const handleAction = type => e => {
    switch (type) {
      case 'cancel':
        e.stopPropagation();
        handleCancelUpdate(option, idInventory.id);
        setActionCollape(false);
        break;
      case 'accept':
        e.stopPropagation();
        handleUpdateInventory('', option);
        setActionCollape(false);
        break;
      case 'all':
        handleUpdateInventory('', e);
        setActionCollape(true);
        break;
      default:
        return;
    }
  };

  const handleCancelUpdate = (option, id) => {
    const newProduct = data.products.map(item => {
      if (item.id === id) {
        return item;
      }
      return item;
    });
    setProducts(newProduct);
  };

  const handleUpdateInventory = async (value, newOption) => {
    if (idInventory) {
      const id = idInventory.id;
      let newOptions;
      if (newOption) {
        newOptions = newOption.map(item => {
          return {
            ...item,
            promotion_id: data.id,
          };
        });
      }
      await request(`user-service/supplier/promotion/${id}/option`, {
        method: 'put',
        data: { options: newOptions },
      });
      gotoPage('');
    }
  };

  const handleSelect = (type, value) => () => {
    if (type !== 'none' && currentOption.some(item => item.type === 'all'))
      return;
    let newSelected = listSelected;
    let newOption = currentOption.some(item => item.value === value)
      ? currentOption
      : [...currentOption, { type, value }];
    let optionSelected = listOption;

    switch (type) {
      case 'all':
        newOption = [{ type, value }];
        newSelected = products.map(item => item.id);
        // setCurrentOption([]);
        optionSelected = listOption.map(item => ({
          ...item,
          active: false,
        }));
        break;
      case 'none':
        newSelected = [];
        newOption = [];
        optionSelected = listOption.map(item => ({
          ...item,
          active: false,
        }));
        break;
      default:
        break;
    }

    setCurrentOption(newOption);
    setListSelected(newSelected);
    setListOption(optionSelected);
  };

  const handleOnChange = (type, index, isNumberField, record) => e => {
    const newproducts = products.slice(0);

    if (type === 'status') {
      if (e) {
        newproducts[index] = { ...newproducts[index], [type]: 'active' };
      } else newproducts[index] = { ...newproducts[index], [type]: 'inactive' };
      setProducts(newproducts);
      return;
    }

    const value = e?.target?.value ?? e;

    if (isNumberField ? isNumber(value) : value) {
      newproducts[index] = { ...newproducts[index], [type]: value };
    } else if (!value) {
      newproducts[index] = { ...newproducts[index], [type]: '' };
    }

    if (type === 'type') {
      newproducts[index] = { ...newproducts[index], value: 0 };
    }

    if (type === 'value') {
      const prtType = products.find((item, idx) => idx === index).type;
      if (
        typeMethod === 'quantity_by' ||
        prtType === 'percent' ||
        record.origin_supplier_price < value
      ) {
        let isError;
        if (value > 100 || value <= 0) isError = true;
        else isError = false;
        newproducts[index] = { ...newproducts[index], isErrorValue: isError };
      } else {
        newproducts[index] = { ...newproducts[index], isErrorValue: false };
      }
    }

    setProducts(newproducts);
  };

  const handleChangeCollape = (e, record) => {
    setActionCollape(false);
    setChangeCollape(`${e}_${record.id}`);
    if (e) {
      if (!idChangeCollape.includes(record.id)) {
        idChangeCollape.push(record.id);
        setIdChangeCollape(idChangeCollape);
      }
      setIdInventory(record);
    } else {
      idChangeCollape.splice(idChangeCollape.indexOf(record.id), 1);
      setIdChangeCollape(idChangeCollape);
      if (idChangeCollape) {
        let lastId = idChangeCollape[idChangeCollape.length - 1];
        setIdInventory(products?.find(item => item.id === lastId));
      }
    }
  };

  const handleAddOption = (e, id) => {
    e.stopPropagation();
    setActionCollape(true);
    let newOption = [];
    products.forEach((item, i) => {
      if (item.id === id) {
        item.option.map(e => {
          newOption.push(e);
        });
        newOption.push({
          promotion_product_id: id,
          quantity_from: 0,
          quantity_to: 0,
          value: 0,
        });
        setProducts(
          [...products].fill({ ...item, option: newOption }, i, i + 1),
        );
      }
    });
    setOption(newOption);
  };

  const genExtra = id => (
    <div className="see-more">
      {idChangeCollape.includes(id) && (
        <div className="btn-more">
          <Button className="btn-sm" onClick={e => handleAddOption(e, id)}>
            Thêm Option
          </Button>
        </div>
      )}
      {actionCollape && idInventory?.id === id ? (
        <div className="btn-action-collape">
          <Button
            className="btn-sm btn-cancel"
            onClick={handleAction('cancel')}
          >
            Hủy
          </Button>
          <Button
            className="btn-sm"
            onClick={handleAction('accept')}
            disabled={
              data?.status_validate?.includes('expired') || data?.is_approve
            }
          >
            Lưu
          </Button>
        </div>
      ) : (
        <>
          <div className="text-see-more">
            {idChangeCollape.includes(id) ? 'Rút gọn' : 'Thêm Option'}
          </div>
          <div
            className={
              idChangeCollape.includes(id) ? 'icon-see-more' : 'icon-see'
            }
          >
            <DownOutlined />
          </div>
        </>
      )}
    </div>
  );

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
        width: 250,
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
                  title={`${record?.variation?.productName}${
                    record?.name_option ? `(${record?.name_option})` : ''
                  }`}
                >
                  <div className="product-name">
                    {record?.variation?.productName}
                    {record?.name_option && (
                      <span>({record?.name_option})</span>
                    )}
                  </div>
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
            <div className="title-box">Giá NCC</div>
          </div>
        ),
        dataIndex: 'origin_supplier_price',
        key: 'origin_supplier_price',
        width: 100,
        align: 'center',
        render: (text, record, index) => formatMoney(text),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Loại giảm giá</div>
          </div>
        ),
        dataIndex: 'type',
        key: 'type',
        width: '10%',
        display: 'none',
        render: (text, record, index) => (
          <Select
            size="medium"
            placeholder="Chọn type"
            value={text}
            onChange={handleOnChange('type', index, false, record)}
            {...layout}
          >
            <Option value="percent">Giảm giá %</Option>
            <Option value="money">Giảm giá VND</Option>
          </Select>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Số lượng từ</div>
          </div>
        ),
        dataIndex: 'quantity_from',
        key: 'quantity_from',
        width: 100,
        render: (text, record, index) => (
          <InputMoney
            {...layout}
            disabled={true}
            placeholder="Nhập số lượng"
            value={record?.option[0]?.quantity_from || 0}
            onChange={handleOnChange('quantity_from', index, false, record)}
          />
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Số lượng đến</div>
          </div>
        ),
        dataIndex: 'quantity_to',
        key: 'quantity_to',
        width: 100,
        render: (text, record, index) => (
          <InputMoney
            {...layout}
            disabled={true}
            placeholder="Nhập số lượng"
            value={record?.option[0]?.quantity_to || 0}
            onChange={handleOnChange('quantity_to', index, false, record)}
          />
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">
              {typeMethod === 'product_by' ? 'Giảm giá' : 'Chiết khấu %'}
            </div>
          </div>
        ),
        dataIndex: 'value',
        key: 'value',
        width: 100,
        render: (text, record, index) => (
          <>
            <InputMoney
              {...layout}
              placeholder="Giảm giá"
              disabled={!!typeMethod.includes('quantity_by')}
              value={
                typeMethod.includes('quantity_by')
                  ? record?.option[0]?.value || 0
                  : text
              }
              onChange={handleOnChange('value', index, false, record)}
            />
            {record?.isErrorValue && (
              <div
                style={{ color: 'red', fontSize: '12px', position: 'absolute' }}
              >
                Giảm giá không hợp lệ!
              </div>
            )}
          </>
        ),
      },

      {
        title: '',
        key: 'status',
        dataIndex: 'status',
        fixed: 'right',
        width: 100,
        render: (text, _, index) => {
          return (
            <div className="">
              <Space align="center" direction="vertical" className="d-flex">
                <Switch
                  onChange={handleOnChange('status', index)}
                  checked={text === 'active'}
                  disabled={data?.status_validate?.includes('expired')}
                />
              </Space>
            </div>
          );
        },
      },
    ],
    [products, changeCollape, idInventory],
  );

  return (
    <div style={{ width: '97.5%', margin: '0 12px' }}>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <div className="title">Điều kiện</div>
        <WrapperCheckbox>
          <CustomStyle>
            <Space wrap>
              <span>Chon:</span>
              <Button
                context="secondary"
                color="transparent"
                className={
                  currentOption.some(item => item.type === 'all')
                    ? 'actice'
                    : ''
                }
                onClick={handleSelect('all')}
              >
                Chọn tất cả
              </Button>
              <Button
                context="secondary"
                color="transparent"
                onClick={handleSelect('none')}
              >
                Bỏ chọn
              </Button>
            </Space>
          </CustomStyle>
          <div className="d-flex justify-content-end align-items-center">
            <CustomStyle>
              <Space>
                {!isEmpty(listSelected) && (
                  <Button
                    disabled={
                      data?.status_validate?.includes('expired') ||
                      data?.is_approve
                    }
                    context="secondary"
                    className="btn-sm"
                    color="default"
                    onClick={() => setIsEditProduct(true)}
                  >
                    Sửa hàng loạt
                  </Button>
                )}
                <Button
                  className="btn-sm mr-2"
                  color="blue"
                  onClick={() => setIsVisible(true)}
                  disabled={
                    data?.status_validate?.includes('expired') ||
                    data?.is_approve
                  }
                >
                  Chọn sản phẩm
                </Button>
              </Space>
            </CustomStyle>
          </div>
        </WrapperCheckbox>
        <CustomTable
          className="custom"
          columns={
            data?.type?.includes('quantity_by')
              ? columns.filter(item => item.dataIndex !== 'type')
              : columns.filter(
                  item =>
                    item.dataIndex !== 'quantity_to' &&
                    item.dataIndex !== 'quantity_from' &&
                    item.dataIndex !== 'addQuantity',
                )
          }
          dataSource={products}
          expandable={
            typeMethod === 'quantity_by' && {
              expandedRowKeys: products.map((record, index) => record.id),
              expandedRowRender: record => {
                const option = record?.option || [];
                return (
                  <>
                    <div className="card-variant">
                      <Collapse
                        accordion
                        onChange={e => handleChangeCollape(e, record)}
                        activeKey={idChangeCollape.includes(record.id) && ['1']}
                      >
                        <Panel
                          header={`Tổng ${option.length} option`}
                          key="1"
                          extra={genExtra(record.id)}
                        >
                          <TableOption
                            data={option}
                            setOption={value => setOption(value)}
                            actionCollape={actionCollape}
                            products={products}
                            setProducts={value => setProducts(value)}
                            idInventory={idInventory}
                            setIdInventory={setIdInventory}
                            isCheckOption={
                              data?.status_validate?.includes('expired') ||
                              data?.is_approve
                            }
                          />
                        </Panel>
                      </Collapse>
                    </div>
                  </>
                );
              },
              expandIcon: ({ expanded, onExpand, record }) => <></>,
            }
          }
          scroll={{ x: 900, y: 1000 }}
          pagination={false}
          notNeedRedirect={true}
          rowKey={(record, index) => record.id}
          rowSelection={{
            selectedRowKeys: listSelected,
            type: 'checkbox',
            ...rowSelection,
          }}
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
          data={data}
        />
      )}
      <EditProduct
        title="Sửa hàng loạt"
        listSelect={products.filter(item => listSelected.includes(item.id))}
        products={products}
        setProducts={setProducts}
        callBackCancel={() => setIsEditProduct(!isEditProduct)}
        visible={isEditProduct}
        setIsEditProduct={setIsEditProduct}
        type={typeMethod}
        gotoPage={gotoPage}
      />
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
