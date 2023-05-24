import React, { useState, useEffect, useCallback, memo } from 'react';
import { Form, Input, Button } from 'app/components';
import Confirm from 'app/components/Modal/Confirm';

import { Modal, Row, Col, Spin, Radio } from 'antd';

import request from 'utils/request';
import styled from 'styled-components/macro';

export default memo(function UpdateShippingProviderLazada({
  order,
  onCancel,
  onFinish,
  // ...rest
}) {
  const orderId = order?.id;
  const updateShippingProvider = async () => {
    try {
      await request(`oms/supplier/orders/${orderId}/set-pack`, {
        method: 'put',
        data: { shipping_provider: 'B2B' },
      });
      onFinish();
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Confirm
      isFullWidthBtn
      isModalVisible={true}
      color="blue"
      title="Xác nhận đóng gói"
      data={{
        message: (
          <span>
            Bạn có chắc chắn muốn chuyển đơn hàng này
            <br /> về trạng thái đã đóng gói không?
          </span>
        ),
      }}
      handleConfirm={updateShippingProvider}
      handleCancel={onCancel}
    />
  );
});
