import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
// import { formatMoney } from 'utils/helpers';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { useTranslation } from 'react-i18next';
import { Row, Col, Spin, Menu, Skeleton } from 'antd';
import { selectLoading } from '../../slice/selectors';
import {
  WalletOutlined,
  DollarOutlined,
  BankOutlined,
} from '@ant-design/icons';
import {
  PageWrapper,
  Form,
  //  LoadingIndicator
} from 'app/components';
import { SectionWrapper, CustomH3 } from 'styles/commons';
import Bank from './byBank';

export function Deposit({ match, history }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);
  const [selectedKeyType, setSelectedKeyType] = useState(1);

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
    };
  }, []);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Ví của tôi',
          link: '/mywallet',
        },
        {
          name: 'Nạp tiền',
        },
      ],
      fixWidth: true,
      title: 'Nạp tiền',
    };
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, []);

  return (
    <PageWrapper fixWidth>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Form form={form} name="form-info" className="" onFinish="">
          <>
            <CustomRow gutter={24}>
              <Col xs={24} xl={6} className="col left">
                <CustomSectionWrapperType>
                  {isLoading ? (
                    <Skeleton active paragraph={{ rows: 7 }} />
                  ) : (
                    <>
                      <CustomH3 mb={{ xs: 's4' }}>Hình thức nạp tiền</CustomH3>
                      <Menu
                        mode="inline"
                        defaultSelectedKeys="1"
                        style={{ height: '100%' }}
                      >
                        <Menu.Item
                          key="1"
                          icon={<DollarOutlined />}
                          onClick={() => {
                            setSelectedKeyType(1);
                          }}
                        >
                          {t('mywallet.transaction.bank')}
                        </Menu.Item>
                        <Menu.Item
                          key="2"
                          icon={<WalletOutlined />}
                          onClick={() => {
                            setSelectedKeyType(2);
                          }}
                          disabled
                        >
                          {t('mywallet.transaction.wallet')}
                        </Menu.Item>
                        <Menu.Item
                          key="3"
                          icon={<BankOutlined />}
                          onClick={() => {
                            setSelectedKeyType(3);
                          }}
                          disabled
                        >
                          {t('mywallet.transaction.atm')}&ensp;/&ensp;
                          {t('mywallet.transaction.cardvisit')}
                        </Menu.Item>
                      </Menu>
                    </>
                  )}
                </CustomSectionWrapperType>
                <CustomSectionWrapperCSKH>
                  {isLoading ? (
                    <Skeleton active paragraph={{ rows: 0 }} />
                  ) : (
                    <>
                      <div className="title">Tổng đài hỗ trợ</div>
                      <div className="phone-CSKH">1900 0000</div>
                    </>
                  )}
                </CustomSectionWrapperCSKH>
              </Col>
              <Col xs={24} xl={14} className="col">
                <Bank />
              </Col>
            </CustomRow>
          </>
        </Form>
      </Spin>
    </PageWrapper>
  );
}

const CustomSectionWrapperType = styled(SectionWrapper)`
  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: none;
  }
  .ant-menu-item {
    height: 65px;
    background: white !important;
    box-sizing: border-box;
    border-radius: 6px;
    border: 1px solid #ebebf0;
    .ant-menu-title-content {
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      color: #4f4f4f;
    }
    .anticon {
      svg {
        color: #bdbec0;
        width: 20px;
        height: 20px;
      }
    }
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    &-selected {
      border: 2px solid #3d56a6;
      ::before {
        content: '';
        position: absolute;
        left: 0px;
        width: 4px;
        height: 37px;
        background: #3d56a6;
        border-radius: 0px 6px 6px 0px;
      }
      ::after {
        display: none;
      }
      .ant-menu-title-content {
        color: #29418e;
      }
      .anticon {
        svg {
          color: #3d56a6;
        }
      }
    }
  }
`;

const CustomSectionWrapperCSKH = styled(SectionWrapper)`
  display: flex;
  justify-content: space-between;
  padding: 21px 20px;
  .title {
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    color: #4f4f4f;
  }
  .phone-CSKH {
    font-weight: bold;
    font-size: 18px;
    line-height: 18px;
    color: #f2994a;
  }
`;

const CustomRow = styled(Row)`
  .col {
    padding-left: unset !important;
    padding-right: unset !important;
  }
  .left {
    margin-right: 20px;
    min-width: 316px;
  }
`;
