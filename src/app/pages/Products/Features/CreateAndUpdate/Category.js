import React, { memo, useEffect, useState } from 'react';
import { Button, Form } from 'app/components';
import { isEmpty } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useCategoriesSlice } from 'app/pages/Categories/slice';
import CategoriesModal from 'app/components/Modal/CategoriesModal';
import { selectData } from 'app/pages/Categories/slice/selectors';
import { CustomStyle } from 'styles/commons';
import Styled from 'styled-components';
import { CustomSectionWrapper } from './styled';
const Item = Form.Item;

function CategoryChild({ data, onChange = () => null }) {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const listCategories = useSelector(selectData);
  const categoriesSlice = useCategoriesSlice();

  useEffect(() => {
    if (isEmpty(listCategories)) {
      dispatch(categoriesSlice.actions.getData({ page: 0, page_size: 1000 }));
    }
  }, [listCategories]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const customChange = value => {
    onChange(value);
    toggleModal();
  };

  const suggestValue = data?.length === 1 && data[0].cat_path;

  return (
    <>
      <CustomButton
        context="secondary"
        onClick={toggleModal}
        color="default"
        width="100%"
        className="btn-md justify-content-start"
      >
        {!isEmpty(data) ? (
          <CustomStyle>
            {suggestValue ||
              data.map((item, i) => (
                <span key={item.id}>
                  {i === 0 ? '' : ' / '}
                  {item.name}
                </span>
              ))}
          </CustomStyle>
        ) : (
          'Chọn danh mục cho sản phẩm'
        )}
      </CustomButton>
      {showModal && (
        <CategoriesModal
          isOpen={showModal}
          defaultSuggestValue={suggestValue}
          data={listCategories}
          defaultActives={data || []}
          className="modal-1"
          callBackCancel={toggleModal}
          handleConfirm={customChange}
        />
      )}
    </>
  );
}

export default memo(function Category({ layout, ...res }) {
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };
  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      <CustomStyle mb={{ xs: 's7' }}>
        <Item
          name="product_categories_metadata"
          label="Danh mục sản phẩm"
          valuePropName="data"
          getValueFromEvent={normFile}
          {...layout}
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn danh mục!',
            },
          ]}
        >
          <CategoryChild {...res} />
        </Item>
      </CustomStyle>
    </CustomSectionWrapper>
  );
});

const CustomButton = Styled(Button)`
  &:hover, &.active {
    background: transparent !important;
    color: ${({ theme }) => theme.text} !important;
  }
`;
