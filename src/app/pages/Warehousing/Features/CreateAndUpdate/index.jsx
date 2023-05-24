/**
 *
 * CreateAndUpdateWarehousing
 *
 */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Form as F, Space } from 'antd';
import { isEmpty, pickBy, identity } from 'lodash';
import { Button, PageWrapper, Form } from 'app/components';
import { globalActions } from 'app/pages/AppPrivate/slice';
import Confirm from 'app/components/Modal/Confirm';

import { selectLoading, selectDetail } from '../../slice/selectors';
import { useWarehousingSlice } from '../../slice';
import Info from './Info';
import Location from './Location';
// import { SectionWrapper } from 'styles/commons';
const Item = F.Item;

const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};

export function CreateAndUpdateWarehousing({ match, history }) {
  const id = match?.params?.id; // is update
  const dispatch = useDispatch();
  const { actions } = useWarehousingSlice();
  const [form] = Form.useForm();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);
  // const [, forceUpdate] = useState();
  const [, setFormValues] = useState({});
  const [, setLocation] = useState({});
  const {
    setFieldsValue,
    getFieldsValue,
    // resetFields,
    // isFieldsTouched,
    submit,
  } = form;
  const { province, district } = getFieldsValue();
  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
    };
  }, []);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Kho hàng',
          link: '/infobusiness',
        },
        {
          name: id ? 'Chi tiết kho hàng' : 'Thêm mới kho hàng',
        },
      ],
      title: 'Thêm mới',
      fixWidth: true,
      actions: (
        <Item className="m-0" shouldUpdate>
          <div className="d-flex justify-content-between">
            <Space>
              <Button color="grayBlue" onClick={onClear} className="btn-sm">
                <span>Hủy</span>
              </Button>
              {/* <Button
                 onClick={goBack}
                 className="btn-sm"
                 context="secondary"
                 // color="white"
               >
                 <span>Trở về</span>
               </Button> */}
              <Button
                className="btn-sm mr-2"
                // disabled={!id}
                width={100}
                onClick={submit}
                color="blue"
              >
                <span>Lưu</span>
              </Button>
            </Space>
          </div>
        </Item>
      ),
    };
    if (!isEmpty(data)) {
      const local = {
        province: {
          value: data?.location_data?.province_id || '',
          label: data?.location_data?.province || '',
        },
        district: {
          value: data?.location_data?.district_id || '',
          label: data?.location_data?.district_name || '',
        },
        ward: {
          value: data?.location_data?.ward_id || '',
          label: data?.location_data?.ward_name || '',
        },
      };
      setFieldsValue({
        name: data?.name || '',
        id: data?.id || '',
        phone: data?.phone || '',
        thumb: data?.thumb || {},
        description: data?.description || '',
        location_data: data?.location_data || {},
        is_pickup_address: data?.is_pickup_address || false,
        is_return_address: data?.is_return_address || false,
        ...local,
      });
      // forceUpdate();
      setLocation(local);
      dataBreadcrumb.title = data?.name;
    } else {
      if (id) dispatch(actions.getDetail(id));
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  // const goBack = () => {
  //   history.push('/products');
  // };

  const onClear = () => {
    // if (id) {
    //   const local = {
    //     province: {
    //       value: data?.location_data?.province_id || '',
    //       label: data?.location_data?.province || '',
    //     },
    //     district: {
    //       value: data?.location_data?.district_id || '',
    //       label: data?.location_data?.district_name || '',
    //     },
    //   };
    //   setFieldsValue({
    //     name: data?.name || '',
    //     id: data?.id || '',
    //     phone: data?.phone || '',
    //     thumb: data?.thumb || {},
    //     description: data?.description || '',
    //     location_data: data?.location_data || {},
    //     ...local,
    //   });
    // } else {
    //   resetFields();
    // }
    dispatch(
      globalActions.showModal({
        modalType: Confirm,
        modalProps: {
          isFullWidthBtn: true,
          data: {
            message: 'Bạn có chắc chắn muốn thoát và huỷ phiên làm việc?',
          },
          callBackConfirm: () => history.push('/infobusiness'),
        },
      }),
    );
  };

  const onFinish = values => {
    // if (!isFieldsTouched(id ? ['name'] : ['name'])) {
    //   return message.error('Vui lòng thêm thông tin!');
    // }
    const {
      province,
      district,
      ward,
      phone,
      location_data,
      ...resValues
    } = values;
    const handleLocation = {
      ...data?.location_data,
      ...location_data,
      country: 'Viet Nam',
      province_id: province.value?.toString(),
      province: province.label,
      district_id: district.value,
      district_name: district.label,
      ward_id: ward.value,
      ward_name: ward.label,
    };
    const dataSend = {
      ...resValues,
      name: resValues.name?.trim(),
      phone: phone?.toString() || '',
      location_data: pickBy(handleLocation, identity),
    };
    let isPickup = resValues.is_pickup_address;
    let isReturn = resValues.is_return_address;
    if (!isPickup && !isReturn) {
      isPickup = true;
      isReturn = true;
    }
    if (id) {
      const { id, ...removeId } = data;
      let payload = pickBy(
        {
          ...removeId,
          ...dataSend,
        },
        identity,
      );
      payload = {
        ...payload,
        is_pickup_address: isPickup,
        is_return_address: isReturn,
      };
      dispatch(
        actions.updateAndCreate({
          id,
          data: payload,
        }),
      );
    } else {
      let payload = pickBy(dataSend, identity);
      payload = {
        ...payload,
        is_pickup_address: isPickup,
        is_return_address: isReturn,
      };
      dispatch(
        actions.updateAndCreate({
          data: payload,
          push: history.push,
        }),
      );
    }
  };
  return (
    <PageWrapper fixWidth>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          onValuesChange={setFormValues}
          initialValues={{
            location_data: {
              country_code: 'VN',
            },
          }}
          onFinish={onFinish}
        >
          <>
            <Info layout={layout} form={form} />
            <Location
              layout={layout}
              form={form}
              province={province}
              district={district}
            />
            <Item shouldUpdate>
              <div className="d-flex justify-content-end">
                <Space align="baseline">
                  <Button color="grayBlue" onClick={onClear} className="btn-sm">
                    <span>Hủy</span>
                  </Button>
                  <Button
                    // onClick={onMenuClick(null, 2)}
                    type="primary"
                    htmlType="submit"
                    className="btn-sm mr-2"
                    // disabled={!id}
                    width={100}
                    color="blue"
                  >
                    <span>Lưu</span>
                  </Button>
                </Space>
              </div>
            </Item>
          </>
        </Form>
      </Spin>
    </PageWrapper>
  );
}
