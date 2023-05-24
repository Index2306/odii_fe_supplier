import React, { useState, useEffect } from 'react';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import request from 'utils/request';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Form, Input } from 'app/components';
import iconExclamationMark from 'assets/images/exclamationMark.svg';
import { PicturesWall } from 'app/components/Uploads';
import styled from 'styled-components';
import { iconIsHadImg } from 'assets/images';
import { LoadingOutlined } from '@ant-design/icons';
import BillingInfo from './BillingInfo';
import Warehouse from './Warehouse';
import { isEmpty } from 'lodash';
// import { useSelector, useDispatch } from 'react-redux';

const Item = Form.Item;
const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};

export default function CategorySetting() {
  const [form] = Form.useForm();

  // const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const dataSupplierSetting = location.state;
  const [categories, setCategories] = useState([]);

  const [dataCategories, setDataCategories] = useState([]);
  const [LicenseImages, setLicenseImages] = useState([]);
  const [isHadImg, setIsHadImg] = useState(false);
  const [isMiss, setIsMiss] = useState(false);
  const [isShowUpload, setisShowUpload] = React.useState(true);
  const [isFillWarehouse, setIsFillWarehouse] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const { setFieldsValue, getFieldsValue } = form;
  // const {} = getFieldsValue();
  setFieldsValue({
    // name_warehouse: '',
    description_warehouse: '',
    phone_warehouse: '',
    // address_warehouse: '',
    // province_warehouse: {},
    // district_warehouse: {},
  });

  useEffect(() => {
    const getCategories = async () => {
      const url =
        'product-service/categories-listing?page=1&page_size=100&is_top=true';
      const response = await request(url, {
        method: 'get',
        requireAuth: false,
      })
        .then(response => response)
        .catch(error => error);

      if (response.data) {
        await setCategories(response.data);
      }
    };

    getCategories();
  }, []);

  const handleChangeCategory = value => {
    const category_ids = dataCategories || [];
    let newCategoryIds = category_ids;
    if (category_ids.find(id => id === value)) {
      newCategoryIds = category_ids.filter(id => id !== value);
      setDataCategories(newCategoryIds);
    } else {
      newCategoryIds.push(value);
      setDataCategories(newCategoryIds);
    }
  };

  const handleChangeLicenseImages = thumb => {
    setLicenseImages(thumb);
    setIsHadImg(true);
  };

  const onFinish = async values => {
    const { name_bank, province_warehouse, district_warehouse } = values;
    // setIsLoading(true);

    const handleData = {
      ...dataSupplierSetting,
      name: values.name.trim(),
      category_ids: dataCategories,
      metadata: {
        ...dataSupplierSetting?.metadata,
        business_info: {
          images_license: LicenseImages,
        },
        billing_info: {
          name_bank: name_bank.label.toString(),
          number_bank: values.number_bank.trim(),
          owner_bank: values.owner_bank.trim(),
          branch_bank: values.branch_bank.trim(),
        },
      },
      ...(isFillWarehouse
        ? {
            ware_housing: {
              name: values.name_warehouse.trim(),
              phone: values.phone_warehouse.trim(),
              description: values.description_warehouse.trim(),
              location_data: {
                province_id: province_warehouse.value?.toString(),
                province: province_warehouse.label,
                district_id: district_warehouse.value.toString(),
                district_name: district_warehouse.label,
                zipcode: values.zipcode || '',
                country: 'Viet Nam',
                country_code: 'VN',
                city: province_warehouse.label,
                address1: values.address_warehouse.trim(),
              },
            },
          }
        : {}),
    };
    if (!isEmpty(dataCategories)) {
      setIsMiss(false);
      const response = await request('/user-service/seller/register-supplier', {
        method: 'post',
        data: handleData,
      })
        .then(response => response)
        .catch(error => error);
      if (response.is_success) {
        history.push({
          pathname: '/auth/completed',
        });
      } else {
        console.log(response.data.message || response.data.error_code);
      }
    } else {
      setIsMiss(true);
    }
    setIsLoading(false);
  };

  const goBackSupplierSetting = () => {
    history.push({
      pathname: '/auth/supplier-setting',
      state: dataSupplierSetting,
    });
  };

  return (
    <div className="supplier_setting">
      <Form
        form={form}
        name="form-supplier"
        className="form-supplier"
        onFinish={onFinish}
      >
        <div className="supplier_setting__section">
          <div className="supplier_setting__section_top">
            <div className="supplier_setting__title">Thông tin kinh doanh</div>
            <div className="supplier_setting__desc">
              Vui lòng nhập các thông tin kinh doanh của Nhà Cung Cấp
            </div>
          </div>

          <div className="supplier_setting__section_bottom">
            <div className="odii-form">
              <div className="odii-form-dual">
                <div className="odii-form-dual-item">
                  <CustomItem
                    name="name"
                    label="Tên cửa hàng"
                    className="odii-form-item"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng điền Tên cửa hàng của bạn ',
                      },
                    ]}
                  >
                    <Input placeholder="Tên gian hàng kinh doanh online của bạn" />
                  </CustomItem>
                  <CustomItem
                    name="category"
                    label="Ngành hàng"
                    className="odii-form-item required"
                  >
                    <CustomDivCategories className="category-setting__list">
                      {categories &&
                        categories.map(category => (
                          <CategoryItem
                            category={category}
                            onChange={handleChangeCategory}
                          />
                        ))}
                    </CustomDivCategories>
                    {isMiss && (
                      <div className="txt-required">
                        Vui lòng chọn ngành hàng
                      </div>
                    )}
                  </CustomItem>

                  <CustomDiv className="odii-form-item ">
                    <div className="odii-form-label">Giấy phép kinh doanh</div>
                    <div>
                      Tải lên hình ảnh, tập tin các giấy tờ bắt buộc theo ngành
                      hàng của bạn.
                    </div>
                  </CustomDiv>

                  <CustomLicense className="odii-form-item ">
                    <div className="title">
                      <div className="d-flex">
                        <img
                          className="iconLicense"
                          src={isHadImg ? iconIsHadImg : iconExclamationMark}
                          alt=""
                        />
                        {isHadImg ? (
                          <div>Hình ảnh hợp lệ</div>
                        ) : (
                          <div>
                            Vui lòng chọn ảnh chụp của giấy phép kinh doanh (Nếu
                            có)
                          </div>
                        )}
                      </div>
                      {!isShowUpload ? (
                        <RightOutlined
                          onClick={() => setisShowUpload(!isShowUpload)}
                        />
                      ) : (
                        <DownOutlined
                          onClick={() => setisShowUpload(!isShowUpload)}
                        />
                      )}
                    </div>
                    {isShowUpload ? (
                      <div className="odii-form-upload">
                        <Item
                          name="image-license"
                          label=""
                          valuePropName="data"
                          // getValueFromEvent={normFile}
                          {...layout}
                        >
                          <PicturesWall
                            maxImages={7}
                            url="common-service/upload-image-file?source=supplier"
                            onChange={handleChangeLicenseImages}
                          />
                        </Item>
                      </div>
                    ) : (
                      ''
                    )}
                  </CustomLicense>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="supplier_setting__section">
          <div className="supplier_setting__section_top">
            <div className="supplier_setting__title">Thông tin thanh toán</div>
            <div className="supplier_setting__desc">
              Nhập tài khoản ngân hàng nhận thanh toán của bạn. Odii sẽ chuyển
              khoản doanh thu kinh doanh của bạn vào tài khoản này
            </div>
          </div>
          <BillingInfo layout={layout} form={form} />
        </div>

        <div className="supplier_setting__section">
          <div className="supplier_setting__section_top">
            <div className="supplier_setting__title">Địa chỉ kho hàng</div>
          </div>
          <Warehouse
            layout={layout}
            form={form}
            isFillWarehouse={isFillWarehouse}
            setIsFillWarehouse={setIsFillWarehouse}
          />
        </div>

        <CustomDivButton className="supplier_setting__button d-flex justify-content-between">
          <Button
            onClick={goBackSupplierSetting}
            context="secondary"
            color="default"
            className="btn-sm btn-back auth__form-button"
          >
            ⬅ Quay lại
          </Button>
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
            TIẾP THEO
          </Button>
        </CustomDivButton>
      </Form>
    </div>
  );
}

