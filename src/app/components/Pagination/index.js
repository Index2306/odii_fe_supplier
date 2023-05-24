/**
 *
 * Table
 *
 */
import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { Pagination as P } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  useValidateQuerySearch,
  useShouldRedirectToLastPage,
  useHandleChangePage,
} from 'app/hooks/useValidateQuerySearch';
import { Redirect } from 'react-router-dom';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const defaultSchema = {
  page: {
    required: true,
    default: 1,
    test: value => {
      return /^\d+$/.test(value);
    },
  },
  page_size: {
    required: true,
    default: 10,
    test: value => Number(value) <= 100,
  },
};

const Pagination = ({
  data = {},
  needObjectParams,
  searchSchema = {},
  notNeedRedirect = false,
  actions = () => null,
  ...rest
}) => {
  const { t } = useTranslation();
  const location = useShouldRedirectToLastPage(data);
  useEffect(() => {
    if (location.search) {
      actions(
        needObjectParams
          ? { search: location.search, params: queryData }
          : location.search,
      );
    }
  }, [location.search]);

  const handleChangePage = useHandleChangePage(notNeedRedirect);
  const { isValid, to, queryData } = useValidateQuerySearch({
    ...defaultSchema,
    ...searchSchema,
  });
  if (!isValid && !notNeedRedirect) {
    return <Redirect to={to} />;
  }
  const itemRender = (current, type, originalElement) => {
    if (type === 'prev') {
      return (
        <i>
          <LeftOutlined />
        </i>
      );
    }
    if (type === 'next') {
      return (
        <i>
          <RightOutlined />
        </i>
      );
    }
    return originalElement;
  };
  return (
    <CustomPagination
      total={data?.pagination?.total ?? 0}
      current={+queryData.page || 1}
      showTotal={(total, range) =>
        `${range[0]}-${range[1]} ${t('user.of')} ${total} ${t('user.items')}`
      }
      itemRender={itemRender}
      pageSize={queryData?.page_size}
      // defaultPageSize={+queryData.page_size || 10}
      showSizeChanger={false}
      onChange={handleChangePage}
      {...rest}
    />
  );
};

const CustomPagination = styled(P)`
  padding: ${({ theme }) => theme.space.s4}px;
  background-color: ${({ theme }) => theme.whitePrimary};
  display: flex;

  .ant-pagination-total-text {
    font-weight: 500;
    height: auto;
    flex: 1;
  }

  .ant-pagination-item,
  .ant-pagination-prev,
  .ant-pagination-next {
    border: solid 1px ${({ theme }) => theme.stroke};
    color: ${({ theme }) => theme.grayBlue};

    a {
      color: ${({ theme }) => theme.grayBlue};
    }
  }

  .ant-pagination-item-active {
    background-color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primary};

    a {
      color: ${({ theme }) => theme.whitePrimary};
    }
  }
`;

export default Pagination;
