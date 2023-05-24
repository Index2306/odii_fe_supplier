import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form as F } from 'antd';
import { Input, Select } from 'app/components';
import { isEmpty } from 'lodash';
import { CustomSectionWrapper } from './styled';
import { useWarehousingSlice } from 'app/pages/Warehousing/slice';
import { selectData } from 'app/pages/Warehousing/slice/selectors';
import InputNumber from 'app/components/DataEntry/InputNumber';
import { selectDetail } from '../../slice/selectors';
import { useProductSourceSlice } from 'app/pages/ProductSource/slice';
import { selectDataSource } from 'app/pages/ProductSource/slice/selectors';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
const WAREHOUSE_TYPE = {
  All: 1,
  PICKUP: 2,
  RETURN: 3,
  SOURCE: 4,
};
const Item = F.Item;

const CustomWarehousing = ({ value, onChange, type = WAREHOUSE_TYPE.All }) => {
  const dispatch = useDispatch();
  const listWarehousing = useSelector(selectData);
  const listSource = useSelector(selectDataSource);
  const [dtSrc, setDataSrc] = useState([]);
  const warehousingSlice = useWarehousingSlice();
  const productSource = useProductSourceSlice();
  const { roles } = useSelector(selectCurrentUser);

  React.useEffect(() => {
    if (isEmpty(listWarehousing) && isEmpty(listSource)) {
      dispatch(warehousingSlice.actions.getData());
      if (!roles?.includes('partner_source')) {
        dispatch(productSource.actions.getData());
      }
    } else {
      if (type === WAREHOUSE_TYPE.PICKUP) {
        const src = listWarehousing.filter(item => item.is_pickup_address);
        setDataSrc([...src]);
      } else if (type === WAREHOUSE_TYPE.RETURN) {
        const src = listWarehousing.filter(item => item.is_return_address);
        setDataSrc([...src]);
      } else if (type === WAREHOUSE_TYPE.SOURCE) {
        setDataSrc([...listSource]);
      } else {
        setDataSrc([...listWarehousing]);
      }
    }
  }, [listWarehousing]);

  const handleChange = id => {
    if (type === WAREHOUSE_TYPE.SOURCE) {
      onChange(listSource.find(item => item.id === id)?.id);
    } else {
      onChange(listWarehousing.find(item => item.id === id));
    }
  };

  return (
    <Select
      value={
        type === WAREHOUSE_TYPE.SOURCE
          ? listSource.find(item => item.id === value)?.name
          : value?.id?.toString()
      }
      // labelInValue
      onChange={handleChange}
      showSearch
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {dtSrc?.map(v => (
        <Select.Option key={v.id} value={v.id}>
          {v.name}
        </Select.Option>
      ))}
    </Select>
  );
};

function Info({ layout, has_variation, isProductSource }) {
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };

  return (
    <div style={{ width: '100%', margin: '0 12px' }}>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <div className="">
          <Row gutter={24}>
            <Col span={12}>
              <Item name="sku" label="SKU" {...layout}>
                <Input placeholder="SKU" />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                name="barcode"
                label="Barcode (ISBN, UPC, GTIN, etc.)"
                {...layout}
              >
                <Input placeholder="Barcode" />
              </Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              {!isProductSource && (
                <Item
                  name="product_source_id"
                  label="Nguồn hàng"
                  valuePropName="value"
                  getValueFromEvent={normFile}
                  {...layout}
                >
                  <CustomWarehousing type={WAREHOUSE_TYPE.SOURCE} />
                </Item>
              )}
            </Col>
            {!has_variation && (
              <Col span={12}>
                <Item
                  name="low_quantity_thres"
                  label="Mức tồn kho thấp"
                  {...layout}
                >
                  <InputNumber
                    disabled={false}
                    min={1}
                    size="large"
                    placeholder="Số lượng"
                  />
                </Item>
              </Col>
            )}
          </Row>
        </div>
      </CustomSectionWrapper>
    </div>
  );
}

export default Info;
