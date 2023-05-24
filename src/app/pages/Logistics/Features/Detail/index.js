import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Space } from 'antd';
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
import { isEmpty, pickBy, identity } from 'lodash';
import moment from 'moment';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { selectData } from 'app/pages/Warehousing/slice/selectors';
import { selectData as selectListUser } from 'app/pages/Employees/slice/selectors';
import { useWarehousingSlice } from 'app/pages/Warehousing/slice';
import { useEmployeesSlice } from 'app/pages/Employees/slice';
import notification from 'utils/notification';
import ListProduct from '../../Components/ListProduct';
import { useWarehouseImportSlice } from '../../slice';
import { selectDetail, selectLoading } from '../../slice/selectors';
import {
  COMBINE_STATUS,
  COMBINE_STATUS_CHIEF,
  RECALL_TIME,
} from '../../constants';
import locale from 'antd/es/date-picker/locale/vi_VN';

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

export function LogisticsImportDetail({ match, history }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { actions } = useWarehouseImportSlice();
  const id = match?.params?.id;
  const data = useSelector(selectDetail);
  const isLoading = useSelector(selectLoading);
  const warehousingSlice = useWarehousingSlice();
  const employeesSlice = useEmployeesSlice();
  const userSup = useSelector(selectCurrentUser);
  const listWarehousing = useSelector(selectData);
  const listUser = useSelector(selectListUser);
  const [products, setProducts] = useState([]);
  const [, setFormValues] = useState({});
  const [allStatus, setAllStatus] = useState({});
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

  const submitWithStatus = values => () => {
    if (id) {
      setConfirmAction({
        visible: true,
        nextState: values,
        recordId: id,
      });
      setAllStatus(values);
    }
  };

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

  const checkRecallTime = tỉme => {
    if (new Date(tỉme) < new Date()) {
      return 0;
    }
    return Math.abs(new Date(tỉme) - new Date()) / 1000 / 60 / 60 / 24;
  };

  useEffect(() => {
    let actionButton = COMBINE_STATUS;
    if (
      userSup.roles.includes('owner') ||
      userSup.roles.includes('partner_chief_warehouse')
    ) {
      actionButton = COMBINE_STATUS_CHIEF;
    }
    const currentAllActives = !isEmpty(data)
      ? actionButton[`${data.status}/${data.publish_status}`]
      : actionButton[Object.keys(actionButton)[0]];

    const dataBreadcrumb = {
      menus: [
        {
          name: 'Nhập kho',
          link: '/logistics/import',
        },
        {
          name: id ? 'Chi tiết phiếu nhập' : 'Thêm mới',
        },
      ],
      title: id ? 'Chi tiết phiếu nhập' : 'Thêm mới phiếu nhập',
      fixWidth: true,
      actions: (
        <Item className="m-0" shouldUpdate>
          <div className="d-flex justify-content-between">
            <Space>
              {data.status !== 'active' && data.publish_status !== 'active' && (
                <>
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
                    <span>Lưu</span>
                  </Button>
                </>
              )}
              {data.time_recall &&
                data.status === 'active' &&
                data.publish_status === 'active' &&
                checkRecallTime(data.time_recall) === 0 &&
                !data.user_recall_id && (
                  <Button
                    className="btn-sm mr-2 "
                    // disabled={!id}
                    width={'150px'}
                    onClick={() =>
                      history.push({
                        pathname: '/export/detail',
                        search: '?page=1&page_size=10',
                        state: { warehouse_import_id: data.id },
                      })
                    }
                    color={'blue'}
                  >
                    <span>Tạo phiếu thu hồi</span>
                  </Button>
                )}
              {isEmpty(currentAllActives.buttonText) || !id || (
                <Button
                  className="btn-sm mr-2 "
                  // disabled={!id}
                  width={currentAllActives?.width || '100px'}
                  onClick={submitWithStatus(currentAllActives)}
                  color={currentAllActives?.color || 'blue'}
                >
                  <span>{currentAllActives?.buttonText}</span>
                </Button>
              )}
              {data.status === 'inactive' &&
                data.publish_status === 'draft' &&
                data.user_created_id === userSup.id &&
                (userSup.roles.includes('owner') ||
                  userSup.roles.includes('partner_chief_warehouse')) && (
                  <Button
                    className="btn-sm mr-2 "
                    // disabled={!id}
                    width={currentAllActives?.width || '100px'}
                    onClick={submitWithStatus({
                      publish_status: 'active',
                      status: 'active',
                      buttonText: 'Duyệt',
                    })}
                    color={currentAllActives?.color || 'blue'}
                  >
                    <span>Duyệt</span>
                  </Button>
                )}
            </Space>
          </div>
        </Item>
      ),
    };
    if (!isEmpty(data)) {
      setFieldsValue({
        reason: data?.reason || '',
        time_import: moment(data?.time_import) || '',
        time_recall: data?.time_recall ? moment(data?.time_recall) : '',
        created_at: moment(data?.created_at) || '',
        user_import_id: data?.user_import_id || '',
        user_created_id: data?.user_created_id || '',
        supplier_warehousing_id: data?.supplier_warehousing_id,
        approved_by: data?.approved_by || '',
        time_approved: data?.time_approved ? moment(data?.time_approved) : '',
      });
      setProducts(data?.products || [{}]);
      if (data?.code) {
        dataBreadcrumb.title = `#${data?.code}`;
      }
    } else {
      if (id) {
        dispatch(actions.getDetail(id));
      } else {
        setFieldsValue({
          user_created_id: userSup?.id,
          user_import_id: userSup?.id,
          created_at: moment(new Date()),
          time_import: moment(new Date()),
        });
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
    const { publish_status } = allStatus;
    if (selectedProduct.length === 0) {
      notification('error', '', 'Vui lòng chọn sản phẩm nhập kho');
      return;
    }
    const dataSend = {
      ...values,
      time_import: moment(values.time_import),
      time_recall: moment(values.time_recall),
      created_at: moment(values.created_at),
      approved_time: values.approved_time ? moment(values.approved_time) : null,
      products: selectedProduct,
      publish_status: publish_status,
    };
    if (id) {
      const handleDataSend = pickBy(dataSend, identity);
      dispatch(
        actions.updateAndCreate({
          id,
          data: handleDataSend,
          onSuccess: () => {
            dispatch(actions.getDetail(id));
          },
        }),
      );
    } else {
      dispatch(
        actions.updateAndCreate({
          data: {
            publish_status: 'inactive',
            ...dataSend,
          },
          onSuccess: id => {
            dispatch(actions.getDetail(id));
            history.push(`/logistics/import/detail/${id}`);
          },
        }),
      );
    }

    setAllStatus({});
  };

  const onFinishFailed = ({ errorFields }) => {
    let descriptionErr = '';
    for (const iterator of errorFields) {
      descriptionErr = `
      ${descriptionErr ? `${descriptionErr},` : descriptionErr}
      ${iterator.errors[0]}
        `;
    }
    notification('error', descriptionErr, 'Vui lòng điền \n thêm thông tin!');
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
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={setFormValues}
      disabled={
        (data?.status === 'active' && data?.publish_status === 'active') ||
        (data.user_created_id !== userSup.id && id)
      }
    >
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <Row gutter={24}>
          <Col span={24}>
            <div className="d-flex" style={{ justifyContent: 'space-between' }}>
              <div className="title-head">
                Thông tin phiếu nhập
                <span>
                  {data.time_recall &&
                    data.status === 'active' &&
                    data.publish_status === 'active' &&
                    checkRecallTime(data.time_recall) <= RECALL_TIME &&
                    (data.user_recall_id
                      ? ``
                      : checkRecallTime(data.time_recall) === 0
                      ? 'Đã hết thời gian lưu kho'
                      : 'Sắp hết thời gian lưu kho')}
                </span>
              </div>
              <div>
                {data.user_recall_id ? (
                  <CustomStyle
                    fontSize={{ xs: 'f3' }}
                    fontWeight="bold"
                    color={'red'}
                  >
                    Đã thu hồi
                  </CustomStyle>
                ) : (
                  <CustomStyle
                    fontSize={{ xs: 'f3' }}
                    fontWeight="bold"
                    color={
                      COMBINE_STATUS[`${data.status}/${data.publish_status}`]
                        ?.colorLabel
                    }
                  >
                    {COMBINE_STATUS[`${data.status}/${data.publish_status}`]
                      ?.label || 'Khởi tạo'}
                  </CustomStyle>
                )}
              </div>
            </div>
            <Row gutter={24}>
              <Col xs={24} lg={24}>
                <Item name="reason" label="Lý do nhập kho">
                  <Input
                    showCount
                    maxLength={120}
                    minLength={10}
                    placeholder="Nhập lý do nhập kho"
                    suffix={
                      <CustomStyle color="gray3">{`| ${
                        name?.length ?? 0
                      }/120`}</CustomStyle>
                    }
                  />
                </Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24} lg={6}>
                <Item
                  name="supplier_warehousing_id"
                  label="Kho nhập"
                  valuePropName="value"
                  getValueFromEvent={normFile}
                  {...layout}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn kho nhập!',
                    },
                  ]}
                >
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {listWarehousing
                      .filter(item => item.is_pickup_address)
                      ?.map(v => (
                        <Select.Option key={v.id} value={v.id}>
                          {v.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Item>
              </Col>
              <Col xs={24} lg={6}>
                <Item name="time_recall" label="Lưu kho đến">
                  <DatePicker
                    locale={locale}
                    style={{ width: '100%' }}
                    showTime
                    format="YYYY/MM/DD HH:mm"
                  />
                </Item>
              </Col>
              <Col xs={24} lg={6}>
                <Item
                  name="user_import_id"
                  label="Người nhập"
                  valuePropName="value"
                  getValueFromEvent={normFile}
                  {...layout}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn người nhập!',
                    },
                  ]}
                >
                  <Select
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
                <Item
                  name="time_import"
                  label="Thời gian nhập kho"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn thời gian nhập!',
                    },
                  ]}
                >
                  <DatePicker
                    locale={locale}
                    style={{ width: '100%' }}
                    showTime
                    format="YYYY/MM/DD HH:mm"
                  />
                </Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24} lg={6}>
                <Item name="user_created_id" label="Người tạo phiếu">
                  <Select showSearch disabled={true} showArrow={false}>
                    {listUser?.map(v => (
                      <Select.Option key={v.id} value={v.id}>
                        {v.full_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Item>
              </Col>
              <Col xs={24} lg={6}>
                <Item name="created_at" label="Ngày tạo phiếu">
                  <DatePicker
                    locale={locale}
                    style={{ width: '100%' }}
                    showTime
                    disabled={true}
                    format="DD/MM/YYYY HH:mm"
                    suffixIcon={false}
                  />
                </Item>
              </Col>
              <Col xs={24} lg={6}>
                <Item name="approved_by" label="Người duyệt phiếu">
                  <Select showSearch disabled={true} showArrow={false}>
                    {listUser?.map(v => (
                      <Select.Option key={v.id} value={v.id}>
                        {v.full_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Item>
              </Col>
              <Col xs={24} lg={6}>
                <Item name="time_approved" label="Ngày duyệt phiếu">
                  <DatePicker
                    locale={locale}
                    style={{ width: '100%' }}
                    showTime
                    disabled={true}
                    format="DD/MM/YYYY HH:mm"
                    placeholder=""
                    suffixIcon={false}
                  />
                </Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </CustomSectionWrapper>
      <Row>
        <ListProduct
          id={id}
          productList={products}
          setselectedProducts={setselectedProducts}
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

    span{
      font-weight: 400;
      font-size: 14px;
      color: red;
      margin-left: 20px;
    }
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
  .ant-form-item:last-child{
    margin-bottom: 0 !important;
  }
`);
