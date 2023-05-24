import React, { useState, useEffect } from 'react';
import { SectionWrapper } from 'styles/commons';
import { GeneralStatisticWrapper } from '../../styles/OrderDetail';
import { isEmpty } from 'lodash';
import { Col, Skeleton } from 'antd';
import { BoxColor } from 'app/components';
import constants from 'assets/constants';
import { formatMoney } from 'utils/helpers';

export default function GeneralStatistic({ order }) {
  const isLoading = isEmpty(order);
  function emptyData(text = 'Hiện chưa có') {
    return <span className="value-empty">{text}</span>;
  }

  function getPaymentStatus() {
    const statusId =
      order.payment_status ||
      constants.ORDER_PAYMENT_STATUS[0].id.toLowerCase();
    const currentStatus = constants.ORDER_PAYMENT_STATUS.find(
      v => v.id.toLowerCase() === statusId,
    );
    return (
      <BoxColor
        className="status-payment"
        notBackground
        colorValue={currentStatus?.color}
      >
        {currentStatus?.name || ''}
      </BoxColor>
    );
  }

  function getTotalItemsPrice() {
    return order.order_items.reduce(
      (total, item) => total + item.quantity * item.retail_price,
      0,
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

  function getProfit() {
    return !order.fulfillment_status ||
      order.fulfillment_status === constants.ORDER_FULFILLMENT_STATUS.PENDING.id
      ? emptyData('Cần xác nhận')
      : formatMoney(order.total_retail_price - order.total_price || 0);
  }

  if (isLoading) {
    return (
      <GeneralStatisticWrapper gutter="26">
        <Col span={8}>
          <SectionWrapper className="statistic-item px-default box-df">
            <Skeleton active paragraph={{ rows: 1 }} />
          </SectionWrapper>
        </Col>
        <Col span={8}>
          <SectionWrapper className="statistic-item px-default box-df">
            <Skeleton active paragraph={{ rows: 1 }} />
          </SectionWrapper>
        </Col>
        <Col span={8}>
          <SectionWrapper className="statistic-item px-default box-df">
            <Skeleton active paragraph={{ rows: 1 }} />
          </SectionWrapper>
        </Col>
      </GeneralStatisticWrapper>
    );
  }

  return (
    <GeneralStatisticWrapper gutter="26">
      <Col span={8}>
        <SectionWrapper className="statistic-item px-default box-df">
          <div className="statistic-item__icon border-df">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.3271 8.17188L18.335 2.23438C18.1006 1.49219 17.3975 0.945312 16.5771 0.945312H11.0693V8.44531H20.3662C20.3662 8.36719 20.3662 8.25 20.3271 8.17188ZM9.81934 0.945312H4.27246C3.45215 0.945312 2.74902 1.49219 2.51465 2.23438L0.522461 8.17188C0.483398 8.25 0.483398 8.36719 0.483398 8.44531H9.81934V0.945312ZM0.444336 9.69531V19.0703C0.444336 20.125 1.26465 20.9453 2.31934 20.9453H18.5693C19.585 20.9453 20.4443 20.125 20.4443 19.0703V9.69531H0.444336Z"
                fill="#95ABC2"
              />
            </svg>
          </div>
          <div className="statistic-item__info">
            <label className="item-info__title font-df">Số lượng</label>
            <div className="item-info__value font-lg">
              {order.order_items.reduce(
                (total, item) => total + item.quantity,
                0,
              )}
            </div>
          </div>
        </SectionWrapper>
      </Col>
      <Col span={8} className="statistic-item-wrapper">
        <SectionWrapper className="statistic-item px-default box-df">
          <div className="statistic-item__icon border-df">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.4521 3.94531H3.56934C3.21777 3.94531 2.94434 3.67188 2.94434 3.32031C2.94434 3.00781 3.21777 2.69531 3.56934 2.69531H18.5693C18.8818 2.69531 19.1943 2.42188 19.1943 2.07031C19.1943 1.05469 18.335 0.195312 17.3193 0.195312H2.94434C1.53809 0.195312 0.444336 1.32812 0.444336 2.69531V15.1953C0.444336 16.6016 1.53809 17.6953 2.94434 17.6953H18.4521C19.5459 17.6953 20.4443 16.875 20.4443 15.8203V5.82031C20.4443 4.80469 19.5459 3.94531 18.4521 3.94531ZM16.6943 12.0703C15.9912 12.0703 15.4443 11.5234 15.4443 10.8203C15.4443 10.1562 15.9912 9.57031 16.6943 9.57031C17.3584 9.57031 17.9443 10.1562 17.9443 10.8203C17.9443 11.5234 17.3584 12.0703 16.6943 12.0703Z"
                fill="#68BF8D"
              />
            </svg>
          </div>
          <div className="statistic-item__info">
            <label className="item-info__title font-df">Thanh toán</label>
            <div className="item-info__value font-lg">
              {formatMoney(getTotalPrice())}
              {/* <span className="info-value__unit"> ₫</span> */}
            </div>
            {getPaymentStatus()}
          </div>
        </SectionWrapper>
      </Col>
      <Col span={8}>
        <SectionWrapper className="statistic-item px-default box-df">
          <div className="statistic-item__icon border-df">
            <svg
              width="20"
              height="20"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.444336 16.8047V18.4453C0.444336 19.8516 3.80371 20.9453 7.94434 20.9453C12.085 20.9453 15.4443 19.8516 15.4443 18.4453V16.8047C13.8037 17.9375 10.874 18.4453 7.94434 18.4453C4.97559 18.4453 2.0459 17.9375 0.444336 16.8047ZM12.9443 5.94531C17.085 5.94531 20.4443 4.85156 20.4443 3.44531C20.4443 2.07812 17.085 0.945312 12.9443 0.945312C8.80371 0.945312 5.44434 2.07812 5.44434 3.44531C5.44434 4.85156 8.80371 5.94531 12.9443 5.94531ZM0.444336 12.7031V14.6953C0.444336 16.1016 3.80371 17.1953 7.94434 17.1953C12.085 17.1953 15.4443 16.1016 15.4443 14.6953V12.7031C13.8037 14.0312 10.874 14.6953 7.94434 14.6953C4.97559 14.6953 2.0459 14.0312 0.444336 12.7031ZM16.6943 13.1328C18.9209 12.7031 20.4443 11.8828 20.4443 10.9453V9.30469C19.5068 9.92969 18.1787 10.3594 16.6943 10.6328V13.1328ZM7.94434 7.19531C3.80371 7.19531 0.444336 8.60156 0.444336 10.3203C0.444336 12.0781 3.80371 13.4453 7.94434 13.4453C12.085 13.4453 15.4443 12.0781 15.4443 10.3203C15.4443 8.60156 12.085 7.19531 7.94434 7.19531ZM16.499 9.42188C18.8428 8.99219 20.4443 8.17188 20.4443 7.19531V5.55469C19.0381 6.53125 16.6553 7.03906 14.1553 7.19531C15.2881 7.74219 16.1475 8.48438 16.499 9.42188Z"
                fill="#65A1C4"
              />
            </svg>
          </div>
          <div className="statistic-item__info">
            <label className="item-info__title font-df">Lợi nhuận từ đơn</label>
            <div className="item-info__value font-lg">
              {getProfit()}
              {/* <span className="info-value__unit"> ₫</span> */}
            </div>
          </div>
        </SectionWrapper>
      </Col>
    </GeneralStatisticWrapper>
  );
}
