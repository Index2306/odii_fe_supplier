import React, {
  useState,
  useImperativeHandle,
  memo,
  forwardRef,
  useRef,
} from 'react';
import { InfoCircleTwoTone } from '@ant-design/icons';

import { Button, Checkbox, Select } from 'app/components';
import { Modal } from 'antd';
import { isEmpty, countBy } from 'lodash';
import constants from 'assets/constants';
import styled from 'styled-components';

const SHIPPING_TYPE_DROP_OFF_STEP_1 = 'SHIPPING_TYPE_DROP_OFF_STEP_1';
const SHIPPING_TYPE_PICKUP_STEP_1 = 'SHIPPING_TYPE_PICKUP_STEP_1';
const SHIPPING_CONFIRM_STEP_2 = 'SHIPPING_CONFIRM_STEP_2';

const getProviderName = orders => {
  if (isEmpty(orders) || orders.length === 0) return '';
  if (orders.length === 1) return orders[0]?.shipment_provider;
  const providers = orders.map(item => item?.shipment_provider);
  const providersGrp = countBy(providers);
  const arr = [];
  Object.keys(providersGrp).forEach(function (key) {
    if (key && providersGrp[key] > 0) {
      arr.push(`${key} (${providersGrp[key]} đơn)`);
    }
  });
  return arr.join(', ');
};

