import React, { useState, useEffect, useCallback, memo } from 'react';
import UpdateShippingProviderLazada from './UpdateShippingProviderLazada';
import UpdateShippingProviderShopee from './UpdateShippingProviderShopee';

export default memo(function UpdateShippingProvider({
  order,
  onCancel,
  onFinish,
}) {
  const contents = {
    shopee: () => (
      <UpdateShippingProviderShopee
        order={order}
        onCancel={onCancel}
        onFinish={onFinish}
      ></UpdateShippingProviderShopee>
    ),
    lazada: () => (
      <UpdateShippingProviderLazada
        order={order}
        onCancel={onCancel}
        onFinish={onFinish}
      ></UpdateShippingProviderLazada>
    ),
  };

  return contents[order.platform]();
});
