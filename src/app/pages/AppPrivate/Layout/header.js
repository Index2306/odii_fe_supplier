import React from 'react';
import { Layout } from 'antd';
import HeaderContent from 'app/components/Header';
import styled from 'styled-components';
import { CustomStyle } from 'styles/commons';
import { StyleConstants } from 'styles/StyleConstants';
import {
  // MenuUnfoldOutlined,
  // MenuFoldOutlined,
  MenuOutlined,
} from '@ant-design/icons';
const { Header } = Layout;
export default function HeaderBar({ setSidebarCollapsed, sidebarIsCollapsed }) {
  return (
    <CustomHeader
      className="site-layout-sub-header-background d-flex justify-content-between align-items-center"
      sidebarIsCollapsed={sidebarIsCollapsed}
    >
      <CustomStyle
        ml={{ xs: 's6' }}
        fontSize={{ xs: 'f6' }}
        color="grayBlue"
        className="header-icon-menu"
      >
        {sidebarIsCollapsed ? (
          <MenuOutlined
            className="trigger"
            onClick={() => setSidebarCollapsed(false)}
          />
        ) : (
          <MenuOutlined
            className="trigger"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
      </CustomStyle>
      <HeaderContent />
    </CustomHeader>
  );
}
const CustomHeader = styled(Header)`
  background: #fff;
  padding: 0;
  z-index: 100;
  box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.05);
  /* box-shadow: 0px 2px 8px #f0f1f2; */
  position: fixed;
  right: 0;
  left: ${({ sidebarIsCollapsed }) =>
    sidebarIsCollapsed ? 65 : StyleConstants.sidebarWidth}px;
  .header-icon-menu {
    width: 40px;
    height: 40px;
    &:hover {
      background-color: #dfe1e4;
      border-radius: 50%;
    }
    .anticon-menu {
      margin-top: 8px;
      display: block;
    }
  }
`;
