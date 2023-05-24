import React, { useState, useEffect } from 'react';
import { Button, Form } from 'app/components';
// import { useHistory, useLocation } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import request from 'utils/request';
import { SectionWrapper } from 'styles/commons';
import { isEmpty } from 'lodash';
import { Skeleton, Space, Modal } from 'antd';
import { Info, Location, InfoCategory, Warehouse } from '../Components';
import styled from 'styled-components';
import { message } from 'antd';
import { flower } from 'assets/images/dashboards';
import { useDispatch } from 'react-redux';
import { useInfoBusinessSlice } from '../slice';

const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};

export default function InfoSupplier({ data, isLoading }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { actions } = useInfoBusinessSlice();

  // const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  // const [, setFormValues] = useState({});
  const [dataImageIdentityBefore, setDataImageIdentityBefore] = useState('');
  const [dataImageIdentityAfter, setDataImageIdentityAfter] = useState('');

  const [idsSelected, setIdsSelected] = useState([]);
  const [licenseImages, setLicenseImages] = useState([]);

  const [isReasonReject, setIsReasonReject] = useState('');
  const [isMiss, setIsMiss] = useState(false);
  const [isMissCategory, setIsMissCategory] = useState(false);

  const [isShowModal, setIsShowModal] = useState('');
  const [isShowModalCSKH, setIsShowModalCSKH] = useState('');

  const { setFieldsValue, getFieldsValue, resetFields } = form;

  useEffect(() => {
    // const { province } = getFieldsValue();
    setFieldsValue({
      name: data?.name,
      representative_name: data?.metadata?.user_info?.representative_name,
      contact_email: data?.contact_email,
      phone_number: data?.phone_number,
      identity_card: data?.metadata?.user_info?.identity_card,
      images_representative_before: [
        data?.metadata?.user_info?.images_representative_before,
      ],
      images_representative_after: [
        data?.metadata?.user_info?.images_representative_after,
      ],
      country: data?.address?.country || 'Viet Nam',
      ...(data?.address?.province_id
        ? {
            province_location: {
              value: data?.address?.province_id,
              label: data?.address?.province,
            },
          }
        : {}),
      ...(data?.address?.district_id
        ? {
            district_location: {
              value: data?.address?.district_id,
              label: data?.address?.district_name,
            },
          }
        : {}),
      zip: data?.address?.zip,
      address1: data?.address?.address1,
      image_license: data?.metadata?.business_info?.images_license,
    });
    if (!isEmpty(data?.note)) {
      setIsReasonReject(data?.note);
    }
  }, [data]);

  const onFinish = async values => {
    setIsLoadingButton(true);
    const {
      province_location,
      district_location,
      ward_location,
      province_warehouse,
      district_warehouse,
      ward_warehouse,
    } = values;

    const handleData = {
      contact_email: values.contact_email.trim(),
      phone_number: values.phone_number.trim(),
      name: values.name.trim(),
      category_ids: idsSelected,
      // description: '',
      metadata: {
        user_info: {
          representative_name: values.representative_name.trim(),
          identity_card: values.identity_card.trim(),
          images_representative_before: dataImageIdentityBefore,
          images_representative_after: dataImageIdentityAfter,
        },
        business_info: {
          images_license: licenseImages,
        },
      },
      address: {
        address1: values.address1.trim(),
        province_id: province_location.value?.toString(),
        province: province_location.label,
        district_id: district_location.value.toString(),
        district_name: district_location.label,
        ward_id: ward_location.value?.toString(),
        ward_name: ward_location.label,
        zip: values.zipcode || '',
        country: 'Viet Nam',
        country_code: 'VN',
        city: province_location.label,
        description: '',
        phone_number: values.phone_number.trim(),
      },
      ...(isEmpty(data?.supplier_warehousing_data)
        ? {
            ware_housing: {
              name: values.name_warehouse.trim(),
              phone: values.phone_warehouse.trim(),
              description: values.description_warehouse?.trim() || '',
              location_data: {
                province_id: province_warehouse.value?.toString(),
                province: province_warehouse.label,
                district_id: district_warehouse.value.toString(),
                district_name: district_warehouse.label,
                ward_id: ward_warehouse.value?.toString(),
                ward_name: ward_warehouse.label,
                zipcode: values.zipcode || '',
                country: 'Viet Nam',
                country_code: 'VN',
                city: province_warehouse.label,
                address1: values.address_warehouse.trim(),
              },
              is_pickup_address: values.is_pickup_address,
              is_return_address: values.is_return_address,
            },
          }
        : {}),
    };

    if (isEmpty(dataImageIdentityBefore) || isEmpty(dataImageIdentityAfter)) {
      setIsMiss(true);
      setIsLoadingButton(false);
      if (isEmpty(idsSelected)) {
        setIsMissCategory(true);
      }
    } else if (isEmpty(idsSelected)) {
      setIsMissCategory(true);
      setIsLoadingButton(false);
    } else {
      setIsMiss(false);
      setIsMissCategory(false);
      // Lần đầu tiên submit data register supplier
      if (isEmpty(data)) {
        const response = await request(
          '/user-service/seller/register-supplier',
          {
            method: 'post',
            data: handleData,
          },
        )
          .then(response => response)
          .catch(error => error);
        if (response.is_success) {
          message.success('Lưu thông tin xác thực Nhà cung cấp thành công !');
          dispatch(actions.getDataRegisterSupplier({}));
          setIsShowModal(true);
        } else {
          message.error(
            'Lưu thông tin xác thực Nhà cung cấp không thành công, vui lòng kiểm tra và thử lại !',
          );

          console.log(response.data.message || response.data.error_code);
        }
      }
      // Chỉnh sửa data register supplier
      else {
        const response = await request('/user-service/supplier/profile', {
          method: 'put',
          data: handleData,
        })
          .then(response => response)
          .catch(error => error);
        if (response.is_success) {
          message.success(
            'Chỉnh sửa thông tin xác thực Nhà cung cấp thành công !',
          );
          dispatch(actions.getDataRegisterSupplier({}));
        } else {
          message.error(
            'Chỉnh sửa thông tin xác thực Nhà cung cấp không thành công, vui lòng kiểm tra và thử lại !',
          );

          console.log(response.data.message || response.data.error_code);
        }
      }
      setIsLoadingButton(false);
    }
  };

  const onClear = () => {
    if (data) {
      setFieldsValue({
        name: data?.name,
        representative_name: data?.metadata?.user_info?.representative_name,
        contact_email: data?.contact_email,
        phone_number: data?.phone_number,
        identity_card: data?.metadata?.user_info?.identity_card,
        images_representative_before: [
          data?.metadata?.user_info?.images_representative_before,
        ],
        images_representative_after: [
          data?.metadata?.user_info?.images_representative_after,
        ],
        country: data?.address?.country || 'Viet Nam',
        ...(data?.address?.province_id
          ? {
              province_location: {
                value: data?.address?.province_id,
                label: data?.address?.province,
              },
            }
          : {}),
        ...(data?.address?.district_id
          ? {
              district_location: {
                value: data?.address?.district_id,
                label: data?.address?.district_name,
              },
            }
          : {}),
        zip: data?.address?.zip,
        address1: data?.address?.address1,
        image_license: data?.metadata?.business_info?.images_license,
      });
      if (!isEmpty(data?.note)) {
        setIsReasonReject(data?.note);
      }
    } else {
      resetFields({});
    }
  };

  const pageContent = (
    <>
      <CustomModal
        name="modal__wellcome"
        footer={null}
        visible={isShowModal}
        onCancel={() => setIsShowModal(false)}
      >
        <div className="modal__img-flower">
          <img src={flower} alt="" />
        </div>
        <div className="modal__title">
          <span style={{ fontSize: '24px' }}>Chúc mừng</span> <br /> Bạn đã hoàn
          tất cung cấp thông tin NCC
        </div>
        <div className="modal__desc">
          Chúng tôi đã nhận được thông tin bạn cung cấp, Admin đang đánh giá và
          xác thực thông tin. <br />
          Thông báo sẽ được gửi cho bạn sớm nhất.
        </div>
        <div className="modal__btn-skip" onClick={() => setIsShowModal(false)}>
          Tôi đã hiểu
        </div>
      </CustomModal>
      <CustomModal
        name="modal__cskh"
        footer={null}
        visible={isShowModalCSKH}
        onCancel={() => setIsShowModalCSKH(false)}
      >
        <div className="modal__img-flower">
          <img src={flower} alt="" />
        </div>
        <div className="modal__title">
          Liên hệ CSKH / Hotline
          <br />
          0999996666
        </div>
        <div className="modal__desc">
          Nhà cung cấp muốn thay đổi thông tin doanh nghiệp, vui lòng liên hệ
          CSKH/ Hotline để được hỗ trợ thay đổi.
        </div>
        <div
          className="modal__btn-skip"
          onClick={() => setIsShowModalCSKH(false)}
        >
          Tôi đã hiểu
        </div>
      </CustomModal>
      {isReasonReject && (
        <TxtReason className="d-flex justify-content-start">
          <span>Lý do từ chối:</span> &ensp;{isReasonReject}
        </TxtReason>
      )}
      <Form
        form={form}
        name="form-info-supplier"
        className="form-supplier"
        onFinish={onFinish}
        disabled={
          data?.register_status === 'active' ||
          data?.register_status === 'pending_for_review' ||
          data?.register_status === 'pending_for_review_after_update'
        }
      >
        <CustomSection>
          <SectionWrapper>
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 12 }} className="loading" />
            ) : (
              <Info
                layout={layout}
                data={data}
                isMiss={isMiss}
                dataImageIdentityBefore={dataImageIdentityBefore}
                setDataImageIdentityBefore={setDataImageIdentityBefore}
                dataImageIdentityAfter={dataImageIdentityAfter}
                setDataImageIdentityAfter={setDataImageIdentityAfter}
              />
            )}
          </SectionWrapper>
        </CustomSection>

        <CustomSection>
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 1 }} className="loading" />
          ) : (
            <>
              <div className="section__title">Thông tin kinh doanh</div>
              <div className="section__desc">
                Thông tin kinh doanh của Nhà Cung Cấp
              </div>
            </>
          )}
          <SectionWrapper>
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 6 }} className="loading" />
            ) : (
              <InfoCategory
                layout={layout}
                data={data}
                isMissCategory={isMissCategory}
                idsSelected={idsSelected}
                setIdsSelected={setIdsSelected}
                licenseImages={licenseImages}
                setLicenseImages={setLicenseImages}
              />
            )}
          </SectionWrapper>
        </CustomSection>

        <CustomSection>
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 1 }} className="loading" />
          ) : (
            <>
              <div className="section__title">Địa chỉ kinh doanh</div>
              <div className="section__desc">
                Địa chỉ kinh doanh của Nhà Cung Cấp
              </div>
            </>
          )}
          <SectionWrapper>
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 4 }} className="loading" />
            ) : (
              <Location layout={layout} data={data} />
            )}
          </SectionWrapper>
        </CustomSection>

        {isEmpty(data?.supplier_warehousing_data) && (
          <CustomSection>
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 1 }} className="loading" />
            ) : (
              <>
                <div className="section__title">Kho hàng</div>
                <div className="section__desc">
                  Địa chỉ kho hàng của Nhà Cung Cấp
                </div>
              </>
            )}
            <SectionWrapper>
              {isLoading ? (
                <Skeleton active paragraph={{ rows: 4 }} className="loading" />
              ) : (
                <Warehouse layout={layout} data={data} />
              )}
            </SectionWrapper>
          </CustomSection>
        )}
        <div className="d-flex justify-content-end">
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 1 }} className="loading" />
          ) : (
            <Space>
              {
                // data?.status === 'active' &&
                data?.register_status === 'active' ||
                data?.register_status === 'pending_for_review' ||
                data?.register_status === 'pending_for_review_after_update' ? (
                  ''
                ) : (
                  <>
                    <Button
                      className="btn-sm"
                      color="grayBlue"
                      onClick={onClear}
                      disabled={isLoading}
                    >
                      Hủy
                    </Button>
                    <Button
                      className="btn-sm"
                      type="primary"
                      color="blue"
                      width="100px"
                      htmlType="submit"
                      disabled={isLoading}
                    >
                      {isLoadingButton && (
                        <>
                          <LoadingOutlined />
                          &ensp;
                        </>
                      )}
                      Lưu
                    </Button>
                  </>
                )
              }
            </Space>
          )}
        </div>
        {(isMiss || isMissCategory) && (
          <TxtRequired className="d-flex justify-content-end">
            Hãy điền đầy đủ các trường thông tin bắt buộc !
          </TxtRequired>
        )}
      </Form>
      <div className="d-flex justify-content-end">
        {data?.register_status === 'active' ? (
          <Button
            className="btn-sm "
            color="blue"
            // width="100px"
            onClick={() => setIsShowModalCSKH(true)}
          >
            Chỉnh sửa
          </Button>
        ) : (
          ''
        )}
      </div>
    </>
  );

  return (
    // isLoading ? (
    //   <Skeleton active paragraph={{ rows: 20 }} className="loading" />
    // ) : (
    <div>{pageContent}</div>
  );
}

