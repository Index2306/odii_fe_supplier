import React, { useState, useEffect } from 'react';
import { Input, Form, Select, Checkbox } from 'app/components';
import { Row, Col } from 'antd';
import request from 'utils/request';
import { isEmpty } from 'lodash';
// import { CustomStyle } from 'styles/commons';
import { styledSystem } from 'styles/theme/utils';
import styled from 'styled-components/macro';
import { validatePhoneNumberVN } from 'utils/helpers';

const Item = Form.Item;
const { TextArea } = Input;

function Warehouse({ layout }) {
  const [provinceWarehouse, setProvinceWarehouse] = useState([]);
  const [districtLocation, setDistrictLocation] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (provinceWarehouse?.value) fetchDistricts();
  }, [provinceWarehouse]);

  useEffect(() => {
    if (districtLocation?.value) fetchWards();
  }, [districtLocation]);

  const fetchProvinces = async () => {
    const url = '/common-service/location-country?type=province';
    const response = await request(url, {
      method: 'get',
      requireAuth: false,
    })
      .then(response => {
        if (!isEmpty(response?.data)) setProvinces(response?.data);
      })
      .catch(error => error);
  };

  const fetchDistricts = async () => {
    const url = `/common-service/location-country?parent_id=${provinceWarehouse?.value}&type=district`;
    const response = await request(url, {
      method: 'get',
      requireAuth: false,
    })
      .then(response => {
        if (!isEmpty(response?.data)) setDistricts(response?.data);
      })
      .catch(error => error);
  };

  const fetchWards = async () => {
    const url = `/common-service/location-country?parent_id=${districtLocation?.value}&type=ward`;
    const response = await request(url, {
      method: 'get',
      requireAuth: false,
    })
      .then(response => {
        if (!isEmpty(response?.data)) setWards(response?.data);
      })
      .catch(error => error);
  };

  return (
    <CustomSectionWrapper>
      <Row>
        <Col xs={24}>
          <Row gutter={24}>
            <Col span={12}>
              <CustomItem
                name="name_warehouse"
                label="Tên kho hàng"
                {...layout}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng điền Tên kho hàng',
                  },
                  {
                    max: 120,
                    message: 'Tên kho hàng không vượt quá 120 ký tự.',
                  },
                ]}
              >
                <Input
                  // showCount
                  // maxLength={120}
                  // minLength={10}
                  // suffix={
                  //   <CustomStyle color="gray3">{`| ${
                  //     name_warehouse?.length ?? 0
                  //   }/120`}</CustomStyle>
                  // }
                  placeholder="Tên kho hàng"
                />
              </CustomItem>
            </Col>
            <Col span={12}>
              <CustomItem
                name="phone_warehouse"
                label="Điện thoại"
                {...layout}
                rules={[
                  {
                    required: true,
                    message: 'Nhập số điện thoại',
                  },
                  validatePhoneNumberVN,
                ]}
              >
                <Input placeholder="Điện thoại" type="number" />
              </CustomItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <CustomItem
                name="description_warehouse"
                label="Mô tả kho"
                {...layout}
                rules={[
                  {
                    max: 500,
                    message: 'Nội dung mô tả kho không vượt quá 500 ký tự.',
                  },
                ]}
              >
                <TextArea
                  className="textArea"
                  showCount
                  maxLength={500}
                  rows={4}
                  placeholder="Nhập nội dung mô tả ngắn gọn về kho hàng này"
                />
              </CustomItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <CustomItem
                name="province_warehouse"
                label="Tỉnh/ Thành phố"
                {...layout}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn Tỉnh/ Thành phố!',
                  },
                ]}
              >
                <Select
                  labelInValue
                  showSearch
                  placeholder="Chọn tỉnh / Thành phố"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onSelect={e => setProvinceWarehouse(e)}
                >
                  {provinces?.map(v => (
                    <Select.Option key={v.id} value={v.id}>
                      {v.name}
                    </Select.Option>
                  ))}
                </Select>
              </CustomItem>
            </Col>
            <Col span={12}>
              <CustomItem
                name="district_warehouse"
                label="Quận/ Huyện"
                {...layout}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn Quận / Huyện!',
                  },
                ]}
              >
                <Select
                  labelInValue
                  showSearch
                  placeholder="Chọn Quận/ Huyện"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onSelect={e => setDistrictLocation(e)}
                >
                  {districts?.map(v => (
                    <Select.Option key={v.id} value={v.id}>
                      {v.name}
                    </Select.Option>
                  ))}
                </Select>
              </CustomItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <CustomItem
                name="ward_warehouse"
                label="Phường/ Xã"
                {...layout}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn Phường / Xã!',
                  },
                ]}
              >
                <Select
                  labelInValue
                  showSearch
                  placeholder="Chọn Phường/ Xã"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {wards?.map(v => (
                    <Select.Option key={v.id} value={v.id}>
                      {v.name}
                    </Select.Option>
                  ))}
                </Select>
              </CustomItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <CustomItem
                name="address_warehouse"
                label="Số nhà & Tên đường"
                {...layout}
                rules={[
                  {
                    required: true,
                    message:
                      'Vui lòng điền đầy đủ địa chỉ số nhà và tên đường!',
                  },
                ]}
              >
                <Input placeholder="Nhập địa chỉ Số nhà & Tên đường" />
              </CustomItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <CustomItem
                name="is_pickup_address"
                valuePropName="checked"
                {...layout}
                style={{ marginBottom: '12px' }}
              >
                <Checkbox style={{ fontWeight: '400' }}>
                  Đặt làm Kho lấy hàng
                </Checkbox>
              </CustomItem>
              <CustomItem
                name="is_return_address"
                valuePropName="checked"
                {...layout}
              >
                <Checkbox style={{ fontWeight: '400' }}>
                  Đặt làm Kho trả hàng
                </Checkbox>
              </CustomItem>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* )} */}
    </CustomSectionWrapper>
  );
}

export default Warehouse;

export const CustomSectionWrapper = styledSystem(styled.div`
  label {
    font-weight: 500;
  }
`);
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
      margin-bottom: 6px;
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
`;
