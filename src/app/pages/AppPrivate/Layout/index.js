import React, { useState } from 'react';
import { Layout } from 'antd';
import SideBar from './sidebar';
import HeaderBar from './header';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';

const { Content } = Layout;
export function AppLayout(props) {
  const [sidebarIsCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <Layout>
      <SideBar
        setSidebarCollapsed={setSidebarCollapsed}
        sidebarIsCollapsed={sidebarIsCollapsed}
      />
      <InnerLayout sidebarIsCollapsed={sidebarIsCollapsed}>
        <HeaderBar
          setSidebarCollapsed={setSidebarCollapsed}
          sidebarIsCollapsed={sidebarIsCollapsed}
        />
        <CustomerContent>{props.children}</CustomerContent>
        {/* <Footer className="text-center">©2021 Created by Odii</Footer> */}
      </InnerLayout>
    </Layout>
  );
}

const InnerLayout = styled(Layout)`
  margin-left: ${props =>
    props.sidebarIsCollapsed ? 65 : StyleConstants.sidebarWidth}px;
  transition: margin-left 0.1s ease-out;
  background-color: ${({ theme }) => theme.backgroundBlue};
`;
const CustomerContent = styled(Content)`
  min-height: 100vh;
  margin-top: 64px;
`;
