/**
 * Menu sidebar tối giản theo design
 * Tối da 2 cấp.
 * Nếu có 2 cấp thì cấp 1 hay parent sẽ chỉ là title not link.
 */
import React, { useMemo, useState, useEffect } from 'react';
import { Divider, Menu, Modal } from 'antd';
import { Link, Button } from 'app/components';
import { useHistory } from 'react-router-dom';
import { menus, menusCSKH } from './constants';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectRoles } from '../slice/selectors';
import { isEmpty } from 'lodash';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { shouldVerify } from 'assets/images/dashboards';
// import { CustomStyle } from 'styles/commons';

export function SidebarMenu({ sidebarIsCollapsed }) {
  const history = useHistory();
  const userRoles = useSelector(selectRoles);
  const currentUser = useSelector(selectCurrentUser);

  const [isSupplier, setIsSupplier] = useState('');
  const [isShowModal, setIsShowModal] = useState('');

  useEffect(() => {
    if (!isEmpty(currentUser)) {
      if (currentUser?.supplier_status === 'active') {
        setIsSupplier(true);
      } else {
        setIsSupplier(false);
      }
    }
  }, [currentUser]);

  const goSupplierSetting = () => {
    setIsShowModal(false);
    history.push({
      pathname: '/infobusiness',
    });
  };

  const onCancel = () => {
    setIsShowModal(false);
  };

  function getMathMenuItem(pathname, menuItems) {
    let mathMenuItem;
    for (let menuItem of menuItems) {
      const subMenus = menuItem.subMenus;
      if (subMenus) {
        mathMenuItem = getMathMenuItem(pathname, subMenus);
      }
      if (mathMenuItem) {
        return mathMenuItem;
      }
      // not have subMenu
      const menuItemPath = menuItem.link || menuItem.name;
      if (pathname.startsWith(menuItemPath)) {
        return menuItemPath;
      }
    }
    return '';
  }

  const hasAuthor = menu => {
    const requiredRoles = menu.requiredRoles;
    return (
      !requiredRoles ||
      userRoles.some(userRole => requiredRoles.includes(userRole))
    );
  };

  const matchKey = useMemo(
    () => getMathMenuItem(window.location.pathname, menus),
    [window.location.pathname],
  );

  const authMenu = useMemo(() => {
    const result = [];
    for (let menuItem of menus) {
      const subMenus = menuItem.subMenus;
      if (!hasAuthor(menuItem) || menuItem.ignore) {
        continue;
      }
      if (subMenus) {
        const subAuthMenu = subMenus.filter(subMenu => hasAuthor(subMenu));
        if (subAuthMenu.length) {
          const parentMenu = { name: menuItem.name, subMenus: subAuthMenu };
          result.push(parentMenu);
        }
      } else {
        const menu = {
          name: menuItem.name,
          icon: menuItem.icon,
          link: menuItem.link,
        };
        result.push(menu);
      }
    }
    return result;
  }, [userRoles]);

  return (
    <Wrapper className="d-flex flex-column">
      <CustomModal
        name="modal"
        footer={null}
        visible={isShowModal}
        onCancel={onCancel}
      >
        <div className="modal__img-flower">
          <img src={shouldVerify} alt="" />
        </div>
        <div className="modal__title">Hãy xác thực doanh nghiệp</div>
        <div className="modal__desc">
          Rất tiếc, bạn chưa thể sử dụng tính năng này !
          {/* vì tài khoản của bạn chưa được xác thực!  */}
          <br />
          Nếu bạn đã cung cấp thông tin doanh nghiệp, vui lòng đợi phản hồi từ
          chúng tôi. Nếu chưa, vui lòng cung cấp thông tin xác thực doanh
          nghiệp.
        </div>
        <Button
          type="primary"
          className="btn-md modal__btn"
          onClick={goSupplierSetting}
        >
          Đến trang thông tin doanh nghiệp
        </Button>
      </CustomModal>
      <CustomMenu
        mode="inline"
        style={{ height: '100%' }}
        selectedKeys={[matchKey]}
      >
        {authMenu.map(item => {
          const subMenus = item.subMenus;
          const menuItems = subMenus || [item];
          return (
            <>
              {subMenus && (
                <li className="menu-parent">
                  {sidebarIsCollapsed ? <CustomDivider /> : item.name}
                </li>
              )}
              {menuItems.map(menuItem => {
                return isSupplier ? (
                  <Menu.Item
                    key={menuItem.link}
                    icon={menuItem.icon && <img src={menuItem.icon} alt="" />}
                  >
                    <Link to={menuItem.link}>{menuItem.name}</Link>
                  </Menu.Item>
                ) : (
                  // : menuItem.name === 'Tổng quan' ? (
                  //   <Menu.Item
                  //     key={menuItem.link}
                  //     icon={menuItem.icon && <img src={menuItem.icon} alt="" />}
                  //   >
                  //     <Link to={menuItem.link}>{menuItem.name}</Link>
                  //   </Menu.Item>
                  // )
                  <Menu.Item
                    key={menuItem.link}
                    icon={menuItem.icon && <img src={menuItem.icon} alt="" />}
                    onClick={() => setIsShowModal(true)}
                  >
                    {menuItem.name}
                  </Menu.Item>
                );
              })}
            </>
          );
        })}
      </CustomMenu>
      <CustomMenuFooter>
        {menusCSKH.map(item => {
          return (
            <Menu.Item
              key={item.link}
              icon={item.icon ? <img src={item.icon} alt="" /> : undefined}
              title={item.name}
              className="menu-footer"
            >
              <a href={item.link} target="blank">
                {item.name}
              </a>
            </Menu.Item>
          );
        })}
      </CustomMenuFooter>
    </Wrapper>
  );
}