export default memo(
  forwardRef(function UpdateShippingProviderTiktok(
    { onFinish, onSubmit },
    ref,
  ) {
    const [currStepKey, setCurrStepKey] = useState(SHIPPING_TYPE_PICKUP_STEP_1);
    const [orders, setOrders] = useState([]);
    const [visible, setVisible] = useState(false);
    const [confirmCheck, setConfirmCheck] = useState(false);
    const [reasonghn, setReasoghn] = useState('KHONGCHOXEMHANG');
    const selectPickupRef = useRef(true);
    // useEffect(() => {
    //   getShippingParameter();
    // }, []);

    useImperativeHandle(ref, () => ({
      loadData: orders => {
        console.log('loadData', orders);
        if (orders) {
          selectPickupRef.current = true;
          setCurrStepKey(SHIPPING_TYPE_PICKUP_STEP_1);
          setOrders([...orders]);
          setVisible(true);
        }
      },
      hide: () => {
        setVisible(false);
        setOrders([]);
        setCurrStepKey(SHIPPING_TYPE_PICKUP_STEP_1);
        selectPickupRef.current = true;
      },
    }));
    const onCancel = () => {
      if (currStepKey === SHIPPING_CONFIRM_STEP_2) {
        if (selectPickupRef.current) {
          setCurrStepKey(SHIPPING_TYPE_PICKUP_STEP_1);
        } else {
          setCurrStepKey(SHIPPING_TYPE_DROP_OFF_STEP_1);
        }

        setConfirmCheck(false);
      } else {
        setVisible(false);
        setOrders([]);
        setCurrStepKey(SHIPPING_TYPE_PICKUP_STEP_1);
        setReasoghn('KHONGCHOXEMHANG');
      }
    };

    const shippingTypes = [
      {
        key: SHIPPING_TYPE_PICKUP_STEP_1,
        name: 'Lấy hàng',
        description: 'Lên lịch lấy hàng tại kho của bạn',
        onClick: () => {
          selectPickupRef.current = true;
          setCurrStepKey(SHIPPING_TYPE_PICKUP_STEP_1);
        },
      },
      {
        key: SHIPPING_TYPE_DROP_OFF_STEP_1,
        name: 'Gửi hàng',
        description: 'Gửi bưu kiện tại điểm gửi hàng gần nhất của bạn.',
        onClick: () => {
          selectPickupRef.current = false;
          setCurrStepKey(SHIPPING_TYPE_DROP_OFF_STEP_1);
        },
      },
    ];

    const handleConfirm = () => {
      if (
        currStepKey === SHIPPING_TYPE_DROP_OFF_STEP_1 ||
        currStepKey === SHIPPING_TYPE_PICKUP_STEP_1
      ) {
        setCurrStepKey(SHIPPING_CONFIRM_STEP_2);
      } else {
        if (onSubmit) onSubmit(orders, selectPickupRef.current, reasonghn);
      }
    };

    const onChange = e => {
      setConfirmCheck(e.target.checked);
    };

    const onHandleReason = value => {
      setReasoghn(value);
    };

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
              {currStepKey === SHIPPING_CONFIRM_STEP_2 ? (
                <span>Lấy tận nơi theo lịch</span>
              ) : (
                <span>
                  Sắp xếp vận chuyển{' '}
                  {orders?.length > 1 ? `(${orders?.length} đơn hàng)` : ''}
                </span>
              )}
            </div>
          </>
        }
        footer={
          <div className="modal-footer">
            <Button
              className="btn-cancel btn-sm"
              color="grayBlue"
              width="100px"
              onClick={onCancel}
            >
              {currStepKey !== SHIPPING_CONFIRM_STEP_2 ? `Hủy` : 'Chọn lại'}
            </Button>
            <Button
              className="btn-ok btn-sm"
              width="100px"
              disabled={
                currStepKey === SHIPPING_CONFIRM_STEP_2 && !confirmCheck
              }
              onClick={handleConfirm}
            >
              {currStepKey !== SHIPPING_CONFIRM_STEP_2 ? `Tiếp tục` : 'OK'}
            </Button>
          </div>
        }
        onCancel={onCancel}
      >
        <div className="modal-content-wrapper">
          {currStepKey !== SHIPPING_CONFIRM_STEP_2 ? (
            <div className="modal-content">
              <div className="shipping-provider">
                <span className="title">Nhà cung cấp dịch vụ vận chuyển</span>
                <span className="content">
                  {getProviderName(orders) || 'Giao hàng tiết kiệm'}
                </span>
              </div>
              <span className="shipping-type-title">
                Phương thức thu gom hàng
              </span>
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
              <div
                className="shipping-type-title"
                style={{ marginTop: '20px' }}
              >
                Lưu ý giao hàng{' '}
                <span>
                  (chỉ áp dụng với những đơn hàng của Giao hàng nhanh)
                </span>
              </div>
              <Select onChange={onHandleReason} value={reasonghn}>
                {constants.SHIPMENT_REASON.map((item, index) => (
                  <Select.Option key={index} value={item.id}>
                    <div>{item.name}</div>
                  </Select.Option>
                ))}
              </Select>
            </div>
          ) : (
            <div className="dialog-confirm">
              <div className="content-box">
                <InfoCircleTwoTone />
                <div>
                  Không thể yêu cầu thời gian lấy tận nơi cụ thể. Yêu cầu lấy
                  tận nơi của bạn sẽ được gửi đến nhà cung cấp dịch vụ vận
                  chuyển, nhưng nếu bạn cần lên lịch cho thời gian lấy hàng cụ
                  thể, vui lòng gọi cho nhà cung cấp theo để sắp xếp. Bằng cách
                  nhấp vào xác nhận bên dưới, yêu cầu lấy tận nơi của bạn sẽ
                  được gửi đến nhà cung cấp dịch vụ vận chuyển.
                </div>
              </div>
              <Checkbox
                style={{ fontSize: '14px', fontWeight: 400 }}
                onClick={onChange}
              >
                Tôi chấp nhận điều kiện ở trên
              </Checkbox>
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
    padding: 0 20px;
  }
  .modal-content {
    padding: 20px 25px 25px 25px;
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
  .dialog-confirm {
    padding: 5px;
    .content-box {
      display: flex;
      flex-direction: row;
      padding: 15px;
      border-style: solid;
      border-width: 1px;
      border-color: rgb(158, 153, 255);
      background-color: rgb(245, 245, 255);
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 16px;
      > span {
        margin-top: 2px;
      }
      > div {
        margin-left: 5px;
        font-size: 14px;
        font-weight: 400;
        color: rgb(33, 37, 51);
      }
    }
    .
  }
  .shipping-provider {
    display: grid;
    margin-bottom: 16px;
    .title {
      font-size: 14px;
      font-weight: 600;
    }
    .content {
      margin-top: 8px;
    }
  }
  .shipping-type-title {
    font-size: 14px;
    font-weight: 600;

    span{
      font-weight: 400;
    }

  }
  .shipping-types {
    display: flex;
    margin: -7px;
    margin-top: 10px;
    .shipping-type-wrapper {
      width: 50%;
      padding: 7px;
    }
    .shipping-type {
      background: #fafafa;
      border-radius: 5px;
      text-align: center;
      position: relative;
      border: 1px solid transparent;
      transition: all ease-out 0.25s;
      cursor: pointer;
      min-height: 90px;
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
