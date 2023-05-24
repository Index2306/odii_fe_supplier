/**
 *
 * Table
 *
 */
import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { Table as T } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  useValidateQuerySearch,
  useShouldRedirectToLastPage,
  useHandleChangePage,
} from 'app/hooks/useValidateQuerySearch';
import { Redirect } from 'react-router-dom';

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

const Table = ({
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
    actions(
      needObjectParams
        ? { search: location.search, params: queryData }
        : location.search,
    );
  }, [location.search]);

  const handleChangePage = useHandleChangePage(notNeedRedirect);
  const { isValid, to, queryData } = useValidateQuerySearch({
    ...defaultSchema,
    ...searchSchema,
  });
  if (!isValid && !notNeedRedirect) {
    return <Redirect to={to} />;
  }
  const pagination = {
    showSizeChanger: true,
    hideOnSinglePage: true,
    // pageSize: repositories?.pagination?.page_size ?? 10,
    current: +queryData.page || 1,
    total: data?.pagination?.total ?? 0,
    // size: 'small',
    defaultPageSize: +queryData.page_size || 10,
    defaultCurrent: 1,
    showTotal: (total, range) =>
      `${range[0]}-${range[1]} ${t('user.of')} ${total} ${t('user.items')}`,
  };
  return (
    <CustomTable
      rowKey="id"
      dataSource={data?.data || []}
      pagination={pagination}
      onChange={handleChangePage}
      scroll={{ x: 1200, y: 900 }}
      {...rest}
    />
  );
};

const CustomTable = styled(T)`
  .ant-table {
    font-size: 14px;
  }
  .ant-table-thead > tr > th:not(.ant-table-cell-fix-right) {
    color: ${({ theme }) => theme.grayBlue};
    padding: 22px 10px;
    font-size: 14px;
    background: transparent;
    border-bottom-color: ${({ theme }) => theme.stroke};

    :before {
      background-color: transparent !important;
    }
  }
  .ant-table-cell-fix-right {
    background: #fff;
  }
  .ant-table-tbody > tr > td {
    padding: 16px 10px;
    border-bottom-color: ${({ theme }) => theme.stroke};
  }

  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: ${({ theme }) => theme.background};
  }

  .ant-image,
  .ant-image-img {
    width: 45px;
    border-radius: 4px;
  }
  .ant-list-item {
    padding: 0;
    .ant-list-item-meta-title {
      font-size: 14px;
      font-weight: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      /* white-space: nowrap; */
      a {
        color: ${({ theme }) => theme.text};
      }
    }
    .ant-list-item-meta-description {
      font-weight: normal;
      font-size: 12;
      color: rgba(0, 0, 0, 0.4);
    }
  }
  .ant-select {
    font-size: 14px;
  }
  .ant-select-multiple .ant-select-selection-item {
    display: none;
  }
  thead tr {
    /* background: #e0e0e0; */
  }
  th.ant-table-cell {
    /* display: flex; */
    /* background: #e0e0e0; */
  }
  button.ant-pagination-item-link {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default Table;
