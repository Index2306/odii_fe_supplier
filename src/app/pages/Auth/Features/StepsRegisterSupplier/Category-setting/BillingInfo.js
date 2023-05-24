import React from 'react';
import { Input, Form, Select } from 'app/components';
import { Row, Col } from 'antd';
import { styledSystem } from 'styles/theme/utils';
import styled from 'styled-components/macro';
import { SectionWrapper } from 'styles/commons';

const Item = Form.Item;

function Info({ layout, form }) {
  const optionBanks = [
    { id: 0, label: 'Vietcombank' },
    { id: 1, label: 'Techcombank' },
    { id: 2, label: 'Agribank' },
    { id: 3, label: 'Vietinbank' },
  ];

  return (
    <div>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <Row>
          <Col xs={24}>
            <Row gutter={24}>
              <Col span={12}>
                <CustomItem
                  name="name_bank"
                  label="Ngân hàng "
                  {...layout}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn ngân hàng',
                    },
                  ]}
                >
                  <Select
                    labelInValue
                    showSearch
                    placeholder="Chọn ngân hàng "
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {optionBanks?.map(v => (
                      <Select.Option key={v.id} value={v.label}>
                        {v.label}
                      </Select.Option>
                    ))}
                  </Select>
                </CustomItem>
                <CustomItem
                  name="number_bank"
                  label="Số tài khoản"
                  {...layout}
                  className="odii-form-item"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập số tài khoản',
                    },
                  ]}
                >
                  <Input placeholder="Nhập số tài khoản" />
                </CustomItem>
              </Col>
              <Col span={12}>
                <CustomItem
                  name="branch_bank"
                  label="Chi nhánh"
                  {...layout}
                  className="odii-form-item"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên chi nhánh ngân hàng',
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên chi nhánh ngân hàng" />
                </CustomItem>
                <CustomItem
                  name="owner_bank"
                  label="Tên chủ tài khoản"
                  {...layout}
                  className="odii-form-item"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập đầy đủ Họ Tên chủ tài khoản',
                    },
                  ]}
                >
                  <Input placeholder="Nhập Họ Tên chủ tài khoản" />
                </CustomItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </CustomSectionWrapper>
    </div>
  );
}

export default Info;

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
