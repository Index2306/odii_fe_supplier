import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Row, Col, Divider, List } from 'antd';
import { isEqual, isNumber } from 'lodash';
import { Modal, Button, Image, InputNumber, Input } from 'app/components';
import { CustomStyle } from 'styles/commons';

export default function ShippingModal({
  layout,
  data = [],
  variations = [],
  setVariations,
  callBackCancel,
  ...res
}) {
  const [allValue, setAllValue] = useState({
    box_length_cm: '',
    box_width_cm: '',
    box_height_cm: '',
    weight_grams: '',
  });
  const [listShow, setListShow] = useState(data);
  const [finalListVariation, setFinalListVariation] = useState(variations);
  const [disableOk, setDisableOk] = useState(true);

  const onSave = () => {
    setVariations(finalListVariation);
    callBackCancel();
  };

  useEffect(() => {
    if (isEqual(data, listShow)) {
      setDisableOk(true);
    } else setDisableOk(false);
  }, [listShow]);

  const handleChangeAllInput = t => v => {
    setAllValue({ ...allValue, [t]: v?.target?.value ?? v });
  };

  const applyAll = type => () => {
    const v = allValue[type];
    const handleVariations = finalListVariation.map(item => ({
      ...item,
      [type]: listShow.some(o => o.id === item.id) ? v : item[type],
    }));
    const handleListShow = listShow.map(item => ({
      ...item,
      [type]: v,
    }));
    setFinalListVariation(handleVariations);
    setListShow(handleListShow);
  };

  const applyValueDetail = (type, id) => v => {
    const value = v.target.value;
    if (value) {
      const handleVariations = finalListVariation.map(item => ({
        ...item,
        [type]: item.id === id ? value : item[type],
      }));
      const handleListShow = listShow.map(item => ({
        ...item,
        [type]: item.id === id ? value : item[type],
      }));
      setFinalListVariation(handleVariations);
      setListShow(handleListShow);
    }
  };

  const { box_length_cm, box_width_cm, box_height_cm, weight_grams } = allValue;

  return (
    <div>
      <Modal
        {...res}
        isOpen
        disableOk={disableOk}
        width={800}
        callBackOk={onSave}
        callBackCancel={callBackCancel}
      >
        <Row gutter={16}>
          <Col span={12}>
            <CustomStyle my={{ xs: 's3' }} fontWeight="medium">
              Áp dụng tất chiều dài
            </CustomStyle>
            <Row gutter={8}>
              <Col span={16}>
                <InputNumber
                  placeholder="Dài"
                  value={box_length_cm}
                  suffix="cm"
                  onChange={handleChangeAllInput('box_length_cm')}
                />
              </Col>
              <Col span={8}>
                <Button
                  context="secondary"
                  disabled={!box_length_cm}
                  className="w-100 h-100 p-0"
                  onClick={applyAll('box_length_cm')}
                >
                  Áp dụng
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <CustomStyle my={{ xs: 's3' }} fontWeight="medium">
              Áp dụng tất chiều rộng
            </CustomStyle>
            <Row gutter={8}>
              <Col span={16}>
                <InputNumber
                  placeholder="Rộng"
                  value={box_width_cm}
                  suffix="cm"
                  onChange={handleChangeAllInput('box_width_cm')}
                />
              </Col>
              <Col span={8}>
                <Button
                  context="secondary"
                  disabled={!box_width_cm}
                  className="w-100 h-100 p-0"
                  onClick={applyAll('box_width_cm')}
                >
                  Áp dụng
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <CustomStyle my={{ xs: 's3' }} fontWeight="medium">
              Áp dụng tất chiều cao
            </CustomStyle>
            <Row gutter={8}>
              <Col span={16}>
                <InputNumber
                  placeholder="Cao"
                  value={box_height_cm}
                  suffix="cm"
                  onChange={handleChangeAllInput('box_height_cm')}
                />
              </Col>
              <Col span={8}>
                <Button
                  context="secondary"
                  disabled={!box_height_cm}
                  className="w-100 h-100 p-0"
                  onClick={applyAll('box_height_cm')}
                >
                  Áp dụng
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <CustomStyle my={{ xs: 's3' }} fontWeight="medium">
              Áp dụng tất khối lượng
            </CustomStyle>
            <Row gutter={8}>
              <Col span={16}>
                <InputNumber
                  placeholder="Khối lượng"
                  value={weight_grams}
                  suffix="gr"
                  onChange={handleChangeAllInput('weight_grams')}
                />
              </Col>
              <Col span={8}>
                <Button
                  context="secondary"
                  disabled={!weight_grams}
                  className="w-100 h-100 p-0"
                  onClick={applyAll('weight_grams')}
                >
                  Áp dụng
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <Divider />

        <WrapperOption>
          {listShow.map(item => (
            <Row gutter={8}>
              <Col span={4}>
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Image size="200x200" src={item?.thumb?.location} />
                    }
                    // description={`Giá: ${formatMoney(
                    //   item.total_quantity,
                    // )}đ`}
                    title={`${item.option_1}${
                      item.option_2 ? `/${item.option_2}` : ''
                    }${item.option_3 ? `/${item.option_3}` : ''}`}
                  />
                </List.Item>
              </Col>
              <Col span={5}>
                <CustomStyle my={{ xs: 's3' }}>Chiều dài</CustomStyle>
                <Input
                  placeholder="Chiều dài"
                  suffix="cm"
                  value={item.box_length_cm}
                  onChange={applyValueDetail('box_length_cm', item.id)}
                />
              </Col>
              <Col span={5}>
                <CustomStyle my={{ xs: 's3' }}>Rộng</CustomStyle>
                <Input
                  placeholder="Rộng"
                  suffix="cm"
                  value={item.box_width_cm}
                  onChange={applyValueDetail('box_width_cm', item.id)}
                />
              </Col>
              <Col span={5}>
                <CustomStyle my={{ xs: 's3' }}>Cao</CustomStyle>
                <Input
                  placeholder="Cao"
                  suffix="cm"
                  value={item.box_height_cm}
                  onChange={applyValueDetail('box_height_cm', item.id)}
                />
              </Col>
              <Col span={5}>
                <CustomStyle my={{ xs: 's3' }}>Khối lượng</CustomStyle>
                <Input
                  placeholder="Khối lượng"
                  suffix="cm"
                  value={item.weight_grams}
                  onChange={applyValueDetail('weight_grams', item.id)}
                />
              </Col>
            </Row>
          ))}
        </WrapperOption>
      </Modal>
    </div>
  );
}

const WrapperOption = styled.div`
  max-height: 300px;
  overflow: scroll;
  > :not(:last-child) {
    padding-bottom: 16px;
    margin-bottom: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.stroke};
  }
  .ant-image {
    width: 48px;
    border-radius: 4px;
  }
  .ant-list-item-meta-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ant-list-item-meta-description {
    font-weight: 400;
    font-size: 12;
    color: rgba(0, 0, 0, 0.4);
  }
`;
