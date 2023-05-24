import React, { useState, useEffect } from 'react';
import { CustomerInfoWrapper } from '../../styles/OrderDetail';
import { isEmpty } from 'lodash';
import { Skeleton } from 'antd';

export default function CustomerInfo({ order }) {
  const isLoading = isEmpty(order);
  const emptyData = (text = 'Hiện chưa có') => (
    <span className="value-empty">{text}</span>
  );

  const isPersonalOrder = order => {
    return !order.shop_order_id;
  };

  const getShippingAddress = (order, separator = ', ') => {
    const address = order?.shipping_address;
    if (isPersonalOrder(order)) {
      return address?.address1 || '';
    }

    if (order.platform === 'shopee') {
      return address.full_address;
    }

    const addresParts = [
      address?.address1,
      address?.address5,
      address?.address4,
      address?.address3,
    ].filter(address => address);
    return addresParts.join(separator) || '';
  };

  if (isLoading) {
    return (
      <CustomerInfoWrapper loading className="box-df">
        <Skeleton active paragraph={{ rows: 12 }} />
      </CustomerInfoWrapper>
    );
  }

  return (
    <CustomerInfoWrapper className="box-df">
      <div className="customer-info__top">
        <div className="customer-top__title section-title">Khách hàng</div>
        <div className="customer-top__name">{order.customer_full_name}</div>
      </div>
      <div className="customer-info__center">
        {/* <div className="customer-center__item center-item__one">
          <div>
            <div>Lượt đăng hàng</div>
            <div>{emptyData}</div>
          </div>
          <div>
            <div>Tiền tích lũy</div>
            <div>{emptyData}</div>
          </div>
        </div> */}
        <div className="customer-center__item center-item__two">
          <div>
            <div>Email</div>
            <div className="customer-mail__value">
              {order.customer_email || emptyData('Không')}
            </div>
          </div>
          <div>
            <div>Điện thoại</div>
            {/* <div>**********</div> */}
            <div> {order.customer_phone || emptyData('Không')}</div>
          </div>
        </div>
      </div>
      <div className="customer-info__bottom">
        <div className="customer-bottom__title section-title">Giao hàng</div>
        <div className="customer-bottom__content">
          <div className="bottom-content__item">
            <div>Địa chỉ</div>
            <div>{getShippingAddress(order)}</div>
          </div>
          <div className="bottom-content__item">
            <div>Ghi chú</div>
            <div>{order.note || emptyData('Không có ghi chú')}</div>
          </div>
        </div>
      </div>
    </CustomerInfoWrapper>
  );
}
