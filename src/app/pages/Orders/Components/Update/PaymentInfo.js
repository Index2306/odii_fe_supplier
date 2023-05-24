import React, { useState, useEffect } from 'react';
import { PaymentInfoWrapper } from '../../styles/OrderDetail';
import { isEmpty } from 'lodash';
import { BoxColor } from 'app/components';
import constants from 'assets/constants';
import { formatMoney } from 'utils/helpers';

export default function PaymentInfo({ order }) {
  const isLoading = isEmpty(order);

  function getStatus() {
    const statusId =
      order.payment_status ||
      constants.ORDER_PAYMENT_STATUS[0].id.toLowerCase();
    const currentStatus = constants.ORDER_PAYMENT_STATUS.find(
      v => v.id.toLowerCase() === statusId,
    );
    return (
      isEmpty(currentStatus) || (
        <BoxColor
          className="status-payment font-df"
          notBackground
          colorValue={currentStatus?.color}
        >
          {currentStatus?.name || ''}
        </BoxColor>
      )
    );
  }

  function normalizePaymentMethod(payment) {
    if (!payment) return '';
    return payment.replaceAll('_', ' ') || '';
  }

  function getPaymentType() {
    return order.payment_method === 'COD'
      ? `Thanh toán khi nhận hàng`
      : `${normalizePaymentMethod(order?.payment_method)}`;
  }

  function getTotalNum() {
    return order.order_items.reduce((total, item) => total + item.quantity, 0);
  }

  function getTotalItemsPrice() {
    return order.order_items.reduce(
      (total, item) => total + item.quantity * item.retail_price,
      0,
    );
  }

  function getTotalShipping() {
    return (
      parseFloat(order.total_shipping_fee || 0) -
      parseFloat(order.total_shipping_discount || 0)
    );
  }

  // function getTotalPrice() {
  //   return (
  //     parseFloat(getTotalItemsPrice()) +
  //     parseFloat(order.total_shipping_fee || 0) -
  //     parseFloat(order.total_shipping_discount || 0) -
  //     parseFloat(order.total_discount || 0)
  //   );
  // }

  function getTotalPrice() {
    return order?.total_retail_price;
  }

  return (
    !isLoading && (
      <PaymentInfoWrapper className="box-df">
        <div className="payment-title">
          <span className="section-title">Thanh toán</span>
          {getStatus()}
          {order?.platform && (
            <span className="payment-type">{getPaymentType()}</span>
          )}
        </div>
        <div className="payment-content">
          <div className="payment-content__top">
            <div className="content-top__item">
              <span>
                <span>{getTotalNum()}</span>
                <span>&nbsp; x Sản phẩm</span>
              </span>
              <span>{formatMoney(getTotalItemsPrice())}</span>
            </div>
            <div className="content-top__item">
              <span>Giảm giá</span>
              <span>{formatMoney(order.total_discount)}</span>
            </div>
            <div className="content-top__item">
              <span>Vận chuyển</span>
              <span>{formatMoney(getTotalShipping())}</span>
            </div>
            <div className="content-top__item">
              <span>Tổng giá trị đơn hàng</span>
              <span>{formatMoney(getTotalPrice())}</span>
            </div>
          </div>
          <div className="payment-content__bottom">
            <div className="content-bottom__item">
              <span>Đã thanh toán</span>
              <span>{formatMoney(getTotalPrice())}</span>
            </div>
            <div className="content-bottom__item">
              <span>Đã hoàn trả</span>
              <span>0 đ</span>
            </div>
            <div className="content-bottom__item">
              <span>Thực nhận</span>
              <span>{formatMoney(getTotalPrice())}</span>
            </div>
          </div>
        </div>
      </PaymentInfoWrapper>
    )
  );
}
