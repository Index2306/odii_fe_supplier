import React, { useState, useEffect } from 'react';
import CustomModal from 'app/components/Modal';
import { Tooltip, AutoComplete, Spin } from 'antd';
import Styled from 'styled-components';
import { Radio, Input } from 'app/components';
import { isEmpty } from 'lodash';
import { getSuggestCategory } from 'utils/providers';
import { RightOutlined } from '@ant-design/icons';
import { CustomStyle } from 'styles/commons';
import { useDebouncedCallback } from 'use-debounce';

export default function CategoriesModal({
  data = [],
  defaultSuggestValue,
  defaultActives = [],
  handleConfirm = () => null,
  ...res
}) {
  const [actives, setActives] = useState(defaultActives);
  const [suggestValue, setSuggestValue] = useState();
  const [draftSuggestValue, setDraftSuggestValue] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [dataChanel, setDataChanel] = useState([[], [], [], []]);
  const [options, setOptions] = useState([]);

  const debounced = useDebouncedCallback(
    // function
    value => {
      if (value && value.length > 1) {
        setIsLoading(true);
        getSuggestCategory(value)
          .then(response => {
            setIsLoading(false);
            if (!isEmpty(response?.data))
              setOptions(
                response?.data.map(v => ({ ...v, value: v.cat_path })),
              );
          })
          .catch(err => setIsLoading(false));
      } else {
        setSuggestValue('');
        setOptions([]);
      }
    },
    // delay in ms
    500,
  );
  useEffect(() => {
    if (isEmpty(data)) return;
    if (defaultSuggestValue) {
      setOptions(defaultActives);
      setSuggestValue(defaultSuggestValue);
      setDataChanel([data]);
    } else {
      let newData = dataChanel.slice(0);
      if (isEmpty(defaultActives)) {
        newData[0] = data;
      } else {
        defaultActives.forEach((_, key) => {
          if (key === 0) {
            newData[key] = data;
          } else {
            newData[key] = newData[key - 1]?.find(
              v => v.name === defaultActives[key - 1].name,
            ).children;
          }
        });
      }
      setDataChanel(newData);
    }
  }, []);

  const onChangeRadius = index => e => {
    const preActives = actives.slice(0, index);
    const name = e.target.value;
    const currentValue = dataChanel[index].find(item => item.name === name);
    const newActives = [...preActives, currentValue];
    let newData = [];
    if (!isEmpty(currentValue.children)) {
      const cloneDataChanel = dataChanel.slice(0);
      if (+index + 1 === dataChanel.length) {
        // newData.push([]);
        cloneDataChanel[+index + 1] = [];
      }
      for (let [i, item] of cloneDataChanel.entries()) {
        if (i <= index) {
          newData[i] = item;
        } else if (i === index + 1) {
          newData[i] = currentValue.children
            .slice()
            .sort((a, b) => (a.priority > b.priority ? 1 : -1));
        } else newData[i] = [];
      }

      setDataChanel(newData);
    } else {
      for (let [i, item] of dataChanel.entries()) {
        if (i <= index) {
          newData[i] = item;
          // } else if (i === index + 1) {
          //   newData[i] = currentValue.children;
        } else newData[i] = [];
      }
    }
    setDataChanel(newData);

    setActives(newActives);
  };

  const handleOk = () => {
    handleConfirm(
      suggestValue ? options.filter(v => v.cat_path === suggestValue) : actives,
    );
  };

  const onSearch = searchText => {
    setDraftSuggestValue(searchText);
    setDataChanel([data]);
    // debounced(searchText);
  };

  const onSelect = data => {
    setDraftSuggestValue('');
    const currentValue = dataChanel[0].find(item => item.name === data);
    let newData = [];
    if (!isEmpty(currentValue.children)) {
      const cloneDataChanel = dataChanel.slice(0);
      cloneDataChanel[1] = [];
      for (let [i, item] of cloneDataChanel.entries()) {
        if (i <= 0) {
          newData[i] = item.filter(e => e.name === data);
        } else if (i === 1) {
          newData[i] = currentValue.children
            .slice()
            .sort((a, b) => (a.priority > b.priority ? 1 : -1));
        } else newData[i] = [];
      }

      setDataChanel(newData);
    } else {
      for (let [i, item] of dataChanel.entries()) {
        if (i <= 0) {
          newData[i] = item;
        } else newData[i] = [];
      }
    }
    setDataChanel(newData);
    setActives([currentValue]);
    // setSuggestValue(data);
  };

  const disableOk = isEmpty(actives) || !isEmpty(actives.slice(-1)[0].children);
  return (
    <CustomModal
      {...res}
      width={1000}
      bodyStyle={{ overflow: 'scroll' }}
      title="Danh mục sản phẩm"
      callBackOk={handleOk}
      disableOk={disableOk && !suggestValue}
    >
      <CustomStyle className="d-flex" mb={{ xs: 's4' }}>
        <CustomStyle color="grayBlue" mr={{ xs: 's3' }}>
          Đã chọn:
        </CustomStyle>
        <CustomStyle color="primary">
          {suggestValue ||
            actives?.map((item, i) => (
              <span>
                {i === 0 ? '' : ' / '}
                {item.name}
              </span>
            ))}
        </CustomStyle>
      </CustomStyle>
      <CustomStyle className="d-flex" mb={{ xs: 's4' }}>
        <AutoComplete
          // className="custom"
          value={draftSuggestValue || suggestValue}
          style={{ width: '100%' }}
          onSelect={onSelect}
          onSearch={onSearch}
          options={dataChanel[0]?.map(e => ({ value: e.name }))}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          // onKeyPress={handleKeyPress}
          // onChange={onChange}
        >
          <Input placeholder="Tìm kiếm ngành hàng" />
        </AutoComplete>
      </CustomStyle>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Wrapper total={dataChanel.length}>
          {dataChanel.map((item, index) => (
            <Col>
              <Radio.Group
                onChange={onChangeRadius(index)}
                value={actives?.[index]?.name}
                disabled={!!suggestValue}
              >
                {item.map(v => (
                  <Radio value={v.name}>
                    <div className="d-flex justify-content-between align-items-center content">
                      <span className="text">
                        <Tooltip mouseEnterDelay={0.5} title={v.name}>
                          {v.name}
                        </Tooltip>
                      </span>
                      {isEmpty(v.children) || <RightOutlined />}
                    </div>
                  </Radio>
                ))}
              </Radio.Group>
            </Col>
          ))}
        </Wrapper>
      </Spin>
    </CustomModal>
  );
}

const Wrapper = Styled.div`
border: 1px solid ${({ theme }) => theme.stroke};
background: ${({ theme }) => theme.whitePrimary};
border-radius: 4px;
/* padding: 0 12px; */
width: calc(238px * ${({ total }) => total});
display: flex;
/* overflow-x: scroll; */
height: 410px;

`;

const Col = Styled.div`
display: inline-block;
overflow: auto;
white-space: nowrap;
height: 410px;
width: 230px;
.ant-radio-group {
  display: inline-flex;
  flex-wrap: wrap;
  width: 100%;
    > * {
      padding: 8px;
    
      width: 100%;
      margin: 0;
      &.ant-radio-wrapper-checked {
        background: #EBF1FF;
      }
      > span:last-child {
        width: 197px;
        padding-right: 0;
      }
      .content {
        .text {
          white-space: nowrap; 
          padding-right: 5px;
          overflow: hidden;
          text-overflow: ellipsis; 
        }
        .anticon {
          font-size: 10px;
        }
      }
    }
  }
  :not(:last-child){
    border-right: 1px solid ${({ theme }) => theme.stroke};
  }
`;
