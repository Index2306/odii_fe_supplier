import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Space, Modal } from 'antd';
import {
  Button,
  PageWrapper,
  Form,
  Input,
  DatePicker,
  Tabs,
  Select,
} from 'app/components';
import { SectionWrapper } from 'styles/commons';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { useDispatch, useSelector } from 'react-redux';
import { styledSystem } from 'styles/theme/utils';
import styled from 'styled-components/macro';
import { CustomStyle } from 'styles/commons';
import Confirm from 'app/components/Modal/Confirm';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { selectData } from 'app/pages/Warehousing/slice/selectors';
import { selectData as selectListUser } from 'app/pages/Employees/slice/selectors';
import { useWarehousingSlice } from 'app/pages/Warehousing/slice';
import { useEmployeesSlice } from 'app/pages/Employees/slice';
import notification from 'utils/notification';
import ListProduct from '../../Components/ListProduct';
import { useWarehouseExportSlice } from '../../slice';
import { selectDetail, selectLoading } from '../../slice/selectors';
import { COMBINE_STATUS, COMBINE_STATUS_CHIEF } from '../../constants';
import { Link } from 'react-router-dom';
import request from 'utils/request';
import FormatExport from '../../Components/formatExport';

const Item = Form.Item;
const { TabPane } = Tabs;

const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};

const initConfirmAction = {
  visible: false,
  nextState: {},
  recordId: 0,
};

