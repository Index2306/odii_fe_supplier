/**
 *
 * InfoBusiness
 *
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Tabs, Skeleton } from 'antd';
import { PageWrapper } from 'app/components';
import { useInfoBusinessSlice } from './slice';
import { selectLoading, selectDataRegisterSupplier } from './slice/selectors';
// import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { messages } from './messages';
import styled from 'styled-components';
import constants from 'assets/constants';
import {
  InfoPay,
  InfoSupplier,
  Warehouse,
  Setting,
  ProductSource,
} from './ComponentsTab';
import { isEmpty } from 'lodash';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
const { TabPane } = Tabs;

const { roles } = constants;

export function InfoBusiness({ history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useInfoBusinessSlice();
  const isLoading = useSelector(selectLoading);
  const currentUser = useSelector(selectCurrentUser);
  const data = useSelector(selectDataRegisterSupplier);
  const [tab, setTabs] = useState(
    localStorage.getItem('ViewtabproductSource')
      ? localStorage.getItem('ViewtabproductSource')
      : 'list',
  );

  // const [isSupplier, setIsSupplier] = useState('');

  useEffect(() => {
    dispatch(actions.getDataRegisterSupplier({}));
    // return (
    // dispatch(actions.getDone({}));
    // )
  }, []);

  return (
    <>
      <CustomPageWrapper fixWidth>
        <Spin tip="Đang tải..." spinning={isLoading}>
          {currentUser?.roles?.includes(roles.owner) ? (
            <>
              <div className="title">{t(messages.title())}</div>
              <Tabs
                defaultActiveKey={tab}
                onChange={value =>
                  localStorage.setItem('ViewtabproductSource', value)
                }
              >
                <TabPane tab="Thông tin NCC" key="1">
                  <InfoSupplier
                    data={data}
                    isLoading={isLoading}
                  ></InfoSupplier>
                </TabPane>
                {!isEmpty(data?.supplier_warehousing_data) && (
                  <TabPane tab="Kho hàng" key="2">
                    <Warehouse data={data} isLoading={isLoading}></Warehouse>
                  </TabPane>
                )}
                <TabPane tab="Thông tin thanh toán" key="3">
                  <InfoPay data={data} isLoading={isLoading}></InfoPay>
                </TabPane>
                <TabPane tab="Thiết lập" key="4">
                  <Setting data={data} isLoading={isLoading}></Setting>
                </TabPane>
                <TabPane tab="Nguồn hàng" key="5">
                  <ProductSource isLoading={isLoading}></ProductSource>
                </TabPane>
              </Tabs>
            </>
          ) : null}
        </Spin>
      </CustomPageWrapper>
    </>
  );
}
const CustomPageWrapper = styled(PageWrapper)`
  .ant-tabs-nav {
    /* padding: 0 20px 24px; */
  }
  .ant-tabs-tab {
    padding: 0 0 12px;
    color: #6c798f;
  }

  .title {
    font-weight: 900;
    font-size: 22px;
    line-height: 26px;
    color: #3d56a6;
    margin-bottom: 24px;
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #3d56a6;
  }
  .ant-tabs-ink-bar.ant-tabs-ink-bar-animated {
    height: 4px;
    background: #435ebe;
    border-radius: 6px 6px 0px 0px;
  }
`;
