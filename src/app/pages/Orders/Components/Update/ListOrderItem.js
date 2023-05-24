import React, { useState, useEffect } from 'react';
import { ListOrderItemWrapper } from '../../styles/OrderDetail';
import { isEmpty } from 'lodash';
import { BoxColor, Image } from 'app/components';
import constants from 'assets/constants';
import { formatMoney } from 'utils/helpers';
import moment from 'moment';
import { Skeleton, Tooltip } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

export default function ListOrderItem({ order }) {
  const isLoading = isEmpty(order);

  const normalizeOrderItems = () => {
    return order?.order_items.filter(
      item => item.retail_price && item.quantity,
    );
  };

  const getSupplierPriceText = record => {
    let finalPrice = record?.origin_supplier_price;
    if (!isEmpty(record?.promotion)) {
      if (record?.promotion?.prtType === 'product_by') {
        finalPrice = record?.promotion?.finalPrice;
        return (
          <>
            <div className="">{formatMoney(finalPrice)}</div>
            <div
              style={{
                textDecoration: 'line-through',
                color: 'gray',
              }}
            >
              {formatMoney(record?.origin_supplier_price)}
            </div>
          </>
        );
      } else {
        return <div className="">{formatMoney(finalPrice)}</div>;
      }
    } else {
      return <div className="">{formatMoney(finalPrice)}</div>;
    }
  };

  function getStatus() {
    const statusId = order.fulfillment_status;
    const currentStatus =
      constants.ORDER_FULFILLMENT_STATUS[statusId?.toUpperCase()];

    return (
      currentStatus && (
        <BoxColor
          className="status-fulfill font-df"
          notBackground
          colorValue={currentStatus?.color}
        >
          {currentStatus?.name || ''}
        </BoxColor>
      )
    );
  }

  function formatDateStr(dateStr) {
    return moment(dateStr).format('HH:mm DD/MM/YYYY');
  }

  if (isLoading) {
    return (
      <ListOrderItemWrapper loading className="box-df">
        <Skeleton active paragraph={{ rows: 12 }} />
      </ListOrderItemWrapper>
    );
  }

  return (
    <ListOrderItemWrapper className="box-df">
      <div className="top-title px-default">
        <div className="top-title__left"></div>
        <div className="top-title__right">
          <span>Ngày tạo đơn: </span>
          <span>{formatDateStr(order.created_at)}</span>
        </div>
      </div>
      <div className="content-items border-df">
        <table className="order-item-tbl">
          <thead>
            <tr>
              <td>Sản phẩm</td>
              <Tooltip title="Giá nhà cung cấp bán cho seller">
                <td>Giá NCC</td>
              </Tooltip>
              <Tooltip title="Giá seller bán">
                <td>Giá bán</td>
              </Tooltip>
              <td>Số lượng</td>
              <Tooltip title="Tổng tiền đơn hàng">
                <td>Thành tiền</td>
              </Tooltip>
            </tr>
          </thead>
          <tbody>
            {normalizeOrderItems().map(item => {
              return (
                <tr>
                  <td>
                    <div>
                      <Image className="order-thumbnail" src={item.thumb} />
                      <div className="order-info-text">
                        <span>
                          <a
                            href={item.metadata?.product_detail_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Tooltip
                              title={
                                item?.is_low_price_order
                                  ? 'Sản phẩm bán phá giá'
                                  : item.metadata?.shop_product_name ||
                                    item.product_name
                              }
                            >
                              <span
                                style={{
                                  color: item?.is_low_price_order ? 'red' : '',
                                }}
                              >
                                {item.metadata?.shop_product_name ||
                                  item.product_name}
                              </span>
                            </Tooltip>
                          </a>
                        </span>
                        <span>
                          {item.shop_product_variation_id
                            ? `SKU: ${item.shop_product_variation_id}`
                            : 'Không có SKU'}
                        </span>
                        <span>
                          {item.metadata?.shop_variation_name ||
                            item.product_variation_name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{getSupplierPriceText(item)}</td>
                  <td>{formatMoney(item.retail_price)}</td>
                  <td>
                    <div className="text-center">{item.quantity}</div>
                  </td>
                  <td>
                    {formatMoney(item.retail_price * item.quantity)}
                    {item.qr_checked == item.quantity ? (
                      <div className="icon-check">
                        <CheckOutlined />
                      </div>
                    ) : (
                      item.qr_checked > 0 && (
                        <div className="icon-check">
                          <div className="number-check">{item.qr_checked}</div>
                        </div>
                      )
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ListOrderItemWrapper>
  );
}
