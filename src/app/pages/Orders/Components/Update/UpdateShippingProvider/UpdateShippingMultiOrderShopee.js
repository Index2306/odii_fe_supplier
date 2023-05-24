import React, {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  memo,
  forwardRef,
} from 'react';
import { Form, Input, Button, Checkbox } from 'app/components';
import { Modal, Row, Col, Spin } from 'antd';
import { Skeleton } from 'antd';

import { isEmpty, intersectionBy } from 'lodash';
import request from 'utils/request';
import notification from 'utils/notification';
import styled from 'styled-components/macro';

import { pickup } from 'assets/images/icons';
import { dropoff } from 'assets/images/icons';
import { formatDate } from 'utils/helpers';
import moment from 'moment';

const SHIPPING_TYPE_DROP_OFF = 'SHIPPING_TYPE_DROP_OFF';
const SHIPPING_TYPE_PICKUP_STEP_1 = 'SHIPPING_TYPE_PICKUP_STEP_1';
const SHIPPING_TYPE_PICKUP_STEP_2 = 'SHIPPING_TYPE_PICKUP_STEP_2';

export default memo(
  forwardRef(function UpdateShippingMultiOrderShopee(
    { onFinish, onSubmit },
    ref,
  ) {
    const [isLoading, setLoading] = useState(true);
    const [currStepKey, setCurrStepKey] = useState(SHIPPING_TYPE_PICKUP_STEP_1);
    const [shippingParam, setShippingParam] = useState(null);
    const [currPickupAddress, setCurrPickupAddress] = useState(null);
    const [currPickupTime, setCurrPickupTime] = useState(null);
    const [orders, setOrders] = useState([]);
    const [visible, setVisible] = useState(false);
    // useEffect(() => {
    //   getShippingParameter();
    // }, []);

    useImperativeHandle(ref, () => ({
      loadData: orders => {
        console.log('loadData', orders);
        if (orders) {
          setOrders([...orders]);
          setVisible(true);
          getShippingParameter(orders);
        }
      },
      hide: () => {
        onCancel();
      },
    }));
    const onCancel = () => {
      setVisible(false);
      setOrders([]);
      setCurrStepKey(SHIPPING_TYPE_PICKUP_STEP_1);
    };

    const shippingTypes = [
      {
        key: SHIPPING_TYPE_PICKUP_STEP_1,
        icon: pickup,
        name: 'Đơn vị vận chuyển đến lấy hàng',
        description: (
          <span>
            Đơn vị vận chuyển của Shopee <br /> sẽ đến lấy hàng theo thông tin
            xác nhận
          </span>
        ),
        onClick: () => setCurrStepKey(SHIPPING_TYPE_PICKUP_STEP_1),
      },
      {
        key: SHIPPING_TYPE_DROP_OFF,
        icon: dropoff,
        name: 'Bạn tự mang hàng tới bưu cục',
        description: (
          <span>
            Gửi hàng tại các Bưu cục <br /> ở gần mà Shopee hỗ trợ
          </span>
        ),
        onClick: () => setCurrStepKey(SHIPPING_TYPE_DROP_OFF),
      },
    ];

    const descriptions = {
      SHIPPING_TYPE_DROP_OFF:
        'Vui lòng chọn một trong các hình thức vận chuyển dưới đây',
      SHIPPING_TYPE_PICKUP_STEP_1:
        'Vui lòng chọn một trong các hình thức vận chuyển dưới đây',
      SHIPPING_TYPE_PICKUP_STEP_2:
        'Vui lòng chọn địa chỉ và thời gian lấy hàng',
    };

    const getShippingParameter = async orders => {
      setLoading(true);
      console.log('orders', orders);
      try {
        let finalData = {};
        for (let order of orders) {
          const { data } = await request(
            `oms/supplier/orders/${order.id}/get-shipping-parameter`,
          );
          if (isEmpty(data?.pickup?.address_list?.[0]?.time_slot_list)) {
            notification(
              'warning',
              `Order #${order?.code} đang được khởi tạo bên Shopee, quá trình này sẽ diễn ra từ 3 - 5 phút, vui lòng thử lại sau!`,
              'Cảnh báo!',
            );
            onFinish(true);
            onCancel();
            return;
          }
          if (
            !isEmpty(finalData?.pickup) &&
            finalData.pickup?.address_list.length > 0
          ) {
            finalData.pickup.address_list = intersectionBy(
              finalData?.pickup.address_list,
              data.pickup.address_list,
              'address_id',
            );
            finalData.pickup.address_list = finalData.pickup.address_list.map(
              item => {
                const existedTime = data.pickup.address_list.find(
                  t => t.address_id === item.address_id,
                );
                if (isEmpty(existedTime)) return { ...item };
                const timeSame = intersectionBy(
                  item.time_slot_list,
                  existedTime.time_slot_list,
                  'date',
                );
                return { ...item, time_slot_list: timeSame };
              },
            );
          } else {
            finalData = { ...data };
          }
        }
        console.log('final', finalData);
        setShippingParam(finalData);
        const firtPickupAddress = finalData?.pickup?.address_list?.[0];
        setCurrPickupAddress(firtPickupAddress);
        setCurrPickupTime(firtPickupAddress.time_slot_list[0]);
      } finally {
        setLoading(false);
      }
    };

    const handleConfirm = () => {
      switch (currStepKey) {
        case SHIPPING_TYPE_DROP_OFF:
          if (onSubmit) {
            onSubmit(SHIPPING_TYPE_DROP_OFF, currPickupAddress, currPickupTime);
          }
          break;
        case SHIPPING_TYPE_PICKUP_STEP_1:
          setCurrStepKey(SHIPPING_TYPE_PICKUP_STEP_2);
          break;
        case SHIPPING_TYPE_PICKUP_STEP_2:
          if (onSubmit)
            onSubmit(
              SHIPPING_TYPE_PICKUP_STEP_2,
              currPickupAddress,
              currPickupTime,
            );
          break;
        default:
          break;
      }
    };

    // const shipBydropoff = async () => {
    //   setLoading(true);
    //   try {
    //     await request(
    //       `oms/supplier/orders/${orderId}/ship-order-and-create-document`,
    //       { method: 'post', data: { dropoff: {} } },
    //     );
    //     notification(
    //       'success',
    //       `Order #${order?.code} đã được xác nhận đóng gói và chờ giao hàng!`,
    //       'Thành công!',
    //     );
    //     onFinish();
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // const shipByPickup = async () => {
    //   setLoading(true);
    //   try {
    //     await request(
    //       `oms/supplier/orders/${orderId}/ship-order-and-create-document`,
    //       {
    //         method: 'post',
    //         data: {
    //           pickup: {
    //             address_id: currPickupAddress.address_id,
    //             pickup_time_id: currPickupTime.pickup_time_id,
    //           },
    //         },
    //       },
    //     );
    //     notification(
    //       'success',
    //       `Order #${order?.code} đã được xác nhận đóng gói và chờ giao hàng!`,
    //       'Thành công!',
    //     );
    //     onFinish();
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const getPickupAddress = address => {
      return [
        <span>{address.address}</span>,
        <span>, {address.district},</span>,
        <br />,
        <span>{address.city}</span>,
        <span>, {address.state}</span>,
        <span>, {address.region}</span>,
      ].filter(part => part);
    };

    const formatPickupTime = time => {
      const { date } = time;
      const dateMoment = moment(date * 1000);
      const dateFormatted = dateMoment.format('DD/MM/YYYY');
      const dayNumber = dateMoment.weekday();
      const days = [
        'Chủ nhật',
        'Thứ hai',
        'Thứ ba',
        'Thứ tư',
        'Thứ năm',
        'Thứ sáu',
        'Thứ bảy',
      ];

      return [
        <span>{days[dayNumber]}</span>,
        <span>
          &nbsp;
          {dateFormatted}
        </span>,
      ];
    };

    const listPickupAddress = shippingParam?.pickup?.address_list;

    return (
      // <Spin spinning={isLoading}>
      <UpdatetrackingModal
        transitionName=""
        width={640}
        className="box-df"
        visible={visible}
        title={
          <>
            <div className="modal-title__main">
              <span>Xác nhận giao đơn hàng</span>
            </div>
            <div className="modal-title__desc">{descriptions[currStepKey]}</div>
          </>
        }
        footer={
          <div className={isLoading ? 'modal-footer loading' : 'modal-footer'}>
            <Button
              className="btn-cancel btn-sm"
              color="grayBlue"
              width="60px"
              onClick={onCancel}
            >
              Hủy
            </Button>
            <Button
              className="btn-ok btn-sm"
              width="100px"
              onClick={handleConfirm}
            >
              Xác nhận
            </Button>
          </div>
        }
        onCancel={onCancel}
      >
        <div className="modal-content-wrapper">
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : currStepKey !== SHIPPING_TYPE_PICKUP_STEP_2 ? (
            <div className="modal-content">
              <div className="shipping-types">
                {shippingTypes.map(shippingType => (
                  <div
                    key={shippingType.key}
                    className="shipping-type-wrapper"
                    onClick={shippingType.onClick}
                  >
                    <div
                      className={
                        shippingType.key === currStepKey
                          ? 'shipping-type checked'
                          : 'shipping-type'
                      }
                    >
                      <div className="shipping-type__icon">
                        <img src={shippingType.icon} />
                      </div>
                      <div className="shipping-type__name">
                        {shippingType.name}
                      </div>
                      <div className="shipping-type__desc">
                        {shippingType.description}
                      </div>
                      <div className="checked-option">
                        <svg data-name="Layer 1" viewBox="0 0 32 32">
                          <path d="M12.32 25.35l-9.2-9.2 2.59-2.59 6.6 6.58 14-14 2.57 2.66z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="list-pickup-address">
              <div className="pickup-address__title">Kho lấy hàng</div>
              <div className="pickup-address__content-wrapper">
                {listPickupAddress.map(pickupAddress => (
                  <div
                    className="pickup-address__content"
                    key={pickupAddress.address_id}
                  >
                    <div
                      className={
                        pickupAddress.address_id ===
                        currPickupAddress.address_id
                          ? 'pickup-address__value checked'
                          : 'pickup-address__value'
                      }
                      onClick={() => setCurrPickupAddress(pickupAddress)}
                    >
                      {getPickupAddress(pickupAddress)}
                      <div className="checked-option">
                        <svg data-name="Layer 1" viewBox="0 0 32 32">
                          <path d="M12.32 25.35l-9.2-9.2 2.59-2.59 6.6 6.58 14-14 2.57 2.66z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pickup-time__title">Thời gian lấy hàng</div>
              <div className="pickup-time__content-wrapper">
                {currPickupAddress.time_slot_list.map(pickupTime => (
                  <div
                    className="pickup-time__content"
                    key={pickupTime.pickup_time_id}
                  >
                    <div
                      className={
                        pickupTime.pickup_time_id ===
                        currPickupTime.pickup_time_id
                          ? 'pickup-time__value checked'
                          : 'pickup-time__value'
                      }
                      onClick={() => setCurrPickupTime(pickupTime)}
                    >
                      {formatPickupTime(pickupTime)}
                      <div className="checked-option">
                        <svg data-name="Layer 1" viewBox="0 0 32 32">
                          <path d="M12.32 25.35l-9.2-9.2 2.59-2.59 6.6 6.58 14-14 2.57 2.66z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </UpdatetrackingModal>
    );
  }),
);

export const UpdatetrackingModal = styled(Modal)`
  min-height: 550px;
  top: 50%;
  transform: translateY(-50%) !important;
  padding-bottom: 0;
  .modal-title__main {
    font-size: 18px;
    font-weight: bold;
  }
  .modal-title__desc {
    font-weight: normal;
    font-size: 14px;
    color: #828282;
    margin-top: 2px;
  }
  .ant-modal-header {
    border-bottom: none;
    padding: 21px 25px 14px 24px;
  }
  .ant-modal-content {
    height: 100%;
  }
  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
  }
  .ant-spin-nested-loading > div > .ant-spin {
    min-height: unset;
  }
  .ant-modal-body {
    padding: 0;
    margin-top: 2px;
  }
  .shipping-provider-content {
    color: red;
  }
  .modal-content-wrapper {
    min-height: 260px;
    padding: 0 20px;
  }
  .modal-content {
    padding: 20px 25px 60px 25px;
  }
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    &.loading {
      opacity: 0.5;
      pointer-events: none;
    }
  }
  .modal-footer > button:not(:first-child) {
    margin-left: 10px;
  }
  .shipping-types {
    display: flex;
    margin: -7px;
    .shipping-type-wrapper {
      width: 50%;
      padding: 7px;
    }
    .shipping-type {
      background: #fafafa;
      border-radius: 5px;
      padding: 25px 5px;
      text-align: center;
      position: relative;
      border: 1px solid transparent;
      transition: all ease-out 0.25s;
      cursor: pointer;
    }
    .shipping-type__icon img {
      height: 40px;
    }
    .shipping-type__name {
      margin-top: 15px;
      font-size: 16px;
      font-weight: bold;
      transition: all ease-out 0.25s;
    }
    .shipping-type__desc {
      margin-top: 3px;
      font-size: 14px;
      color: #8c8c8c;
      font-weight: 400;
      line-height: 1.5;
    }
    .shipping-type.checked {
      border-color: #3d56a6;
      .checked-option {
        opacity: 1;
        visibility: visible;
      }
      .shipping-type__name {
        color: #3d56a6;
      }
    }
  }
  .checked-option {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    right: 0;
    top: 0;
    border-style: solid;
    border-width: 0 30px 30px 0;
    border-color: transparent #3d56a6 transparent transparent;
    z-index: 2;
    width: 30px;
    height: 30px;
    transition: all ease-out 0.25s;
    svg {
      fill: #fff;
      position: absolute;
      right: -27px;
      width: 14px;
      height: 14px;
    }
  }
  .pickup-address__title,
  .pickup-time__title {
    font-size: 15px;
    font-weight: bold;
  }
  .pickup-time__title {
    margin-top: 10px;
  }
  .pickup-address__content-wrapper,
  .pickup-time__content-wrapper {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -7px;
  }
  .pickup-address__content,
  .pickup-time__content {
    padding: 8px 7px;
  }
  .pickup-address__value,
  .pickup-time__value {
    padding: 10px 25px;
    background: #fafafa;
    border-radius: 5px;
    position: relative;
    border: 1px solid transparent;
    cursor: pointer;
  }
  .pickup-address__value.checked,
  .pickup-time__value.checked {
    border-color: #3d56a6;
    .checked-option {
      opacity: 1;
      visibility: visible;
    }
  }
`;

export const ModalFooter = styled.div`
  color: red !important;
`;
