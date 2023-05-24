import React, { useState } from 'react';
import { Button, Form } from 'app/components';
import { useHistory, useLocation } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import Location from './Location';
import Info from './Info';
import { isEmpty } from 'lodash';
// import styled from 'styled-components';

const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};

export default function SupplierSetting() {
  const history = useHistory();
  const location = useLocation();
  const dataSupplierSettingBack = location.state;

  const [form] = Form.useForm();
  // const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [, setFormValues] = useState({});
  const [dataImageIdentityBefore, setDataImageIdentityBefore] = React.useState(
    '',
  );
  const [dataImageIdentityAfter, setDataImageIdentityAfter] = React.useState(
    '',
  );
  const [isMiss, setIsMiss] = useState(false);
  const { setFieldsValue, getFieldsValue } = form;
  const { province } = getFieldsValue();
  setFieldsValue({
    name: '',
    id: '',
    phone: '',
    description: '',
    location_data: {},
  });

  const onFinish = async values => {
    setIsLoading(true);
    const { province, district } = values;
    const handleData = {
      contact_email: values.contact_email.trim(),
      phone_number: values.phone_number.trim(),
      metadata: {
        user_info: {
          representative_name: values.representative_name.trim(),
          identity_card: values.identity_card.trim(),
          images_representative_before: dataImageIdentityBefore,
          images_representative_after: dataImageIdentityAfter,
        },
      },
      location: {
        address1: values.address1.trim(),
        province_id: province.value?.toString(),
        province: province.label,
        district_id: district.value.toString(),
        district_name: district.label,
        zipcode: values.zipcode || '',
        country: 'Viet Nam',
        country_code: 'VN',
        city: province.label,
        description: '',
        phone_number: values.phone_number.trim(),
      },
    };
    if (!isEmpty(dataImageIdentityBefore) && !isEmpty(dataImageIdentityAfter)) {
      setIsMiss(false);
      setIsLoading(false);
      await history.push({
        pathname: '/auth/category-setting',
        state: handleData,
      });
    } else {
      setIsLoading(false);
      setIsMiss(true);
    }
  };

  return (
    <div className="supplier_setting">
      <Form
        form={form}
        name="form-supplier"
        className="form-supplier"
        onValuesChange={setFormValues}
        initialValues={{
          country_code: 'VN',
          country: 'Viet Nam',
          contact_email: dataSupplierSettingBack?.contact_email || '',
          phone_number: dataSupplierSettingBack?.phone_number || '',
          representative_name:
            dataSupplierSettingBack?.metadata?.user_info?.representative_name ||
            '',
          identity_card:
            dataSupplierSettingBack?.metadata?.user_info?.identity_card || '',
          province: {
            value: dataSupplierSettingBack?.location?.province_id || '',
            label: dataSupplierSettingBack?.location?.province || '',
          },
          district: {
            value: dataSupplierSettingBack?.location?.district_id || '',
            label: dataSupplierSettingBack?.location?.district_name || '',
          },
          address1: dataSupplierSettingBack?.location?.address1 || '',
          zipcode: dataSupplierSettingBack?.location?.zipcode || '',
        }}
        onFinish={onFinish}
      >
        <div className="supplier_setting__section">
          <div className="supplier_setting__section_top">
            <div className="supplier_setting__title">
              Thông tin Nhà cung cấp
            </div>
            <div className="supplier_setting__desc">
              Nhập các thông tin cơ bản của công ty để Odii hỗ trợ bạn tốt hơn.
            </div>
          </div>
          <Info
            layout={layout}
            form={form}
            isMiss={isMiss}
            dataImageIdentityBefore={dataImageIdentityBefore}
            setDataImageIdentityBefore={setDataImageIdentityBefore}
            dataImageIdentityAfter={dataImageIdentityAfter}
            setDataImageIdentityAfter={setDataImageIdentityAfter}
            dataSupplierSettingBack={dataSupplierSettingBack}
          />
        </div>

        <div className="supplier_setting__section">
          <div className="supplier_setting__section_top">
            <div className="supplier_setting__title">Thông tin Địa chỉ</div>
            <div className="supplier_setting__desc">
              Nhập địa chỉ liên hệ của Nhà Cung Cấp
            </div>
          </div>
          <Location layout={layout} form={form} province={province} />
        </div>

        <div className="supplier_setting__button d-flex justify-content-end">
          <Button
            className="auth__form-button btn-sm"
            type="primary"
            color="blue"
            width="190px"
            htmlType="submit"
            disabled={isLoading}
          >
            {isLoading && (
              <>
                <LoadingOutlined />
                &ensp;
              </>
            )}
            Tiếp theo
          </Button>
        </div>
      </Form>
    </div>
  );
}
