import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useOrdersSlice } from '../../slice';
import { formatMoney, htmlStringToPdf } from 'utils/helpers';
import {
  selectDetail,
  selectLoading,
  selectShowEmptyPage,
} from '../../slice/selectors';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';

import { Row, Col, Form as F, Space, Select, Tabs } from 'antd';

import { Button, PageWrapper, EmptyPage, Input } from 'app/components';
import Confirm from 'app/components/Modal/Confirm';
import { globalActions } from 'app/pages/AppPrivate/slice';

import styled from 'styled-components/macro';
import { CustomTitle, CustomStyle } from 'styles/commons';
import { OrderCodeWrapper, PageWrapperDefault } from '../../styles/OrderDetail';
import 'assets/scss/pages/order/page_action_select.scss';

import ListOrderItem from '../../Components/Update/ListOrderItem';
import PaymentInfo from '../../Components/Update/PaymentInfo';
import OrderCode from '../../Components/Update/OrderCode';
import CustomerInfo from '../../Components/Update/CustomerInfo';
import StoreInfo from '../../Components/Update/StoreInfo';
import OrderHistory from '../../Components/Update/OrderHistory';

import constants from 'assets/constants';
import request from 'utils/request';
import notification from 'utils/notification';
import UpdateShippingProvider from '../../Components/Update/UpdateShippingProvider';
import PrintPreview from '../../Components/Update/PrintPreview';
import { downloadFiles } from 'utils/request';
import { getOrderAction } from 'utils/helpers';
import OrderStatus from '../../Components/Update/OrderStatus';
import UpdateShippingProviderTiktok from '../../Components/Update/UpdateShippingProvider/UpdateShippingProviderTiktok';
import BatchActionProgress from '../../Components/List/BatchActionProgress';
import { SearchOutlined } from '@ant-design/icons';
const Item = F.Item;
const { Option } = Select;
const { TabPane } = Tabs;

//fulfillment action
const confirmAction = constants?.FULFILLMENT_ACTION.CONFIRM;
const rejectAction = constants?.FULFILLMENT_ACTION.REJECT;
const cancelAction = constants?.FULFILLMENT_ACTION.CANCEL;

const SELLER_CONFIRMED_STATUS =
  constants?.ORDER_FULFILLMENT_STATUS.SELLER_CONFIRMED.id;
const SUPPLIER_CONFIRMED_STATUS =
  constants?.ORDER_FULFILLMENT_STATUS.SUPPLIER_CONFIRMED.id;
const PENDING_STATUS = constants?.ORDER_FULFILLMENT_STATUS.PENDING.id;
const READY_TO_SHIP_STATUS =
  constants?.ORDER_FULFILLMENT_STATUS.READY_TO_SHIP.id;
const SUP_CANCELLED_STATUS =
  constants?.ORDER_FULFILLMENT_STATUS.SUP_CANCELLED.id;
const SUP_REJECTED_STATUS = constants?.ORDER_FULFILLMENT_STATUS.SUP_REJECTED.id;
const PLATFORM_CANCELLED_STATUS =
  constants?.ORDER_FULFILLMENT_STATUS.PLATFORM_CANCELLED;

const SHOPEE_ORDER_SHOP_STATUS = constants?.SHOPEE_ORDER_SHOP_STATUS;

const UPDATE_STATUS_CONFIRM__KEY = 'CONFIRM_UPDATE_STATUS_MODAL';
const UPDATE_SHIPPING_PROVIDER_MODAL_KEY = 'UPDATE_SHIPPING_PROVIDER_MODAL';

const initBatchActModel = {
  visible: false,
  action_tpye: '',
  items: [],
};

