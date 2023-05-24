import React, { useState, useEffect, useRef, memo } from 'react';
import { Modal, Spin } from 'antd';
import { Progress } from 'antd';
import request from 'utils/request';
import styled from 'styled-components/macro';
import notification from 'utils/notification';

const SHIPPING_TYPE_DROP_OFF = 'SHIPPING_TYPE_DROP_OFF';
const SHIPPING_TYPE_PICKUP_STEP_1 = 'SHIPPING_TYPE_PICKUP_STEP_1';
const SHIPPING_TYPE_PICKUP_STEP_2 = 'SHIPPING_TYPE_PICKUP_STEP_2';

export default memo(function BatchActionProgress({
  visible,
  action_type,
  items,
  onCompleted,
  metadata,
}) {
  const [isProgressing, setProgressing] = useState(false);
  const [executedNum, setExecutedNum] = useState(0);
  const totalNum = items?.length;

  useEffect(() => {
    console.log('BatchActionProgress', visible, items);
    if (visible && items && items.length > 0) {
      handleProgress();
    }
  }, []);

  // const updateShippingProvider = async order => {
  //   const orderId = parseInt(order.id);
  //   try {
  //     await request(`oms/supplier/orders/${orderId}/set-pack`, {
  //       method: 'put',
  //       data: { shipping_provider: 'B2B' },
  //     });
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // };

  const handleProgress = async () => {
    console.log('handleProgress');
    setProgressing(true);
    for (let item of items) {
      if (action_type === 'update_packing') {
        const res = await request(`oms/supplier/orders/${item.id}/set-pack`, {
          method: 'put',
          data: { shipping_provider: 'B2B' },
        });
        console.log('update pack res', res);
      } else if (action_type === 'ready_toship') {
        const res = await request(`oms/supplier/orders/${item.id}/set-rts`, {
          method: 'put',
        });
        console.log('update lazada rst', res);
      } else if (action_type === 'shopee_update_packing' && metadata) {
        if (metadata.shipType === SHIPPING_TYPE_DROP_OFF) {
          const res = await request(
            `oms/supplier/orders/${item.id}/ship-order-and-create-document`,
            { method: 'post', data: { dropoff: {} } },
          );
          console.log('update shopee dropoff', res);
        } else if (metadata.shipType === SHIPPING_TYPE_PICKUP_STEP_2) {
          const res = await request(
            `oms/supplier/orders/${item.id}/ship-order-and-create-document`,
            {
              method: 'post',
              data: {
                pickup: {
                  address_id: metadata.addressPickup.address_id,
                  pickup_time_id: metadata.timePickup.pickup_time_id,
                },
              },
            },
          );
          console.log('update shopee pickup at store', res);
        }
      } else if (action_type === 'tiktok_ready_toship') {
        try {
          const res = await request(`oms/supplier/orders/${item.id}/set-rts`, {
            method: 'put',
            data: {
              pick_up_type: metadata?.isPickup ? 1 : 2,
            },
          });
          console.log('update tiktok rst', res);
        } catch (error) {
          console.log('error', error);
          if (onCompleted) onCompleted(action_type);
          return;
        }
      } else if (action_type === 'other_ready_toship') {
        try {
          const res = await request(
            `oms/supplier/orders/${item.id}/other-rts`,
            {
              method: 'put',
              data: {
                pick_option: metadata?.is_pickup ? 'cod' : 'post',
                required_note: metadata?.reasonghn,
              },
            },
          );
          console.log('create ghtk order', res);
        } catch (error) {
          console.log('error', error);
          if (onCompleted) onCompleted(action_type);
          return;
        }
      }
      setExecutedNum(executedNum + 1);
    }

    let notifyMsg = '';
    if (action_type === 'update_packing') {
      notifyMsg = `${items.length} đơn hàng đã được đóng gói!`;
    } else if (
      action_type === 'ready_toship' ||
      action_type === 'shopee_update_packing' ||
      action_type === 'tiktok_ready_toship' ||
      action_type === 'other_ready_toship'
    ) {
      notifyMsg = `${items.length} đơn hàng đã được xác nhận vận chuyển!`;
    }
    setTimeout(() => {
      notification('success', notifyMsg, 'Cập nhật đơn hàng thành công!');
      if (onCompleted) onCompleted(action_type);
    }, 2000);
  };

  return (
    <>
      {isProgressing && (
        <BatchActionProgressModel
          width={270}
          closable={false}
          className="box-df"
          centered={true}
          title={null}
          visible={visible}
          footer={null}
        >
          <div className="print-progress-content">
            <div>
              <Spin />
            </div>
            <span>
              <span className="progress-title">
                Đang xử lý đơn hàng {`(${totalNum} đơn)`}
              </span>
            </span>
          </div>
          <Progress
            percent={Math.round((executedNum * 100) / totalNum)}
            status="active"
          />
        </BatchActionProgressModel>
      )}
    </>
  );
});

export const BatchActionProgressModel = styled(Modal)`
  .print-progress-content {
    display: flex;
    justify-content: space-between;
    .progress-title {
      margin-left: 10px;
    }
    .loading-icon {
      color: ${({ theme }) => theme.primary};
    }
  }
`;
