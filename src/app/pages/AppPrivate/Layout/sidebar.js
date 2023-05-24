import React from 'react';
import { Layout } from 'antd';
import { logo, logoSmall } from 'assets/images';
import { SidebarMenu } from './sidebarMenuV2';
import { StyleConstants } from 'styles/StyleConstants';
import { styledSystem } from 'styles/theme/utils';
// import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../slice/selectors';

const { Sider } = Layout;
export default function AppSidebar({
  setSidebarCollapsed,
  sidebarIsCollapsed,
}) {
  const currentUser = useSelector(selectCurrentUser);
  return (
    <CustomSider
      collapsedWidth={'65'}
      breakpoint="lg"
      collapsible
      collapsed={sidebarIsCollapsed}
      width={StyleConstants.sidebarWidth}
      theme="light"
      onCollapse={isCollapsed => {
        setSidebarCollapsed(isCollapsed);
      }}
      reverseArrow
      trigger={null}
      // trigger={
      //   sidebarIsCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
      // }
    >
      <LogoWrapper
        sidebarIsCollapsed={sidebarIsCollapsed}
        // className="d-flex align-items-center"
      >
        <Link
          to={currentUser?.supplier_status === 'active' ? `/dashboard` : '/'}
        >
          <img src={sidebarIsCollapsed ? logoSmall : logo} alt="logo" />
        </Link>
      </LogoWrapper>
      <SidebarMenu sidebarIsCollapsed={sidebarIsCollapsed} />
    </CustomSider>
  );
}

const CustomSider = styledSystem(styled(Sider)`
  /* background: #fff; */
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.95) 100%
  );
  border: 1px solid #ebebf0;

  position: fixed;
  height: 100vh;
  z-index: 1;
  left: 0;
  & img {
    width: 100%;
    max-width: 120px;
    height: 40px;
  }
`);

const LogoWrapper = styled.div`
  height: 64px;
  transition: margin 0.2s ease-out;
  margin: ${({ sidebarIsCollapsed }) =>
    sidebarIsCollapsed ? '13px 6px 0' : '12px 12px 0'};
`;