const CategoryItem = props => {
  const [isActive, setIsActive] = React.useState(false);

  const handleChangeCategory = async category => {
    setIsActive(!isActive);
    props.onChange(category.id);
  };

  return (
    <div
      className={`category-setting__item ${isActive ? 'active' : ''}`}
      key={props.category.id}
      onClick={_ => handleChangeCategory(props.category)}
    >
      <div className="category-setting__item_thumb">
        <img src={props.category.thumb?.origin} alt="" />
      </div>

      <div className="category-setting__item_name">{props.category.name}</div>
    </div>
  );
};

const CustomItem = styled(Item)`
  display: block;

  .ant-form-item {
    &-label {
      margin-bottom: 6px;
      label {
        &::after {
          content: '';
        }
      }
      font-weight: 500;
      margin-bottom: $spacer/2;
    }
  }
  label.ant-form-item-required {
    height: unset;
    &::before {
      content: '' !important;
    }
    &::after {
      display: inline-block;
      margin-left: 4px;
      color: #ff4d4f;
      font-size: 18px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }
  .txt-required {
    color: #ff4d4f;
  }
`;

const CustomDiv = styled.div`
  padding-top: 24px;
  padding-bottom: 26px;
  border-top: 1px solid #ebebf0;
  border-bottom: 1px solid #ebebf0;
`;

const CustomLicense = styled.div`
  padding: 14px 0 18px;
  border-bottom: 1px solid #ebebf0;
  .title {
    display: flex;
    justify-content: space-between;
  }
  .iconLicense {
    margin-right: 10px;
  }
  .anticon-right {
    margin-top: 6px;
  }
  .odii-form-upload {
    border: 1px dashed #ebebf0;
    margin-top: 16px;
    height: 128px;
    padding: 12px 0;
  }
  /* .ant-upload-select {
    max-width: 100%;
    max-height: 168px;
  } */
`;

const CustomDivButton = styled.div`
  button {
    letter-spacing: 1px;
  }
  .btn-back {
    text-transform: none;
  }
`;

const CustomDivCategories = styled.div`
  display: flex;
  flex-wrap: wrap;
  .category-setting {
    &__item {
      border: solid 1px #ebebf0;
      width: 23%;
      display: inline-flex;
      align-items: center;
      padding: ${({ theme }) => (theme.space.s4 / 6) * 5}px
        ${({ theme }) => theme.space.s4}px;
      margin-bottom: 24px;
      border-radius: 4px;
      cursor: pointer;

      &:not(:nth-child(4n)) {
        margin-right: 24px;
      }

      &.active {
        border-color: #3d56a6;
        color: #3d56a6;
        font-weight: 500;
        border-width: 2px;
        padding: ${({ theme }) => (theme.space.s4 / 6) * 5 - 1}px
          ${({ theme }) => theme.space.s4 - 1}px;
      }

      &_thumb {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: ${({ theme }) => theme.space.s4 / 3}px;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center center;
        }
      }
    }
  }
`;
