import React, { memo } from 'react';
import { CustomStyle } from 'styles/commons';
// import { useSelector, useDispatch } from 'react-redux';
import {
  newOrder,
  processOrder,
  lowInventory,
  denyIcon,
} from 'assets/images/dashboards';
import BoxList from 'app/components/BoxList';
// import { selectListStores } from '../slice/selectors';

const dataOrder = [
  {
    icon: newOrder,
    title: 'Đơn chờ xử lý',
    total: 'order_pending',
    hint: 'Số lượng đơn hàng mới',
    link: '/orders?odii_status=2&fulfillment_status=seller_confirmed',
  },
  {
    icon: processOrder,
    title: 'Đơn chờ lấy hàng',
    total: 'order_awaiting_collection',
    hint: 'Số lượng đơn hàng đang được tiến hành',
    link: '/orders?odii_status=3',
  },
  {
    icon: lowInventory,
    title: 'Sản phẩm tồn kho thấp',
    total: 'total_low_inventory',
    hint: 'Số lượng đơn hàng đã hoàn thành',
    link: '/products?status=active&publish_status=active&quantity=low',
  },
  {
    icon: denyIcon,
    title: 'Sản phẩm từ chối duyệt',
    total: 'product_rejected',
    hint: 'Số lượng đơn hàng đã bị hủy',
    colorBox: '#EB5757',
    link:
      '/products?page=1&page_size=10&status=inactive&publish_status=rejected',
  },
];

export default memo(function ImportantWork(props) {
  return (
    <CustomStyle style={{ marginBottom: 24.49 }}>
      <BoxList
        initData={dataOrder}
        data={props.data}
        title="Việc cần làm"
        row="row"
      />
    </CustomStyle>
  );
});
