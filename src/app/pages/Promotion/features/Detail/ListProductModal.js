import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  memo,
} from 'react';
import { Checkbox, Modal, Pagination, Table, Spin, Space, Tooltip } from 'antd';
import { Form, Button, BoxColor, Select, Input } from 'app/components';
import { Scrollbars } from 'react-custom-scrollbars';
import styled from 'styled-components/macro';
import { isEmpty, debounce } from 'lodash';
import request from 'utils/request';
import { genImgUrl, formatMoney } from 'utils/helpers';
import { useWarehousingSlice } from 'app/pages/Warehousing/slice';
import { useSelector, useDispatch } from 'react-redux';
import { selectData } from 'app/pages/Warehousing/slice/selectors';
import { SearchOutlined } from '@ant-design/icons';
import { usePromotionSlice } from '../../slice';

const { Option } = Select;

const PRODUCT_IMG_SIZE = 36;
const PAGE_SIZE = 10;
const SELECTED_COLUMN_INDEX = 0;
const PRICE_COLUMN_INDEX = 5;
const EXPANDED_COLUMN_INDEX = 6;

const SORT = [
  { id: '1', name: 'Mới nhất', fields: null },
  {
    id: '2',
    name: 'Giá thấp đến cao',
    fields: { order_by: 'min_price_variation', order_direction: 'asc' },
  },
  {
    id: '3',
    name: 'Giá cao đến thấp',
    fields: { order_by: 'min_price_variation', order_direction: 'desc' },
  },
];

const PUBLISH_STATUS = [
  { id: 'ready', name: 'Sẵn sàng', color: 'grayBlue' },
  {
    id: 'pending',
    name: 'Chờ duyệt',
    color: 'secondary2',
  },
  { id: 'active', name: 'Đang bán', color: 'greenMedium' },
];

const VARIATION_OPTIONS = [
  { fieldValue: 'Màu sắc', titleShowBefore: '' },
  { fieldValue: 'Kích cỡ', titleShowBefore: 'Size ' },
  { fieldValue: 'Kiểu dáng', titleShowBefore: '' },
];

const VARIATION_OPTION_FIELDS = ['option_2', 'option_1', 'option_3'];

