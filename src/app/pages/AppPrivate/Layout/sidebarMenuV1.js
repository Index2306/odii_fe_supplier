import React, { useMemo, useState, useEffect } from 'react';
import { Menu, Modal } from 'antd';
import { useHistory } from 'react-router-dom';
import { Link, Button } from 'app/components';
import { menus, menusCSKH } from './constants';
// import Icon from '@ant-design/icons';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectRoles } from '../slice/selectors';
import constants from 'assets/constants';
import { CustomStyle } from 'styles/commons';
import { shouldVerify } from 'assets/images/dashboards';
import { isEmpty } from 'lodash';

const { roles } = constants;
const { SubMenu } = Menu;

const menuKeyList = [];
(function getKeyList(arr, parent) {
  arr.forEach(item => {
    menuKeyList.push({ current: item.link || item.name, parent });
    if (item.subMenus) {
      getKeyList(item.subMenus, item.name);
    }
  });
})(menus);

function getMatchKey(pathname) {
  for (let i = 0; i < menuKeyList.length; i++) {
    if (pathname.startsWith(menuKeyList[i].current)) {
      return menuKeyList[i];
    }
  }
  return {};
}

export function SidebarMenu() {
  const history = useHistory();

  const currentUser = useSelector(selectCurrentUser);
  const currentUserRoles = useSelector(selectRoles);
  const [state, setState] = useState({ matchKey: '', defaultOpen: '' });

  const [isSupplier, setIsSupplier] = useState('');
  const [isShowModal, setIsShowModal] = useState('');

  useEffect(() => {
    const { current, parent } = getMatchKey(window.location.pathname);
    setState({ matchKey: current, defaultOpen: parent });
  }, [window.location.pathname]);

  const { matchKey, defaultOpen } = state;

  const filteredMenu = useMemo(() => {
    function hasAccessByRoles(requiredRoles) {
      if (!requiredRoles || currentUserRoles?.includes(roles.superAdmin))
        return true;
      for (let i = 0; i < requiredRoles.length; i++) {
        if (currentUserRoles.includes(requiredRoles[i])) {
          return true;
        }
      }
      return false;
    }
    const copiedMenuList = menus.filter(item => {
      return hasAccessByRoles(item.requiredRoles);
    });
    copiedMenuList.forEach(item => {
      if (item.subMenus) {
        item.subMenus = [...item.subMenus].filter(item => {
          return hasAccessByRoles(item.requiredRoles);
        });
      }
    });
    return copiedMenuList;
  }, [currentUserRoles]);

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
    history.push({
      pathname: '/infobusiness',
    });
  };

  const onCancel = () => {
    setIsShowModal(false);
  };

  return (
    <>
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
          Rất tiếc, bạn không thể sử dụng tính năng này vì tài khoản của bạn
          chưa cung cấp và xác thực thông tin doanh nghiệp.
        </div>
        <Button
          type="primary"
          className="btn-md modal__btn"
          onClick={goSupplierSetting}
        >
          Đến trang thông tin doanh nghiệp
        </Button>
      </CustomModal>
      <CustomerMenu
        mode="inline"
        // defaultOpenKeys={[defaultOpen]}
        openKeys={[defaultOpen]}
        style={{ height: '100%' }}
        // defaultSelectedKeys={[matchKey]}
        selectedKeys={[matchKey]}
      >
        {filteredMenu.map(item => {
          if (item.subMenus) {
            return (
              <SubMenu
                key={item.name}
                img={<img src={item.icon} alt="" />}
                title={item.name}
              >
                {item.subMenus.map(childItem => {
                  return (
                    <Menu.Item
                      key={childItem.link}
                      icon={
                        childItem.icon ? (
                          <img src={childItem.icon} alt="" />
                        ) : undefined
                      }
                    >
                      <Link to={childItem.link}>{childItem.name}</Link>
                    </Menu.Item>
                  );
                })}
              </SubMenu>
            );
          } else {
            return (
              <Menu.Item
                key={item.link}
                icon={item.icon ? <img src={item.icon} alt="" /> : undefined}
              >
                {isSupplier ? (
                  <Link to={item.link}>{item.name}</Link>
                ) : (
                  <div onClick={() => setIsShowModal(true)}>{item.name}</div>
                )}
              </Menu.Item>
            );
          }
        })}
        <Menu.Item title="122" className="menu-footer item-version">
          <CustomStyle fontWeight="medium" color="primary">
            Phiên bản: {process.env.REACT_APP_VERSION_APP}
          </CustomStyle>
        </Menu.Item>
        {menusCSKH.map(item => {
          return (
            <Menu.Item
              key={item.link}
              icon={item.icon ? <img src={item.icon} alt="" /> : undefined}
              title={item.name}
              className={
                item.key === 1
                  ? 'menu-footer item-cskh'
                  : 'menu-footer item-mess'
              }
            >
              <a href={item.link} target="blank">
                {item.name}
              </a>
            </Menu.Item>
          );
        })}
      </CustomerMenu>
    </>
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
      font-size: 16px;
      line-height: 22px;
      font-weight: 400;
      margin-top: 6px;
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

const CustomerMenu = styled(Menu)`
  height: 100%;
  overflow: auto;
  position: relative;
  a,
  .ant-menu-item,
  .ant-menu-submenu-title {
    /* color: red; */
    color: ${({ theme }) => theme.grayBlue};
    :hover {
      /* font-weight: 500; */
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
  .menu-footer {
    background: #fff;
    position: absolute;
  }
  .item-version {
    bottom: 152px;
  }
  .item-cskh {
    bottom: 112px;
  }
  .item-mess {
    bottom: 72px;
    border-top: 1px solid #ebebf0;
  }
`;
