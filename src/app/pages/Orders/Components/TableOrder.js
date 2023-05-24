import * as React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { CustomStyle } from 'styles/commons';
import { Table, Spin, Row, Col, List, Tooltip, Menu, Modal } from 'antd';
import { selectLoading, selectsystemTime } from '../slice/selectors';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { formatMoney, htmlStringToPdf } from 'utils/helpers';
import constants from 'assets/constants';
import { Image, Dropdown, BoxColor } from 'app/components';
import { isEmpty, sum } from 'lodash';
import moment from 'moment';
import { CheckOutlined, DownOutlined } from '@ant-design/icons';
import { downloadFiles } from 'utils/request';
import PrintPreview from '../Components/Update/PrintPreview';
import UpdateShippingProvider from '../Components/Update/UpdateShippingProvider';
import request from 'utils/request';
import Confirm from 'app/components/Modal/Confirm';
import notification from 'utils/notification';
import { getOrderAction, GetPrintTime } from 'utils/helpers';
import { order } from 'assets/images/icons';
import axios from 'axios';

const { Item } = Menu;

const confirmAction = constants.FULFILLMENT_ACTION.CONFIRM;
const rejectAction = constants.FULFILLMENT_ACTION.REJECT;
const cancelAction = constants.FULFILLMENT_ACTION.CANCEL;

const PRINT_POGRESS_MODAL_KEY = 'PRINT_POGRESS_MODAL';

const SELLER_CONFIRMED_STATUS =
  constants.ORDER_FULFILLMENT_STATUS.SELLER_CONFIRMED.id;
const SUPPLIER_CONFIRMED_STATUS =
  constants.ORDER_FULFILLMENT_STATUS.SUPPLIER_CONFIRMED.id;
const PENDING_STATUS = constants.ORDER_FULFILLMENT_STATUS.PENDING.id;
const READY_TO_SHIP_STATUS =
  constants.ORDER_FULFILLMENT_STATUS.READY_TO_SHIP.id;
const SUP_CANCELLED_STATUS =
  constants.ORDER_FULFILLMENT_STATUS.SUP_CANCELLED.id;
const SUP_REJECTED_STATUS = constants.ORDER_FULFILLMENT_STATUS.SUP_REJECTED.id;
const PLATFORM_CANCELLED_STATUS =
  constants.ORDER_FULFILLMENT_STATUS.PLATFORM_CANCELLED;

const SHOPEE_ORDER_SHOP_STATUS = constants.SHOPEE_ORDER_SHOP_STATUS;

const UPDATE_STATUS_CONFIRM__KEY = 'CONFIRM_UPDATE_STATUS_MODAL';
const UPDATE_SHIPPING_PROVIDER_MODAL_KEY = 'UPDATE_SHIPPING_PROVIDER_MODAL';

