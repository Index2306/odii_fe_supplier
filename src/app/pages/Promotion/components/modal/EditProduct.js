import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { isNumber } from 'lodash';
import { Modal, Button, Select } from 'app/components';
import { CustomStyle } from 'styles/commons';
import { InputMoney } from 'app/components/DataEntry/InputNumber';
import request from 'utils/request';
import Confirm from 'app/components/Modal/Confirm';

export default function EditProduct({
  layout,
  listSelect = [],
  products = [],
  setProducts,
  callBackCancel,
  type,
  gotoPage,
  setIsEditProduct,
  ...res
}) {
  const [typeDiscount, setTypeDiscount] = useState();
  const [quantityFrom, setQuantityFrom] = useState(0);
  const [quantityTo, setQuantityTo] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [listShow, setListShow] = useState(listSelect);
  const [finalListVariation, setFinalListVariation] = useState(products);
  const [disableOk, setDisableOk] = useState(true);
  const [isShow, setIsShow] = useState({ first: false, second: false });
  const [isError, setIsError] = useState(false);
  const [option, setOption] = useState([]);
  const [confirmModel, setConfirmModel] = useState(false);

  useEffect(() => {
    setFinalListVariation(products);
    setListShow(listSelect);
  }, [listSelect]);

  const onSave = () => {
    setIsShow({ first: true, second: false });
    setDiscount(0);
    setQuantityTo(0);
    setQuantityFrom(0);
    setTypeDiscount();
    if (type === 'quantity_by') {
      setConfirmModel(true);
      setIsEditProduct(false);
    } else {
      setProducts(finalListVariation);
      callBackCancel();
      setDisableOk(true);
    }
  };

  const handlePostOption = async () => {
    const arrData = [];
    const showId = listShow.map(item => item.id);
    const newVariant = finalListVariation.map((item, index) => {
      if (showId.includes(item.id)) {
        let newOption = option.map(e => {
          const objectOption = {
            ...e,
            promotion_product_id: item.id,
            promotion_id: item.promotion_id,
          };
          arrData.push(objectOption);
          return objectOption;
        });

        return { ...item, option: newOption };
      }
      return item;
    });

    await request(`user-service/supplier/promotion/options`, {
      method: 'put',
      data: { options: arrData, ids: showId },
    });
    gotoPage('');
    setOption([]);
    setIsEditProduct(false);
    setConfirmModel(!confirmModel);
    setDisableOk(true);
  };

  const handleOnChangeOption = (type, index) => e => {
    const newOption = option.slice(0);
    const value = e?.target?.value ?? e;
    if (value) {
      newOption[index] = { ...newOption[index], [type]: value };
    } else {
      newOption[index] = { ...newOption[index], [type]: '' };
    }

    if (type === 'value' && value > 100) {
      newOption[index] = {
        ...newOption[index],
        [type]: 0,
      };
    }

    setOption(newOption);
  };

  const handleChangePrice = typeValue => e => {
    const value = e?.target?.value ?? e;
    const handleVariations = finalListVariation.map(item => ({
      ...item,
      [typeValue]: listShow.some(o => o.id === item.id)
        ? value
        : item[typeValue],
    }));
    const handleListShow = listShow.map(item => ({
      ...item,
      [typeValue]: value,
    }));

    if (typeValue === 'value') {
      if (typeDiscount === 'percent' || type.includes('quantity_by')) {
        if (value > 100) setIsError(true);
        else setIsError(false);
      }
      if (isNumber(value)) setDiscount(value);
      else setDiscount(0);
    }

    if (typeValue === 'typeDiscount') {
      setIsShow({ first: true, second: false });
      setTypeDiscount(value);
      setDiscount(0);
    }

    if (typeValue === 'quantity_from') {
      if (isNumber(value)) setQuantityFrom(value);
      else setQuantityFrom(0);
      setFinalListVariation(handleVariations);
      setListShow(handleListShow);
    }

    if (typeValue === 'quantity_to') {
      if (isNumber(value)) setQuantityTo(value);
      else setQuantityTo(0);
      setFinalListVariation(handleVariations);
      setListShow(handleListShow);
    }
  };

  const applyAllPrice = typeValue => () => {
    const value = ['value'].includes(typeValue) ? discount : typeDiscount;
    const handleVariations = finalListVariation.map(item => ({
      ...item,
      [typeValue]: listShow.some(o => o.id === item.id)
        ? value
        : item[typeValue],
    }));
    const handleListShow = listShow.map(item => ({
      ...item,
      [typeValue]: value,
    }));

    if (type === 'quantity_by') {
      setOption(prev => [
        ...prev,
        {
          quantity_from: quantityFrom,
          quantity_to: quantityTo,
          value: discount,
        },
      ]);
      setDiscount(0);
      setQuantityTo(0);
      setQuantityFrom(0);
    }

    setFinalListVariation(handleVariations);
    setListShow(handleListShow);
    setDisableOk(false);

    if (typeValue === 'type') {
      setIsShow({ first: false, second: true });
      setDisableOk(true);
    } else {
      setIsShow({ first: false, second: false });
    }
  };

  return (
    <div>
      <Modal
        {...res}
        isOpen
        disableOk={disableOk}
        callBackOk={onSave}
        callBackCancel={() => {
          setOption([]);
          setDiscount(0);
          setTypeDiscount();
          setDisableOk(true);
          callBackCancel();
        }}
      >
        {type?.includes('quantity_by') ? (
          <>
            <Row gutter={16}>
              <Col span={8}>
                <CustomStyle my={{ xs: 's3' }} fontWeight="medium">
                  Số lượng từ
                </CustomStyle>
                <InputMoney
                  placeholder="Nhập số lượng"
                  value={quantityFrom}
                  onChange={handleChangePrice('quantity_from')}
                />
              </Col>
              <Col span={8}>
                <CustomStyle my={{ xs: 's3' }} fontWeight="medium">
                  Số lượng đến
                </CustomStyle>
                <InputMoney
                  placeholder="Nhập số lượng"
                  value={quantityTo}
                  onChange={handleChangePrice('quantity_to')}
                />
              </Col>
              <Col span={8}>
                <CustomStyle my={{ xs: 's3' }} fontWeight="medium">
                  Chiết khấu %
                </CustomStyle>
                <InputMoney
                  placeholder="Nhập số lượng"
                  value={discount}
                  onChange={handleChangePrice('value')}
                />
                {isError && (
                  <div
                    style={{
                      marginTop: '4px',
                      color: 'red',
                    }}
                  >
                    CK không hợp lệ!
                  </div>
                )}
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '10px' }}>
              <Col span={16}></Col>
              <Col span={8}>
                <Button
                  context="secondary"
                  disabled={!!(discount <= 0 || quantityTo <= 0) || isError}
                  className="w-100 btn-sm"
                  onClick={applyAllPrice('value')}
                >
                  Áp dụng
                </Button>
              </Col>
            </Row>
            {option.map((item, index) => (
              <Row gutter={16} style={{ marginTop: '10px' }}>
                <Col span={8}>
                  <InputMoney
                    value={item.quantity_from}
                    onChange={handleOnChangeOption('quantity_from', index)}
                  />
                </Col>
                <Col span={8}>
                  <InputMoney
                    value={item.quantity_to}
                    onChange={handleOnChangeOption('quantity_to', index)}
                  />
                </Col>
                <Col span={8}>
                  <InputMoney
                    value={item.value}
                    onChange={handleOnChangeOption('value', index)}
                  />
                </Col>
              </Row>
            ))}
          </>
        ) : (
          <Row gutter={16}>
            <Col span={24}>
              <CustomStyle my={{ xs: 's3' }} fontWeight="medium">
                Loại giảm giá
              </CustomStyle>
              <Row gutter={8}>
                <Col span={16}>
                  <Select
                    placeholder="Loại giảm giá"
                    onChange={handleChangePrice('typeDiscount')}
                    size="medium"
                    value={typeDiscount}
                  >
                    <Select.Option value="percent">Giảm giá %</Select.Option>
                    <Select.Option value="money">Giảm giá VND</Select.Option>
                  </Select>
                </Col>
                <Col span={8}>
                  {isShow.first && (
                    <Button
                      context="secondary"
                      value={discount}
                      className="w-100 h-100 p-0"
                      onClick={applyAllPrice('type')}
                    >
                      Áp dụng
                    </Button>
                  )}
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <CustomStyle my={{ xs: 's3' }} fontWeight="medium">
                Giảm giá
              </CustomStyle>
              <Row gutter={8}>
                <Col span={16}>
                  <InputMoney
                    placeholder="Giảm giá"
                    value={discount}
                    onChange={handleChangePrice('value')}
                  />
                </Col>
                <Col span={8}>
                  {isShow?.second && (
                    <Button
                      context="secondary"
                      disabled={!isNumber(discount) || isError}
                      className="w-100 h-100 p-0"
                      onClick={applyAllPrice('value')}
                    >
                      Áp dụng
                    </Button>
                  )}
                </Col>
              </Row>
              {isError && (
                <div
                  style={{
                    marginTop: '4px',
                    color: 'red',
                  }}
                >
                  Giảm giá không hợp lệ!
                </div>
              )}
            </Col>
          </Row>
        )}
      </Modal>

      {confirmModel && (
        <Confirm
          isFullWidthBtn
          data={{
            message: 'Dữ liệu cũ sẽ bị xóa hết! Bạn chắc chắn đồng ý không?',
          }}
          handleConfirm={() => handlePostOption()}
          handleCancel={() => {
            setIsEditProduct(true);
            setConfirmModel(!confirmModel);
          }}
        />
      )}
    </div>
  );
}
