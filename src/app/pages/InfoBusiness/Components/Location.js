import React, { useState, useEffect } from 'react';
import { Input, Select, Form } from 'app/components';
import { Row, Col } from 'antd';
import request from 'utils/request';
import { isEmpty } from 'lodash';
import { styledSystem } from 'styles/theme/utils';
import styled from 'styled-components/macro';
import { flagVN } from 'assets/images';

const Item = Form.Item;

function Location({ layout }) {
  const [provinceLocation, setProvinceLocation] = useState([]);
  const [districtLocation, setDistrictLocation] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (provinceLocation?.value) fetchDistricts();
  }, [provinceLocation]);

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
    const url = `/common-service/location-country?parent_id=${provinceLocation?.value}&type=district`;
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
              <Item name="country" label="Quốc gia" {...layout}>
                <Select
                  placeholder="Chọn quốc gia của bạn"
                  // initialValue={{ value: 'Viet Nam' }}
                  defaultActiveFirstOption
                >
                  {[
                    {
                      id: 0,
                      code: 'VN',
                      label: 'Viet Nam',
                      flag: flagVN,
                    },
                  ]?.map(v => (
                    <Select.Option key={v.code} value={v.label}>
                      {v.label} <img className="img-flag" src={v.flag} alt="" />
                    </Select.Option>
                  ))}
                </Select>
              </Item>
              <CustomItem
                name="province_location"
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
                  onSelect={e => setProvinceLocation(e)}
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
              <Item
                name="zipcode"
                label="Mã vùng (Zip/postal code)"
                {...layout}
              >
                <Input placeholder="Mã vùng" type="number" />
              </Item>
              <CustomItem
                name="district_location"
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
                name="ward_location"
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
                name="address1"
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
        </Col>
      </Row>
    </CustomSectionWrapper>
  );
}

export default Location;

const CustomSectionWrapper = styledSystem(styled.div`
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
`;