export function UpdateOrder({ match, history }) {
  const [isLoadingPrint, setLoadingPrint] = useState(false);
  const [updateStatusActionType, setUpdateStatusActionType] = useState(null);
  const [currModalKey, setCurrModalKey] = useState(null);
  const [printData, setPrintData] = useState([]);
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    removeAfterPrint: true,
    content: () => printRef.current,
    onAfterPrint: () => {
      setPrintData([]);
      setLoadingPrint(false);
    },
  });

  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useOrdersSlice();
  const order = useSelector(selectDetail);
  const { roles } = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectLoading);
  const isEmptyPage = useSelector(selectShowEmptyPage);
  const [isLoadingConfirm, setLoadingConfirm] = React.useState(false);
  const [orderConfirm, setOrderConfirm] = React.useState({});
  const fulfillmentStatus = order?.fulfillment_status;
  const [batchProgressModel, setBatchProgressModel] = React.useState({
    ...initBatchActModel,
  });
  const [handleQr, setHandleQr] = useState(false);
  const [qrCode, setQrcode] = React.useState('');
  const updateShippingOrderTiktokRef = React.useRef();
  const updateShippingOrderOtherRef = React.useRef();
  const inputRef = useRef(null);
  let reasonSrc = [];
  if (order?.platform) {
    reasonSrc = constants?.ORDER_CANCEL_REASON[order?.platform].filter(
      item =>
        !item.available_status_list ||
        item.available_status_list.includes('*') ||
        item.available_status_list.includes(`${order?.shop_status}`),
    );
  }
  useEffect(() => {
    loadOrderData();
    return () => {
      dispatch(actions.getDetailDone([]));
    };
  }, []);

  useEffect(() => {
    return () => {
      if (isEmptyPage) {
        dispatch(actions.clearEmptyPage());
      }
    };
  });

  const getCancelReasonTranslate = value => {
    const cancel_reason = constants?.ORDER_CANCEL_REASON_NOTE.find(
      v => v.id === value,
    );
    return cancel_reason?.name;
  };

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Đơn hàng',
          link: '/orders',
        },
        {
          name: 'Chi tiết đơn hàng',
        },
      ],
      fixWidth: true,
      actions: !roles?.includes('partner_source') &&
        order?.status !== 'wait_transport' && (
          <Item className="m-0" shouldUpdate>
            <div className="d-flex justify-content-between">
              <Space>{getPageAction()}</Space>
            </div>
          </Item>
        ),
    };
    const orderCode = !order?.platform
      ? order?.code
      : order?.shop_order_id || order?.code;
    dataBreadcrumb.title = orderCode ? `#${orderCode}` : '';
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
    };
  }, [order, isLoadingPrint]);

  // const isPersonalOrder = !order?.shop_order_id;

  const modals = [
    {
      key: UPDATE_SHIPPING_PROVIDER_MODAL_KEY,
      getContent: () => (
        <UpdateShippingProvider
          key={UPDATE_SHIPPING_PROVIDER_MODAL_KEY}
          visible={true}
          onCancel={() => setCurrModalKey(null)}
          onFinish={isNotReload => {
            setCurrModalKey(null);
            !isNotReload && loadOrderData();
          }}
          order={order}
        ></UpdateShippingProvider>
      ),
    },
    {
      key: UPDATE_STATUS_CONFIRM__KEY,
      getContent: () => (
        <Confirm
          isFullWidthBtn
          key={UPDATE_STATUS_CONFIRM__KEY}
          color={updateStatusActionType === confirmAction ? 'blue' : 'red'}
          title={`${
            updateStatusActionType === confirmAction
              ? 'Xác nhận cung cấp'
              : updateStatusActionType === rejectAction
              ? 'Từ chối'
              : 'Hủy đơn'
          } đơn hàng`}
          data={
            !!order?.platform && {
              message: getConfirmMessage(),
            }
          }
          handleConfirm={updateStatus}
          handleCancel={toggleUpdateStatusConfirm}
          reasonList={
            updateStatusActionType === confirmAction ||
            (updateStatusActionType === cancelAction && !order?.platform)
              ? null
              : reasonSrc
          }
          cancelWarning={
            updateStatusActionType === cancelAction ? getConfirmMessage() : null
          }
        />
      ),
    },
  ];

  const loadOrderData = () => {
    dispatch(actions.getDetail(id));
  };

  const handlePressQR = e => {
    dispatch(
      actions.updateQrChecked({
        id: order.id,
        data: {
          code: e.target.value,
        },
        onSuccess: () => {
          loadOrderData();
        },
      }),
    );
    if (!handleQr) inputRef.current.value = '';
  };

  const updateRst = () => {
    request(`oms/supplier/orders/${order?.id}/set-rts`, {
      method: 'put',
    })
      .then(() => {
        loadOrderData();
      })
      .catch(err => err);
  };

  const onSubmitOtherShipping = (orders, isPickup) => {
    setBatchProgressModel({
      action_type: 'other_ready_toship',
      visible: true,
      items: orders,
      metadata: {
        is_pickup: isPickup,
      },
    });
  };

  const onActionHandler = (action_type, data) => {
    if (action_type === 'other_ready_toship') {
      updateShippingOrderOtherRef.current.loadData([data]);
    }
  };

  const checkFullOrderItem = () => {
    let total = 0;
    order?.order_items?.forEach(item => {
      total += item.quantity;
      total -= item.qr_checked;
    });
    return total === 0;
  };

  const getPageAction = () => {
    if (isLoading) {
      return;
    }
    const actions = getOrderAction(
      order?.platform,
      'supplier',
      order?.odii_status,
      order?.fulfillment_status,
      order?.shop_status,
      '',
    );
    if (!actions) return null;

    let pageAction;
    if (actions.supplier_confirm && actions.order_cancel) {
      pageAction = (
        <ActionWrapper>
          <Space size={11}>
            <Button
              context="secondary"
              className="btn-cancel btn-sm p-0"
              color="orange"
              onClick={() => toggleUpdateStatusConfirm(cancelAction)}
              width="90px"
            >
              Hủy đơn
            </Button>
            <Button
              onClick={() => toggleUpdateStatusConfirm(confirmAction)}
              className="btn-sm p-0"
              width="90px"
            >
              Xác nhận
            </Button>
          </Space>
        </ActionWrapper>
      );
    } else if (actions.supplier_confirm) {
      pageAction = (
        <Button
          onClick={() => toggleUpdateStatusConfirm(confirmAction)}
          className="btn-sm p-0"
          width="90px"
        >
          Xác nhận
        </Button>
      );
    } else if (actions.order_cancel) {
      pageAction = (
        <Button
          context="secondary"
          className="btn-cancel btn-sm"
          color="red"
          onClick={() => toggleUpdateStatusConfirm(cancelAction)}
          width="90px"
        >
          Hủy đơn
        </Button>
      );
    }
    return (
      <>
        {/* {updateStatusSelection} */}
        {actions.ready_toship && (
          <Button
            color="orange"
            context="secondary"
            onClick={updateRst}
            className="btn-sm p-0 btn-update-rst"
            width="150px"
            disabled={!checkFullOrderItem()}
          >
            Sẵn sàng vận chuyển
          </Button>
        )}
        {actions.other_ready_toship && (
          <Button
            color="orange"
            context="secondary"
            onClick={() => onActionHandler('other_ready_toship', order)}
            className="btn-sm p-0 btn-update-rst"
            width="150px"
            disabled={!checkFullOrderItem()}
          >
            Sắp xếp vận chuyển
          </Button>
        )}
        <>
          {(actions.update_packing || actions.shopee_update_packing) && (
            <ButonActionConfirmPacking
              context="secondary"
              className="btn-action-print btn-sm"
              color="blue"
              // disabled={!isEnableUpdatePacking}
              onClick={() => toggleModal(UPDATE_SHIPPING_PROVIDER_MODAL_KEY)}
              disabled={!checkFullOrderItem()}
            >
              Xác nhận đóng gói
            </ButonActionConfirmPacking>
          )}
          {(actions.print_pack_list || actions.print) && (
            <ButonActionPrint
              context="secondary"
              className={`btn-action-print btn-sm ${
                isLoadingPrint ? 'loading' : ''
              }`}
              color="blue"
              width="100%"
              // disabled={!isEnablePrint}
              onClick={printShipingLabel}
            >
              <i
                className={
                  isLoadingPrint
                    ? 'far fa-spinner-third fa-spin'
                    : 'far fa-print'
                }
              ></i>
              {actions.print ? 'In đơn hàng' : 'In phiếu đóng gói'}
            </ButonActionPrint>
          )}
        </>
        {pageAction}
      </>
    );
  };

  // const isEnableUpdatePacking = () => {
  //   const isLazadaEnable =
  //     order?.platform === 'lazada' &&
  //     [SUPPLIER_CONFIRMED_STATUS].includes(order?.fulfillment_status) &&
  //     [PENDING_STATUS].includes(order?.shop_status);

  //   const isShopeeEnable =
  //     order?.platform === 'shopee' &&
  //     [SUPPLIER_CONFIRMED_STATUS].includes(order?.fulfillment_status) &&
  //     [
  //       SHOPEE_ORDER_SHOP_STATUS.READY_TO_SHIP.id,
  //       SHOPEE_ORDER_SHOP_STATUS.PROCESSED.id,
  //       SHOPEE_ORDER_SHOP_STATUS.READY_TO_CREATE_DOCUMENT.id,
  //     ].includes(order?.shop_status);

  //   return isLazadaEnable || isShopeeEnable;
  // };

  // const isEnablePrint = () => {
  //   const isLazadaEnable =
  //     order?.platform === 'lazada' &&
  //     ![
  //       SUP_REJECTED_STATUS,
  //       SUP_CANCELLED_STATUS,
  //       PLATFORM_CANCELLED_STATUS,
  //     ].includes(order?.fulfillment_status) &&
  //     [READY_TO_SHIP_STATUS].includes(order?.shop_status);

  //   const isShopeeEnable =
  //     order?.platform === 'shopee' &&
  //     ![
  //       SUP_REJECTED_STATUS,
  //       SUP_CANCELLED_STATUS,
  //       PLATFORM_CANCELLED_STATUS,
  //     ].includes(order?.fulfillment_status) &&
  //     ![
  //       SHOPEE_ORDER_SHOP_STATUS.UNPAID.id,
  //       SHOPEE_ORDER_SHOP_STATUS.READY_TO_SHIP.id,
  //       SHOPEE_ORDER_SHOP_STATUS.PROCESSED.id,
  //       SHOPEE_ORDER_SHOP_STATUS.CANCELLED.id,
  //       SHOPEE_ORDER_SHOP_STATUS.READY_TO_CREATE_DOCUMENT.id,
  //     ].includes(order?.shop_status);

  //   return isLazadaEnable || isShopeeEnable;
  // };

  // const isEnableUpdateReadToShip =
  //   isPersonalOrder &&
  //   order?.fulfillment_status &&
  //   ![
  //     constants?.ORDER_FULFILLMENT_STATUS.PENDING.id,
  //     constants?.ORDER_FULFILLMENT_STATUS.SELLER_CONFIRMED.id,
  //     constants?.ORDER_FULFILLMENT_STATUS.READY_TO_SHIP.id,
  //     constants?.ORDER_FULFILLMENT_STATUS.SELLER_DELIVERED.id,
  //     constants?.ORDER_FULFILLMENT_STATUS.SUP_REJECTED.id,
  //     constants?.ORDER_FULFILLMENT_STATUS.SUP_CANCELLED.id,
  //     constants?.ORDER_FULFILLMENT_STATUS.CANCEL.id,
  //   ].includes(order?.fulfillment_status);

  const printShipingLabelLazada = async () => {
    try {
      setLoadingPrint(true);
      await fetchPrintContent();
      handlePrint();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPrint(false);
    }
  };

  const printShipingLabelShopee = async () => {
    try {
      setLoadingPrint(true);
      const blob = await downloadFiles(
        `oms/supplier/orders/${order?.id}/download-shipping-document`,
        'get',
        {},
        {},
        { responseType: 'arraybuffer' },
        { type: 'application/pdf' },
      );
      if (!blob) {
        return;
      }
      var URL = window.URL || window.webkitURL;
      var dataUrl = URL.createObjectURL(blob);
      window.open(dataUrl, '_blank');
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPrint(false);
    }
  };

  const fetchPrintTiktokContent = async documentType => {
    setLoadingPrint(true);
    try {
      const response = await request(
        `oms/supplier/orders/${order?.id}/${documentType}/print-tiktok-order`,
        {
          method: 'get',
        },
      );
      if (response?.data && response.data.doc_url) {
        window.open(response.data.doc_url, '_blank');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPrint(false);
    }
  };

  const printShipingLabel = async () => {
    if (order?.platform === 'lazada') {
      printShipingLabelLazada();
    } else if (order?.platform === 'tiktok') {
      let documentType = 1;
      if (order?.shop_status === '111') documentType = 2;
      await fetchPrintTiktokContent(documentType);
    } else if (order?.platform === 'shopee') {
      printShipingLabelShopee();
    } else {
      fetchPrintGHTKContent();
    }
  };

  const fetchPrintGHTKContent = async () => {
    try {
      setLoadingPrint(true);
      const response = await request(
        `oms/supplier/orders/${order?.id}/print-ghtk-label-pdf`,
        {
          method: 'get',
        },
      );
      if (response.platform === 'GHTK') {
        openPdf(response.data);
      } else {
        await htmlStringToPdf([response.data]);
      }
    } catch (error) {
      console.log('fetchPrintGHTKContent error', error);
    } finally {
      setLoadingPrint(false);
    }
  };

  const openPdf = basePdf => {
    let byteCharacters = atob(basePdf);
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    let file = new Blob([byteArray], { type: 'application/pdf;base64' });
    let fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  };

  const fetchPrintContent = async () => {
    const response = await request(
      `oms/supplier/orders/${order?.id}/get-shipping-label`,
      {
        method: 'get',
      },
    );
    setPrintData([response.data.file]);
  };

  const toggleUpdateStatusConfirm = async actionType => {
    setUpdateStatusActionType(actionType);
    if (actionType === cancelAction) {
      const isSuccess = await loadOrderConfirmInfo(order);
      if (isSuccess) {
        toggleModal(UPDATE_STATUS_CONFIRM__KEY);
      }
    } else {
      toggleModal(UPDATE_STATUS_CONFIRM__KEY);
    }
  };

  const toggleModal = modalKey => {
    setCurrModalKey(currModalKey ? null : modalKey);
  };

  const getConfirmMessage = () => {
    const total_price = formatMoney(orderConfirm.total_fulfill_price);
    switch (updateStatusActionType) {
      case confirmAction:
        return <span>Bạn có chắc chắn muốn cung cấp đơn hàng này không?</span>;
      case rejectAction:
        return <span>Bạn có chắc chắn muốn từ chối đơn hàng này không?</span>;
      case cancelAction:
        return (
          <span>
            Đơn hàng{' '}
            <span style={{ fontWeight: 'bold' }}>{`#${
              order?.shop_order_id || order?.id
            }`}</span>{' '}
            sẽ bị hủy và Odii sẽ hoàn trả cho nhà bán hàng số tiền{' '}
            <SpanPrice>{total_price}</SpanPrice>&nbsp;
          </span>
        );
      default:
        return <span></span>;
    }
  };

  const loadOrderConfirmInfo = async order => {
    setLoadingConfirm(true);
    try {
      const response = await request(
        `oms/seller/order/${order?.id}/confirm-info`,
        {
          method: 'get',
        },
      );
      setOrderConfirm(response.data);
      return true;
    } catch (err) {
      const errorMessages = [
        {
          code: 'product_variation_not_found',
          title: 'Xác nhận không thành công!',
          message: `Đơn hàng của bạn có chứa sản phẩm không thuộc Odii.
      Vui lòng kiểm tra lại hoặc liên hệ với bộ phận cskh.`,
        },
      ];
      const errorCode = err?.data?.error_code;
      const currError = errorMessages.find(error => (error.code = errorCode));
      currError && notification('error', currError.message, currError.title);
      return false;
    } finally {
      setLoadingConfirm(false);
    }
  };

  const updateStatus = (reasonId, comment) => {
    const payload = {
      fulfillment_status: updateStatusActionType,
      reason_id: reasonId || '',
      note: comment || '',
    };
    if (
      updateStatusActionType === confirmAction ||
      (updateStatusActionType === cancelAction && !order?.platform)
    ) {
      delete payload.note;
      delete payload.reason_id;
    }
    request(`oms/supplier/orders/${order?.id}/change-fulfill-status`, {
      method: 'put',
      data: payload,
    })
      .then(response => {
        notification(
          'success',
          `Order #${order?.code} đã ${
            updateStatusActionType === confirmAction
              ? 'được xác nhận'
              : updateStatusActionType === rejectAction
              ? 'bị từ chối'
              : 'bị hủy bỏ'
          }!`,
          'Thành công!',
        );
        toggleUpdateStatusConfirm(updateStatusActionType);
        loadOrderData();
      })
      .catch(err => {
        const errorMessages = [
          {
            code: 'product_of_order_item_not_same_warehousing',
            title: 'Xác nhận không thành công!',
            message: `Các sản phẩm trong đơn hàng phải thuộc cùng một kho hàng.
          Vui lòng kiểm tra lại hoặc liên hệ với bộ phận cskh.`,
          },
          {
            code: 'Không thể kết nối đến shopee, vui lòng thử lại sau',
            title: 'Xác nhận không thành công!',
            message: `Không thể kết nối đến shopee.
          Vui lòng kiểm tra lại hoặc liên hệ với bộ phận cskh.`,
          },
          {
            code:
              'Your refresh token is error ,please check refresh token or shopid.',
            title: 'Xác nhận không thành công!',
            message: `Kết nối với cửa hàng đã hết hạn.
          Vui lòng kiểm tra lại hoặc liên hệ với bộ phận cskh.`,
          },
        ];
        const errorCode = err?.data?.error_code;

        let currError = errorMessages.find(error => error.code === errorCode);
        if (currError) {
          notification('error', currError.message, currError.title);
        } else {
          let errMsg = err?.data?.error_message;
          errMsg = errMsg ? errMsg : errorCode;
          notification('error', errMsg, 'Xác nhận không thành công!');
        }
      });
  };

  const getTotalSupplierPrice = orderItems => {
    let totalPrice = 0;
    orderItems?.map(item => {
      if (item.promotion) {
        if (item.promotion.prtType === 'product_by') {
          totalPrice += item.promotion?.finalPrice * item.quantity;
        } else {
          totalPrice += item.origin_supplier_price * item.quantity;
        }
      } else {
        totalPrice += item.origin_supplier_price * item.quantity;
      }
    });
    return totalPrice;
  };

  const items = useMemo(
    () => [
      {
        key: '1',
        label: 'Chi tiết đơn hàng',
        children: (
          <Row gutter="26">
            <Col span={16}>
              <ListOrderItem order={order || []}></ListOrderItem>
              <PaymentInfo order={order || {}}></PaymentInfo>
              <OrderHistory orderData={order} orderId={id}></OrderHistory>
            </Col>
            <Col span={8}>
              {!isLoading && (
                <OrderCodeWrapper>
                  <div className="order-top-wrapper">
                    <div className="order-top__title section-title">
                      Supplier nhận
                    </div>
                    <div className="order-code__monney">
                      <input
                        readOnly
                        className="order-code__value"
                        value={formatMoney(
                          getTotalSupplierPrice(order?.order_items) || 0,
                        )}
                      ></input>
                    </div>
                  </div>
                </OrderCodeWrapper>
              )}
              <OrderCode order={order} onUpdate={loadOrderData}></OrderCode>
              <CustomerInfo order={order}></CustomerInfo>
              <StoreInfo order={order}></StoreInfo>
              {order?.odii_status && (
                <OrderStatus
                  name="Trạng thái đơn hàng"
                  order={order?.odii_status}
                  status={constants?.ODII_ORDER_STATUS_NAME}
                />
              )}
              {order?.fulfillment_status && (
                <OrderStatus
                  name="Trạng thái cung cấp"
                  order={order?.fulfillment_status?.toUpperCase()}
                  status={constants?.ORDER_SUPPLIER_FULFILLMENT_STATUS}
                />
              )}
              {order?.odii_status === 6 && (
                <>
                  {order?.cancel_reason && (
                    <OrderStatus
                      name="Lý do hủy"
                      order={
                        getCancelReasonTranslate(order?.cancel_reason) ||
                        order?.cancel_reason
                      }
                      status={null}
                    />
                  )}
                  {order?.fulfillment_status && (
                    <OrderStatus
                      name="Bên hủy"
                      order={order?.fulfillment_status?.toUpperCase()}
                      status={constants?.ORDER_SUPPLIER_CANCEL_STATUS}
                    />
                  )}
                  {order?.note && (
                    <OrderStatus
                      name="Nhận xét khi hủy"
                      order={order?.note}
                      status={null}
                    />
                  )}
                </>
              )}
            </Col>
          </Row>
        ),
      },
      // {
      //   key: '2',
      //   label: 'Xuất kho',
      //   children: <div>long</div>
      // }
    ],
    [order],
  );

  return isEmptyPage ? (
    <PageWrapper fixWidth>
      <CustomTitle height="calc(100vh - 120px)" className="d-flex flex-column">
        <CustomTitle>Đơn hàng</CustomTitle>
        <EmptyPage>
          <CustomStyle className="d-flex justify-content-center">
            <Button className="btn-md" onClick={() => history.push('/orders')}>
              Trở về danh sách
            </Button>
          </CustomStyle>
        </EmptyPage>
      </CustomTitle>
    </PageWrapper>
  ) : (
    <PageWrapperDefault fixWidth>
      <Tabs defaultActiveKey="1">
        {items.map(item => (
          <TabPane tab={item.label} key={item.key}>
            {item.children}
          </TabPane>
        ))}
      </Tabs>
      {order?.odii_status === 2 &&
        order?.fulfillment_status === 'supplier_confirmed' &&
        !checkFullOrderItem() && (
          <>
            <div
              className="input-qr"
              style={{ opacity: `${handleQr ? 1 : 0}` }}
            >
              <input
                placeholder="Nhập mã QR code"
                ref={inputRef}
                autoFocus={true}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    handlePressQR(e);
                  }
                }}
              />
            </div>
            {!handleQr && (
              <div className="button-qr">
                <Button onClick={() => setHandleQr(true)} height={39}>
                  Nhập tay QR Code
                </Button>
              </div>
            )}
          </>
        )}
      {modals.map(modal => currModalKey === modal.key && modal.getContent({}))}
      <PrintPreview ref={printRef} data={printData}></PrintPreview>
      {batchProgressModel.visible && (
        <BatchActionProgress
          visible={batchProgressModel.visible}
          action_type={batchProgressModel.action_type}
          items={batchProgressModel.items}
          onCompleted={action_type => {
            setBatchProgressModel({ ...initBatchActModel });
            loadOrderData();
            if (action_type === 'other_ready_toship') {
              updateShippingOrderOtherRef.current.hide();
            }
          }}
          metadata={batchProgressModel.metadata}
        />
      )}
      <UpdateShippingProviderTiktok
        ref={updateShippingOrderOtherRef}
        onSubmit={onSubmitOtherShipping}
      />
    </PageWrapperDefault>
  );
}

const PageActionSelect = styled(Select)`
  .ant-select-selector {
    border: none !important;
    box-shadow: none !important;
    font-size: 14px;
    color: ${({ theme }) => theme.primary}!important;
  }
  .ant-select-selection-placeholder,
  .ant-select-selector + span {
    color: ${({ theme }) => theme.primary}!important;
  }
  .ant-select-selection-placeholder {
    padding-right: 14px !important;
  }
  .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder {
  }
  .ant-select-arrow {
    top: 46%;
    .anticon > svg {
      width: 10px;
    }
  }
`;

const ButonActionPrint = styled(Button)`
  width: 120px;
  padding: 0 10px 0 10px !important;
  justify-content: space-between !important;
  &.loading {
    pointer-events: none;
  }
`;

const ButonActionConfirmPacking = styled(Button)`
  width: 136px;
  padding: 0 !important;
  justify-content: center !important;
`;

const ActionWrapper = styled.div`
  display: flex;
`;
const SpanPrice = styled.span`
  color: orange;
  font-weight: bold;
`;