export default memo(function ListProduct({
  selectedProducts,
  setselectedProducts,
  keywordFilter,
  setKeywordFilter,
  onCancel,
  data,
  gotoPage,
  ...rest
}) {
  const [isLoading, setLoading] = useState(false);
  const [productData, setProductData] = useState({});
  const [currProductLoadingId, setCurrProductLoadingId] = useState(null);
  const [form] = Form.useForm();
  const productTableContainer = useRef(null);
  const warehousingSlice = useWarehousingSlice();
  const listWarehousing = useSelector(selectData);
  const dispatch = useDispatch();
  const { actions } = usePromotionSlice();

  const selectedVariationMap = useMemo(() => {
    const variationIds = new Map();
    const productIds = new Map();
    const ids = new Map();
    selectedProducts.forEach(item => {
      variationIds.set(item?.variation_id, null);
      productIds.set(item?.product_id, null);
      ids.set(item?.variation_id, item?.id);
    });

    return { variationIds, productIds, ids };
  }, [selectedProducts]);

  const updateKeywordFiler = () => {
    form.setFieldsValue({ keyword: keywordFilter });
  };

  useEffect(() => {
    if (isEmpty(listWarehousing)) {
      dispatch(warehousingSlice.actions.getData());
    }
  }, [listWarehousing]);

  const changeFilter = useCallback(
    debounce(keyword => {
      if (keyword !== '' && keyword.length < 2) {
        return;
      }
      setKeywordFilter(keyword);
    }, 200),
    [],
  );

  const onCancelHandle = () => {
    setselectedProducts(selectedProducts.filter(item => item.id));
    onCancel();
  };

  useEffect(() => {
    updateKeywordFiler();
  }, []);

  useEffect(() => {
    const productTableContainerElement = productTableContainer.current;
    console.log(productTableContainerElement);
    if (productTableContainerElement) {
      setupRowEvents(productTableContainerElement);
    }
  }, [productData]);

  useEffect(() => {
    fetchProducts();
    setFilterDefault();
  }, [keywordFilter]);

  const handleOk = async () => {
    const variations = selectedProducts.filter(item => !item.id);
    if (!isEmpty(variations)) {
      await request(
        `user-service/supplier/promotion/${data.id}/promotion-product`,
        {
          method: 'post',
          data: { products: variations },
        },
      );
      dispatch(actions.getDetailDone({}));
      onCancel();
    } else {
      onCancel();
    }
  };

  const setupForceCloseExpandRow = tableElement => {
    const forceCloseTrs = tableElement.querySelectorAll('.force-close-expand');
    forceCloseTrs.forEach(forceCloseTr => {
      forceCloseTr?.previousElementSibling
        ?.querySelector('.expand-btn')
        ?.click();
    });
  };

  const setFilterDefault = () => {
    form.setFieldsValue({
      warehousing: '',
      publish_status: '',
      sort_id: '',
    });
  };

  const setupExpandRow = tableElement => {
    let availableExpandElements = tableElement.querySelectorAll(
      '.expand-onclick',
    );
    availableExpandElements = [
      ...availableExpandElements,
      ...tableElement.querySelectorAll(
        '.ant-table-row-expand-icon-cell .expand-btn',
      ),
    ];
    availableExpandElements.forEach(expandAvail => {
      const tdElement = expandAvail.parentNode;
      tdElement &&
        (tdElement.onclick = e => {
          if (e.target.className.includes('expand-btn')) {
            return;
          }
          tdElement.parentNode?.children[EXPANDED_COLUMN_INDEX]?.querySelector(
            '.expand-btn',
          )?.click();
        });
    });
  };

  const setupSelectedRow = tableElement => {
    const availableSelectedElements = tableElement.querySelectorAll(
      '.selected-onclick',
    );
    availableSelectedElements.forEach(selectedAvail => {
      const tdElement = selectedAvail.parentNode;
      tdElement &&
        (tdElement.onclick = e => {
          if (e.target.className.includes('ant-checkbox-input')) {
            return;
          }
          tdElement.parentNode?.children[SELECTED_COLUMN_INDEX]?.querySelector(
            '.ant-checkbox-input',
          )?.click();
        });
    });
  };

  const setupRowEvents = tableElement => {
    setupForceCloseExpandRow(tableElement);
    setupExpandRow(tableElement);
    setTimeout(() => setupSelectedRow(tableElement), 200);
  };

  const getProducReqUrl = pagination => {
    let url = 'product-service/supplier/products/listing';
    let queries = {
      page: pagination ? pagination.page : 0,
      page_size: PAGE_SIZE,
      ...form.getFieldsValue(),
    };
    const { sort_id } = queries;
    const sortFields = SORT.find(sort => sort.id === sort_id)?.fields;
    queries = { ...queries, ...(sortFields || {}) };
    delete queries.sort_id;
    const queryStrings = [];
    for (let attr in queries) {
      if (queries[attr]) {
        queryStrings.push(attr + '=' + queries[attr]);
      }
    }
    url += '?' + queryStrings.join('&');
    return url;
  };

  const fetchProducts = async params => {
    setLoading(true);
    const response = await request(getProducReqUrl(params), {
      method: 'get',
    });
    if (response.is_success) {
      setProductData({
        items: response.data,
        pagination: {
          ...response.pagination,
          current: response.pagination.page,
        },
      });
    }
    setLoading(false);
  };

  const onCheckProduct = (product, isChecked) => {
    if (isChecked) {
      const newProd = {
        productId: product?.id,
        productName: product?.name,
        sku: product?.sku,
        thumb: product?.thumb,
      };

      setselectedProducts([
        ...selectedProducts,
        {
          variation: newProd,
          status: 'active',
          product_id: product?.id,
          variation_id: product?.variations[0]?.id,
          origin_supplier_price: product?.min_price_variation,
          option: [{ value: 0, quantity_form: 0, quantity_to: 0 }],
        },
      ]);
    } else if (
      isEmpty(selectedVariationMap.ids.get(product?.variations[0]?.id))
    ) {
      setselectedProducts(
        selectedProducts.filter(
          selectedVariation => selectedVariation?.product_id !== product?.id,
        ),
      );
    }
  };

  const onCheckVariation = (variation, isChecked) => {
    if (isChecked) {
      const newVariation = {
        ...variation,
        quantity: 1,
      };

      setselectedProducts([
        ...selectedProducts,
        {
          variation: newVariation,
          status: 'active',
          product_id: variation?.productId,
          variation_id: variation?.id,
          name_option: variation.name,
          origin_supplier_price: variation?.price,
          option: [{ value: 0, quantity_form: 0, quantity_to: 0 }],
        },
      ]);
    } else if (isEmpty(selectedVariationMap.ids.get(variation?.id))) {
      setselectedProducts(
        selectedProducts.filter(
          selectedVariation =>
            selectedVariation?.product_id !== variation?.productId ||
            selectedVariation?.variation?.id !== variation?.id,
        ),
      );
    }
  };

  const hasVariation = product => {
    return product?.has_variation && product?.number_of_variation > 0;
  };

  const isOutOfStock = product => {
    return (
      (product?.quantity ?? product?.total_quantity < 1) &&
      product?.supplier_product_publish_status === 'inactive'
    );
  };

  const fetchProductVariations = async productId => {
    const currProductIndex = productData.items.findIndex(
      product => product?.id === productId,
    );
    const currProduct = productData?.items?.[currProductIndex];
    const optionInfos = {};
    VARIATION_OPTION_FIELDS.forEach(field => {
      let optionInfo = null;
      const productOptionValue = currProduct[field];
      if (currProduct[field]) {
        optionInfo = VARIATION_OPTIONS.find(
          option => option.fieldValue === productOptionValue,
        );
      }
      if (optionInfo) {
        optionInfos[field] = optionInfo;
      }
    });

    if (
      currProduct &&
      (currProduct?.number_of_variation === 0 || currProduct?.childrens)
    ) {
      return;
    }
    setCurrProductLoadingId(productId);
    const response = await request(
      `/product-service/supplier/products/${productId}/variations`,
      {
        method: 'get',
      },
    );

    if (response.is_success) {
      const currProductClone = { ...currProduct };
      const childrens = [];
      response.data.forEach(variation => {
        const variations = [];
        for (let attr in optionInfos) {
          if (variation[attr]) {
            let variationValue = variation[attr];
            variationValue =
              variationValue[0]?.toUpperCase() + variationValue.substring(1);
            variations.push(optionInfos[attr].titleShowBefore + variationValue);
          }
        }
        const variationName = variations.join(' - ');
        const children = {
          key: variation?.id,
          id: variation?.id,
          product_variation_id: variation?.product_variation_id,
          name: variationName,
          productId: productId,
          productName: currProduct?.name,
          sku: variation?.sku,
          price: variation?.origin_supplier_price || variation?.retail_price,
          thumb: variation?.thumb,
          total_quantity: variation?.total_quantity,
          is_promotion: variation?.is_promotion,
        };
        childrens.push(children);
      });
      currProductClone.childrens = childrens;
      const productItemsClone = [...productData.items];
      productItemsClone[currProductIndex] = currProductClone;
      setProductData({ ...productData, items: productItemsClone });
    }
    setCurrProductLoadingId(null);
  };

  const productColumns = [
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: 56,
      render: (text, record) => {
        const $hasVariation = hasVariation(record);
        const $isOutOfStock = isOutOfStock(record);
        return (
          <Checkbox
            className={
              $hasVariation && !$isOutOfStock
                ? 'expand-onclick'
                : $isOutOfStock
                ? 'aria-disabled'
                : 'selected-onclick'
            }
            aria-disabled={
              $hasVariation ||
              $isOutOfStock ||
              !isEmpty(selectedVariationMap.ids.get(record?.variations[0]?.id))
            }
            checked={selectedVariationMap.productIds.has(record.id)}
            onChange={e =>
              !$hasVariation && onCheckProduct(record, e.target.checked)
            }
          ></Checkbox>
        );
      },
    },
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      width: 270,
      render: (text, record) => {
        const $hasVariation = hasVariation(record);
        const $isOutOfStock = isOutOfStock(record);
        return (
          <div
            className={`product-name-wrapper ${
              $hasVariation && !$isOutOfStock
                ? 'expand-onclick'
                : $isOutOfStock
                ? 'aria-disabled'
                : 'selected-onclick'
            }`}
          >
            <img
              alt=""
              className="product-image"
              src={genImgUrl({
                location: record?.thumb?.location,
                width: PRODUCT_IMG_SIZE,
                height: PRODUCT_IMG_SIZE,
              })}
            ></img>
            <div className="product-name__text">
              <Tooltip
                // mouseEnterDelay={0.25}
                placement="bottomLeft"
                title={text}
              >
                <div className="product-name">{text}</div>
              </Tooltip>
              <div className="product-sku">{record.sku}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'publish_status',
      key: 'publish_status',
      width: 120,
      render: (text, record) => {
        const $hasVariation = hasVariation(record);
        const $isOutOfStock = isOutOfStock(record);
        const publishStatus = PUBLISH_STATUS.find(status => status.id === text);
        return (
          <div
            className={
              $hasVariation && !$isOutOfStock
                ? 'expand-onclick'
                : $isOutOfStock
                ? 'aria-disabled'
                : 'selected-onclick'
            }
          >
            {publishStatus && (
              <BoxColor
                className="fulfillment-status font-df"
                notBackground
                colorValue={publishStatus?.color}
              >
                {publishStatus?.name}
              </BoxColor>
            )}
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'supplier_warehousing',
      key: 'supplier_warehousing',
      width: 200,
      render: (text, record) => {
        const $hasVariation = hasVariation(record);
        const $isOutOfStock = isOutOfStock(record);
        return (
          <div
            className={
              $hasVariation && !$isOutOfStock
                ? 'expand-onclick'
                : $isOutOfStock
                ? 'aria-disabled'
                : 'selected-onclick'
            }
          >
            <div className="product-name__text">
              <div className="product-sku">
                {record?.supplier_warehousing?.name || ''}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'number_of_variation',
      key: 'number_of_variation',
      width: 115,
      render: (text, record) => {
        const $hasVariation = hasVariation(record);
        const $isOutOfStock = isOutOfStock(record);
        return (
          <div
            className={`product-variations-number ${
              $hasVariation && !$isOutOfStock
                ? 'expand-onclick'
                : $isOutOfStock
                ? 'aria-disabled'
                : 'selected-onclick'
            }`}
          >
            {$isOutOfStock ? (
              <span className="out-of-stock">Hết hàng</span>
            ) : $hasVariation ? (
              <>
                <span>{text}</span>&nbsp; biến thể
              </>
            ) : (
              <span className="no-variation">0 biến thể</span>
            )}
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'min_price_variation',
      key: 'min_price_variation',
      width: 130,
      render: (text, record) => {
        const $hasVariation = hasVariation(record);
        const $isOutOfStock = isOutOfStock(record);
        return (
          <div
            className={`product-min-price ${
              $hasVariation && !$isOutOfStock
                ? 'expand-onclick'
                : $isOutOfStock
                ? 'aria-disabled'
                : 'selected-onclick'
            }`}
          >
            {formatMoney(text)}
          </div>
        );
      },
    },
  ];

  const variationColumns = [
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: 30,
      render: (text, record) => {
        const $isOutOfStock = isOutOfStock(record);
        return (
          <Checkbox
            aria-disabled={
              $isOutOfStock ||
              !isEmpty(selectedVariationMap.ids.get(record?.id))
            }
            className={$isOutOfStock ? 'aria-disabled' : 'selected-onclick'}
            checked={selectedVariationMap.variationIds.has(record.id)}
            onChange={e => onCheckVariation(record, e.target.checked)}
          ></Checkbox>
        );
      },
    },
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (text, record) => {
        const $isOutOfStock = isOutOfStock(record);
        return (
          <span
            className={$isOutOfStock ? 'aria-disabled' : 'selected-onclick'}
          >
            {text}
            {$isOutOfStock && (
              <span className="out-of-stock variation-out-of-stock">
                Hết hàng
              </span>
            )}
          </span>
        );
      },
    },
    {
      title: '',
      dataIndex: 'sku',
      key: 'sku',
      width: 300,
      render: (text, record) => {
        const $isOutOfStock = isOutOfStock(record);
        return (
          <div
            className={`variation-sku ${
              $isOutOfStock ? 'aria-disabled' : 'selected-onclick'
            }`}
          >
            {text || 'Không có SKU'}
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'price',
      key: 'price',
      // width: 200,
      render: (text, record) => {
        const $isOutOfStock = isOutOfStock(record);
        return (
          <div
            className={`variation-price ${
              $isOutOfStock ? 'aria-disabled' : 'selected-onclick'
            }`}
          >
            {formatMoney(text)}
          </div>
        );
      },
    },
  ];

  const modalFooter = (
    <div className="modal-footer-wrapper">
      <Pagination
        hideOnSinglePage
        showSizeChanger={false}
        {...productData.pagination}
        className="footer-pagination"
        onChange={(page, pageSize) => {
          fetchProducts({ page, pageSize });
        }}
      ></Pagination>
      <div className="footer-action">
        <Space size={14}>
          <Button
            disabled={isLoading}
            className="btn-cancel btn-sm"
            color="grayBlue"
            width="60px"
            onClick={onCancelHandle}
          >
            Hủy
          </Button>
          <Button className="btn-sm p-0" width="100px" onClick={handleOk}>
            Đồng ý
          </Button>
        </Space>
      </div>
    </div>
  );

  return (
    <ListProductModal
      title="Chọn sản phẩm khuyến mại"
      transitionName=""
      width={920}
      footer={modalFooter}
      onCancel={onCancelHandle}
      {...rest}
    >
      <Spin spinning={isLoading && !productData.items}>
        <ListProductWrapper className="box-df">
          <div className="products-toolbar-top">
            <Form name="products-toolbar-top" form={form}>
              <div className="products-toolbar">
                <div className="filter-input-wrapper">
                  <Form.Item
                    name="keyword"
                    rules={[
                      {
                        min: 2,
                        message: `Nội dung tìm kiếm ít nhất ${2} kí tự`,
                      },
                    ]}
                  >
                    <Input
                      placeholder="Tìm sản phẩm theo tên"
                      className="filter-input"
                      size="medium"
                      prefix={<SearchOutlined />}
                      onChange={e => {
                        changeFilter(e.target.value);
                      }}
                    />
                  </Form.Item>
                </div>
                <div className="product-top-right">
                  <div className="product-filter-wrapper">
                    <Form.Item name="warehousing">
                      <Select
                        className="warehousing-select"
                        onChange={fetchProducts}
                      >
                        <Option key="" value="">
                          Kho lấy hàng
                        </Option>
                        {listWarehousing.map(item => (
                          <Option key={item.id} value={item.value}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="product-sort-wrapper">
                    <Form.Item name="sort_id">
                      <Select className="sort-select" onChange={fetchProducts}>
                        <Option key="" value="">
                          Sắp xếp
                        </Option>
                        {SORT.map(sort => (
                          <Option key={sort.id} value={sort.id}>
                            {sort.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Form>
          </div>
          <Scrollbars
            autoHide
            autoHideTimeout={300}
            autoHideDuration={300}
            heightRelativeToParent="100%"
            style={{ height: 'calc(100% - 50px)' }}
          >
            <div ref={productTableContainer}>
              <Table
                className="product-tbl"
                columns={productColumns}
                dataSource={productData.items}
                pagination={false}
                rowKey={record => record.id}
                expandable={{
                  rowExpandable: record => hasVariation(record),
                  expandIconColumnIndex: EXPANDED_COLUMN_INDEX,
                  expandedRowClassName: record => {
                    return !record.childrens ? 'force-close-expand' : '';
                  },
                  columnWidth: 0,
                  expandedRowRender: (record, expanded) => {
                    if (record.id === currProductLoadingId) {
                      return (
                        <span className="variation-desc">Đang tải ...</span>
                      );
                    }
                    return isEmpty(record?.childrens) && !isLoading ? (
                      <span className="variation-desc">Không có biến thể</span>
                    ) : (
                      <Table
                        className="variation-tbl"
                        columns={variationColumns}
                        pagination={false}
                        dataSource={record?.childrens || []}
                      />
                    );
                  },
                  expandIcon: ({ expanded, onExpand, record }) =>
                    hasVariation(record) ? (
                      <i
                        className={`expand-icon expand-btn fa fa-chevron-down ${
                          expanded ? 'expaned' : ''
                        }`}
                        onClick={e => {
                          fetchProductVariations(record.id);
                          onExpand(record, e);
                        }}
                      />
                    ) : (
                      <span className="selected-onclick"></span>
                    ),
                }}
              />
            </div>
          </Scrollbars>
        </ListProductWrapper>
      </Spin>
    </ListProductModal>
  );
});

export const ListProductModal = styled(Modal)`
  top: 50%;
  transform: translateY(-50%) !important;
  height: calc(100% - 2 * 87px);
  .ant-modal-content {
    height: 100%;
  }
  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
  }
  .ant-spin-nested-loading > div > .ant-spin {
    min-height: unset;
  }
  .ant-modal-header {
    position: relative;
    height: 55px;
    padding: 0 24px;
    display: flex;
    align-items: center;
  }
  .ant-modal-body {
    height: calc(100% - 53px - 55px);
    padding: 0;
  }
  .ant-modal-footer {
    background: #fff;
    margin-top: 12px;
    padding: 15px 25px;
    z-index: 2;
    position: relative;
    min-height: 57px;
  }
  .modal-footer-wrapper {
    display: flex;
    line-height: 1;
  }
  .footer-pagination {
    /* margin-left: auto; */
    .ant-pagination-item-link {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .ant-pagination-item-link,
    .ant-pagination-item {
      border-radius: 4px;
      font-family: 'Roboto';
    }
    .ant-pagination-item-active {
      background: #435ebe;
      font-weight: 400;
      border-color: #435ebe;
      a {
        color: #fff;
      }
    }
  }
  .footer-action {
    margin-left: auto;
  }

  .search-external-wrapper {
    color: ${({ theme }) => theme.darkBlue1};
    position: absolute;
    top: 0;
    left: 215px;
    /* transform: translateX(-50%); */
    height: 55px;
    display: flex;
    align-items: center;
    .search-external {
      position: relative;
      padding-left: 18px;
      cursor: pointer;
      :after {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        height: 20px;
        width: 1px;
        transform: translateY(-50%);
        background: #ebebf0;
      }
    }
  }
`;

const ListProductWrapper = styled.div`
  height: 100%;
  .ant-select-lg {
    font-size: 14px;
  }
  .ant-select-single.ant-select-lg:not(.ant-select-customize-input):not(.ant-select-customize-input)
    .ant-select-selection-search-input,
  .ant-select-single.ant-select-lg,
  .ant-select-single.ant-select-lg:not(.ant-select-customize-input)
    .ant-select-selector {
    height: 36px !important;
  }
  .ant-select-single.ant-select-lg:not(.ant-select-customize-input)
    .ant-select-selector
    .ant-select-selection-item {
    line-height: 36px;
  }
  .ant-select-selection-placeholder {
    color: ${({ theme }) => theme.text};
    line-height: 36px;
  }
  .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: 0;
  }
  .ant-checkbox-inner {
    border-radius: 4px;
  }
  .ant-checkbox-checked {
    &:after {
      border: none;
    }
    & > .ant-checkbox-inner {
      background-color: ${({ theme }) => theme.primary};
      border-color: transparent;
      border-radius: 4px;
    }
  }
  .ant-checkbox-wrapper {
    color: ${({ theme }) => theme.primary};
  }
  .ant-checkbox + span {
    padding-right: 0;
    padding-left: 7px;
    color: ${({ theme }) => theme.grayBlue};
  }
  .products-toolbar-top {
    padding: 20px 25px;
    border-bottom: 1px solid #ebebf0;
    .ant-form-item {
      margin-bottom: 0;
    }
    .ant-form-item-explain {
      position: absolute;
      top: 100%;
    }
  }
  .filter-input-wrapper {
    position: relative;
    .filter-input {
      border: 1px solid #ebebf0;
      border-radius: 4px;
      width: 270px;
      height: 36px;
    }
  }
  .products-toolbar {
    display: flex;
    .product-top-right {
      display: flex;
      margin-left: auto;
      .platform-select {
        width: 137px;
      }
      .ant-select-selector {
        box-shadow: none !important;
      }
      .product-filter-wrapper {
        display: flex;
        & > div .ant-select-selector {
          border-radius: 0 !important;
        }
        & > div:not(:last-child) .ant-select-selector {
          border-right: none;
        }
        & > div:first-child .ant-select-selector {
          border-radius: 4px 0px 0px 4px !important;
        }
        & > div:last-child .ant-select-selector {
          border-radius: 0 4px 4px 0 !important;
        }
      }
      .product-sort-wrapper {
        margin-left: 14px;
      }
      .store-select {
        width: 136px;
      }
      .publish-status-select {
        width: 110px;
      }
      .sort-select {
        width: 135px;
      }
    }
  }

  .ant-spin-nested-loading,
  .ant-spin-container,
  .ant-table-wrapper,
  .ant-table-container {
    height: 100%;
  }
  .ant-table-expanded-row {
    background: #fafafa;
  }

  .product-tbl {
    label.aria-disabled {
      pointer-events: none;
      cursor: not-allowed;
    }
    cursor: pointer;
    .float-right {
      text-align: right;
    }
    .ant-table-placeholder .ant-table-cell {
      border-bottom: none;
    }
    .ant-table-tbody > tr.ant-table-row:hover > td {
      background: #fff;
    }
    .ant-table-tbody > tr > td:first-child {
      padding-left: 25px;
      padding-right: 15px;
    }
    .ant-table-tbody > tr > td:nth-child(${PRICE_COLUMN_INDEX + 1}) {
      padding-right: 25px;
    }
    .ant-table-tbody > tr > td:nth-child(2) {
      padding-left: 0;
    }
    .ant-table-thead > tr > td:nth-child(${EXPANDED_COLUMN_INDEX + 1}),
    .ant-table-tbody > tr > td:nth-child(${EXPANDED_COLUMN_INDEX + 1}) {
      display: none;
    }
    .ant-table-thead {
      display: none;
    }
    .ant-table-body {
      overflow-y: auto !important;
      height: 100%;
    }
    table {
      width: 100% !important;
      margin-bottom: 55px;
    }
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
    .product-min-price,
    .product-variations-number {
      text-align: right;
      word-break: keep-all;
    }
    .product-min-price {
      color: ${({ theme }) => theme.orange};
    }
    .expand-icon {
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f3f3f3;
      border-radius: 100%;
      cursor: pointer;
      transition: all ease-out 0.25s;
      &.expaned {
        transform: rotate(-90deg);
      }
    }
    .variation-desc {
      color: ${({ theme }) => theme.gray3};
    }
    .ant-table-row.ant-table-row-level-0 .ant-table-expanded-row {
      position: relative;
      &:before {
        content: '';
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        background: red;
      }
    }
    .no-variation,
    .count-zero {
      color: #bbb;
    }
    .out-of-stock {
      color: red;
      background: #ffe4e4;
      padding: 1.5px 5px;
      border-radius: 4px;
      font-size: 12px;
    }
    .variation-out-of-stock {
      margin-left: 7px;
    }
    .count-non-zero {
      color: #3b6aff;
    }
    .store-platform {
      display: flex;
      align-items: center;
      .store-platform__icon {
        height: 14px;
        width: 14px;
      }
      .store-platform__name {
        word-break: keep-all;
        margin-left: 6px;
        color: ${({ theme }) => theme.primary};
      }
    }
    .store-info_content {
      display: flex;
      align-items: center;
      .store-icon {
        border-radius: 100%;
        flex-grow: 1;
        flex-shrink: 0;
        width: 16px;
        height: 16px;
        border: 1px solid rgb(225, 225, 225);
      }
      .store-name {
        margin-left: 5px;
        line-height: 1.3;
      }
    }
    .fulfillment-status {
      width: unset;
      word-break: keep-all;
    }
  }
  .variation-tbl {
    margin: 0;
    .ant-table-container {
      background: #fafafa;
    }
    .ant-table-tbody > tr.ant-table-row:hover > td {
      background: #fafafa;
    }
    table {
      margin-bottom: 0 !important;
    }
    .ant-table {
      margin-left: 0 !important;
    }

    .ant-table-tbody > tr > td:first-child {
      padding-left: 0;
    }
    .ant-table-thead {
      display: none;
    }
    .variation-sku {
      font-size: 12px;
      text-align: right;
      color: ${({ theme }) => theme.gray3};
      text-align: left;
    }
    .variation-price {
      text-align: right;
      padding-right: 10px;
    }
  }
`;
