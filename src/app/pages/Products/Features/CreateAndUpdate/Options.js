import React, { memo, useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { Tags, Form, Select, Button } from 'app/components';
import styled from 'styled-components';
import { isEmpty, without } from 'lodash';
import { deleteIcon } from 'assets/images/icons';
import Constants from 'assets/constants';
import { CustomStyle } from 'styles/commons';

const Item = Form.Item;
const Option = Select.Option;

export default memo(function Options({
  layout,
  variations = [],
  getFieldsValue,
  setFieldsValue,
  setVariations,
  option_1,
  option_2,
  option_3,
  supplierInfo,
}) {
  const [options, setOptions] = useState({
    options1: [],
    options2: [],
    options3: [],
  });

  const [optionShow, setOptionShow] = useState(1);

  useEffect(() => {
    const currentOptions = variations.reduce(
      (final, item) => {
        if (item.option_1 && !final.options1.includes(item.option_1)) {
          final.options1.push(item.option_1);
        }
        if (item.option_2 && !final.options2.includes(item.option_2)) {
          final.options2.push(item.option_2);
        }
        if (item.option_3 && !final.options3.includes(item.option_3)) {
          final.options3.push(item.option_3);
        }
        return final;
      },
      {
        options1: [],
        options2: [],
        options3: [],
      },
    );
    if (currentOptions.options3.length > 0) {
      setOptionShow(3);
    } else if (currentOptions.options2.length > 0) {
      setOptionShow(2);
    }
    setOptions(currentOptions);
  }, []);

  const { options1, options2, options3 } = options;

  const addOption = () => {
    setOptionShow(optionShow + 1);
  };

  const handleChangeVariations = type => value => {
    const allOption = { options1, options2, options3 };
    const newVariations = [];
    allOption[type] = value;
    setOptions(allOption);

    const {
      origin_supplier_price,
      high_retail_price,
      low_retail_price,
      total_quantity,
      defaultVariation,
    } = getFieldsValue();
    const {
      box_length_cm,
      box_width_cm,
      box_height_cm,
      weight_grams,
    } = defaultVariation;
    const initVariation = {
      origin_supplier_price: origin_supplier_price || '',
      high_retail_price: high_retail_price || '',
      low_retail_price: low_retail_price || '',
      total_quantity: total_quantity || '',
      box_length_cm: box_length_cm || '',
      box_width_cm: box_width_cm || '',
      box_height_cm: box_height_cm || '',
      weight_grams: weight_grams || '',
      status: 'active',
      low_quantity_thres: supplierInfo?.low_quantity_thres,
    };
    if (!isEmpty(allOption.options1)) {
      for (const item1 of allOption.options1) {
        if (!isEmpty(allOption.options2)) {
          for (const item2 of allOption.options2) {
            if (!isEmpty(allOption.options3)) {
              for (const item3 of allOption.options3) {
                newVariations.push({
                  ...initVariation,
                  option_1: item1,
                  option_2: item2,
                  option_3: item3,
                });
              }
            } else {
              newVariations.push({
                ...initVariation,
                option_1: item1,
                option_2: item2,
              });
            }
          }
        } else {
          if (!isEmpty(allOption.options3)) {
            for (const item3 of allOption.options3) {
              newVariations.push({
                ...initVariation,
                option_1: item1,
                option_3: item3,
              });
            }
          } else {
            newVariations.push({
              ...initVariation,
              option_1: item1,
            });
          }
        }
      }
    } else {
      if (!isEmpty(allOption.options2)) {
        for (const item2 of allOption.options2) {
          if (!isEmpty(allOption.options3)) {
            for (const item3 of allOption.options3) {
              newVariations.push({
                ...initVariation,
                option_2: item2,
                option_3: item3,
              });
            }
          } else {
            newVariations.push({
              ...initVariation,
              option_2: item2,
            });
          }
        }
      } else {
        if (!isEmpty(allOption.options3)) {
          for (const item3 of allOption.options3) {
            newVariations.push({
              ...initVariation,
              option_3: item3,
            });
          }
        }
      }
    }
    setVariations(newVariations);
  };

  const handleDeleteOption = type => () => {
    handleChangeVariations(type)([]);
    setFieldsValue({
      [{ options1: 'option_1', options2: 'option_2', options3: 'option_3' }[
        type
      ]]: '',
    });
  };

  return (
    <div>
      <>
        {/* <div className="title">Option</div> */}
        <div className="">
          <Row>
            <Col span={5}>
              <Item name="option_1" label="Thuộc tính 1" {...layout}>
                <CustomSelect>
                  {without(
                    Constants.LIST_OPTION_VARIATIONS,
                    option_2,
                    option_3,
                  ).map(item => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
                </CustomSelect>
              </Item>
            </Col>
            <Col span={17}>
              <WrapperItem>
                <Item
                  name=""
                  defaultValue={options1}
                  label="1"
                  {...layout}
                  disabled={!option_1}
                >
                  <Tags
                    disabled={!option_1}
                    defaultShowInput
                    data={options1}
                    onChange={handleChangeVariations('options1')}
                  />
                </Item>
              </WrapperItem>
            </Col>
            <Col
              span={2}
              className="d-flex align-items-end justify-content-end"
            >
              <CustomStyle mb={{ xs: 's7' }}>
                <Button
                  context="secondary"
                  className="btn-md"
                  onClick={handleDeleteOption('options1')}
                  color="red"
                  width="36px"
                >
                  <img src={deleteIcon} alt="" />
                </Button>
              </CustomStyle>
            </Col>
          </Row>
          {optionShow >= 2 && (
            <Row>
              <Col span={5}>
                <Item name="option_2" label="Thuộc tính 2" {...layout}>
                  <CustomSelect>
                    {without(
                      Constants.LIST_OPTION_VARIATIONS,
                      option_1,
                      option_3,
                    ).map(item => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </CustomSelect>
                </Item>
              </Col>
              <Col span={17}>
                <WrapperItem>
                  <Item
                    name=""
                    disabled={!option_2}
                    defaultValue={options2}
                    label="2"
                    {...layout}
                  >
                    <Tags
                      disabled={!option_2}
                      defaultShowInput
                      data={options2}
                      onChange={handleChangeVariations('options2')}
                    />
                  </Item>
                </WrapperItem>
              </Col>
              <Col
                span={2}
                className="d-flex align-items-end justify-content-end"
              >
                <CustomStyle mb={{ xs: 's7' }}>
                  <Button
                    context="secondary"
                    className="btn-md"
                    onClick={handleDeleteOption('options2')}
                    color="red"
                    width="36px"
                  >
                    <img src={deleteIcon} alt="" />
                  </Button>
                </CustomStyle>
              </Col>
            </Row>
          )}
          {optionShow === 3 && (
            <Row>
              <Col span={5}>
                <Item name="option_3" label="Thuộc tính 3" {...layout}>
                  <CustomSelect>
                    {without(
                      Constants.LIST_OPTION_VARIATIONS,
                      option_1,
                      option_2,
                    ).map(item => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </CustomSelect>
                </Item>
              </Col>
              <Col span={17}>
                <WrapperItem>
                  <Item
                    name=""
                    disabled={!option_3}
                    defaultValue={options3}
                    label="3"
                    {...layout}
                  >
                    <Tags
                      disabled={!option_3}
                      defaultShowInput
                      data={options3}
                      onChange={handleChangeVariations('options3')}
                    />
                  </Item>
                </WrapperItem>
              </Col>
              <Col
                span={2}
                className="d-flex align-items-end justify-content-end"
              >
                <CustomStyle mb={{ xs: 's7' }}>
                  <Button
                    context="secondary"
                    className="btn-md"
                    onClick={handleDeleteOption('options3')}
                    color="red"
                    width="36px"
                  >
                    <img src={deleteIcon} alt="" />
                  </Button>
                </CustomStyle>
              </Col>
            </Row>
          )}
        </div>
        {optionShow === 3 || (
          <CustomStyle mb={{ xs: 's7' }}>
            <Button
              context="secondary"
              className="btn-sm"
              width="150px"
              onClick={addOption}
            >
              Thêm thuộc tính
            </Button>
          </CustomStyle>
        )}
      </>
    </div>
  );
});

const CustomSelect = styled(Select)`
  .ant-select-selector {
    border-right: none !important;
    background: ${({ theme }) => theme.background} !important;
    border-radius: 4px 0px 0px 4px !important;
    font-size: 14px;
  }
`;

const WrapperItem = styled.div`
  label {
    visibility: hidden;
  }
  .ant-form-item-control {
    border: 1px solid ${({ theme }) => theme.stroke};
    border-radius: 0px 4px 4px 0px;
  }

  .ant-form-item-control-input-content {
    padding: 5px 6px 0;
    min-height: 38px;
    > * {
      display: flex;
      flex-wrap: wrap;
    }
  }
  .ant-tag,
  .ant-input {
    height: 28px;
  }

  .ant-input {
    border: none;
    flex: 1;
    box-shadow: none;
  }
`;
