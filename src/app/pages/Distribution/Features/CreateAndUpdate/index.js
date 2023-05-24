import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import styled from 'styled-components/macro';
import { Row, Col, Spin, Form as F, Space } from 'antd';
import { FixedContainer } from 'app/hooks';
import { isEmpty, pickBy, identity, cloneDeep, sumBy } from 'lodash';
import { Button, PageWrapper, Form, Switch } from 'app/components';
import { globalActions } from 'app/pages/AppPrivate/slice';
import Confirm from 'app/components/Modal/Confirm';
import notification from 'utils/notification';
import req from 'utils/request';
import { selectLoading, selectDetail } from '../../slice/selectors';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { selectDataRegisterSupplier } from '../../../InfoBusiness/slice/selectors';
import { useInfoBusinessSlice } from '../../../InfoBusiness/slice';
import { COMBINE_STATUS } from '../../constants';
import { useDistributionsSlice } from '../../slice';
import Price from './Price';
import Info from './Info';
import Attributes from './Attributes';
import ProductImages from './ProductImages';
// import Supplier from './Supplier';
// import WareHousing from './WareHousing';
import SuggestName from './SuggestName';
import Vendor from './Vendor';
import Tags from './Tags';
import Options from './Options';
import ListVariations from './ListVariations';
import Shipping from './Shipping';
import Description from './Description';
import Name from './Name';
import Category from './Category';
import { CustomStyle } from 'styles/commons';
import { CustomSectionWrapper, WrapperCheckbox } from './styled';
import { ProductImagesModal } from './modals';
import ListProduct from './ListProduct';

const Item = F.Item;
const listWarning = [
  { lazada: 'color_family', origin: 'Màu sắc' },
  { lazada: 'size', origin: 'Kích cỡ' },
];
const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};
const initConfirmAction = {
  visible: false,
  nextState: {},
  recordId: 0,
};

