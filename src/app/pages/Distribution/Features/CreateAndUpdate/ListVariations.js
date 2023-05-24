import React, { memo, useMemo, useState, useEffect } from 'react';
import { Space, Menu, Dropdown, Tooltip } from 'antd';
import styled from 'styled-components';
import { List } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { flatten, isEmpty, union, isNumber } from 'lodash';
import {
  Table,
  Image,
  Button,
  Input,
  Switch,
  InputNumber,
} from 'app/components';
import { InputMoney } from 'app/components/DataEntry/InputNumber';
import { CustomStyle } from 'styles/commons';
// import { EditOutlined } from '@ant-design/icons';
import { DownOutlined } from '@ant-design/icons';
import { useDebouncedCallback } from 'use-debounce';
import { CustomSectionWrapper } from './styled';
import { EditPrice, TotalQuantity, ShippingModal } from './modals';
import { CalcRecommendPrice, CalcMinPrice } from 'utils/helpers';

export default memo(function ListVariations({
  variations,
  setVariations,
  setDetailVariations,
  toggleImagesModal,
  supplierInfo,
  // form,
}) {
  // const { getFieldsValue } = form;
  // const { categories } = getFieldsValue();

  const [listSelected, setListSelected] = useState([]);
  const [listOption, setListOption] = useState([]);
  const [currentOption, setCurrentOption] = useState([]);
  const [StatusModal, setStatusModal] = useState('');
  const debounced = useDebouncedCallback(
    // function
    value => {
      setVariations(value);
    },
    // delay in ms
    300,
  );

  // useEffect(() => {
  //   if (!isEmpty(categories)) {
  //     const listChecked = [];
  //     categories.forEach(currentItem => {
  //       listChecked.push(
  //         `${currentItem.parent_id ? `${currentItem.parent_id}-` : ''}${
  //           currentItem.id
  //         }`,
  //       );
  //     });
  //   }
  // }, [categories]);

  useEffect(() => {
    const handlePushOption = (type, list, item, position) => {
      if (
        list[position].every(v => type !== v.type || item[type] !== v.value)
      ) {
        list[position].push({ type: type, value: item[type] });
      }
    };
    const listChildOption = variations.reduce(
      (final, item) => {
        if (item.option_1) {
          handlePushOption('option_1', final, item, 0);
        }
        if (item.option_2) {
          handlePushOption('option_2', final, item, 1);
        }
        if (item.option_3) {
          handlePushOption('option_3', final, item, 2);
        }
        return final;
      },
      [[], [], []],
    );
    setListOption(flatten(listChildOption));
  }, [variations]);

  const handlePickImage = index => () => {
    setDetailVariations([index]);
    toggleImagesModal();
  };

  const handleChangeDetail = (type, index, isNumberField) => e => {
    const newVariations = variations.slice(0);
    if (type === 'status') {
      if (e) {
        newVariations[index] = { ...newVariations[index], [type]: 'active' };
      } else
        newVariations[index] = { ...newVariations[index], [type]: 'inactive' };
      setVariations(newVariations);
      return;
    }
    const value = e?.target?.value ?? e;
    if (isNumberField ? isNumber(value) : value) {
      newVariations[index] = { ...newVariations[index], [type]: value };
    } else if (!value) {
      newVariations[index] = { ...newVariations[index], [type]: '' };
    }
    setVariations(newVariations);
    // debounced(newVariations);
    // Auto gen price
    if (type === 'origin_supplier_price') {
      const recommendPrice = CalcRecommendPrice(value, supplierInfo);
      const minPrice = CalcMinPrice(value, supplierInfo);
      newVariations[index] = {
        ...newVariations[index],
        recommend_retail_price: recommendPrice,
        low_retail_price: minPrice,
      };
    }
  };

  const { columns } = useMemo(() => {
    return {
      columns: [
        {
          title: (
            <div className="custome-header">
              <div className="title-box">Biến thể</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'name',
          key: 'name',
          width: 170,
          render: (text, record, index) => (
            <WrapperOption>
              <List.Item>
                <List.Item.Meta
                  avatar={
                    record?.thumb?.location ? (
                      <Image
                        size="200x200"
                        src={record?.thumb?.location}
                        onClick={handlePickImage(index)}
                      />
                    ) : (
                      <div
                        className="add-image"
                        onClick={handlePickImage(index)}
                      >
                        <PlusOutlined />
                      </div>
                    )
                  }
                  title={text}
                  description={`${record?.option_1}${
                    record?.option_2 ? `/${record?.option_2}` : ''
                  }${record?.option_3 ? `/${record?.option_3}` : ''}`}
                />
              </List.Item>
            </WrapperOption>
          ),
        },
        {
          title: (
            <div className="custome-header">
              <Tooltip title="Giá gốc từ NCC">
                <div className="title-box">Giá NCC</div>
              </Tooltip>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'origin_supplier_price',
          key: 'origin_supplier_price',
          width: 120,
          render: (text, _, index) => (
            <InputMoney
              placeholder="Giá"
              value={text}
              onChange={handleChangeDetail(
                'origin_supplier_price',
                index,
                true,
              )}
            />
          ),
        },
        {
          title: (
            <div className="custome-header">
              <Tooltip title="Giá bán đễ xuất tốt nhất">
                <div className="title-box">Giá bán gợi ý</div>
                {/* <div className="addition"></div> */}
              </Tooltip>
            </div>
          ),
          dataIndex: 'recommend_retail_price',
          key: 'recommend_retail_price',
          width: 120,
          render: (text, _, index) => (
            <InputMoney
              placeholder="Giá"
              value={text}
              onChange={handleChangeDetail(
                'recommend_retail_price',
                index,
                true,
              )}
            />
          ),
        },
        {
          title: (
            <div className="custome-header">
              <Tooltip title="Nếu seller thiết lập giá bán nhỏ hơn giá trị này, Phần mềm sẽ không cho phép đẩy sản phẩm lên sàn !">
                <div className="title-box">Giá bán thấp nhất cho phép</div>
              </Tooltip>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'low_retail_price',
          key: 'low_retail_price',
          width: 120,
          render: (text, _, index) => (
            <InputMoney
              placeholder="Giá"
              value={text}
              onChange={handleChangeDetail('low_retail_price', index, true)}
            />
          ),
        },
        {
          title: (
            <div className="custome-header">
              <div className="title-box">Số lượng</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'total_quantity',
          key: 'total_quantity',
          width: 120,
          render: (text, _, index) => (
            <InputNumber
              disabled={false}
              placeholder="Tồn kho"
              value={text}
              onChange={handleChangeDetail('total_quantity', index, true)}
            />
          ),
        },
        {
          title: (
            <div className="custome-header">
              <div className="title-box">Ngưỡng tồn kho thấp</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'low_quantity_thres',
          key: 'low_quantity_thres',
          width: 120,
          render: (text, _, index) => (
            <InputNumber
              placeholder="Mức tồn kho thấp"
              value={text}
              onChange={handleChangeDetail('low_quantity_thres', index, true)}
            />
          ),
        },
        {
          title: (
            <div className="custome-header">
              <div className="title-box">SKU</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'sku',
          key: 'sku',
          width: 170,
          render: (text, _, index) => (
            <Input
              placeholder="sku"
              value={text}
              size="medium"
              onChange={handleChangeDetail('sku', index)}
            />
          ),
        },
        {
          title: (
            <div className="custome-header">
              <div className="title-box">Barcode</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          width: 170,
          dataIndex: 'barcode',
          key: 'barcode',
          render: (text, _, index) => (
            <Input
              placeholder="barcode"
              value={text}
              size="medium"
              onChange={handleChangeDetail('barcode', index)}
            />
          ),
        },
        // {
        //   title: (
        //     <div className="custome-header">
        //       <div className="title-box">Chiều dài</div>
        //       {/* <div className="addition"></div> */}
        //     </div>
        //   ),
        //   width: 170,
        //   dataIndex: 'box_length_cm',
        //   key: 'box_length_cm',
        //   render: (text, _, index) => (
        //     <Input
        //       placeholder="box_length_cm"
        //       value={text}
        //       size="medium"
        //       onChange={handleChangeDetail('box_length_cm', index)}
        //     />
        //   ),
        // },
        // {
        //   title: (
        //     <div className="custome-header">
        //       <div className="title-box">Rộng</div>
        //       {/* <div className="addition"></div> */}
        //     </div>
        //   ),
        //   width: 170,
        //   dataIndex: 'box_width_cm',
        //   key: 'box_width_cm',
        //   render: (text, _, index) => (
        //     <Input
        //       placeholder="box_width_cm"
        //       value={text}
        //       size="medium"
        //       onChange={handleChangeDetail('box_width_cm', index)}
        //     />
        //   ),
        // },
        // {
        //   title: (
        //     <div className="custome-header">
        //       <div className="title-box">Cao</div>
        //       {/* <div className="addition"></div> */}
        //     </div>
        //   ),
        //   width: 170,
        //   dataIndex: 'box_height_cm',
        //   key: 'box_height_cm',
        //   render: (text, _, index) => (
        //     <Input
        //       placeholder="box_height_cm"
        //       value={text}
        //       size="medium"
        //       onChange={handleChangeDetail('box_height_cm', index)}
        //     />
        //   ),
        // },
        // {
        //   title: (
        //     <div className="custome-header">
        //       <div className="title-box">Khối lượng</div>
        //       {/* <div className="addition"></div> */}
        //     </div>
        //   ),
        //   width: 170,
        //   dataIndex: 'weight_grams',
        //   key: 'weight_grams',
        //   render: (text, _, index) => (
        //     <Input
        //       placeholder="weight_grams"
        //       value={text}
        //       size="medium"
        //       onChange={handleChangeDetail('weight_grams', index)}
        //     />
        //   ),
        // },
        {
          title: '',
          key: 'status',
          dataIndex: 'status',
          fixed: 'right',
          width: 100,
          render: (text, _, index) => {
            return (
              <div className="">
                <Space align="center" direction="vertical" className="d-flex">
                  {/* <CustomStyle
                    fontSize={{ xs: 'f5' }}
                    color="primary"
                    className="pointer"
                    
                  >
                    <EditOutlined />
                  </CustomStyle> */}
                  <Switch
                    onChange={handleChangeDetail('status', index)}
                    checked={text === 'active'}
                  ></Switch>
                </Space>
              </div>
            );
          },
        },
      ],
    };
  }, [variations]);

  const rowSelection = {
    onChange: selectedRowKeys => {
      // setListOption([]);
      setListSelected(selectedRowKeys);
    },
  };

  const handleSelect = (type, value) => () => {
    if (type !== 'none' && currentOption.some(item => item.type === 'all'))
      return;
    let newSelected = listSelected;
    let newOption = currentOption.some(item => item.value === value)
      ? currentOption
      : [...currentOption, { type, value }];
    let optionSelected = listOption;

    const handleOption = params => {
      const lists = [];
      for (const [index, item] of variations.entries()) {
        if (item.active || item[params] === value) lists.push(index);
      }
      // const lists = variations
      //   .filter(item => item.active || item[params] === value)
      //   .map((_, index) => index);
      newSelected = union(lists, newSelected);
      optionSelected = listOption.map(item => ({
        ...item,
        active: item.active || item.value === value,
      }));
      // return { newSelected, optionSelected };
    };

    switch (type) {
      case 'all':
        newOption = [{ type, value }];
        newSelected = variations.map((_, index) => index);
        // setCurrentOption([]);
        optionSelected = listOption.map(item => ({
          ...item,
          active: false,
        }));
        break;
      case 'none':
        newSelected = [];
        newOption = [];
        // setCurrentOption([]);
        optionSelected = listOption.map(item => ({
          ...item,
          active: false,
        }));
        break;
      case 'option_1':
        handleOption('option_1');
        break;
      case 'option_2':
        handleOption('option_2');
        break;
      case 'option_3':
        handleOption('option_3');
        break;

      default:
        break;
    }
    setCurrentOption(newOption);
    setListSelected(newSelected);
    setListOption(optionSelected);
  };

  const handleMenuClick = Type => () => {
    setStatusModal(Type);
  };

  const handleModalShow = () => {
    const listModal = [
      {
        title: 'Sửa số lượng',
        Component: TotalQuantity,
      },
      // {
      //   title: 'Sửa thông tin giao hàng',
      //   Component: ShippingModal,
      // },
    ];
    return (
      <Menu>
        {listModal.map(({ title, Component }) => (
          <Menu.Item
            key={title}
            onClick={handleMenuClick(
              <Component
                title={title}
                // data={intersectionWith(
                //   variations,
                //   listSelected,
                //   (o, id) => o.id === id,
                // )}
                data={listSelected?.map(index => ({
                  ...variations?.[index],
                }))}
                variations={variations}
                setVariations={setVariations}
                callBackCancel={handleMenuClick('')}
                supplierInfo={supplierInfo}
              />,
            )}
          >
            {title}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <div style={{ width: '97.5%', margin: '0 12px' }}>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <div className="title">Biến thể đã nhập</div>
        <CustomStyle className="" mb={{ xs: 's5' }}>
          <Space wrap>
            <span>Chọn:</span>
            <Button
              context="secondary"
              color="transparent"
              className={
                currentOption.some(item => item.type === 'all') ? 'active' : ''
              }
              onClick={handleSelect('all')}
            >
              Chọn tất cả
            </Button>
            <Button
              context="secondary"
              color="transparent"
              onClick={handleSelect('none')}
            >
              Bỏ chọn
            </Button>
            {listOption.map(item => (
              <Button
                context="secondary"
                key={item.value}
                className={item.active ? 'active' : ''}
                color="transparent"
                onClick={handleSelect(item.type, item.value)}
              >
                {item.value}
              </Button>
            ))}
          </Space>
        </CustomStyle>

        {isEmpty(listSelected) || (
          <CustomStyle
            pb={{ xs: 's5' }}
            className="d-flex align-items-center justify-content-between"
          >
            <CustomStyle fontWeight="bold" px={{ xs: 's5' }}>
              Đã chọn {listSelected.length} Biến thể
            </CustomStyle>
            <Dropdown overlay={handleModalShow()}>
              <Button
                className="btn-sm"
                // onClick={handleCancel}
                color="default"
                context="secondary"
              >
                Sửa hàng loạt &nbsp; <DownOutlined />
              </Button>
            </Dropdown>
          </CustomStyle>
        )}

        <CustomTable
          className="custom"
          columns={columns}
          // rowClassName="pointer"
          dataSource={variations || []}
          rowSelection={{
            selectedRowKeys: listSelected,
            type: 'checkbox',
            ...rowSelection,
          }}
          scroll={{ x: 900, y: 1000 }}
          pagination={false}
          notNeedRedirect={true}
          rowKey={(_, index) => index}
        />
      </CustomSectionWrapper>
      {StatusModal}
      {/* {statusModal === 'editPrice' && <EditPrice />} */}
    </div>
  );
});

const WrapperOption = styled.div`
  .add-image {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 45px;
    height: 45px;
    border-radius: 4px;
    color: ${({ theme }) => theme.grayBlue};
    background-color: ${({ theme }) => theme.backgroundBlue};
    border: 1px dashed #d9dbe2;
  }
  .ant-image {
    cursor: pointer;
  }
`;

const CustomTable = styled(Table)`
  color: #4d4d4d;
`;