const CustomModal = styled(Modal)`
  text-align: center;
  .ant-modal-content {
    width: 480px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.07);
    border-radius: 8px;
  }
  .ant-modal-body {
    padding: 36px 48px;
  }
  .modal {
    &__img-flower {
      width: 190px;
      height: 75px;
      margin: auto;
      img {
        width: 100%;
        height: auto;
      }
    }
    &__title {
      font-weight: bold;
      font-size: 20px;
      line-height: 24px;
      margin-top: 26px;
    }
    &__desc {
      font-size: 14px;
      line-height: 18px;
      font-weight: 400;
      color: #767676;
      margin-top: 12px;
    }
    &__btn {
      margin: auto;
      margin-top: 40px;
    }
    &__btn-skip {
      margin: auto;
      margin-top: 20px;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #3d56a6;
      cursor: pointer;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  height: calc(100% - 64px);
  flex-direction: column;

  > :first-child {
    flex: 1;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: scroll;
  }
`;

const CustomMenu = styled(Menu)`
  a,
  .ant-menu-item,
  .ant-menu-submenu-title {
    color: ${({ theme }) => theme.grayBlue};
    :hover {
      color: ${({ theme }) => theme.primary};
    }
  }
  :not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color: ${({ theme }) => theme.backgroundBlue};
    color: ${({ theme }) => theme.primary};
    font-weight: 500;
    a {
      color: ${({ theme }) => theme.primary};
    }
  }
  .ant-menu-item::after {
    display: none;
  }
  .ant-menu-item {
    height: 45px;
    text-decoration: none;
    &-icon {
      width: 22px;
    }
    a {
      text-decoration: none;
    }
  }
  .ant-menu-item-selected {
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: #3d56a6;
    &::before {
      content: '';
      width: 4px;
      height: 45px;
      position: absolute;
      left: 0px;
      background: #3d56a6;
      border-radius: 0px 6px 6px 0px;
    }
  }
  .menu-parent {
    color: #bdbdbd;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 13px;
    letter-spacing: 0.02rem;
    padding-top: 2px;
    padding-left: 24px;
    height: 45px;
    display: flex;
    align-items: center;
  }
`;

const CustomMenuFooter = styled(Menu)`
  a,
  .ant-menu-item,
  .ant-menu-submenu-title {
    color: ${({ theme }) => theme.grayBlue};
    :hover {
      color: ${({ theme }) => theme.primary};
    }
  }
  .ant-menu-item::after {
    display: none;
  }
  .ant-menu-item {
    height: 45px;
    text-decoration: none;
    &-icon {
      width: 22px;
    }
    a {
      text-decoration: none;
    }
  }
  .ant-menu-item-selected {
    background-color: #ffffff !important;
  }
  .menu-footer {
    background: #fff;
    padding: 0 24px;
    margin-top: 0;
    margin-bottom: 0;
    &:first-child {
      margin-top: 0;
      margin-bottom: 0;
    }
    &:last-child {
      border-top: 1px solid #ebebf0;
      margin-bottom: 8px;
    }
  }
`;

const CustomDivider = styled(Divider)`
  margin: 15px -9px;
  border-top: 3px solid rgba(0, 0, 0, 0.3);
`;