export function CreateAndUpdateDistribution({ match, history }) {
  const id = match?.params?.id; // is update
  const dispatch = useDispatch();
  const { actions } = useDistributionsSlice();
  const [form] = Form.useForm();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);
  const supplierInfo = useSelector(selectDataRegisterSupplier);
  const supplierSlice = useInfoBusinessSlice();
  // const [, forceUpdate] = useState();
  const [allStatus, setAllStatus] = useState({});
  const [variations, setVariations] = useState([]);
  const [listAttributes, setListAttributes] = useState([]);
  const [, setFormValues] = useState({});
  const [showProductImagesModal, setShowProductImagesModal] = useState(false);
  const [detailVariations, setDetailVariations] = useState([]);
  const refTimeOut = useRef(null);
  const isFirstCome = useRef(true);
  const { roles } = useSelector(selectCurrentUser);
  const [confirmAction, setConfirmAction] = React.useState(initConfirmAction);
  const [selectedProduct, setselectedProducts] = React.useState([]);

  const {
    setFieldsValue,
    getFieldsValue,
    // resetFields,
    // isFieldsTouched,
    submit,
    // getFieldsError,
    validateFields,
  } = form;
  const {
    product_category,
    product_images,
    product_categories_metadata,
    attributes,
    option_1,
    option_2,
    option_3,
    name,
    ...res
  } = getFieldsValue();
  const has_variation = id ? data?.has_variation : res.has_variation;
  // useEffect(() => {
  //   if (!isEmpty(allStatus)) {
  //     submit();
  //   }
  // }, [allStatus]);

  useEffect(() => {
    if (!isEmpty(variations)) {
      let minPrice = 0;
      for (const iterator of variations) {
        if (
          iterator.origin_supplier_price &&
          iterator.status === 'active' &&
          (!minPrice || iterator.origin_supplier_price < minPrice)
        ) {
          minPrice = iterator.origin_supplier_price;
        }
      }
      if (refTimeOut.current) clearTimeout(refTimeOut.current);
      if (minPrice > 0) {
        refTimeOut.current = setTimeout(() => {
          setFieldsValue({ origin_supplier_price: minPrice });
        }, 3000);
      }
    }
  }, [variations]);

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
    };
  }, []);
  useEffect(() => {
    dispatch(supplierSlice.actions.getDataRegisterSupplier({}));
  }, []);
  useEffect(() => {
    if (isEmpty(product_categories_metadata)) return;
    const idCat = product_categories_metadata.slice(-1)[0].id;
    req(`/product-service/category/${idCat}`, {})
      .then(result => {
        if (result.is_success) {
          const newListAttributes = cloneDeep(result.data.attributes);
          if (!isFirstCome.current || !id) {
            setFieldsValue({
              attributes: { warranty_type: 'No Warranty', warranty: '' },
            });
          } else {
            isFirstCome.current = false;
          }
          if (!isEmpty(newListAttributes) && !isEmpty(attributes)) {
            newListAttributes?.forEach((item, key) => {
              if (attributes[item.name]) {
                // if (attributes[item.name] === 'warranty_type') {
                //   newListAttributes[key].value = 'No Warranty';
                // } else {
                // }
                newListAttributes[key].value = attributes?.[item.name];
              } else {
                if (attributes[item.name] === 'warranty_type') {
                  newListAttributes[key].value = 'No Warranty';
                } else {
                  newListAttributes[key].value = '';
                }
              }
            });
          }
          // if (handleShowWarning(newListAttributes)) {
          //   // handleSetCurrent('primary_cat_metadata')([]);
          //   return setListAttributes([]);
          // }
          const handleListAttributes = newListAttributes.filter(
            v => !listWarning.some(t => t.lazada === v.name),
          );
          setListAttributes(handleListAttributes);
        } else {
          setListAttributes([]);
        }
      })
      .catch(err => {
        // setListChannel([]);
      });
  }, [product_categories_metadata]);

  useEffect(() => {
    const currentAllActives = !isEmpty(data)
      ? COMBINE_STATUS[`${data.status}`]
      : COMBINE_STATUS[Object.keys(COMBINE_STATUS)[0]];

    const dataBreadcrumb = {
      menus: [
        {
          name: 'Phân bổ sản phẩm',
          link: '/distribution',
        },
        {
          name: id ? 'Chi tiết phân bổ' : 'Phân bổ sản phẩm',
        },
      ],
      title: 'Phân bổ sản phẩm',
      fixWidth: true,
      actions: !roles?.includes('partner_source') && (
        <Item className="m-0" shouldUpdate>
          <div className="d-flex justify-content-between">
            <Space>
              <Button
                color="grayBlue"
                onClick={onClear}
                className="btn-sm"
                width={80}
              >
                <span>Hủy</span>
              </Button>
              {!id && (
                <Button
                  className="btn-sm mr-2"
                  width={120}
                  onClick={submit}
                  color="blue"
                >
                  <span>Lưu</span>
                </Button>
              )}
              {isEmpty(currentAllActives) || !id || (
                <Button
                  className="btn-sm mr-2 "
                  // disabled={!id}
                  width={currentAllActives?.width || '100px'}
                  onClick={submitWithStatus(currentAllActives)}
                  color={currentAllActives?.color || 'blue'}
                >
                  <span>{currentAllActives?.buttonText}</span>
                </Button>
              )}
            </Space>
          </div>
        </Item>
      ),
    };
    if (!isEmpty(data)) {
      setFieldsValue({
        name: data?.name || '',
        origin_supplier_price: data?.origin_supplier_price || 0,
        odii_price: data?.odii_price || 0,
        low_retail_price: data?.low_retail_price || 0,
        recommend_retail_price: data?.recommend_retail_price || 0,
        low_quantity_thres: data?.low_quantity_thres || 0,
        attributes: isEmpty(data.attributes)
          ? ''
          : data.attributes.reduce((final, item) => {
              if (item.value) final[item.name] = item.value;
              return final;
            }, {}),
        odii_compare_price: data?.odii_compare_price || 0,
        // high_retail_price: data?.high_retail_price || 0,
        sku: data?.sku || '',
        barcode: data?.barcode || '',
        total_quantity: data?.total_quantity || '',
        description: data?.description || '',
        short_description: data?.short_description || '',
        defaultVariation: data?.variations?.[0] || { box_length_cm: '' },
        thumb: data?.thumb || null,
        size_chart: data?.size_chart || null,
        currency_code: data?.currency_code,
        product_images: data?.product_images || [],
        tags: data?.tags || [],
        option_1: data?.option_1,
        option_2: data?.option_2,
        option_3: data?.option_3,
        supplier_warehousing: data?.supplier_warehousing,
        supplier_warehouse_return: data?.supplier_warehouse_return,
        vendor: data?.vendor || '',
        product_categories_metadata:
          product_categories_metadata ||
          data?.product_categories_metadata ||
          [],
        has_variation: data?.has_variation,
        product_source_id: data?.product_source_id || '',
        // variations: data?.variations,
      });
      setVariations(data?.variations || []);
      dataBreadcrumb.title = data?.name;
    } else {
      if (id) dispatch(actions.getDetail(id));
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  useEffect(() => {
    if (!id && supplierInfo) {
      setFieldsValue({ low_quantity_thres: supplierInfo.low_quantity_thres });
    }
  }, [supplierInfo]);
  const submitWithStatus = values => () => {
    if (id) {
      setConfirmAction({
        visible: true,
        nextState: values,
        recordId: id,
      });
      setAllStatus(values);
    }
  };

  const toggleImagesModal = () => {
    setShowProductImagesModal(!showProductImagesModal);
  };
  const onCloseConfirmModel = () => {
    setConfirmAction({ ...initConfirmAction });
  };
  const onConfirmAction = () => {
    if (confirmAction.recordId > 0) {
      dispatch(
        actions.updateState({
          id: confirmAction.recordId,
          data: {
            supplier_status: confirmAction.nextState.publish_status,
          },
          onSuccess: () => {
            dispatch(actions.getDetail(id));
          },
        }),
      );
      // gotoPage(history.location.search);
      onCloseConfirmModel();
    } else {
      onCloseConfirmModel();
    }
  };

  const onClear = () => {
    dispatch(
      globalActions.showModal({
        modalType: Confirm,
        modalProps: {
          isFullWidthBtn: true,
          data: {
            message: 'Bạn có chắc chắn muốn thoát và huỷ phiên làm việc?',
          },
          callBackConfirm: () => history.push('/distribution'),
        },
      }),
    );
  };

  const onFinishFailed = ({ errorFields }) => {
    let descriptionErr = '';
    for (const iterator of errorFields) {
      descriptionErr = `
      ${descriptionErr ? `${descriptionErr},` : descriptionErr}
      ${iterator.errors[0]}
        `;
    }
    notification('error', descriptionErr, 'Vui lòng điền \n thêm thông tin!');
  };

  const onFinish = values => {
    // if (!isFieldsTouched(id ? ['name'] : ['name'])) {
    //   return message.error('Vui lòng thêm thông tin!');
    // }
    const {
      defaultVariation,
      supplier_warehousing,
      supplier_warehouse_return,
      thumb,
      size_chart,
      product_images,
      attributes,
      vendor,
      product_categories_metadata,
      product_source_id,
      ...resValues
    } = values;
    let newAttributes = null;
    if (!isEmpty(listAttributes)) {
      newAttributes = cloneDeep(listAttributes);
      const handleAttributes = isEmpty(attributes)
        ? data.attributes.reduce((final, item) => {
            if (item.value) final[item.name] = item.value;
            return final;
          }, {})
        : attributes;
      for (let [key, item] of listAttributes.entries()) {
        if (handleAttributes?.[item.name]) {
          newAttributes[key].value = handleAttributes?.[item.name];
        }
      }
    }

    const { publish_status } = allStatus;
    const finalVariations = has_variation
      ? variations.map(({ thumb, ...res }) => ({
          ...res,
          product_image_id: thumb?.id.toString() ?? '',
          ...defaultVariation,
          thumb: {
            location: thumb?.location,
          },
        }))
      : [
          {
            ...(variations?.[0] || {}),
            is_default: true,
            ...defaultVariation,
            origin_supplier_price: resValues.origin_supplier_price,
            low_retail_price: resValues.low_retail_price,
            recommend_retail_price: resValues.recommend_retail_price || 0,
            low_quantity_thres: resValues.low_quantity_thres || 0,
            // // high_retail_price: resValues.high_retail_price,
            total_quantity: resValues.total_quantity,
          },
        ];
    const handleVariations = finalVariations.map(item =>
      pickBy(item, identity),
    );
    let totalQuantity = resValues?.total_quantity;
    if (has_variation) {
      totalQuantity = sumBy(finalVariations, 'total_quantity');
    }
    const dataSend = {
      ...resValues,
      thumb: thumb,
      size_chart: size_chart,
      attributes: newAttributes,
      publish_status: publish_status,
      name: resValues.name?.trim(),
      variations: handleVariations,
      product_images,
      supplier_warehousing_id: supplier_warehousing?.id?.toString(),
      supplier_warehouse_return_id: supplier_warehouse_return?.id?.toString(),
      supplier_warehousing: supplier_warehousing,
      supplier_warehouse_return:
        supplier_warehouse_return ?? supplier_warehousing,
      product_category_id: product_categories_metadata
        .slice(-1)?.[0]
        ?.id?.toString(),
      product_images_ids: product_images?.map(item => item.id.toString()) ?? [],
      total_quantity: totalQuantity,
      product_source_id: product_source_id,
    };
    const handleDataSend = pickBy(dataSend, identity);
    if (id) {
      dispatch(
        actions.updateAndCreate({
          id,
          data: {
            // ...data,
            has_variation: !!has_variation,
            ...handleDataSend,
            vendor: vendor || null,
          },
        }),
      );
    } else {
      dispatch(
        actions.updateAndCreate({
          data: {
            has_variation: !!has_variation,
            publish_status: 'inactive',
            ...handleDataSend,
          },
          push: history.push,
        }),
      );
    }
    setAllStatus({});
  };

  const onFinishDistribution = values => {
    if (selectedProduct.length > 0) {
      const handleDataSend = {
        supplier_warehousing_id: values.supplier_warehousing.id,
        supplier_warehouse_return_id:
          values.supplier_warehouse_return?.id || null,
        products: selectedProduct.map(item => item.product_id),
      };
      dispatch(
        actions.updateAndCreate({
          data: handleDataSend,
          push: history.push,
        }),
      );
    } else {
      notification('error', '', 'Vui lòng chọn sản phẩm cần phân bổ!');
    }
  };

  if (isEmpty(data)) {
    return (
      <PageWrapper fixWidth>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <Form
            scrollToFirstError
            form={form}
            {...layout}
            name="normal_login"
            className="login-form"
            onValuesChange={setFormValues}
            onFinish={onFinishDistribution}
          >
            <Row gutter={24}>
              <Info
                layout={layout}
                form={form}
                has_variation={has_variation}
                isProductSource={data?.is_source}
                is_stock={isEmpty(data)}
              />
              <ListProduct
                form={form}
                setselectedProducts={setselectedProducts}
              />
            </Row>
          </Form>
        </Spin>
      </PageWrapper>
    );
  }

  const isShowOption = !id || isEmpty(variations);

  return (
    <PageWrapper fixWidth>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Form
          scrollToFirstError
          form={form}
          {...layout}
          name="normal_login"
          disabled={true}
          className="login-form"
          onValuesChange={setFormValues}
          // initialValues={{
          //   name: data?.name || '',
          //   odii_price: data?.odii_price || 0,
          // }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <>
            <Row gutter={24}>
              <Col span={17}>
                <Name
                  isCreate={!id}
                  name={name}
                  layout={layout}
                  product_categories_metadata={product_categories_metadata}
                  setFieldsValue={setFieldsValue}
                  setFormValues={setFormValues}
                />
                <Category layout={layout} />
                {isEmpty(listAttributes) || (
                  <Attributes
                    // onClick={toggleCategoriesModal}
                    data={listAttributes}
                    arrayDataAttributes={data?.attributes}
                    // attributes={attributes || { warranty_type: 'No Warranty' }}
                    attributes={attributes || {}}
                  />
                )}
                {/* )} */}
              </Col>
              <Col span={7}>
                {/* <FixedContainer top={150} needFixWidth> */}
                {/* {!!id && <Status layout={layout} />} */}
                {/* {!!id && <PublishStatus layout={layout} />} */}
                <SuggestName layout={layout} />
                {id && (
                  <CustomSectionWrapper mt={{ xs: 's4' }}>
                    <div className="title">Trạng thái</div>
                    <CustomStyle
                      mb={{ xs: 's6' }}
                      fontSize={{ xs: 'f3' }}
                      fontWeight="bold"
                      color={
                        COMBINE_STATUS[`${data.status}/${data.publish_status}`]
                          ?.colorLabel
                      }
                    >
                      {COMBINE_STATUS[`${data.status}/${data.publish_status}`]
                        ?.label ?? <span>&nbsp;</span>}
                    </CustomStyle>
                  </CustomSectionWrapper>
                )}

                <Vendor layout={layout} />
                <Tags layout={layout} />
                {/* </FixedContainer> */}
              </Col>
            </Row>
            <Row gutter={24}>
              <Description layout={layout} form={form} disabled={true} />
              {/* <SortDescription layout={layout} /> */}
              <ProductImages layout={layout} />

              {!id && (
                <div style={{ width: '100%', margin: '0 12px' }}>
                  <CustomSectionWrapper mt={{ xs: 's4' }}>
                    {!!id || (
                      <WrapperCheckbox
                        showBorder={has_variation && isShowOption}
                      >
                        <div className="">
                          <CustomStyle fontWeight="bold">
                            Variant (biến thể)
                          </CustomStyle>
                          <CustomStyle color="gray2" fontSize={{ xs: 'f1' }}>
                            Sản phẩm này có biến thể nào không? Ví dụ khác nhau
                            về: Màu sắc, kích thước,....
                          </CustomStyle>
                        </div>

                        <div className="d-flex justify-content-end align-items-center">
                          <CustomStyle
                            color="gray3"
                            fontSize={{ xs: 'f1' }}
                            mr={{ xs: 's2' }}
                          >
                            {has_variation ? 'Có' : 'Không'}
                          </CustomStyle>
                          <Item
                            name="has_variation"
                            valuePropName="checked"
                            className="mb-0"
                            label=""
                            {...layout}
                          >
                            <Switch></Switch>
                          </Item>
                        </div>
                      </WrapperCheckbox>
                    )}

                    {has_variation && isShowOption && (
                      <Options
                        layout={layout}
                        option_1={option_1}
                        option_2={option_2}
                        option_3={option_3}
                        getFieldsValue={getFieldsValue}
                        variations={variations}
                        setFieldsValue={setFieldsValue}
                        setVariations={setVariations}
                        supplierInfo={supplierInfo}
                      />
                    )}
                  </CustomSectionWrapper>
                </div>
              )}
              {has_variation && (
                <ListVariations
                  layout={layout}
                  setVariations={setVariations}
                  setDetailVariations={setDetailVariations}
                  toggleImagesModal={toggleImagesModal}
                  form={form}
                  variations={variations}
                  supplierInfo={supplierInfo}
                />
              )}
              {!has_variation && (
                <Price
                  layout={layout}
                  hasVariation={has_variation}
                  isActive={true}
                  supplierInfo={supplierInfo}
                  setFieldsValue={setFieldsValue}
                  setFormValues={setFormValues}
                />
              )}
              <Info
                layout={layout}
                form={form}
                has_variation={has_variation}
                isProductSource={data?.is_source}
              />
              {/* {(!id || variations?.length <= 1) && ( */}
              <Shipping
                layout={layout}
                form={form}
                defaultVariation={variations?.[0] || {}}
              />
            </Row>
            {!roles?.includes('partner_source') && (
              <Item shouldUpdate>
                <Row>
                  <Col xs={24} md={24}>
                    <CustomStyle className="d-flex justify-content-end">
                      <Space>
                        <Button
                          color="grayBlue"
                          onClick={onClear}
                          className="btn-sm"
                          width={80}
                        >
                          <span>Hủy</span>
                        </Button>
                        <Button
                          // onClick={onMenuClick(null, 2)}
                          type="primary"
                          htmlType="submit"
                          width={100}
                          className="btn-sm mr-2"
                          disabled={false}
                          color="blue"
                        >
                          <span>{id ? 'Lưu' : 'Lưu'}</span>
                        </Button>
                      </Space>
                    </CustomStyle>
                  </Col>
                </Row>
              </Item>
            )}
          </>
        </Form>
      </Spin>
      {showProductImagesModal && (
        <ProductImagesModal
          toggleImagesModal={toggleImagesModal}
          variations={variations}
          setVariations={setVariations}
          detailVariations={detailVariations}
          product_images={product_images}
          setFieldsValue={setFieldsValue}
        />
      )}
      {confirmAction.visible && (
        <Confirm
          data={{}}
          isFullWidthBtn
          title={`Xác nhận '${confirmAction.nextState?.buttonText}'`}
          isModalVisible={confirmAction.visible}
          handleCancel={onCloseConfirmModel}
          handleConfirm={onConfirmAction}
        />
      )}
    </PageWrapper>
  );
}
