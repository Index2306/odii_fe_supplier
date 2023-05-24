/**
 *
 * Orders
 *
 */
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, Tooltip } from 'antd';
import {
  PageWrapper,
  // Image,
  // Divider,
  Table,
  Link,
} from 'app/components';
import constants from 'assets/constants';
import moment from 'moment';
import notification from 'utils/notification';
import { getOrderAction } from 'utils/helpers';
import { CustomTitle, CustomStyle, SectionWrapperCustom } from 'styles/commons';
import {
  selectLoading,
  selectData,
  selectPagination,
  selectListStores,
  selectSummary,
  selectSelectedOrders,
} from './slice/selectors';

import { useOrdersSlice } from './slice';
import Confirm from 'app/components/Modal/Confirm';
import AlertDialog from 'app/components/Modal/AlertDialog';
import styled from 'styled-components/macro';
import request from 'utils/request';
import { FilterBar } from './Features';
import TableOrder from './Components/TableOrder';
import BatchActionProgress from './Components/List/BatchActionProgress';
import UpdateShippingMultiOrderShopee from './Components/Update/UpdateShippingProvider/UpdateShippingMultiOrderShopee';
import UpdateShippingProviderTiktok from './Components/Update/UpdateShippingProvider/UpdateShippingProviderTiktok';
//fulfillment action
const confirmAction = constants.FULFILLMENT_ACTION.CONFIRM;
const rejectAction = constants.FULFILLMENT_ACTION.REJECT;
const cancelAction = constants.FULFILLMENT_ACTION.CANCEL;

const SELLER_CONFIRMED_STATUS =
  constants.ORDER_FULFILLMENT_STATUS.SELLER_CONFIRMED.id;
// const SUPPLIER_CONFIRMED_STATUS = constants.ORDER_FULFILLMENT_STATUS[5].id;
const initConfirmModel = {
  visible: false,
  loading: false,
  action: {},
};
const initBatchActModel = {
  visible: false,
  action_tpye: '',
  items: [],
};
const ALLOW_MULTI_SELECT_TABS = ['2-seller_confirmed', '2-pending'];