export default function TableOrder(props) {
  const { data, gotoPage, history, tab, actionHandler } = props;
  const isLoading = useSelector(selectLoading);
  const systemTime = useSelector(selectsystemTime);
  const printRef = React.useRef(null);
  const [isLoadingPrint, setLoadingPrint] = React.useState(false);
  const isPersonalOrder = !data?.shop_order_id;
  const fulfillmentStatus = data?.fulfillment_status;
  const [printData, setPrintData] = React.useState([]);
  const [isLoadingConfirm, setLoadingConfirm] = React.useState(false);
  const [orderConfirm, setOrderConfirm] = React.useState({});
  const [updateStatusActionType, setUpdateStatusActionType] = React.useState(
    null,
  );
  const [currModalKey, setCurrModalKey] = React.useState(null);
  const [isProgressing, setProgressing] = React.useState(false);
  const { roles } = useSelector(selectCurrentUser);
  let reasonSrc = [];
  if (data?.platform) {
    reasonSrc = constants.ORDER_CANCEL_REASON[data.platform].filter(
      item =>
        !item.available_status_list ||
        item.available_status_list.includes('*') ||
        item.available_status_list.includes(`${data?.shop_status}`),
    );
  }

  React.useEffect(() => {
    loadOrderData();
  }, [isLoadingPrint]);

  const loadOrderConfirmInfo = async order => {
    setLoadingConfirm(true);
    try {
      const response = await request(
        `oms/seller/order/${order.id}/confirm-info`,
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

  const getSupplierPriceText = record => {
    let finalPrice = record?.origin_supplier_price;
    if (!isEmpty(record?.promotion)) {
      if (record?.promotion?.prtType === 'product_by') {
        finalPrice = record?.promotion?.finalPrice;
      } else {
        finalPrice = record?.origin_supplier_price;
      }

      return <div>{formatMoney(finalPrice)}</div>;
    } else {
      return <div>{formatMoney(record?.origin_supplier_price)}</div>;
    }
  };

  const getTotalSupplierPrice = orderItems => {
    let totalPrice = 0;
    orderItems.map(item => {
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
    return <div>{formatMoney(totalPrice)}</div>;
  };

  const Uniq = (arr = []) => {
    return arr.reduce(
      (t, v) =>
        t
          .map(item => item.product_variation_id)
          .includes(v.product_variation_id)
          ? [
              {
                ...t.find(
                  e => e.product_variation_id == v.product_variation_id,
                ),
                quantity:
                  t.find(e => e.product_variation_id == v.product_variation_id)
                    .quantity + 1,
              },
            ]
          : [...t, v],
      [],
    );
  };

  const checkQrOrderItem = () => {
    let total = 0;
    Uniq(data?.order_item).forEach(item => {
      total += item.quantity;
      total -= item.qr_checked;
    });
    return total === 0;
  };

  const handlePrint = useReactToPrint({
    removeAfterPrint: true,
    content: () => printRef.current,
    onAfterPrint: () => {
      setPrintData([]);
      setLoadingPrint(false);
    },
  });

  const getCancelReason = value => {
    const cancel_reason = constants?.ORDER_CANCEL_REASON_NOTE.find(
      v => v.id === value,
    );
    return cancel_reason?.name;
  };

  const isEnableUpdatePacking = () => {
    const isLazadaEnable =
      data?.platform === 'lazada' &&
      [SUPPLIER_CONFIRMED_STATUS].includes(data?.fulfillment_status) &&
      [PENDING_STATUS].includes(data?.shop_status);

    const isShopeeEnable =
      data?.platform === 'shopee' &&
      [SUPPLIER_CONFIRMED_STATUS].includes(data?.fulfillment_status) &&
      [
        SHOPEE_ORDER_SHOP_STATUS.READY_TO_SHIP.id,
        SHOPEE_ORDER_SHOP_STATUS.PROCESSED.id,
        SHOPEE_ORDER_SHOP_STATUS.READY_TO_CREATE_DOCUMENT.id,
      ].includes(data?.shop_status);

    return isLazadaEnable || isShopeeEnable;
  };

  const isEnablePrint = () => {
    const isLazadaEnable =
      data?.platform === 'lazada' &&
      ![
        SUP_REJECTED_STATUS,
        SUP_CANCELLED_STATUS,
        PLATFORM_CANCELLED_STATUS,
      ].includes(data?.fulfillment_status) &&
      [READY_TO_SHIP_STATUS].includes(data?.shop_status);

    const isShopeeEnable =
      data?.platform === 'shopee' &&
      ![
        SUP_REJECTED_STATUS,
        SUP_CANCELLED_STATUS,
        PLATFORM_CANCELLED_STATUS,
      ].includes(data?.fulfillment_status) &&
      ![
        SHOPEE_ORDER_SHOP_STATUS.UNPAID.id,
        SHOPEE_ORDER_SHOP_STATUS.READY_TO_SHIP.id,
        SHOPEE_ORDER_SHOP_STATUS.PROCESSED.id,
        SHOPEE_ORDER_SHOP_STATUS.CANCELLED.id,
        SHOPEE_ORDER_SHOP_STATUS.READY_TO_CREATE_DOCUMENT.id,
      ].includes(data?.shop_status);

    return isLazadaEnable || isShopeeEnable;
  };

  const isEnableUpdateReadToShip =
    isPersonalOrder &&
    data?.fulfillment_status &&
    ![
      constants.ORDER_FULFILLMENT_STATUS.PENDING.id,
      constants.ORDER_FULFILLMENT_STATUS.SELLER_CONFIRMED.id,
      constants.ORDER_FULFILLMENT_STATUS.READY_TO_SHIP.id,
      constants.ORDER_FULFILLMENT_STATUS.SELLER_DELIVERED.id,
      constants.ORDER_FULFILLMENT_STATUS.SUP_REJECTED.id,
      constants.ORDER_FULFILLMENT_STATUS.SUP_CANCELLED.id,
      constants.ORDER_FULFILLMENT_STATUS.CANCEL.id,
    ].includes(data?.fulfillment_status);

  function formatDateStr(dateStr) {
    return moment(dateStr).format('HH:mm DD/MM/YYYY');
  }

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
              data.shop_order_id || data.id
            }`}</span>{' '}
            sẽ bị hủy và Odii sẽ hoàn trả cho nhà bán hàng số tiền{' '}
            <SpanPrice>{total_price}</SpanPrice>&nbsp;
          </span>
        );
      default:
        return <span></span>;
    }
  };

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
          order={data}
        ></UpdateShippingProvider>
      ),
    },
    {
      key: UPDATE_STATUS_CONFIRM__KEY,
      getContent: () => (
        <Confirm
          isLoading={isLoadingConfirm}
          isFullWidthBtn
          key={UPDATE_STATUS_CONFIRM__KEY}
          color={updateStatusActionType === confirmAction ? 'blue' : 'red'}
          title={`${
            updateStatusActionType === confirmAction
              ? 'Xác nhận cung cấp'
              : updateStatusActionType === rejectAction
              ? 'Từ chối'
              : 'Hủy bỏ'
          } đơn hàng`}
          data={
            !!data.platform && {
              message: getConfirmMessage(),
            }
          }
          handleConfirm={updateStatus}
          handleCancel={toggleUpdateStatusConfirm}
          reasonList={
            updateStatusActionType === confirmAction ||
            (updateStatusActionType === cancelAction && !data.platform)
              ? null
              : reasonSrc
          }
          cancelWarning={
            updateStatusActionType === cancelAction ? getConfirmMessage() : null
          }
        />
      ),
    },
    {
      key: PRINT_POGRESS_MODAL_KEY,
      getContent: () => (
        <PrintProgressModal
          width={270}
          closable={false}
          className="box-df"
          centered={true}
          title={null}
          footer={null}
          visible={isProgressing}
        >
          <div className="print-progress-content">
            <span>
              <i className="loading-icon far fa-spinner-third fa-spin"></i>
              <span className="progress-title">Đang xử lý</span>
            </span>
          </div>
        </PrintProgressModal>
      ),
    },
  ];

  const getMenu = actions => {
    return (
      <Menu>
        {actions.supplier_confirm && (
          <Item onClick={() => toggleUpdateStatusConfirm(confirmAction)}>
            Xác nhận
          </Item>
        )}
        {actions.shopee_update_packing && checkQrOrderItem() && (
          <Item onClick={() => toggleModal(UPDATE_SHIPPING_PROVIDER_MODAL_KEY)}>
            Chuẩn bị hàng
          </Item>
        )}
        {actions.update_packing && checkQrOrderItem() && (
          <Item onClick={() => toggleModal(UPDATE_SHIPPING_PROVIDER_MODAL_KEY)}>
            Xác nhận đóng gói
          </Item>
        )}
        {actions.tiktok_ready_toship && checkQrOrderItem() && (
          <Item
            onClick={() => {
              if (actionHandler) actionHandler('tiktok_ready_toship', data);
            }}
          >
            Sắp xếp vận chuyển
          </Item>
        )}
        {actions.ready_toship && checkQrOrderItem() && (
          <Item onClick={updateRst}>Sẵn sàng vận chuyển</Item>
        )}

        {actions.other_ready_toship && checkQrOrderItem() && (
          <Item
            onClick={() => {
              if (actionHandler) actionHandler('other_ready_toship', data);
            }}
          >
            Sắp xếp vận chuyển
          </Item>
        )}

        {actions.print && <Item onClick={printShipingLabel}>In đơn hàng</Item>}
        {actions.print_pack_list && (
          <Item onClick={printShipingLabel}>In phiếu đóng gói</Item>
        )}
        {actions.order_cancel && (
          <Item onClick={() => toggleUpdateStatusConfirm(cancelAction)}>
            Hủy đơn
          </Item>
        )}
      </Menu>
    );
  };
  const renderAction = text => {
    if (text !== data.order_item[0].id || !data?.is_map) return null;
    if (isLoading) return null;
    const actions = getOrderAction(
      data?.platform,
      'supplier',
      data?.odii_status,
      data?.fulfillment_status,
      data?.shop_status,
      '',
    );
    if (!actions) return null;
    let time = {};
    time = GetPrintTime(data?.print_updated_at, systemTime, tab);

    return (
      <>
        <BoxColor className="print-status" notIcon colorValue={time?.color}>
          {time?.data}
        </BoxColor>
        {!roles?.includes('partner_source') &&
          data.status !== 'wait_transport' && (
            <Dropdown overlay={getMenu(actions)} trigger={['click']}>
              <CustomStyle className="btn-printf">
                Các thao tác
                <DownOutlined />
              </CustomStyle>
            </Dropdown>
          )}
        {data.status === 'wait_transport' && (
          <CustomStyle className="wait_transportation">
            Chờ giao vận
          </CustomStyle>
        )}
      </>
    );
  };
  const columns = React.useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Sản phẩm</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'product_name',
        key: 'product_name',
        width: '35%',
        className: 'order-item',
        render: (text, record) => (
          <WrapperOption>
            <div>
              <List.Item>
                {data.odii_status === 2 &&
                  (record.qr_checked == record.quantity ? (
                    <div className="icon-qr">
                      <CheckOutlined />
                    </div>
                  ) : (
                    record.qr_checked > 0 && (
                      <div className="icon-qr color-warning">
                        <div className="number-check">{record.qr_checked}</div>
                      </div>
                    )
                  ))}
                <List.Item.Meta
                  avatar={<Image size="45x45" src={record?.thumb} />}
                  title={
                    <>
                      <CustomStyle ml={{ xs: 's1' }}>
                        {/* <Link to={`/products/uc/${record.product_id}`}>
                          <Tooltip title={text} mouseEnterDelay={0.8}>
                            {record.metadata?.shop_product_name || text}
                          </Tooltip>
                        </Link> */}
                        <Tooltip
                          title={
                            record?.is_low_price_order
                              ? `Sản phẩm bán phá giá`
                              : text
                          }
                        >
                          <span
                            style={{
                              color: record?.is_low_price_order ? 'red' : '',
                            }}
                          >
                            {record.metadata?.shop_product_name || text}
                          </span>

                          {!isEmpty(record?.promotion) && (
                            <span style={{ color: 'red', fontSize: '10px' }}>
                              &nbsp;(SALE OFF)
                            </span>
                          )}
                        </Tooltip>
                      </CustomStyle>
                      {(record.metadata?.shop_variation_name ||
                        record.product_variation_name) && (
                        <div
                          style={{
                            color: '#8D8D8D',
                            fontSize: 12,
                            marginTop: 5,
                            marginLeft: 2,
                          }}
                        >
                          {record.metadata?.shop_variation_name ||
                            record.product_variation_name}
                        </div>
                      )}
                    </>
                  }
                  // description={`${record.option_1}${
                  //   record.option_2 ? `/${record.option_2}` : ''
                  // }${record.option_3 ? `/${record.option_3}` : ''}`}
                />
              </List.Item>
            </div>
            <div className="text-right">
              <Tooltip title="Đơn giá sản phẩm nhà cung cấp bán cho seller">
                <CustomStyle>{getSupplierPriceText(record)}</CustomStyle>
              </Tooltip>
              <Tooltip title="Đơn giá sản phẩm seller bán">
                <CustomStyle className="payment-method">
                  {formatMoney(record.retail_price)}
                </CustomStyle>
              </Tooltip>
              <div className="payment-method">x{record.quantity}</div>
            </div>
          </WrapperOption>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle textAlign="right" className="title-box">
              Trạng thái đơn hàng
            </CustomStyle>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        render: text => {
          if (text === data.order_item[0].id) {
            let currentStatus =
              constants.ODII_ORDER_STATUS_NAME[data.odii_status];
            // if (data.platform === 'shopee') {
            //   currentStatus =
            //     constants.SHOPEE_ORDER_SHOP_STATUS[data.shop_status] ||
            //     constants.ORDER_SHOP_STATUS[0];
            // } else {
            //   currentStatus =
            //     constants.ORDER_SHOP_STATUS.find(
            //       v => v.id === data.shop_status,
            //     ) || constants.ORDER_SHOP_STATUS[0];
            // }

            return (
              isEmpty(currentStatus) || (
                <div
                  className="d-flex"
                  style={{
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    className="d-flex"
                    style={{
                      textTransform: 'uppercase',
                      justifyContent: 'center',
                    }}
                  >
                    {currentStatus.icon && <img src={currentStatus.icon} />}
                    <CustomStyle
                      ml={{ xs: 's2' }}
                      fontSize={14}
                      fontWeight={600}
                      color={currentStatus.color}
                    >
                      {currentStatus?.name?.toUpperCase()}
                    </CustomStyle>
                  </div>
                  {data?.cancel_reason && (
                    <div
                      style={{
                        color: '#8d8d8d',
                        fontSize: '12px',
                        marginLeft: '4px',
                        textAlign: 'center',
                      }}
                    >
                      {getCancelReason(data?.cancel_reason) ||
                        data?.cancel_reason}
                    </div>
                  )}
                  {['delivery', 'COMPLETED', 'INVOICE_PENDING'].includes(
                    data.shop_status,
                  ) && (
                    <CustomStyle ml={{ xs: 's2' }} textAlign="center">
                      {formatDateStr(data?.updated_at)}
                    </CustomStyle>
                  )}
                </div>
              )
            );
          }
        },
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle className="title-box" pl={{ xs: 's4' }}>
              TT cung cấp
            </CustomStyle>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        width: '10%',
        render: text => {
          if (text === data.order_item[0].id) {
            const currentStatus =
              constants.ORDER_SUPPLIER_FULFILLMENT_STATUS[
                data.fulfillment_status?.toUpperCase()
              ];
            return (
              currentStatus && (
                <div
                  className="d-flex"
                  style={{
                    textTransform: 'uppercase',
                    justifyContent: 'left',
                  }}
                >
                  <img src={currentStatus?.icon} />
                  <CustomStyle
                    ml={{ xs: 's2' }}
                    fontSize={14}
                    fontWeight={600}
                    color={currentStatus.color}
                  >
                    {currentStatus.name}
                  </CustomStyle>
                </div>
              )
            );
          }
        },
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle textAlign="right" className="title-box">
              Thanh toán
            </CustomStyle>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        width: '10%',
        className: 'order-item',
        render: text => {
          if (text === data.order_item[0].id) {
            return (
              <>
                <Tooltip title="Tổng tiền supplier nhận được">
                  <CustomStyle className="price">
                    <span>{getTotalSupplierPrice(data.order_item) || 0}</span>
                  </CustomStyle>
                </Tooltip>
                <Tooltip title="Tổng tiền đơn hàng">
                  <CustomStyle className="payment-method">
                    <span>{formatMoney(data?.total_retail_price)}</span>
                  </CustomStyle>
                </Tooltip>
                <CustomStyle className="payment-method">
                  {data?.platform
                    ? ['COD', 'CASH_ON_DELIVERY'].includes(data?.payment_method)
                      ? 'Thanh toán khi nhận hàng'
                      : data?.payment_method
                    : data?.payment_status === 'paid'
                    ? 'Đã thanh toán'
                    : 'Thanh toán khi nhận hàng'}
                </CustomStyle>
              </>
            );
          }
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Cửa hàng</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        width: '145px',
        render: text => {
          if (text === data.order_item[0].id) {
            const logo = constants.SALE_CHANNEL.filter(
              item => item.id.toLowerCase() === data.store.platform,
            );
            return (
              <>
                {!data.store?.id ? (
                  <>
                    <span className="value-empty">
                      {data.store_source || 'khác'}
                    </span>
                  </>
                ) : (
                  <CustomStyle
                    className="store-info"
                    color="text"
                    fontSize={{ xs: 'f2' }}
                  >
                    <img
                      src={logo && logo[0]?.icon}
                      height="20px"
                      width="20px"
                    />
                    <span className="store-name">{data?.store.name}</span>
                  </CustomStyle>
                )}
              </>
            );
          }
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Thao tác</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        width: '140px',
        className: 'order-action',
        render: renderAction,
      },
    ],
    [data],
  );

  const printShipingLabel = async () => {
    toggleModal(PRINT_POGRESS_MODAL_KEY);
    setProgressing(true);
    if (data.platform === 'lazada') {
      printShipingLabelLazada();
    } else if (data.platform === 'tiktok') {
      let documentType = 1;
      if (data.shop_status === '111') documentType = 2;
      await fetchPrintTiktokContent(documentType);
    } else if (data.platform === 'shopee') {
      printShipingLabelShopee();
    } else {
      fetchPrintGHTKContent();
    }
  };

  const printShipingLabelLazada = async () => {
    try {
      setLoadingPrint(true);
      await fetchPrintContent();
      handlePrint();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPrint(false);
      setProgressing(false);
    }
  };

  const fetchPrintGHTKContent = async () => {
    try {
      setLoadingPrint(true);
      const response = await request(
        `oms/supplier/orders/${data.id}/print-ghtk-label-pdf`,
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
      setProgressing(false);
    } finally {
      setLoadingPrint(false);
      setProgressing(false);
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

  const fetchPrintTiktokContent = async documentType => {
    setLoadingPrint(true);
    try {
      const response = await request(
        `oms/supplier/orders/${data.id}/${documentType}/print-tiktok-order`,
        {
          method: 'get',
        },
      );
      if (response?.data && response.data.doc_url) {
        window.open(response.data.doc_url, '_blank');
      }
    } catch (error) {
      console.log('fetchPrintTiktokContent error', error);
      setProgressing(false);
    } finally {
      toggleModal(PRINT_POGRESS_MODAL_KEY);
      setProgressing(false);
    }
  };
  const fetchPrintContent = async () => {
    const response = await request(
      `oms/supplier/orders/${data.id}/get-shipping-label`,
      {
        method: 'get',
      },
    );
    setPrintData([response.data.file]);
  };

  const printShipingLabelShopee = async () => {
    try {
      setLoadingPrint(true);
      const blob = await downloadFiles(
        `oms/supplier/orders/${data.id}/download-shipping-document`,
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
      console.log('print', error);
    } finally {
      setLoadingPrint(false);
      setProgressing(false);
    }
  };

  const toggleUpdateStatusConfirm = async actionType => {
    setUpdateStatusActionType(actionType);
    if (actionType === cancelAction) {
      const isSuccess = await loadOrderConfirmInfo(data);
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

  const updateRst = () => {
    request(`oms/supplier/orders/${data.id}/set-rts`, {
      method: 'put',
    })
      .then(() => {
        loadOrderData();
      })
      .catch(err => err);
  };

  const loadOrderData = () => {
    gotoPage(history.location.search);
  };

  const updateStatus = (reasonId, comment) => {
    const payload = {
      fulfillment_status: updateStatusActionType,
      reason_id: reasonId || '',
      note: comment || '',
    };
    if (
      updateStatusActionType === confirmAction ||
      (updateStatusActionType === cancelAction && !data.platform)
    ) {
      delete payload.note;
      delete payload.reason_id;
    }
    request(`oms/supplier/orders/${data.id}/change-fulfill-status`, {
      method: 'put',
      data: payload,
    })
      .then(response => {
        notification(
          'success',
          `Order #${data?.code} đã ${
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

  return (
    <TableVarientCustom>
      <Spin tip="Đang tải..." spinning={isLoading || data ? false : true}>
        <Row gutter={24}>
          <Col span={24}>
            <div>
              <Table
                columns={columns}
                dataSource={Uniq(data.order_item)}
                pagination={false}
                rowSelection={false}
              ></Table>
            </div>
          </Col>
        </Row>
      </Spin>
      {modals.map(modal => currModalKey === modal.key && modal.getContent({}))}
      <PrintPreview ref={printRef} data={printData}></PrintPreview>
    </TableVarientCustom>
  );
}

export const PrintProgressModal = styled(Modal)`
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

const WrapperOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .ant-image {
    width: 56px;
    border-radius: 4px;
  }
  .ant-list-item-meta {
    align-items: center;

    .ant-list-item-meta-content {
      width: auto;
      max-width: 300px;
    }

    @media screen and (max-width: 1366px) {
      .ant-list-item-meta-content {
        max-width: 200px;
      }
    }
  }
  .ant-list-item-meta-title > * {
    overflow: hidden;
    /* text-align: justify; */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    line-height: 18px; /* fallback */
    max-height: 36px;
    -webkit-line-clamp: 2; /* number of lines to show */
  }
  .ant-list-item-meta-description {
    font-weight: 400;
    font-size: 12;
    color: rgba(0, 0, 0, 0.4);
  }

  .ant-list-item-meta-avatar {
    margin-right: 6px;
  }

  .ant-image-img {
    width: 56px;
  }
`;

const TableVarientCustom = styled.div`
  .ant-table-thead {
    display: none;
  }
  .ant-table-selection-column {
    opacity: 0;
  }
  .ant-table-tbody > tr {
    height: 80px;
  }
  .ant-table-tbody > tr > td {
    padding: 0px 10px !important;
    border-bottom: 1px solid #fff !important;
  }
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: #fff !important;
  }
  .order-item {
    .price span {
      font-size: 14px;
      font-weight: 700;
    }

    .payment-method {
      font-size: 12px;
      color: #8d8d8d;
    }

    .color-warning {
      background: #faad14 !important;
    }

    .icon-qr {
      width: auto;
      min-width: 23px;
      height: 23px;
      background: #52c41a;
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;

      span {
        color: #fff;
      }

      .number-check {
        height: 20px;
        color: #fff;
        font-weight: bold;
      }
    }
  }
  .order-action {
    .print-status {
      font-size: 12px;
      padding: 4px 8px;
      width: auto;
    }
    .btn-printf {
      font-size: 13px;
      color: #1976d2;
      margin-top: 5px;
      margin-left: 5px;
      align-items: center;
      cursor: pointer;
      font-weight: 500;

      .anticon-down {
        margin-left: 5px;
      }

      &:hover {
        color: #40a9ff;
        text-decoration: underline;
      }
    }
    .wait_transportation {
      width: 120px;
      height: 28px;
      background: linear-gradient(#1976d2, #f8f8f800);
      position: absolute;
      top: -12px;
      right: -16px;
      text-align: right;
      text-transform: uppercase;
      font-weight: bold;
      color: #ffffff;
      border-radius: 0 0 0 28px;
      padding-right: 5px;
    }
  }
`;
const SpanPrice = styled.span`
  color: orange;
  font-weight: bold;
`;
