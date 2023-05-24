import React from 'react';
import { isEmpty } from 'lodash';
import { BoxColor } from 'app/components';
import styled from 'styled-components/macro';
import { SectionWrapper } from 'styles/commons';

export default function OrderStatus({ name, order, status }) {
  const isLoading = isEmpty(order);

  function getStatus() {
    const currentStatus = status ? status[order] : order;

    return (
      currentStatus &&
      (status ? (
        <BoxColor
          className="status-fulfill font-df"
          notBackground
          colorValue={currentStatus?.color}
          width={'100%'}
        >
          {currentStatus?.name}
        </BoxColor>
      ) : (
        <div>{currentStatus}</div>
      ))
    );
  }

  return (
    <OrderStatusWrapper className="box-df">
      <div className="order-info__top">
        <span className="section-title">{name}</span>
      </div>
      <div className="order-info_content">{getStatus()}</div>
    </OrderStatusWrapper>
  );
}

export const OrderStatusWrapper = styled(SectionWrapper)`
  .box-df {
    box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.05);
  }
  .order-info__top {
    display: flex;
    justify-content: space-between;
  }
  .order-info_content {
    align-items: center;
    // border: 1px solid #ebebf0;
    border-radius: 4px;
    // padding: 8px 11px;
    margin-top: 12px;
    // min-height: 40px;
  }
  .eqLlbs {
    width: 200px;
  }
`;