export function Orders({ history }) {
  const dispatch = useDispatch();
  const { actions } = useOrdersSlice();
  const isLoading = useSelector(selectLoading);
  const pagination = useSelector(selectPagination);
  const data = useSelector(selectData);
  const summary = useSelector(selectSummary);
  const listStores = useSelector(selectListStores);
  const [selectedRowsArray, setSelectedRowsArray] = React.useState([]);
  const [isShowConfirmStatus, setIsShowConfirmStatus] = React.useState(false);
  const [isShowCopyTitle, setShowCopyTitle] = React.useState(false);
  const [isShowCopy, setShowCopy] = React.useState(false);
  const [checkClick, setCheckClick] = React.useState(0);
  // const [isLoadingConfirm, setLoadingConfirm] = React.useState(false);
  // const [orderConfirm, setOrderConfirm] = React.useState({});
  const [detail, setDetail] = React.useState({});
  const [actionType, setActionType] = React.useState();
  const [tab, setTab] = React.useState();
  const [selected, setSelected] = React.useState(0);
  const [confirmModel, setConfirmModel] = React.useState(initConfirmModel);
  const [batchProgressModel, setBatchProgressModel] = React.useState({
    ...initBatchActModel,
  });
  const selectedOrders = useSelector(selectSelectedOrders);
  const alertDialogRef = React.useRef();
  const requestPayload = React.useRef();
  const updateShippingOrdersShopeeRef = React.useRef();
  const updateShippingOrderTiktokRef = React.useRef();
  const updateShippingOrderOtherRef = React.useRef();
  const orderInputRef = React.useRef();
  // const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);

  // React.useEffect(() => {
  //   getStores()
  //     .then(res => {
  //       if (!isEmpty(res?.data)) dispatch(actions.setListStores(res?.data));
  //     })
  //     .catch(() => null);
  //   return () => {
  //     dispatch(actions.resetWhenLeave());
  //   };
  // }, []);

  React.useEffect(() => {
    const delaySecond = 10000;
    let reloadPageInterval;
    let reloadPageTimeout;
    reloadPageTimeout = setTimeout(() => {
      reloadPageInterval = setInterval(() => {
        gotoPage('', true);
      }, delaySecond);
    }, delaySecond);
    return () => {
      clearInterval(reloadPageInterval);
      clearTimeout(reloadPageTimeout);
    };
  }, []);

  const copyOrderCode = (e, record) => {
    navigator.clipboard.writeText(
      !record.platform ? record.code : record.shop_order_id || record.code,
    );
    setShowCopyTitle(true);
    setShowCopy(record.code);
    setTimeout(() => {
      setShowCopyTitle(false);
    }, 800);
  };

  const handlePressQR = e => {
    dispatch(
      actions.updateQrChecked({
        id: orderInputRef.current.order_id,
        data: {
          code: e.target.value,
        },
        onSuccess: () => {
          gotoPage();
        },
      }),
    );
    orderInputRef.current.value = '';
  };

  const columns = React.useMemo(
    () => [
      {
        title: (
          <div
            className="custome-header d-flex"
            style={{ justifyContent: 'space-between' }}
          >
            <div className="order-code title-box">ID đơn hàng</div>
            Đơn giá
            {/* {tab == 'ready_to_ship' && <BoxColor colorValue='#9D9D9D' notIcon style={{textAlign: 'center'}}>
              {selected} Đã chọn
            </BoxColor>} */}
          </div>
        ),
        dataIndex: 'shop_order_id',
        key: 'shop_order_id',
        width: '33%',
        className: 'order-custom',
        render: (text, record) => (
          <div className="customer-name">
            <div className="d-flex" style={{ alignItems: 'center' }}>
              <CustomLink
                to={`/orders/update/${record.id}`}
                onMouseOver={e => {
                  orderInputRef.current.focus();
                  orderInputRef.current.order_id = e.target.id;
                }}
                onMouseOut={e => {
                  orderInputRef.current.blur();
                }}
              >
                <CustomStyle color="#1976D2" id={record.id}>
                  {!record.platform ? record.code : text || record.code}
                </CustomStyle>
              </CustomLink>
              <Tooltip
                visible={isShowCopyTitle && isShowCopy == record.code}
                placement="bottom"
                title="Copied"
                trigger="click"
                overlayInnerStyle={{
                  background: '#7e7575',
                  color: '#fff',
                  borderRadius: 20,
                }}
              >
                <div
                  className="icon-customer"
                  onClick={e => copyOrderCode(e, record)}
                >
                  <svg
                    width="13"
                    height="16"
                    viewBox="0 0 13 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.66671 0.666672H1.66671C0.933374 0.666672 0.333374 1.26667 0.333374 2.00001V11.3333H1.66671V2.00001H9.66671V0.666672ZM11.6667 3.33334H4.33337C3.60004 3.33334 3.00004 3.93334 3.00004 4.66667V14C3.00004 14.7333 3.60004 15.3333 4.33337 15.3333H11.6667C12.4 15.3333 13 14.7333 13 14V4.66667C13 3.93334 12.4 3.33334 11.6667 3.33334ZM11.6667 14H4.33337V4.66667H11.6667V14Z"
                      fill="#6F8DAB"
                    />
                  </svg>
                </div>
              </Tooltip>
              <CustomStyle className="title-name">
                <svg
                  style={{ marginRight: 6 }}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_3118_97389)">
                    <path
                      d="M6 4.875C7.24264 4.875 8.25 3.86764 8.25 2.625C8.25 1.38236 7.24264 0.375 6 0.375C4.75736 0.375 3.75 1.38236 3.75 2.625C3.75 3.86764 4.75736 4.875 6 4.875Z"
                      stroke="#BFBFBF"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6 6.75C4.70707 6.75 3.46709 7.26361 2.55285 8.17785C1.63861 9.09209 1.125 10.3321 1.125 11.625H10.875C10.875 10.3321 10.3614 9.09209 9.44715 8.17785C8.53291 7.26361 7.29293 6.75 6 6.75V6.75Z"
                      stroke="#BFBFBF"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3118_97389">
                      <rect width="12" height="12" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                {record.customer_full_name}
              </CustomStyle>
            </div>
            {record.platform == null && (
              <div className="box-custom">
                <div className="box-text">Đơn ngoại sàn</div>
              </div>
            )}
          </div>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="text-center title-box">
              <Tooltip title="Trạng thái đơn hàng">TT đơn hàng</Tooltip>
            </div>
          </div>
        ),
        className: 'order-custom',
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">
              <Tooltip title="Trạng thái xử lý đơn hàng">TT cung cấp</Tooltip>
            </div>
          </div>
        ),
        className: 'order-custom',
        width: '10%',
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">
              <Tooltip title="Tổng tiền Odii sẽ thanh toán cho nhà cung cấp">
                Thanh toán
              </Tooltip>
            </div>
          </div>
        ),
        className: 'order-custom',
        width: '10%',
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Cửa hàng</div>
          </div>
        ),
        className: 'order-store',
        width: '150px',
        render: (store, record) => (
          <div className="date-time">Ngày tạo đơn :</div>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Thao tác</div>
          </div>
        ),
        dataIndex: 'store',
        key: 'store',
        width: '144px',
        className: 'order-custom',
        render: (store, record) => (
          <div className="order__create-time">
            {formatDateStr(record.created_at)}
          </div>
        ),
      },
    ],
    [tab, selected, isShowCopyTitle, isShowCopy, orderInputRef],
  );

  function formatDateStr(dateStr) {
    return moment(dateStr).format('HH:mm DD/MM/YYYY');
  }

  const toggleConfirmModal = order => {
    // if (needRefresh === true) gotoPage();
    if (isShowConfirmStatus) {
      setActionType('');
      setDetail({});
    } else {
      // loadOrderConfirmInfo(order);
    }
    setIsShowConfirmStatus(!isShowConfirmStatus);
  };

  const submitAction = () => {
    request(`oms/supplier/orders/${detail.id}/change-fulfill-status`, {
      method: 'put',
      data: {
        fulfillment_status: actionType,
      },
    })
      .then(response => {
        if (response.is_success) {
          notification(
            'success',
            `Order #${detail?.code} đã ${
              actionType === confirmAction
                ? 'được xác nhận'
                : actionType === rejectAction
                ? 'bị từ chối'
                : 'bị hủy bỏ'
            }!`,
            'Thành công!',
          );
          toggleConfirmModal();
          dispatch(
            actions.updateLists({
              id: detail.id,
              status: response.data.fulfillment_status,
            }),
          );
        }
      })
      .catch(err => err);
  };

  const gotoPage = (data = '', isReload) => {
    let payload = isReload ? history.location.search : data;
    if (!payload) {
      payload = '?page=1&page_size=10';
    }
    const strPayload = JSON.stringify(payload);
    if (requestPayload.current !== strPayload) {
      dispatch(actions.setSelectedOrders([]));
      setSelectedRowsArray([]);
    }
    requestPayload.current = strPayload;
    dispatch(actions.getData(payload));
  };

  const getConfirmMessage = () => {
    // const total_price = formatMoney(orderConfirm.total_fulfill_price);
    switch (actionType) {
      case confirmAction:
        return <span>Bạn có chắc chắn muốn cung cấp đơn hàng này không?</span>;
      case rejectAction:
        return <span>Bạn có chắc chắn muốn từ chối đơn hàng này không?</span>;
      case cancelAction:
        return <span>Bạn có chắc chắn muốn hủy bỏ đơn hàng này không?</span>;
      default:
        return <span></span>;
    }
  };

  // const isEnableUpdatePacking = order =>
  //   !isPersonalOrder(order) &&
  //   ['supplier_confirmed'].includes(order?.fulfillment_status) &&
  //   ['pending'].includes(order?.shop_status);

  // const isEnablePrint = order =>
  //   !isPersonalOrder(order) &&
  //   // ['supplier_confirmed'].includes(order?.fulfillment_status) &&
  //   !['pending', 'unpaid'].includes(order?.shop_status);

  const getSelectedOrderMetadata = items => {
    return {
      print_count: items.filter(item => item.actions && item.actions.print)
        .length,
      print_pack_list_count: items.filter(
        item => item.actions && item.actions.print_pack_list,
      ).length,
      seller_confirm_count: items.filter(
        item => item.actions && item.actions.seller_confirm,
      ).length,
      supplier_confirm_count: items.filter(
        item => item.actions && item.actions.supplier_confirm,
      ).length,
      update_packing_count: items.filter(
        item => item.actions && item.actions.update_packing,
      ).length,
      shopee_update_packing_count: items.filter(
        item => item.actions && item.actions.shopee_update_packing,
      ).length,
      ready_toship_count: items.filter(
        item => item.actions && item.actions.ready_toship,
      ).length,
      tiktok_ready_toship_count: items.filter(
        item => item.actions && item.actions.tiktok_ready_toship,
      ).length,
      other_ready_toship_count: items.filter(
        item => item.actions && item.actions.other_ready_toship,
      ).length,
      // Do not allow cancel multi order
      // order_cancel_count: items.filter(
      //   item => item.actions && item.actions.order_cancel,
      // ).length,
    };
  };
  const updateSelectedOrders = selectedOrders => {
    const result = {};
    const items = [];
    // let packingOrPrintNumber = 0;
    selectedOrders.forEach(order => {
      const actions = getOrderAction(
        order?.platform,
        'supplier',
        order?.odii_status,
        order?.fulfillment_status,
        order?.shop_status,
        order?.status,
      );
      const orderData = {
        id: parseInt(order.id),
        actions: actions,
        platform: order?.platform,
        code: order?.code,
        shipment_provider: order?.shipment_provider || 'GHTK',
        shop_status: order?.shop_status,
      };
      items.push(orderData);
    });
    result.items = items;
    result.metadata = getSelectedOrderMetadata(items);
    let hasAction = false;
    Object.keys(result.metadata).forEach(e => {
      if (result.metadata[e] > 0) {
        hasAction = true;
      }
    });
    result.hasAction = hasAction;
    return result;
  };
  const rowSelection = {
    selectedRowKeys: selectedRowsArray,
    // type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      let showDialog = false;
      let newSelectedRows;
      let newSelectedRowKeys;
      if (selectedRows && selectedRows.length > 0) {
        const firstPlatform = selectedRows[0].platform;
        const diffItem = selectedRows.find(
          item => item.platform !== firstPlatform,
        );
        if (diffItem && !ALLOW_MULTI_SELECT_TABS.includes(tab)) {
          showDialog = true;
          alertDialogRef.current.show(
            'Chú ý',
            'Xin vui lòng chọn nền tảng trước khi xử lý hàng loạt',
          );
        }
        if (!firstPlatform) {
          if (selectedRowKeys.length - selected > 1) {
            setCheckClick(checkClick + 1);
          }
          newSelectedRows = selectedRows.filter(
            item => item.status !== 'wait_transport',
          );
          const newSelectedKeys = newSelectedRows.map(item => item.id);
          newSelectedRowKeys = selectedRowKeys.filter(item =>
            newSelectedKeys.includes(item),
          );
          if (checkClick === 1) {
            newSelectedRows.splice(0, newSelectedRows.length);
            newSelectedRowKeys.splice(0, newSelectedRowKeys.length);
            setCheckClick(0);
          }
          if (!showDialog) {
            setSelected(newSelectedRows.length);
            setSelectedRowsArray(newSelectedRowKeys);
            dispatch(
              actions.setSelectedOrders(updateSelectedOrders(newSelectedRows)),
            );
            return;
          }
        }
      }
      if (!showDialog) {
        setSelected(selectedRows.length);
        setSelectedRowsArray(selectedRowKeys);
        dispatch(actions.setSelectedOrders(updateSelectedOrders(selectedRows)));
      }
    },
    // getCheckboxProps: record => ({
    //   checked:
    //     // selectedOrders?.items?.find(item => item.id === record.id) && true,
    //     false,
    // }),
  };
  const batchActionConfirmHandler = action => {
    let url = '';
    let payload = {};
    if (action.id === 'supplier_confirm') {
      url = `oms/supplier/orders/change-fulfill-status`;
      payload.fulfillment_status = 'supplier_confirmed';
      payload.ids = selectedOrders?.items
        .filter(item => item.actions.supplier_confirm)
        .map(item => item.id);
      request(url, {
        method: 'put',
        data: payload,
      })
        .then(response => {
          notification(
            'success',
            `${payload.ids.length} đơn hàng đã được xác nhận!`,
            'Thành công!',
          );
          setConfirmModel({ ...initConfirmModel });
          gotoPage('', true);
          dispatch(actions.setSelectedOrders([]));
          setSelectedRowsArray([]);
          // loadOrderData();
        })
        .catch(err => err);
    } else if (action.id === 'update_packing' || action.id === 'ready_toship') {
      const items = selectedOrders?.items.filter(
        item => item.actions[action.id],
      );
      setConfirmModel({ ...initConfirmModel });
      setBatchProgressModel({
        action_type: action.id,
        visible: true,
        items: items,
      });
    }
  };

  const onCancelConfirmHandler = () => {
    setConfirmModel({ ...initConfirmModel });
  };
  const onBatchActionHandler = (type, items) => {
    console.log(type, items);
    if (type.id === 'supplier_confirm') {
      setConfirmModel({ visible: true, loading: false, action: type });
    } else if (type.id === 'update_packing' || type.id === 'ready_toship') {
      // lazada update packing
      setConfirmModel({
        visible: true,
        loading: false,
        action: type,
      });
    } else if (type.id === 'shopee_update_packing') {
      const selectedItem = selectedOrders?.items.filter(
        item => item?.actions?.shopee_update_packing,
      );
      updateShippingOrdersShopeeRef.current.loadData(selectedItem);
    } else if (type.id === 'tiktok_ready_toship') {
      const selectedItem = selectedOrders?.items.filter(
        item => item?.actions?.tiktok_ready_toship,
      );
      updateShippingOrderTiktokRef.current.loadData(selectedItem);
    } else if (type.id === 'other_ready_toship') {
      const selectedItem = selectedOrders?.items.filter(
        item => item?.actions?.other_ready_toship,
      );
      updateShippingOrderOtherRef.current.loadData(selectedItem);
    }
  };
  const onSubmitShopeeShipping = (shipType, addressPickup, timePickup) => {
    const selectedItem = selectedOrders?.items.filter(
      item => item?.actions?.shopee_update_packing,
    );
    setBatchProgressModel({
      action_type: 'shopee_update_packing',
      visible: true,
      items: selectedItem,
      metadata: {
        addressPickup: addressPickup,
        timePickup: timePickup,
        shipType: shipType,
      },
    });
  };
  const onSubmitTiktokShipping = (orders, isPickup) => {
    setBatchProgressModel({
      action_type: 'tiktok_ready_toship',
      visible: true,
      items: orders,
      metadata: {
        is_pickup: isPickup,
      },
    });
  };
  const onSubmitOtherShipping = (orders, isPickup, reasonghn) => {
    setBatchProgressModel({
      action_type: 'other_ready_toship',
      visible: true,
      items: orders,
      metadata: {
        is_pickup: isPickup,
        reasonghn: reasonghn,
      },
    });
  };
  const onActionHandler = (action_type, data) => {
    if (action_type === 'tiktok_ready_toship') {
      updateShippingOrderTiktokRef.current.loadData([data]);
    }
    if (action_type === 'other_ready_toship') {
      updateShippingOrderOtherRef.current.loadData([data]);
    }
  };
  return (
    <PageWrapper>
      <CustomStyle className="d-flex justify-content-between">
        <CustomTitle>Đơn hàng</CustomTitle>
        <div style={{ opacity: 0, position: 'fixed', zIndex: 10, right: 0 }}>
          <input
            ref={orderInputRef}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handlePressQR(e);
              }
            }}
          />
        </div>
        {/* <Button className="btn-sm" onClick={goCreate}>
          + Tạo đơn hàng
        </Button> */}
      </CustomStyle>
      <SectionWrapperCustom pt={{ xs: 's0' }} className="">
        <CustomStyle className="title text-left" px={{ xs: 's6' }}>
          <FilterBar
            isLoading={isLoading}
            gotoPage={gotoPage}
            history={history}
            listStores={listStores}
            pagination={pagination}
            tab={value => {
              setTab(value);
            }}
            summary={summary}
            batchActionHandler={onBatchActionHandler}
          />
        </CustomStyle>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <Row gutter={24}>
            <Col span={24}>
              <TableWrapper>
                <Table
                  className="order-tbl"
                  columns={columns}
                  // rowSelection={tab == '3' ? rowSelection : false}
                  rowSelection={rowSelection}
                  searchSchema={{
                    keyword: {
                      required: false,
                    },
                    fulfillment_status: {
                      required: false,
                    },
                    // status: {
                    //   required: false,
                    // },
                    odii_status: {
                      required: false,
                    },
                    print_status: {
                      required: false,
                    },
                    // store_id: {
                    //   required: false,
                    // },
                    from_time: {
                      required: false,
                    },
                    to_time: {
                      required: false,
                    },
                    platform: {
                      required: false,
                    },
                  }}
                  expandable={{
                    expandedRowKeys: data.map(e => e.id),
                    expandedRowRender: record => {
                      return (
                        <TableOrder
                          data={record}
                          gotoPage={gotoPage}
                          history={history}
                          tab={tab}
                          actionHandler={onActionHandler}
                        />
                      );
                    },
                    expandIcon: ({ expanded, onExpand, record }) => <></>,
                  }}
                  data={{ data, pagination }}
                  scroll={{ x: 1100 }}
                  rowKey={record => record.id}
                  // rowClassName="pointer"
                  actions={gotoPage}
                  // onRow={record => ({
                  //   onClick: goDetail(record),
                  // })}
                />
              </TableWrapper>
            </Col>
          </Row>
        </Spin>
      </SectionWrapperCustom>
      {confirmModel.visible && (
        <Confirm
          isLoading={confirmModel.loading}
          isFullWidthBtn
          isModalVisible={confirmModel.visible}
          key={confirmModel.action.id}
          color={confirmModel.action.color}
          title={confirmModel.action.title}
          data={{
            message: confirmModel.action.confirm_message.replace(
              '{0}',
              selectedOrders?.metadata[confirmModel.action.count_name],
            ),
          }}
          handleConfirm={() => batchActionConfirmHandler(confirmModel.action)}
          handleCancel={onCancelConfirmHandler}
        />
      )}
      {batchProgressModel.visible && (
        <BatchActionProgress
          visible={batchProgressModel.visible}
          action_type={batchProgressModel.action_type}
          items={batchProgressModel.items}
          onCompleted={action_type => {
            setBatchProgressModel({ ...initBatchActModel });
            gotoPage('', true);
            if (action_type === 'shopee_update_packing') {
              updateShippingOrdersShopeeRef.current.hide();
            } else if (action_type === 'tiktok_ready_toship') {
              updateShippingOrderTiktokRef.current.hide();
            } else if (action_type === 'other_ready_toship') {
              updateShippingOrderOtherRef.current.hide();
            }
          }}
          metadata={batchProgressModel.metadata}
        />
      )}
      <AlertDialog ref={alertDialogRef} />
      <UpdateShippingMultiOrderShopee
        ref={updateShippingOrdersShopeeRef}
        onSubmit={onSubmitShopeeShipping}
      />
      <UpdateShippingProviderTiktok
        ref={updateShippingOrderTiktokRef}
        onSubmit={onSubmitTiktokShipping}
      />
      <UpdateShippingProviderTiktok
        ref={updateShippingOrderOtherRef}
        onSubmit={onSubmitOtherShipping}
      />
    </PageWrapper>
  );
}

