/* eslint-disable no-unused-vars */
import React, { memo, useEffect, useState, useMemo } from 'react';
import { Row, Col, Form as F, Tree } from 'antd';
import { isEmpty } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useCategoriesSlice } from 'app/pages/Categories/slice';
import { selectData } from 'app/pages/Categories/slice/selectors';
// import constants from 'assets/constants';
import { CustomSectionWrapper } from './styled';
const Item = F.Item;

const normFile = e => {
  if (Array.isArray(e)) {
    return e;
  }
  return e;
};

export default memo(function CategoryProduct({
  layout,
  form,
  product_category = {},
}) {
  const dispatch = useDispatch();
  const listCategories = useSelector(selectData);
  const categoriesSlice = useCategoriesSlice();

  useEffect(() => {
    if (isEmpty(listCategories)) {
      dispatch(categoriesSlice.actions.getData({ page: 0, page_size: 1000 }));
    }
  }, [listCategories]);

  const handleListCategories = useMemo(() => {
    // let list = [];
    // function changeIdToKey(arr, id, keyChild) {
    //   debugger;
    //   if (id) {
    //     list[keyChild].children = [];
    //   }
    //   arr.forEach((item, key) => {
    //     if (id) {
    //       list[keyChild].children = [
    //         ...list[keyChild].children,
    //         { ...item, key: `${id}-${item.id?.toString()}` },
    //       ];
    //     } else {
    //       list.push({ ...item, key: item.id?.toString() });
    //     }
    //     if (!isEmpty(item.children)) {
    //       changeIdToKey(item.children, item.id, key);
    //     }
    //   });
    // }
    const loop = data => {
      return data.map(item => {
        if (!isEmpty(item.children)) {
          return {
            ...item,
            key: item.path,
            children: loop(item.children),
          };
        }
        return {
          ...item,
          key: item.path,
        };
      });
    };

    return loop(listCategories);
  }, [listCategories]);

  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      {/* <div className="title">Danh mục sản phẩm</div> */}
      <Row gutter={24}>
        <Col span={24}>
          <Item
            name="product_category"
            label="Danh mục sản phẩm"
            valuePropName="data"
            getValueFromEvent={normFile}
            // valuePropName="treeData"
            {...layout}
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn danh mục!',
              },
            ]}
          >
            <TreeCustom treeData={handleListCategories} />
          </Item>
        </Col>
      </Row>
    </CustomSectionWrapper>
  );
});

const TreeCustom = ({ data, onChange, ...res }) => {
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);

  useEffect(() => {
    if (!isEmpty(data)) {
      const listChecked = [data.path];
      setExpandedKeys(listChecked);
      setSelectedKeys(listChecked);
      setCheckedKeys(listChecked);
    }
  }, [data]);

  const onExpand = expandedKeysValue => {
    // or, you can remove all expanded children keys.

    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onCheck = checkedKeysValue => {
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue, info) => {
    onChange(info.node);
    setSelectedKeys(selectedKeysValue);
  };

  return (
    <Tree // checkable
      // onExpand={onExpand}
      titleRender={item => item.name}
      key="path"
      // expandedKeys={expandedKeys}
      // autoExpandParent={autoExpandParent}
      // onCheck={onCheck}
      // checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      {...res}
    />
  );
};
