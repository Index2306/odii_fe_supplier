/**
 *
 * MyWallet
 *
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Spin } from 'antd';
import request from 'utils/request';
import { EmptyPage } from 'app/components';
import { CustomTitle } from 'styles/commons';
import { useMyWalletSlice } from './slice';
import {
  selectLoading,
  selectData,
  // selectPagination,
  selectDataBalance,
  selectDataBankSupplier,
  selectShowEmptyPage,
} from './slice/selectors';
import { messages } from './messages';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import {
  OverViewMyWallet,
  HistoryTransaction,
  ModalAddBank,
} from './Components';
import {
  SectionWrapperOverViewMyWallet,
  SectionWrapperHistoryTransaction,
} from './styles';

const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};

export function MyWallet({ history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useMyWalletSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const BanksSupplier = useSelector(selectDataBankSupplier);
  const dataBalance = useSelector(selectDataBalance);
  // const pagination = useSelector(selectPagination);
  const showEmptyPage = useSelector(selectShowEmptyPage);

  const [isShowModalAddBank, setIsShowModalAddBank] = useState(false);
  const [bankDefault, setBankDefault] = useState('');
  const [dataBankVN, setDataBankVN] = useState('');

  useEffect(() => {
    request(`user-service/banks-info?page=1&page_size=100`, {})
      .then(result => {
        setDataBankVN(result?.data ?? {});
      })
      .catch(err => {});
  }, []);

  useEffect(() => {
    if (!isEmpty(BanksSupplier)) {
      BanksSupplier.map(item => {
        if (item.is_default) {
          setBankDefault(item);
        }
      });
    }
  }, [BanksSupplier]);

  useEffect(() => {
    dispatch(actions.getBalance({}));
    dispatch(actions.getBankSupplier({}));
    return () => {
      dispatch(actions.resetWhenLeave());
    };
  }, []);

  const handleAddBank = () => {
    setIsShowModalAddBank(true);
  };

  if (showEmptyPage) {
    return (
      <MainWrapper>
        <CustomTitle className="title " mb={{ xs: 's6' }}>
          {t(messages.title())}
        </CustomTitle>

        <SectionWrapperOverViewMyWallet>
          <OverViewMyWallet
            data={data}
            t={t}
            history={history}
            isLoading={isLoading}
            dataBalance={dataBalance}
            BanksSupplier={BanksSupplier}
            bankDefault={bankDefault}
            handleAddBank={handleAddBank}
          ></OverViewMyWallet>
        </SectionWrapperOverViewMyWallet>

        <CustomDivEmpty>
          <EmptyPage style={{ height: 'calc(100vh - 200px)' }}></EmptyPage>
        </CustomDivEmpty>

        <ModalAddBank
          layout={layout}
          dataBankVN={dataBankVN}
          isShowModalAddBank={isShowModalAddBank}
          setIsShowModalAddBank={setIsShowModalAddBank}
        />
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <CustomTitle className="title " mb={{ xs: 's6' }}>
          {t(messages.title())}
        </CustomTitle>

        <SectionWrapperOverViewMyWallet>
          <OverViewMyWallet
            data={data}
            t={t}
            history={history}
            isLoading={isLoading}
            dataBalance={dataBalance}
            BanksSupplier={BanksSupplier}
            bankDefault={bankDefault}
            handleAddBank={handleAddBank}
          ></OverViewMyWallet>
        </SectionWrapperOverViewMyWallet>

        <SectionWrapperHistoryTransaction>
          <HistoryTransaction
            data={data}
            t={t}
            history={history}
            isLoading={isLoading}
          ></HistoryTransaction>
        </SectionWrapperHistoryTransaction>

        <ModalAddBank
          layout={layout}
          dataBankVN={dataBankVN}
          isShowModalAddBank={isShowModalAddBank}
          setIsShowModalAddBank={setIsShowModalAddBank}
        />
      </Spin>
    </MainWrapper>
  );
}

const MainWrapper = styled.div`
  padding: ${({ theme }) => theme.space.s4 * 3}px
    ${({ theme }) => theme.space.s4 * 2}px;
  /* width: ${({ theme }) => `calc(999px + ${theme.space.s4 * 4}px)`}; */
  margin: 0 auto;

  @media screen and (min-width: 1600px) {
    width: ${({ theme }) => `calc(1257px + ${theme.space.s4 * 4}px)`};
  }
`;

const CustomDivEmpty = styled.div`
  .style-1 {
    height: calc(100vh - 210px);
  }
`;