const CustomSection = styled.div`
  margin-top: 26px;
  .section__title {
    font-weight: bold;
    font-size: 14px;
    line-height: 19px;
  }
  .section__desc {
    font-size: 14px;
    line-height: 19px;
    margin-top: 4px;
    margin-bottom: 12px;
  }
`;

const TxtRequired = styled.div`
  margin-top: 12px;
  color: #ff4d4f;
`;
const TxtReason = styled.div`
  color: #ff4d4f;
  margin-bottom: -10px;
  span {
    font-weight: bold;
  }
`;

const CustomModal = styled(Modal)`
  text-align: center;
  /* .ant-modal-close-x {
    display: none;
  } */
  .ant-modal-content {
    width: 480px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.07);
    border-radius: 8px;
  }
  .ant-modal-body {
    padding: 36px 48px;
  }
  .modal {
    &__img-flower {
      width: 40px;
      height: 40px;
      margin: auto;
      img {
        width: 100%;
        height: auto;
      }
    }
    &__title {
      font-weight: bold;
      font-size: 18px;
      line-height: 24px;
      margin-top: 26px;
    }
    &__desc {
      font-size: 14px;
      line-height: 18px;
      font-weight: 400;
      margin-top: 12px;
      color: #828282;
    }
    &__btn-skip {
      margin: auto;
      margin-top: 20px;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #3d56a6;
      cursor: pointer;
      &:hover {
        color: #0f3adb;
      }
    }
  }
`;
