import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';

const Filter = (
  { initState = {}, setFilter = () => null, filter = {}, children },
  ref,
) => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const handleFilter = {};
    Object.keys(initState).forEach(element => {
      if (search.get(element)) {
        handleFilter[element] = search.get(element);
      } else handleFilter[element] = '';
    });
    setFilter(handleFilter);
  }, [location.search]);

  useEffect(() => {
    const listener = event => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault();
        onSearch();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [filter]);

  useImperativeHandle(ref, () => ({
    callBack: (data = {}) => {
      onSearch(data);
    },
  }));
  const onSearch = (list = filter) => {
    const searchParams = new URLSearchParams(location.search);
    Object.keys(list).forEach(element => {
      if (!list[element]) {
        searchParams.delete(element);
      } else {
        searchParams.set(element, list[element]);
      }
    });
    history.push(`${location.pathname}?${searchParams.toString()}`);
  };

  return <Wrapper>{children}</Wrapper>;
  // const Component = component;
  // return function _Component(props) {
  //   return <Component />;
  // };
};

const Wrapper = styled.div`
  .ant-input {
    height: 36px;
  }
  .ant-picker {
    height: 36px;
  }
  .ant-select-selector {
    height: 36px !important;
    .ant-select-selection-item {
      line-height: 34px;
    }
  }
  .ant-input-affix-wrapper .ant-input {
    height: 26px;
  }
`;

export default forwardRef(Filter);