const TableWrapper = styled.div`
  table {
    .text-right {
      text-align: right;
    }
    .ant-table-thead > tr > th {
      border-bottom: 10px solid #f5f6fd;
      border-bottom-color: #f5f6fd !important;
    }
    .ant-table-row-expand-icon-cell {
      padding: 0 !important;
      width: 0%;
    }
    .ant-table-tbody {
      tr {
        td {
          padding: 12px 16px;
        }
      }
    }
    .ant-table-expanded-row {
      td {
        background: #fff;
      }
      .ant-table-cell {
        &:not(last-child) {
          border-bottom: 10px solid #f5f6fd;
        }
      }
    }
    tr {
      position: relative;
      /* display: unset; */

      th:last-child,
      .order-code {
        font-weight: 500;
      }
      .order-quantity,
      .th-number {
        text-align: right;
      }
      .order__create-time {
        font-size: 12px;
        color: ${({ theme }) => theme.gray3};
        margin-top: 2px;
      }
      .customer_address {
        font-size: 12px;
        color: ${({ theme }) => theme.gray3};
        white-space: nowrap;
        margin-top: 2px;
      }
      .order-status {
        width: unset;
        min-width: 110px;
      }
      .shop-status {
        text-align: center;
      }
      .fulfillment-status {
        padding-left: 0;
      }
      .total-price {
        font-size: 14px;
        padding-left: 20px !important;
        padding-right: 60px !important;
      }
      .order-store {
        min-width: 150px;
      }
      .store-info {
        display: inline-flex;
        position: relative;
        align-items: center;
        width: 100%;
      }
      .value-empty {
        color: #ccc;
      }
      .store-icon {
        width: 20px;
        border-radius: 100%;
        object-fit: cover;
        border: 1px solid #e1e1e1;
      }
      .store-name {
        margin-left: 7px;
      }
      .action-wrapper {
        display: none;
        position: absolute;
        padding: 0;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        white-space: nowrap;
        word-break: keep-all;
        > div {
          display: inline-flex;
          > button {
            margin-left: 11px;
          }
        }
        .btn-cancel:not(:hover) {
          background: #fff;
        }
      }
    }
    tr:hover {
      .action-wrapper {
        display: inline-flex;
      }
    }
    .order-code {
      min-width: 120px;
    }
    &:hover .order-custom,
    &:hover .ant-table-selection-column,
    &:hover .order-store {
      background: #fff !important;
    }
    .order-custom,
    .ant-table-selection-column {
      padding: 8px 10px !important;

      .ant-checkbox-inner {
        border: 2px solid #d9d9d9;
      }
      .customer-name {
        display: flex;
        align-items: center;

        .title-name {
          border-left: 1px solid #d7d7d7;
          padding-left: 24px;
          font-size: 13px;
          line-height: 15px;
          align-items: center;
          display: flex;
          margin-left: 24px;
        }

        @media screen and (max-width: 1366px) {
          .title-name {
            padding-left: 10px;
            margin-left: 10px;
          }
        }

        .icon-customer {
          margin-left: 6px;
          cursor: pointer;
        }

        .box-custom {
          background: #f4f4f4;
          border-radius: 3px;
          padding: 4px 8px;
          text-align: right;
          margin-left: 10px;

          .box-text {
            font-size: 12px;
            color: #9d9d9d;
          }
        }
      }
    }
    .order-store {
      padding: 0 !important;
      .date-time {
        font-weight: 500;
        color: #757575;
        text-align: right;
      }
    }
  }
`;

const CustomLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #333333;
`;
