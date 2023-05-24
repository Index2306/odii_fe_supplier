import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { globalActions } from 'app/pages/AppPrivate/slice';
// import { useTranslation } from 'react-i18next';
import { Row, Col, Spin, Space, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import request from 'utils/request';
import {
  selectLoading,
  // selectShowEmptyPage,
  selectDataBankSupplier,
} from '../../slice/selectors';
import { PageWrapper, EmptyPage, Button } from 'app/components';
import { SectionWrapper, CustomH3, CustomStyle } from 'styles/commons';
import { useMyWalletSlice } from '../../slice';
import { isEmpty } from 'lodash';
import {
  ModalAddBank,
  ModalDetailBank,
  ModalUpdateBank,
  ModalWithdrawal,
} from '../../Components';
import notification from 'utils/notification';
import { CustomBank } from '../../styles';

const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};

export function Withdrawal({ match, history }) {
  // const { t } = useTranslation();

  const dispatch = useDispatch();
  const BanksSupplier = useSelector(selectDataBankSupplier);

  const { actions } = useMyWalletSlice();
  const isLoading = useSelector(selectLoading);
  // const showEmptyPage = useSelector(selectShowEmptyPage);

  const [isShowModalAddBank, setIsShowModalAddBank] = useState(false);
  const [isShowModalDetailBank, setIsShowModalDetailBank] = useState(false);
  const [isShowModalUpdateBank, setIsShowModalUpdateBank] = useState(false);
  const [isShowModalWithdrawal, setIsShowModalWithdrawal] = useState(false);

  const [bank, setBank] = useState('');
  const [bankUpdate, setBankUpdate] = useState('');
  const [dataBankVN, setDataBankVN] = useState('');

  useEffect(() => {
    dispatch(actions.getBankSupplier({}));
    dispatch(actions.getBalance({}));
  }, []);

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
    };
  }, []);

  useEffect(() => {
    request(`user-service/banks-info?page=1&page_size=100`, {})
      .then(result => {
        setDataBankVN(result?.data ?? {});
      })
      .catch(err => {});
  }, []);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Ví của tôi',
          link: '/mywallet',
        },
        {
          name: 'Rút tiền',
        },
      ],
      fixWidth: true,
      title: 'Rút tiền',
      actions: !isEmpty(BanksSupplier) ? (
        <Button
          // context="secondary"
          color="blue"
          className="btn-sm"
          onClick={handleAddBank}
        >
          <PlusOutlined />
          &nbsp;Thêm tài khoản
        </Button>
      ) : (
        ''
      ),
    };
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [BanksSupplier]);

  const handleAddBank = () => {
    setIsShowModalAddBank(true);
  };

  const handleShowDetailBank = dataBank => {
    setBank(dataBank);
    setIsShowModalDetailBank(true);
  };

  const handleWithdrawl = dataBank => {
    setBank(dataBank);
    setIsShowModalWithdrawal(true);
  };

  const showModalUpdate = values => {
    setIsShowModalUpdateBank(true);
    setBankUpdate(values);
  };

  const handleDeleteBank = values => {
    if (values.is_default) {
      notification(
        'error',
        'Đây là tài khoản ngân hàng mặc định, vui lòng đổi mặc định sang tài khoản ngân hàng khác và thực hiện xóa',
        'Lỗi',
      );
    } else {
      dispatch(
        actions.SupplierUpdateBank({
          id: values.id,
          data: {
            status: 'inactive',
          },
        }),
      );
      setIsShowModalAddBank(false);
    }
  };

  const handleSetBankDefault = values => {
    dispatch(
      actions.SupplierUpdateBank({
        id: values.id,
        data: {
          is_default: true,
        },
      }),
    );
  };

  // if (showEmptyPage && !isLoading) {
  if (isEmpty(BanksSupplier)) {
    return (
      <PageWrapper fixWidth>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <CustomDivEmpty>
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 15 }} className="loading" />
            ) : (
              <EmptyPage style={{ height: 'calc(100vh - 200px)' }}>
                <CustomStyle className="d-flex justify-content-center">
                  <Button
                    // context="secondary"
                    color="blue"
                    className="btn-md"
                    onClick={handleAddBank}
                  >
                    <PlusOutlined />
                    &nbsp;Thêm tài khoản
                  </Button>
                </CustomStyle>
              </EmptyPage>
            )}
          </CustomDivEmpty>

          <ModalAddBank
            layout={layout}
            dataBankVN={dataBankVN}
            isShowModalAddBank={isShowModalAddBank}
            setIsShowModalAddBank={setIsShowModalAddBank}
          />
        </Spin>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper fixWidth>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <CustomSectionWrapper>
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 15 }} className="loading" />
          ) : (
            <>
              <div className="header">
                <CustomH3 className="title text-left" mb={{ xs: 's2' }}>
                  Rút tiền về ngân hàng
                </CustomH3>
                <div>
                  Vui lòng chọn tài khoản mà bạn muốn nhận tiền. Odii sẽ chuyển
                  khoản số tiền mà bạn muốn rút đến tài khoản này.
                </div>
              </div>
              <Row gutter={8}>
                <Col span={24}>
                  <>
                    {!isEmpty(BanksSupplier)
                      ? BanksSupplier.map((item, index) => (
                          <CustomBank key={index} gutter={[8, 8]}>
                            <Col xs={24} md={12} className="info-bank">
                              <div className="bank-logo">
                                <img
                                  className="logo"
                                  src={item?.bank_data?.logo?.origin}
                                  alt=""
                                />
                              </div>
                              <Row gutter={[8, 8]} style={{ width: '100%' }}>
                                <div
                                // Col xs={24} md={14}
                                >
                                  <div
                                    className="bank-title"
                                    onClick={() => handleShowDetailBank(item)}
                                  >
                                    {item?.bank_data?.title}
                                  </div>
                                  <div className="bank-sub_title">
                                    {item.sub_title}
                                  </div>
                                </div>
                                {item?.is_default ? (
                                  <div
                                    // Col xs={24} md={4}
                                    className="bank-default"
                                  >
                                    Mặc định
                                  </div>
                                ) : (
                                  <div
                                    // Col
                                    // xs={24}
                                    // md={6}
                                    className="set-bank-default"
                                    onClick={() => handleSetBankDefault(item)}
                                  >
                                    Đặt là mặc định
                                  </div>
                                )}
                              </Row>
                            </Col>
                            <Col xs={24} md={5}>
                              <div className="bank-account__name">
                                {item.account_name}
                              </div>
                              <div className="bank-account__number">
                                {item.account_number}
                              </div>
                            </Col>
                            <Col xs={24} md={7}>
                              <Space className="mt-6">
                                <Button
                                  context="secondary"
                                  className="btn-sm"
                                  color="default"
                                  style={{
                                    width: '84px',
                                    color: 'white',
                                    background: '#6C798F',
                                  }}
                                  onClick={() => handleDeleteBank(item)}
                                >
                                  Xóa
                                </Button>
                                <Button
                                  context="secondary"
                                  className="btn-sm"
                                  style={{
                                    width: '84px',
                                    outline: 'none',
                                  }}
                                  onClick={() => showModalUpdate(item)}
                                >
                                  Sửa
                                </Button>

                                <Button
                                  color="blue"
                                  className="btn-sm"
                                  style={{
                                    width: '84px',
                                  }}
                                  onClick={() => handleWithdrawl(item)}
                                >
                                  Rút tiền
                                </Button>
                              </Space>
                            </Col>
                          </CustomBank>
                        ))
                      : ''}
                  </>
                </Col>
              </Row>
            </>
          )}
        </CustomSectionWrapper>

        <ModalAddBank
          layout={layout}
          dataBankVN={dataBankVN}
          isShowModalAddBank={isShowModalAddBank}
          setIsShowModalAddBank={setIsShowModalAddBank}
        />

        <ModalUpdateBank
          layout={layout}
          dataBankVN={dataBankVN}
          isShowModalUpdateBank={isShowModalUpdateBank}
          setIsShowModalUpdateBank={setIsShowModalUpdateBank}
          bankUpdate={bankUpdate}
          setBankUpdate={setBankUpdate}
        />

        <ModalWithdrawal
          layout={layout}
          // isLoading={isLoading}
          dataBankVN={dataBankVN}
          bank={bank}
          isShowModalWithdrawal={isShowModalWithdrawal}
          setIsShowModalWithdrawal={setIsShowModalWithdrawal}
        />

        <ModalDetailBank
          layout={layout}
          // bankDefault={bankDefault}
          bank={bank}
          isShowModalDetailBank={isShowModalDetailBank}
          setIsShowModalDetailBank={setIsShowModalDetailBank}
        />
      </Spin>
    </PageWrapper>
  );
}

const CustomDivEmpty = styled.div`
  .style-1 {
    height: calc(100vh - 210px);
  }
`;

const CustomSectionWrapper = styled(SectionWrapper)`
  padding: 30px 25px;
  p {
    margin-top: 14px;
  }
  .hide {
    visibility: hidden;
  }
  .header {
    margin-bottom: 32px;
  }
  .action-wrapper {
    display: none;
    position: absolute;
    padding: 0;
    top: 50%;
    right: 0px;
    transform: translateY(-50%);
    white-space: nowrap;
    word-break: keep-all;
    > div {
      display: inline-flex;
      > button {
        margin-left: 11px;
      }
    }
    .btn-cancel {
      background: #fff;
      &:hover {
        color: #fff;
        background: red;
      }
    }
  }
  tr:hover {
    .action-wrapper {
      display: inline-flex;
    }
  }
`;
