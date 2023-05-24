import React, { useMemo, useEffect, useState } from 'react';
import { Row, Col, Spin, Table, Tooltip } from 'antd';
import { BoxColor, Button } from 'app/components';
import { CustomH3 } from 'styles/commons';
import { FilterBarDiscount } from './index';
import { formatMoney } from 'utils/helpers';
import {
  selectDataListDiscount,
  selectPaginationListDiscount,
} from '../slice/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { usePromotionSlice } from '../slice';
import Confirm from 'app/components/Modal/Confirm';
import { tooltip } from 'assets/images/dashboards';
import styled from 'styled-components';

export const DEFAULT_FILTER = {
  page: 1,
  page_size: 10,
  keyword: '',
  payment_status: '',
};

export default function ListDiscount({
  isLoading,
  promotionId,
  typeQuantity,
  typeProduct,
}) {
  const { actions } = usePromotionSlice();
  const dispatch = useDispatch();
  const data = useSelector(selectDataListDiscount);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [isShow, setIsShow] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataPrt, setDataPrt] = useState([]);
  const pagination = useSelector(selectPaginationListDiscount);

  const updateFilter = data => {
    const values = {
      ...filter,
      ...data,
    };
    setFilter(values);
  };

  useEffect(() => {
    const result = data.filter(item => item.payment_status === 'pending');
    if (typeQuantity && result.length > 1) {
      setIsShow(true);
    }
  }, [data]);

  useEffect(() => {
    const delaySecond = 60000;
    let reloadPageInterval;
    let reloadPageTimeout;
    reloadPageTimeout = setTimeout(() => {
      reloadPageInterval = setInterval(() => {
        fetchData();
      }, delaySecond);
    }, delaySecond);
    return () => {
      clearInterval(reloadPageInterval);
      clearTimeout(reloadPageTimeout);
    };
  }, []);

  const getRowAction = record => {
    return (
      <Button className="btn-sm" onClick={() => handleOkPayout(record)}>
        <Tooltip
          placement="top"
          title="Lưu ý Thanh toán Chiết khấu sau 5 ngày chương trình Khuyến mại hết hiệu lực."
        >
          Thanh toán
        </Tooltip>
      </Button>
    );
  };

  const fetchData = () => {
    const queryParams = Object.keys(filter).reduce((values, key) => {
      const value = filter[key];
      if (value !== '') {
        values.push(`${[key]}=${value}`);
      }
      return values;
    }, []);
    let querySearch = queryParams.join('&');
    querySearch = querySearch && `?${querySearch}`;

    dispatch(
      actions.getDataListDiscount({
        id: promotionId,
        param: querySearch,
      }),
    );
  };

  function getStatus(status, title) {
    let name;
    let color;
    if (status === 'confirmed') {
      name = 'Đã';
      color = 'green';
    } else {
      name = 'Chờ';
    }

    return (
      <BoxColor colorValue={color} width={'100%'}>
        {name} {title}
      </BoxColor>
    );
  }

  const handleOkPayout = record => {
    let result = [];
    if (record) {
      result.push(record);
    } else {
      result = data.filter(item => item.payment_status === 'pending');
    }
    setDataPrt(result);
    setIsModalVisible(true);
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const getSupplierPromotionValue = record => {
    if (
      record?.promotion?.type === 'quantity_by' ||
      record?.type === 'percent'
    ) {
      return <>{record?.value} %</>;
    } else {
      return formatMoney(record?.value);
    }
  };

  const onChangeTable = pagination => {
    updateFilter({
      page: pagination.current,
      page_size: pagination.pageSize,
    });
  };

  const columns = useMemo(
    () => [
      {
        title: (
          <div className="custom-header">
            <div className="title-box">STT</div>
          </div>
        ),
        dataIndex: 'stt',
        width: 50,
        align: 'center',
        key: 'stt',
        render: (_text, record, index) => {
          return <>{index + 1}</>;
        },
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Seller</div>
          </div>
        ),
        dataIndex: 'full_name',
        width: 100,
        key: 'full_name',
        render: (_text, record) => {
          return <>{record?.user?.full_name}</>;
        },
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Tên sản phẩm</div>
          </div>
        ),
        dataIndex: 'productName',
        width: 130,
        key: 'productName',
        align: 'left',
        render: (_text, record) => (
          <div className="product-name">
            <Tooltip
              placement="top"
              title={`${record?.product_name} (${
                record?.product_variation_name || ''
              })`}
            >
              {record?.product_name} ({record?.product_variation_name || ''})
            </Tooltip>
          </div>
        ),
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Giá NCC</div>
          </div>
        ),
        dataIndex: 'origin_supplier_price',
        width: 90,
        key: 'origin_supplier_price',
        align: 'center',
        render: (_text, record) => formatMoney(record?.origin_supplier_price),
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Số lượng</div>
          </div>
        ),
        dataIndex: 'quantity',
        width: 70,
        key: 'quantity',
        align: 'center',
        render: (_text, record) => record?.quantity,
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">
              {typeProduct ? 'Giảm giá' : 'Chiết khấu'}
            </div>
          </div>
        ),
        dataIndex: 'discount',
        width: 90,
        key: 'discount',
        align: 'center',
        render: (_text, record) => getSupplierPromotionValue(record),
      },
      {
        title: (
          <div className="custom-header">
            <Tooltip
              placement="top"
              title={
                typeProduct ? 'Thành tiền giảm giá' : 'Thành tiền Chiết khấu'
              }
            >
              <div className="title-box">
                {typeProduct ? 'TT giảm giá' : 'TT Chiết khấu'}
              </div>
            </Tooltip>
          </div>
        ),
        dataIndex: 'supplier_promition_amount',
        width: 100,
        key: 'supplier_promition_amount',
        align: 'center',
        render: (_text, record) => formatMoney(record.total_amount),
      },
      {
        title: (
          <div className="custom-header">
            <Tooltip placement="top" title="Trạng thái thanh toán">
              <div className="title-box">TT thanh toán</div>
            </Tooltip>
          </div>
        ),
        dataIndex: 'supplier_promition_amount',
        width: 120,
        key: 'supplier_promition_amount',
        align: 'center',
        render: (_text, record) => (
          <>
            <div>{getStatus(record?.payment_status, 'thanh toán')}</div>
            {record?.payment_status?.includes('pending') && typeQuantity && (
              <div className="action-wrapper">{getRowAction(record)}</div>
            )}
          </>
        ),
      },
    ],
    [data],
  );

  const pageContent = (
    <>
      <CustomH3 className="title text-left" mb={{ xs: 's5' }}>
        <FilterBarDiscount
          filter={filter}
          updateFilter={updateFilter}
          isLoading={isLoading}
          handleOkPayout={() => handleOkPayout()}
          isShow={isShow}
        />
      </CustomH3>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Row guiter={24}>
          <Col span={24}>
            <CustomTable
              className="costom"
              columns={columns}
              dataSource={data}
              searchSchema={{
                keyword: {
                  required: false,
                },
                payment_status: {
                  required: false,
                },
              }}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                hideOnSinglePage: true,
              }}
              onChange={onChangeTable}
              scroll={{ x: 900, y: 1000 }}
              rowKey={record => record.id}
            />
          </Col>
        </Row>
      </Spin>
      {isModalVisible && (
        <Confirm
          key="paymentDiscount"
          isFullWidthBtn
          isModalVisible={isModalVisible}
          color="blue"
          title="Xác nhận"
          data={{
            message: `Bạn có đồng ý thanh toán chiết khấu không!`,
          }}
          handleConfirm={() => {
            dispatch(
              actions.updatePayoutPromotion({
                id: promotionId,
                data: { arrPromotion: dataPrt },
                onSuccess: () => {
                  fetchData();
                },
              }),
            );
            setIsModalVisible(false);
          }}
          handleCancel={() => setIsModalVisible(false)}
        />
      )}
    </>
  );

  return <>{pageContent}</>;
}

const CustomTable = styled(Table)`
  .product-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
  }
`;
