import React, { memo, useState } from 'react';
import { AutoComplete, Tooltip } from 'antd';
import { Input, Form } from 'app/components';
import { isEmpty } from 'lodash';
import { getSuggestCategoryByName } from 'utils/providers';
import { CustomStyle } from 'styles/commons';
import { useDebouncedCallback } from 'use-debounce';
import { CustomSectionWrapper } from './styled';

const Item = Form.Item;

export default memo(function Name({
  layout,
  setFieldsValue,
  setFormValues,
  isCreate,
  name,
}) {
  const [options, setOptions] = useState([]);
  const [suggestValue, setSuggestValue] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const debounced = useDebouncedCallback(
    // function
    value => {
      if (value) {
        setIsLoading(true);
        getSuggestCategoryByName(value)
          .then(response => {
            setIsLoading(false);
            if (!isEmpty(response?.data)) {
              const newOption = [
                {
                  label: (
                    <CustomStyle fontWeight="medium">
                      NGÀNH HÀNG ĐỀ XUẤT (Bạn có thể thay đổi ngành hàng bên
                      dưới)
                    </CustomStyle>
                  ),
                  options: response?.data.map(v => ({
                    ...v,
                    value: v.cat_path,
                    label: (
                      <div>
                        <Tooltip mouseEnterDelay={0.5} title={v.cat_path}>
                          {v.cat_path}
                        </Tooltip>
                      </div>
                    ),
                  })),
                },
              ];
              setOptions(
                newOption,
                // response?.data.map(v => ({ ...v, value: v.cat_path })),
              );
            }
          })
          .catch(err => setIsLoading(false));
      } else {
        setSuggestValue();
        setOptions([]);
      }
    },
    // delay in ms
    300,
  );

  // React.useEffect(() => {
  //   console.log('come here :>> ');
  //   return () => {
  //     console.log('come here :>>1 ');
  //   };
  // }, []);

  const onSelect = data => {
    setSuggestValue(data);
    setFieldsValue({
      product_categories_metadata: options[0].options.filter(
        v => v.cat_path === data,
      ),
    });
    setFormValues();
  };
  const onSearch = searchText => {
    if (searchText && searchText.length > 1) debounced(searchText);
  };

  const Children = (
    <Item
      name="name"
      label="Tên sản phẩm"
      {...layout}
      rules={[
        {
          required: true,
          message: 'Không được để trống ô tên!',
        },
        {
          min: 10,
          message:
            'Tên sản phẩm của bạn quá ngắn. Vui lòng nhập ít nhất 10 kí tự.',
        },
        {
          max: 120,
          message:
            'Tên sản phẩm của bạn quá dài. Vui lòng nhập tối đa 120 kí tự.',
        },
      ]}
    >
      <Input
        showCount
        maxLength={120}
        minLength={10}
        suffix={
          <CustomStyle color="gray3">{`| ${
            name?.length ?? 0
          }/120`}</CustomStyle>
        }
        placeholder="Nhập tên sản phẩm"
      />
    </Item>
  );

  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      {/* <div className="title">Tên sản phẩm</div> */}
      <div className="">
        {isCreate ? (
          <AutoComplete
            // className="custom"
            value={suggestValue}
            // dropdownMatchSelectWidth={800}
            style={{ width: '100%' }}
            onSelect={onSelect}
            onSearch={onSearch}
            options={options}
            // onKeyPress={handleKeyPress}
            // onChange={onChange}
          >
            {Children}
          </AutoComplete>
        ) : (
          Children
        )}
      </div>
    </CustomSectionWrapper>
  );
});
