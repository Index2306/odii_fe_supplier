import React, { useState, useEffect } from 'react';
import { Input, Select, Form, Checkbox } from 'app/components';
import { Row, Col } from 'antd';
import { isEmpty } from 'lodash';
import { getLocation } from 'utils/providers';
import { CustomSectionWrapper } from '../../styled';

const Item = Form.Item;
function Location({ layout, form, province, district }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const { setFieldsValue } = form;
  useEffect(() => {
    getProvinces();
  }, []);

  useEffect(() => {
    if (province?.value) getDistricts();
  }, [province]);

  useEffect(() => {
    if (district?.value) getWards();
  }, [district]);
  const getWards = () => {
    getLocation({ parent_id: district?.value, type: 'ward' }).then(res => {
      if (!isEmpty(res?.data)) setWards(res?.data);
      else setWards([]);
    });
  };
  const getDistricts = () => {
    getLocation({ parent_id: province?.value, type: 'district' }).then(res => {
      if (!isEmpty(res?.data)) setDistricts(res?.data);
      setWards([]);
    });
  };

  function getProvinces() {
    getLocation({ type: 'province' }).then(res => {
      if (!isEmpty(res?.data)) setProvinces(res?.data);
    });
  }
  const handleChange = type => {
    if (type === 'province') {
      setFieldsValue({
        district: null,
        ward: null,
      });
    } else if (type === 'district') {
      setFieldsValue({
        ward: null,
      });
    }
  };
  return (
    <div>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <Row>
          <Col xs={24} lg={17}>
            <Row gutter={24}>
              <Col span={12}>
                <Item
                  name={['location_data', 'country_code']}
                  label="Quốc gia"
                  {...layout}
                  rules={[
                    {
                      required: true,
                      message: 'Please input your country!',
                    },
                  ]}
                >
                  <Select>
                    {[{ value: 'VN', label: 'Viet Nam' }]?.map(v => (
                      <Select.Option key={v.value} value={v.value}>
                        {v.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Item>
              </Col>
              <Col span={12}>
                <Item name="zipcode" label="Mã Zip" {...layout}>
                  <Input placeholder="Nhập số nhà và tên đường" />
                </Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Item
                  name="province"
                  label="Tỉnh / Thành"
                  {...layout}
                  rules={[
                    {
                      required: true,
                      message: 'Xin vui lòng chọn tỉnh/TP!',
                    },
                  ]}
                >
                  <Select
                    labelInValue
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={() => handleChange('province')}
                  >
                    {provinces?.map(v => (
                      <Select.Option key={v.id} value={v.id}>
                        {v.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Item>
              </Col>
              <Col span={12}>
                <Item
                  name="district"
                  label="Quận / Huyện"
                  allowClear
                  {...layout}
                  rules={[
                    {
                      required: true,
                      message: 'Xin vui lòng chọn quận/huyện!',
                    },
                  ]}
                >
                  <Select
                    labelInValue
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={() => handleChange('district')}
                  >
                    {districts?.map(v => (
                      <Select.Option key={v.id} value={v.id}>
                        {v.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Item>
              </Col>
              <Col span={12}>
                <Item
                  allowClear
                  name="ward"
                  label="Phường / Xã"
                  {...layout}
                  rules={[
                    {
                      required: true,
                      message: 'Xin vui lòng chọn phường/xã!',
                    },
                  ]}
                >
                  <Select
                    labelInValue
                    showSearch
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
                </Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Item
                  name={['location_data', 'address1']}
                  label="Địa chỉ"
                  {...layout}
                  rules={[
                    {
                      required: true,
                      message: 'Please input your address!',
                    },
                  ]}
                >
                  <Input placeholder="Nhập số nhà và tên đường" />
                </Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Item
                  name="is_pickup_address"
                  valuePropName="checked"
                  {...layout}
                  style={{ marginBottom: '12px' }}
                >
                  <Checkbox style={{ fontWeight: '400' }}>
                    Đặt làm Kho lấy hàng
                  </Checkbox>
                </Item>
                <Item
                  name="is_return_address"
                  valuePropName="checked"
                  {...layout}
                >
                  <Checkbox style={{ fontWeight: '400' }}>
                    Đặt làm Kho trả hàng
                  </Checkbox>
                </Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </CustomSectionWrapper>
    </div>
  );
}

export default Location;
