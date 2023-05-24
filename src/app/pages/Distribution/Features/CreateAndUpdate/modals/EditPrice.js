import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Row, Col, Divider, List } from 'antd';
import { isEqual, isNumber } from 'lodash';
import { Modal, Button, Image } from 'app/components';
import { CustomStyle } from 'styles/commons';
import { InputMoney } from 'app/components/DataEntry/InputNumber';
import { CalcRecommendPrice, CalcMinPrice } from 'utils/helpers';

export default function EditPrice({
  layout,
  data = [],
  variations = [],
  setVariations,
  callBackCancel,
  supplierInfo,
  ...res
}) {
  const [allPriceOdii, setAllPriceOdii] = useState('');
  const [allOdiiComparePrice, setAllOdiiComparePrice] = useState('');
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

  const handleChangeOdiiPrice = price => {
    if (isNumber(price)) {
      setAllPriceOdii(price);
    } else {
      setAllPriceOdii('');
    }
  };

  const handleChangeAllOdiiComparePrice = price => {
    if (isNumber(price)) {
      setAllOdiiComparePrice(price);
    } else {
      setAllOdiiComparePrice(price);
    }
  };

  const applyAllPrice = type => () => {
    const price =
      type === 'origin_supplier_price' ? allPriceOdii : allOdiiComparePrice;
    const handleVariations = finalListVariation.map(item => ({
      ...item,
      [type]: listShow.some(o => o.id === item.id) ? price : item[type],
      recommend_retail_price: CalcRecommendPrice(price, supplierInfo),
      low_retail_price: CalcMinPrice(price, supplierInfo),
    }));

    const handleListShow = listShow.map(item => ({
      ...item,
      [type]: price,
      recommend_retail_price: CalcRecommendPrice(price, supplierInfo),
      low_retail_price: CalcMinPrice(price, supplierInfo),
    }));
    console.log('handleVariations', handleVariations);
    setFinalListVariation(handleVariations);
    setListShow(handleListShow);
  };

  const applyPrice = (type, id) => price => {
    if (isNumber(price)) {
      const handleVariations = finalListVariation.map(item => ({
        ...item,
        [type]: item.id === id ? price : item[type],
        recommend_retail_price:
          item.id === id
            ? CalcRecommendPrice(price, supplierInfo)
            : item.recommend_retail_price,
        low_retail_price:
          item.id === id
            ? CalcMinPrice(price, supplierInfo)
            : item.low_retail_price,
      }));
      const handleListShow = listShow.map(item => ({
        ...item,
        [type]: item.id === id ? price : item[type],
        recommend_retail_price:
          item.id === id
            ? CalcRecommendPrice(price, supplierInfo)
            : item.recommend_retail_price,
        low_retail_price:
          item.id === id
            ? CalcMinPrice(price, supplierInfo)
            : item.low_retail_price,
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
              Áp dụng tất cả giá
            </CustomStyle>
            <Row gutter={8}>
              <Col span={16}>
                <InputMoney
                  placeholder="Giá"
                  value={allPriceOdii}
                  onChange={handleChangeOdiiPrice}
                />
              </Col>
              <Col span={8}>
                <Button
                  context="secondary"
                  disabled={!isNumber(allPriceOdii)}
                  className="w-100 h-100 p-0"
                  onClick={applyAllPrice('origin_supplier_price')}
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
                <InputMoney
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
                  onClick={applyAllPrice('odii_compare_price')}
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
                    //   item.origin_supplier_price,
                    // )}đ`}
                    title={`${item.option_1}${
                      item.option_2 ? `/${item.option_2}` : ''
                    }${item.option_3 ? `/${item.option_3}` : ''}`}
                  />
                </List.Item>
              </Col>
              <Col span={17}>
                <CustomStyle my={{ xs: 's3' }}>Giá</CustomStyle>
                <InputMoney
                  placeholder="Giá"
                  value={item.origin_supplier_price}
                  onChange={applyPrice('origin_supplier_price', item.id)}
                />
              </Col>
              {/* <Col span={7}>
                <CustomStyle my={{ xs: 's3' }}>Giá khuyến mại</CustomStyle>
                <InputMoney
                  placeholder="Giá"
                  value={item.odii_compare_price}
                  onChange={applyPrice('odii_compare_price', item.id)}
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
