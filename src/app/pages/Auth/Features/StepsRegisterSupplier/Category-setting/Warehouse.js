import React, { useState, useEffect } from 'react';
import { Input, Form, Select } from 'app/components';
import { Row, Col, Switch } from 'antd';
import request from 'utils/request';
import { isEmpty } from 'lodash';
import { styledSystem } from 'styles/theme/utils';
import styled from 'styled-components/macro';
import { SectionWrapper, CustomStyle } from 'styles/commons';

const Item = Form.Item;
const { TextArea } = Input;

function Warehouse({ layout, form, isFillWarehouse, setIsFillWarehouse }) {
  const [province_warehouse, setProvince_warehouse] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (province_warehouse?.value) fetchDistricts();
  }, [province_warehouse]);

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
    const url = `/common-service/location-country?parent_id=${province_warehouse?.value}&type=district`;
    const response = await request(url, {
      method: 'get',
      requireAuth: false,
    })
      .then(response => {
        if (!isEmpty(response?.data)) setDistricts(response?.data);
      })
      .catch(error => error);
  };

  return (
    <>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <CustomDivSwitch className="d-flex justify-content-between">
          <div>Bạn có muốn hoàn tất thông tin Địa chỉ kho hàng ngay không?</div>
          <div className="d-flex">
            <CustomStyle
              color="gray3"
              fontSize={{ xs: 'f1' }}
              mr={{ xs: 's2' }}
              mt={{ xs: 's1' }}
            >
              {isFillWarehouse ? 'Có' : 'không'}
            </CustomStyle>

            <CustomSwitch
              defaultChecked={isFillWarehouse}
              onChange={() => setIsFillWarehouse(!isFillWarehouse)}
            ></CustomSwitch>
          </div>
        </CustomDivSwitch>
        {isFillWarehouse && (
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
                    ]}
                  >
                    <Input placeholder="Tên kho hàng" />
                  </CustomItem>
                </Col>
                <Col span={12}>
                  <Item name="phone_warehouse" label="Điện thoại" {...layout}>
                    <Input placeholder="Điện thoại" type="number" />
                  </Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <CustomItem
                    name="description_warehouse"
                    label="Mô tả kho"
                    {...layout}
                  >
                    <TextArea
                      className="textArea"
                      style={{ minHeight: '120px' }}
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
                      onSelect={e => setProvince_warehouse(e)}
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
            </Col>
          </Row>
        )}
      </CustomSectionWrapper>
    </>
  );
}

export default Warehouse;

export const CustomSectionWrapper = styledSystem(styled(SectionWrapper)`
  padding: 16px;
  padding-bottom: 0;
  border-radius: 4px;
  .title {
    color: #000;
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 1rem;
  }
  input,
  .ant-tag,
  .ant-select-selector {
    border-radius: 2px;
  }
  label {
    font-weight: 500;
  }
  .img-flag {
    margin-top: -2px;
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
const CustomDivSwitch = styled.div`
  padding-bottom: 18px;
  border-bottom: solid 1px #ebebf0;
  margin-bottom: 18px;
`;
const CustomSwitch = styled(Switch)`
  &.ant-switch-checked {
    background: #4869de;
  }
`;
