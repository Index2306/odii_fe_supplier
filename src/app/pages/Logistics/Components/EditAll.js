import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Row, Col, Divider, List } from 'antd';
import { isEqual, isNumber, isObject } from 'lodash';
import { Modal, Button, Image, DatePicker } from 'app/components';
import { CustomStyle } from 'styles/commons';
import { InputMoney } from 'app/components/DataEntry/InputNumber';
import { CalcRecommendPrice, CalcMinPrice } from 'utils/helpers';
import moment from 'moment';

export default function EditAll({
  data = [],
  setProducts,
  type,
  title,
  callBackCancel,
  ...res
}) {
  const [allValue, setallValue] = useState('');
  const [listShow, setListShow] = useState(data);
  const [disableOk, setDisableOk] = useState(true);

  const onSave = () => {
    setProducts(listShow);
    callBackCancel();
  };

  useEffect(() => {
    if (isEqual(data, listShow)) {
      setDisableOk(true);
    } else setDisableOk(false);
  }, [listShow]);

  const handleChangeOdiiPrice = value => {
    if (value) {
      setallValue(value);
    } else {
      setallValue('');
    }
  };

  const applyAllPrice = () => {
    let handleListShow = listShow;
    if (isNumber(allValue)) {
      handleListShow = listShow.map(item => ({
        ...item,
        [type]: allValue,
      }));
    } else {
      console.log(moment(allValue).toISOString());
      handleListShow = listShow.map(item => ({
        ...item,
        [type]: moment(allValue).toISOString(),
      }));
    }
    console.log(handleListShow);

    setListShow(handleListShow);
  };

  const applyPrice = (type, id) => value => {
    const handleListShow = listShow.map(item => ({
      ...item,
      [type]: item.id === id ? (value ? value : null) : item[type],
    }));
    setListShow(handleListShow);
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
        title={`Sửa ${title}`}
      >
        <Row gutter={16}>
          <Col span={24}>
            <CustomStyle my={{ xs: 's3' }} fontWeight="medium">
              Áp dụng tất cả {title}
            </CustomStyle>
            <Row gutter={8}>
              <Col span={16}>
                {type === 'production_date' || type === 'expiry_date' ? (
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    placeholder="Nếu có"
                    onChange={handleChangeOdiiPrice}
                  />
                ) : (
                  <InputMoney
                    placeholder={title}
                    value={allValue}
                    onChange={handleChangeOdiiPrice}
                  />
                )}
              </Col>
              <Col span={8}>
                <Button
                  context="secondary"
                  disabled={
                    type === 'production_date' || type === 'expiry_date'
                      ? !isObject(allValue)
                      : !isNumber(allValue)
                  }
                  className="w-100 h-100 p-0"
                  onClick={applyAllPrice}
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
              <Col span={17}>
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Image
                        size="200x200"
                        src={item?.variation?.thumb?.location}
                      />
                    }
                    title={
                      <>
                        <div>{item?.variation?.productName}</div>
                        <div className="title-variation">
                          {item?.variation.name}
                        </div>
                      </>
                    }
                  />
                </List.Item>
              </Col>
              <Col span={7}>
                <CustomStyle my={{ xs: 's3' }}>{title}</CustomStyle>
                {type === 'production_date' || type === 'expiry_date' ? (
                  <DatePicker
                    value={item[type] ? moment(item[type]) : null}
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    placeholder="Nếu có"
                    onChange={applyPrice(type, item.id)}
                  />
                ) : (
                  <InputMoney
                    placeholder={title}
                    value={item[type]}
                    onChange={applyPrice(type, item.id)}
                  />
                )}
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
    .title-variation {
      font-weight: initial;
    }
  }
  .ant-list-item-meta-description {
    font-weight: 400;
    font-size: 12;
    color: rgba(0, 0, 0, 0.4);
  }
`;
