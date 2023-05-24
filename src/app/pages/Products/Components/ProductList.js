import React from 'react';
import { ProductList as List, ProductItem as Item } from './styles';
import { formatMoney } from 'utils/helpers';
import { useHistory } from 'react-router-dom';
import DefaultIMG from 'assets/images/default-image.svg';
import { CustomStyle } from 'styles/commons';
import { Tooltip } from 'antd';
import { COMBINE_STATUS } from '../constants';
// import { useDispatch } from 'react-redux';
import { BoxColor, Image } from 'app/components';
import { CaretUpOutlined } from '@ant-design/icons';

export default function ProductList(props) {
  const { products } = props;
  // const dispatch = useDispatch();
  const history = useHistory();
  const handleClickName = id => () => {
    history.push(`/products/uc/${id}`);
  };
  const getSupplierPriceText = product => {
    if (!product.has_variation)
      return formatMoney(product.origin_supplier_price);

    if (
      product.has_variation &&
      product.min_price_variation !== product.max_price_variation
    )
      return `${formatMoney(product.min_price_variation)} - ${formatMoney(
        product.max_price_variation,
      )}`;

    if (
      product.has_variation &&
      product.min_price_variation === product.max_price_variation
    )
      return formatMoney(product.min_price_variation);

    return '';
  };
  const getSupplierRecommendPrice = product => {
    let price = '';
    let upPercent = 0;
    if (!product.has_variation)
      price = formatMoney(product.recommend_retail_price);
    else if (product.has_variation) {
      if (
        product.max_recommend_variation_price &&
        product.max_recommend_variation_price ===
          product.min_recommend_variation_price
      ) {
        price = formatMoney(product.max_recommend_variation_price);
      } else if (
        product.min_recommend_variation_price &&
        product.max_recommend_variation_price
      ) {
        price = `${formatMoney(product.min_recommend_variation_price)} -
          ${formatMoney(product.max_recommend_variation_price)}`;
      }
    }
    if (!product.has_variation) {
      upPercent =
        ((product.recommend_retail_price - product.origin_supplier_price) *
          100) /
        product.origin_supplier_price;
    } else {
      const avrgOrigin =
        (product.max_price_variation + product.min_price_variation) / 2;
      const avrgRec =
        (product.min_recommend_variation_price +
          product.max_recommend_variation_price) /
        2;

      upPercent = ((avrgRec - avrgOrigin) * 100) / avrgOrigin;
    }
    upPercent = upPercent.toFixed(0);
    console.log('price', price);
    if (price !== '' && price) {
      return (
        <div className="price-suggest">
          {price}
          <div className="percent">
            {upPercent}
            %
            <CaretUpOutlined style={{ color: 'lightgreen' }} />
          </div>
        </div>
      );
    }
    return '';
  };
  return (
    <List>
      {products.map(product => {
        const currentStatus =
          COMBINE_STATUS[`${product.status}/${product.publish_status}`];

        return (
          <Item onClick={handleClickName(product.id)}>
            <div className="thumb">
              <Image src={product?.thumb?.location || DefaultIMG} />
            </div>

            <div className="info flex-col">
              <div>
                <BoxColor
                  colorValue={currentStatus?.colorLabel}
                  notBackground={true}
                  className="box-custom"
                >
                  {currentStatus?.label}
                </BoxColor>
                <div className="name">
                  <Tooltip
                    mouseEnterDelay={0.25}
                    placement="bottomLeft"
                    title={product.name}
                  >
                    {product.name}
                  </Tooltip>
                </div>

                <div className="more">
                  <div className="variant">
                    {/* <div className="variant-title">Danh mục: </div> */}
                    <div className="variant-title">
                      <CustomStyle fontSize="12px">
                        {product.top_category.name}
                      </CustomStyle>
                    </div>
                  </div>
                </div>

                <div className="price">
                  <div className="price-left">
                    <div className="text-item">Giá NCC :</div>
                    <div className="price-item">
                      {getSupplierPriceText(product)}
                    </div>
                  </div>
                  <Tooltip title="Giá khuyến nghị cho seller bán">
                    <div className="price-right">
                      <div className="text-item">Giá gợi ý :</div>
                      <div className="price-item">
                        {getSupplierRecommendPrice(product)}
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </div>
              {/* <div>
                <div className="more">
                  <div className="variant">
                    <div className="variant-title">Kho lấy hàng</div>
                    <div className="variant-info">
                      <CustomStyle fontSize="12px">
                        {product.supplier_warehousing?.name}
                      </CustomStyle>
                    </div>
                  </div>
                  <div className="quantity">
                    <div className="quantity-title">Tồn kho</div>

                    <CustomStyle fontWeight="bold" fontSize="f2">
                      {product.total_quantity > 0 ? (
                        <CustomStyle textAlign="right">
                          {product.total_quantity}
                        </CustomStyle>
                      ) : (
                        <CustomStyle textAlign="right" color="secondary2">
                          Hết hàng
                        </CustomStyle>
                      )}
                    </CustomStyle>
                  </div>
                </div>
              </div> */}
              <div>
                <div className="more">
                  <div className="variant">
                    <div className="variant-title">Biến thế</div>
                    <div className="variant-info">
                      <CustomStyle fontSize="f2">
                        {product.number_of_variation}
                      </CustomStyle>
                    </div>
                  </div>
                  <div className="quantity">
                    <div className="quantity-title">Lượt chọn</div>

                    <CustomStyle fontSize="f2">
                      <CustomStyle textAlign="right">
                        {product.number_of_times_pushed}
                      </CustomStyle>
                    </CustomStyle>
                  </div>
                </div>
              </div>
            </div>
          </Item>
        );
      })}
    </List>
  );
}