export function LogisticsExportDetail({ match, history }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { actions } = useWarehouseExportSlice();
  const id = match?.params?.id;
  const warehouse_import_id = history.location.state?.warehouse_import_id;
  const data = useSelector(selectDetail);
  const isLoading = useSelector(selectLoading);
  const warehousingSlice = useWarehousingSlice();
  const employeesSlice = useEmployeesSlice();
  const userSup = useSelector(selectCurrentUser);
  const listWarehousing = useSelector(selectData);
  const listUser = useSelector(selectListUser);
  const [products, setProducts] = useState([]);
  const [, setFormValues] = useState({});
  const [confirmAction, setConfirmAction] = React.useState(initConfirmAction);
  const [selectedProduct, setselectedProducts] = React.useState([]);
  const { setFieldsValue, getFieldsValue, submit } = form;

  const { name, approved_by, approved_time } = getFieldsValue();

  React.useEffect(() => {
    if (isEmpty(listWarehousing)) {
      dispatch(warehousingSlice.actions.getData());
    }

    if (isEmpty(listUser)) {
      dispatch(employeesSlice.actions.getData(''));
    }
  }, [listWarehousing, listUser]);

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
    };
  }, []);

  const onCloseConfirmModel = () => {
    setConfirmAction({ ...initConfirmAction });
  };
  const onConfirmAction = () => {
    if (confirmAction.recordId > 0) {
      dispatch(
        actions.updateState({
          id: confirmAction.recordId,
          data: {
            publish_status: confirmAction.nextState.publish_status,
            status: confirmAction.nextState.status,
          },
          onSuccess: () => {
            dispatch(actions.getDetail(id));
          },
        }),
      );
      onCloseConfirmModel();
    } else {
      onCloseConfirmModel();
    }
  };

  const fetchListProduct = async id => {
    const url = `user-service/supplier/warehouse/recall/${id}`;
    await request(url, {
      method: 'get',
    })
      .then(response => {
        if (!isEmpty(response?.data))
          setProducts(
            response?.data.map(item => ({
              ...item,
              total_quantity: 0,
              total_import_quantity: item.total_quantity,
            })),
          );
      })
      .catch(error => error);
  };

  const [isVisiblePrint, setIsVisiblePrint] = useState(false);
  const handleModalPrint = () => {
    setIsVisiblePrint(true);
  };

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: warehouse_import_id ? 'Nhập kho' : 'Xuất kho',
          link: warehouse_import_id ? '/logistics/import' : '/export',
        },
        {
          name: warehouse_import_id
            ? id
              ? 'Chi tiết phiếu thu hồi'
              : 'Thêm mới phiếu thu hồi'
            : id
            ? 'Chi tiết phiếu xuất'
            : 'Thêm mới phiếu xuất',
        },
      ],
      title: warehouse_import_id
        ? id
          ? 'Chi tiết phiếu thu hồi'
          : 'Tạo phiếu thu hồi'
        : id
        ? 'Chi tiết phiếu xuất'
        : 'Tạo phiếu xuất',
      fixWidth: true,
      actions: (
        <>
          <Item className="m-0" shouldUpdate hidden={id}>
            <div className="d-flex justify-content-between">
              <Space>
                <Button
                  color="grayBlue"
                  onClick={onClear}
                  className="btn-sm"
                  width={80}
                >
                  <span>Hủy</span>
                </Button>
                <Button
                  className="btn-sm mr-2"
                  width={120}
                  onClick={submit}
                  color="blue"
                >
                  <span>Duyệt</span>
                </Button>
              </Space>
            </div>
          </Item>
          {id && (
            <Button
              className="btn-sm mr-2"
              width={120}
              color="blue"
              onClick={handleModalPrint}
            >
              In phiếu
            </Button>
          )}
        </>
      ),
    };
    if (!isEmpty(data)) {
      setFieldsValue({
        reason: data?.reason || '',
        time_export: data?.time_export ? moment(data?.time_export) : null,
        created_at: moment(data?.created_at),
        user_export_id: data?.user_export_id || '',
        user_created_id: data?.user_created_id || '',
      });
      setProducts(data?.products || [{}]);
    } else {
      if (id) {
        dispatch(actions.getDetail(id));
      } else {
        setFieldsValue({
          reason: 'Thời gian lưu kho đã hết',
          created_at: moment(new Date()),
          user_created_id: userSup?.id,
        });
        if (warehouse_import_id) {
          fetchListProduct(warehouse_import_id);
        }
      }
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  const onClear = () => {
    dispatch(
      globalActions.showModal({
        modalType: Confirm,
        modalProps: {
          isFullWidthBtn: true,
          data: {
            message: 'Bạn có chắc chắn muốn thoát và huỷ phiên làm việc?',
          },
          callBackConfirm: () => history.push('/logistics/import'),
        },
      }),
    );
  };

  const onFinish = values => {
    const sendProduct = selectedProduct.map(item => ({
      total_quantity: item.total_quantity,
      code: item.code,
      product_id: item.product_id,
      product_variation_id: item.product_variation_id,
    }));
    const dataSend = {
      reason: values.reason,
      warehouse_import_id: warehouse_import_id,
      products: sendProduct,
    };
    dispatch(
      globalActions.showModal({
        modalType: Confirm,
        modalProps: {
          isFullWidthBtn: true,
          data: {
            message: 'Bạn có chắc chắn duyệt phiếu này, không thể hoàn tác?',
          },
          callBackConfirm: () =>
            dispatch(
              actions.updateAndCreate({
                data: {
                  ...dataSend,
                },
                onSuccess: id => {
                  dispatch(actions.getDetail(id));
                  history.push(`/export/detail/${id}`);
                },
              }),
            ),
        },
      }),
    );
  };

  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };

  const formDetail = () => (
    <Form
      form={form}
      scrollToFirstError
      {...layout}
      onValuesChange={setFormValues}
      onFinish={onFinish}
      disabled={id}
    >
      <Row gutter={24}>
        <Col span={24}>
          <CustomSectionWrapper mt={{ xs: 's4' }}>
            <div className="d-flex" style={{ justifyContent: 'space-between' }}>
              <div className="title-head">
                {warehouse_import_id
                  ? 'Thông tin phiếu thu hồi'
                  : 'Thông tin phiếu xuất'}
              </div>
              <div>
                <CustomStyle fontSize={{ xs: 'f3' }} fontWeight="bold">
                  <Link
                    to={
                      data.order_id && !warehouse_import_id
                        ? `/orders/update/${data.order_id}`
                        : `/logistics/import/detail/${
                            warehouse_import_id || data.warehouse_import_id
                          }`
                    }
                  >
                    {data.order_id && !warehouse_import_id
                      ? 'Xem chi tiết đơn hàng'
                      : 'Xem chi tiết phiếu nhập'}
                  </Link>
                </CustomStyle>
              </div>
            </div>
            <Item
              name="reason"
              label={warehouse_import_id ? 'Lý do thu hồi' : 'Lý do xuất kho'}
              products={[
                {
                  required: true,
                  message: 'Không được để trống ô tên!',
                },
              ]}
            >
              <Input
                showCount
                maxLength={120}
                minLength={10}
                placeholder="Nhập lý do"
                suffix={
                  <CustomStyle color="gray3">{`| ${
                    name?.length ?? 0
                  }/120`}</CustomStyle>
                }
              />
            </Item>
            <Row gutter={24}>
              <Col xs={24} lg={6}>
                <Item
                  name="time_export"
                  label="Thời gian duyệt"
                  rules={[
                    {
                      required: false,
                      message: 'Vui lòng chọn thời gian nhập!',
                    },
                  ]}
                >
                  <DatePicker
                    disabled={true}
                    style={{ width: '100%' }}
                    showTime
                    format="YYYY/MM/DD HH:mm"
                  />
                </Item>
              </Col>
              <Col xs={24} lg={6}>
                <Item
                  name="user_export_id"
                  label="Người duyệt"
                  valuePropName="value"
                  getValueFromEvent={normFile}
                  {...layout}
                  rules={[
                    {
                      required: false,
                      message: 'Vui lòng chọn người duyệt!',
                    },
                  ]}
                >
                  <Select
                    disabled={true}
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {listUser?.map(v => (
                      <Select.Option key={v.id} value={v.id}>
                        {v.full_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Item>
              </Col>
              <Col xs={24} lg={6}>
                <Item name="created_at" label="Thời gian khởi tạo">
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    disabled={true}
                    format="YYYY/MM/DD HH:mm"
                  />
                </Item>
              </Col>
              <Col xs={24} lg={6}>
                <Item
                  name="user_created_id"
                  label="Người tạo"
                  valuePropName="value"
                  getValueFromEvent={normFile}
                  {...layout}
                >
                  <Select
                    disabled={true}
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {listUser?.map(v => (
                      <Select.Option key={v.id} value={v.id}>
                        {v.full_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Item>
              </Col>
            </Row>
          </CustomSectionWrapper>
        </Col>
      </Row>
      <Row>
        <ListProduct
          id={id}
          productList={products}
          setselectedProducts={setselectedProducts}
          warehouseImportId={warehouse_import_id}
        />
      </Row>
    </Form>
  );

  return (
    <PageWrapper fixWidth>
      <Spin tip="Đang tải..." spinning={isLoading}>
        {formDetail()}
      </Spin>
      {confirmAction.visible && (
        <Confirm
          data={{}}
          isFullWidthBtn
          title={`Xác nhận '${confirmAction.nextState?.buttonText}'`}
          isModalVisible={confirmAction.visible}
          handleCancel={onCloseConfirmModel}
          handleConfirm={onConfirmAction}
        />
      )}
      {isVisiblePrint && (
        <Modal
          visible={isVisiblePrint}
          onCancel={() => setIsVisiblePrint(false)}
          footer={false}
          width={773}
          closeIcon={<></>}
        >
          <div style={{ textAlign: 'center', width: 725 }}>
            <FormatExport
              id={id}
              productList={products}
              setselectedProducts={setProducts}
            />
          </div>
        </Modal>
      )}
    </PageWrapper>
  );
}

export const CustomSectionWrapper = styledSystem(styled(SectionWrapper)`
  width: 100%;
  padding: 16px 20px
  box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.05);
  border-radius: 4px;
  .title {
    color: #000;
    font-weight: 500;
    font-size: 14px;
  }
  .title-head {
    color: #000;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 1rem;
  }
  input,
  .ant-tag,
  .ant-select-selector {
    border-radius: 4px;
  }
  label {
    font-weight: 500;
  }
  .action-wrapper {
    display: none;
    position: absolute;
    padding: 0;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    white-space: nowrap;
    word-break: keep-all;
    > div {
      display: inline-flex;
      > button {
        margin-left: 11px;
      }
    }
    button {
      margin: auto;
    }
  }
  tr:hover {
    .action-wrapper {
      display: inline-flex;
    }
  }
`);
