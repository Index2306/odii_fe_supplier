import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, PageWrapper } from 'app/components';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { CustomTitle, SectionWrapper } from 'styles/commons';
import ListInvoice from './Components/ListInvoice';
import { selectLoading } from './slice/selectors';

export function LogisticsImport({ history }) {
  const isLoading = useSelector(selectLoading);

  const goCreate = () => {
    history.push('/logistics/import/detail');
  };
  return (
    <PageWrapper>
      <CustomDiv className="header d-flex justify-content-between">
        <CustomTitle>Nhập kho</CustomTitle>
        <Button className="btn-sm" color="blue" onClick={goCreate}>
          <PlusCircleOutlined /> &ensp; Tạo phiếu nhập
        </Button>
      </CustomDiv>
      <CustomSectionWrapper>
        <ListInvoice isLoading={isLoading} history={history} />
      </CustomSectionWrapper>
    </PageWrapper>
  );
}

const CustomSectionWrapper = styled(SectionWrapper)`
  p {
    margin-top: 14px;
  }
  .hide {
    visibility: hidden;
  }
  .group-btn {
    display: none;
  }
  .box-status:hover .group-btn {
    display: block;
  }
  .action-wrapper {
    display: none;
    position: absolute;
    padding: 0;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    white-space: nowrap;
    word-break: keep-all;
    > div {
      display: inline-flex;
      > button {
        margin-left: 11px;
      }
    }
    button {
      margin: auto;
    }
  }
  tr:hover {
    .action-wrapper {
      display: inline-flex;
    }
  }
`;

const CustomDiv = styled.div`
  margin-bottom: 12px;
`;
