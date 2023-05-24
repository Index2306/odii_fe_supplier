import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Row, Col, Divider, List } from 'antd';
import { isEqual, isNumber } from 'lodash';
import { Modal, Button, Image, InputNumber } from 'app/components';
import { CustomStyle } from 'styles/commons';

export default function TotalQuantity({
  layout,
  data = [],
  variations = [],
  setVariations,
  callBackCancel,
  callBackSave,
  ...res
}) {
  const [allTotalQuantity, setAllTotalQuantity] = useState('');
  const [allOdiiComparePrice, setAllOdiiComparePrice] = useState('');
  const [listShow, setListShow] = useState(data);
  const [finalListVariation, setFinalListVariation] = useState(variations);
  const [disableOk, setDisableOk] = useState(true);

  const onSave = () => {
    setVariations(finalListVariation);
    callBackCancel();
    callBackSave(finalListVariation);
  };

  useEffect(() => {
    if (isEqual(data, listShow)) {
      setDisableOk(true);
    } else setDisableOk(false);
  }, [listShow]);

  const handleChangeTotalQuantity = v => {
    if (isNumber(v)) {
      setAllTotalQuantity(v);
    } else {
      setAllTotalQuantity('');
    }
  };

  const handleChangeAllOdiiComparePrice = v => {
    if (isNumber(v)) {
      setAllOdiiComparePrice(v);
    } else {
      setAllOdiiComparePrice(v);
    }
  };

  const applyAll = type => () => {
    const v =
      type === 'total_quantity' ? allTotalQuantity : allOdiiComparePrice;
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
    if (isNumber(v)) {
      const handleVariations = finalListVariation.map(item => ({
        ...item,
        [type]: item.id === id ? v : item[type],
      }));
      const handleListShow = listShow.map(item => ({
        ...item,
        [type]: item.id === id ? v : item[type],
      }));
      setFinalListVariation(handleVariations);
      setListShow(handleListShow);
    }
  };

  return (
    <div>
      <Modal
        {...res}
        isOpen
        disableOk={disableOk}
        width={600}
        callBackOk={onSave}
        callBackCancel={callBackCancel}
      >
        <Row gutter={16}>
          <Col span={24}>
            <CustomStyle my={{ xs: 's3' }} fontWeight="medium">
              Áp dụng tất
            </CustomStyle>
            <Row gutter={8}>
              <Col span={16}>
                <InputNumber
                  placeholder="Số lượng"
                  value={allTotalQuantity}
                  onChange={handleChangeTotalQuantity}
                />
              </Col>
              <Col span={8}>
                <Button
                  context="secondary"
                  disabled={!isNumber(allTotalQuantity)}
                  className="w-100 h-100 p-0"
                  onClick={applyAll('total_quantity')}
                >
                  Áp dụng
                </Button>
              </Col>
            </Row>
          </Col>
          {/* <Col span={12}>
            <CustomStyle my={{ xs: 's3' }} fontWeight="medium">
              Áp dụng tất cả giá khuyễn mại
            </CustomStyle>
            <Row gutter={8}>
              <Col span={16}>
                <InputNumber
                  placeholder="Giá"
                  value={allOdiiComparePrice}
                  onChange={handleChangeAllOdiiComparePrice}
                />
              </Col>
              <Col span={8}>
                <Button
                  context="secondary"
                  disabled={!isNumber(allOdiiComparePrice)}
                  className="w-100 h-100 p-0"
                  onClick={applyTotalQuantity('odii_compare_price')}
                >
                  Áp dụng
                </Button>
              </Col>
            </Row>
          </Col> */}
        </Row>

        <Divider />

        <WrapperOption>
          {listShow.map(item => (
            <Row gutter={8}>
              <Col span={7}>
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
              <Col span={17}>
                <CustomStyle my={{ xs: 's3' }}>Số lượng</CustomStyle>
                <InputNumber
                  placeholder="Số lượng"
                  value={item.total_quantity}
                  onChange={applyValueDetail('total_quantity', item.id)}
                />
              </Col>
              {/* <Col span={7}>
                <CustomStyle my={{ xs: 's3' }}>Giá khuyến mại</CustomStyle>
                <InputMoney
                  placeholder="Giá"
                  value={item.odii_compare_price}
                  onChange={applyValueDetail('odii_compare_price', item.id)}
                />
              </Col> */}
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
