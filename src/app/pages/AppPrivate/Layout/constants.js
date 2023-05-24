import {
  dashboard,
  order,
  product,
  // warehouse,
  employee,
  cskh,
  messenger,
  // cart,
  wallet,
  revenue,
} from 'assets/images/icons';

import constants from 'assets/constants';
const { roles } = constants;

export const MENU_GROUP = {
  ACCOUNTANT: {
    key: 'accountant',
    title: 'KẾ TOÁN',
  },
};

export const menus = [
  {
    name: 'Tổng quan',
    icon: dashboard,
    link: '/dashboard',
    requiredRoles: [roles.owner, roles.superAdmin],
  },
  {
    name: 'Đơn hàng',
    icon: order,
    link: '/orders',
    requiredRoles: [
      roles.partnerOrder,
      roles.owner,
      roles.partnerSource,
      roles.superAdmin,
    ],
  },
  {
    name: 'Sản phẩm',
    icon: product,
    link: '/products',
    requiredRoles: [
      roles.partnerProduct,
      roles.owner,
      roles.partnerSource,
      roles.superAdmin,
    ],
  },
  {
    name: 'Báo cáo & phân tích',
    icon: dashboard,
    link: '/report',
    requiredRoles: [roles.partnerProduct, roles.owner, roles.superAdmin],
  },
  {
    name: 'Nhân viên',
    icon: employee,
    link: '/employees',
    requiredRoles: [roles.partnerMember, roles.owner, roles.superAdmin],
  },
  {
    name: 'Chương trình KM',
    icon: revenue,
    link: '/promotion',
    requiredRoles: [
      roles.partnerProduct,
      roles.owner,
      roles.partnerSource,
      roles.superAdmin,
    ],
  },
  {
    name: 'Tài chính',
    subMenus: [
      {
        name: 'Ví của tôi',
        icon: wallet,
        link: '/mywallet',
        requiredRoles: [roles.partnerBalance, roles.owner, roles.superAdmin],
      },
      // {
      //   name: 'Doanh thu',
      //   icon: wallet,
      //   link: '/revenue',
      //   requiredRoles: [roles.partnerBalance, roles.owner, roles.superAdmin],
      // },
      {
        name: 'Tổng quan công nợ',
        icon: dashboard,
        link: '/accountant/debt-overview',
        requiredRoles: [roles.partnerBalance, roles.owner, roles.superAdmin],
        group: MENU_GROUP.ACCOUNTANT,
      },
    ],
  },
  {
    name: 'Kho vận',
    subMenus: [
      {
        name: 'Phân bổ sản phẩm',
        icon: product,
        link: '/distribution',
        requiredRoles: [
          roles.partnerProduct,
          roles.owner,
          roles.superAdmin,
          roles.partnerChiefWarehouse,
        ],
      },
      {
        name: 'Nhập kho',
        icon: wallet,
        link: '/logistics/import',
        requiredRoles: [
          roles.owner,
          roles.superAdmin,
          roles.partnerWarehouse,
          roles.partnerChiefWarehouse,
        ],
      },
      {
        name: 'Xuất kho',
        icon: dashboard,
        link: '/export',
        requiredRoles: [
          roles.owner,
          roles.superAdmin,
          roles.partnerWarehouse,
          roles.partnerChiefWarehouse,
        ],
      },
    ],
  },
];

export const menusCSKH = [
  {
    key: 1,
    name: 'Trung tâm trợ giúp',
    icon: cskh,
    link: 'https://odii.asia/trung-tam-tro-giup',
  },
  {
    key: 2,
    name: 'Nhắn tin Messenger',
    icon: messenger,
    link: 'https://www.facebook.com/Odiiplatform',
  },
];
