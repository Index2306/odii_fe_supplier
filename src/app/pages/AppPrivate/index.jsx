/**
 *
 * AppPrivate
 *
 */
import React, { memo, useMemo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from 'app/components';
import { isEmpty } from 'lodash';
import { isAdmin } from 'utils/helpers';
import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { selectRoles } from 'app/pages/AppPrivate/slice/selectors';
import { menus } from 'app/pages/AppPrivate/Layout/constants';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { AppLayout } from './Layout';
import { NotFoundPage, Incoming } from 'app/components';
import { Orders } from 'app/pages/Orders/Loadable';
import { UpdateOrder } from 'app/pages/Orders/Features/Update/Loadable';
import AuthRoute from './AuthRoute';
import { HomePage } from '../HomePage/Loadable';
import { Dashboard } from '../Dashboard/Loadable';
import { Products } from '../Products/Loadable';
import { Employees } from '../Employees/Loadable';
import { DetailEmployee } from '../Employees/Features/Detail/Loadable';
import { Categories } from '../Categories/Loadable';
import { DetailProducts } from '../Products/Features/Detail/Loadable';
import { DetailCategories } from '../Categories/Features/Detail/Loadable';
import { CreateAndUpdateProducts } from '../Products/Features/CreateAndUpdate/Loadable';
import { UpdateCategories } from '../Categories/Features/CreateAndUpdate/Loadable';
import { CreateCategories } from '../Categories/Features/CreateAndUpdate/Loadable';
import { Warehousing } from 'app/pages/Warehousing/Loadable';
import { CreateAndUpdateWarehousing } from 'app/pages/Warehousing/Features/CreateAndUpdate/Loadable';
import { MyProfile } from '../MyProfile/Loadable';
import { InfoBusiness } from '../InfoBusiness/Loadable';

import { MyWallet } from '../MyWallet/Loadable';
import { Report } from '../Report/Loadable';
import { DetailTransaction } from '../MyWallet/Features/Detail/Loadable';
import { DepositMoney } from '../MyWallet/Features/DepositMoney/Loadable';
import { WithdrawalMoney } from '../MyWallet/Features/WithdrawalMoney/Loadable';

import { Revenue } from '../Revenue/Loadable';
import { DetailRevenue } from '../Revenue/Features/Detail/Loadable';

import { selectLoading } from './slice/selectors';

import { UserDebtDetail } from '../Accountant/AccountDebtPeriodOverview/Features/UserDebtDetail/Loadable';
import { AccountantPeriodOverviewDetailTransaction } from '../Accountant/AccountDebtPeriodOverview/Features/DetailTransaction/Loadable';
import { AccountDebtByPeriod } from '../Accountant/AccountDebtByPeriod/Loadable';
import { AccountPartnership } from '../Accountant/AccountPartnership/Loadable';
import { DetailAccountPartnership } from '../Accountant/AccountPartnership/Features/Detail/Loadable';
import { ListOrderSeller } from '../Accountant/AccountPartnership/Features/ListOrderSeller/Loadable';
import { AccountDebtPeriodOverview } from '../Accountant/AccountDebtPeriodOverview/Loadable';
import { AccountantHandleDeposit } from '../Accountant/AccountantHandleDeposit/Loadable';
import { DetailAccountantHandleDeposit } from '../Accountant/AccountantHandleDeposit/Features/Detail/Loadable';
import { AccountantHandleWithdrawal } from '../Accountant/AccountantHandleWithdrawal/Loadable';
import { DetailAccountantHandleWithdrawal } from '../Accountant/AccountantHandleWithdrawal/Features/Detail/Loadable';
import { DetailTransactionAcountant } from '../Accountant/Transactions/Features/Detail/Loadable';
import { Transactions } from '../Accountant/Transactions/Loadable';
import { CreateAndUpdateSource } from '../ProductSource/Features/CreateAndUpdate/Loadable';
import { Promotion } from '../Promotion/Loadable';
import { Detail } from '../Promotion/features/Detail';
import { LogisticsImport } from '../Logistics/Loadable';
import { LogisticsExport } from '../Export/Loadable';
import { LogisticsImportDetail } from '../Logistics/Features/Detail';
import { LogisticsExportDetail } from '../Export/Features/Detail';
import { Distribution } from '../Distribution/Loadable';
import { CreateAndUpdateDistribution } from '../Distribution/Features/CreateAndUpdate/Loadable';

const lists = [
  {
    path: '/',
    title: 'home',
    Component: HomePage,
  },
  {
    path: '/transactions/list',
    title: 'transaction.list',
    Component: HomePage,
  },
  {
    path: '/transactions/verify',
    title: 'transaction.verify',
    Component: HomePage,
  },
  {
    path: '/transactions',
    title: 'transaction.list',
    Component: Transactions,
  },
  {
    path: '/transactions/:id/detail',
    title: 'transaction.detail',
    Component: DetailTransactionAcountant,
  },
  {
    path: '/accountant/deposit',
    title: 'accountant.listDeposit',
    Component: AccountantHandleDeposit,
  },
  {
    path: '/accountant/deposit/:id/detail',
    title: 'accountant.detail',
    Component: DetailAccountantHandleDeposit,
  },
  {
    path: '/accountant/withdrawal',
    title: 'accountant.listWithdrawal',
    Component: AccountantHandleWithdrawal,
  },
  {
    path: '/accountant/withdrawal/:id/detail',
    title: 'accountant.detail',
    Component: DetailAccountantHandleWithdrawal,
  },
  {
    path: '/accountant/debt-overview',
    title: 'accountant.debtOverview',
    Component: AccountDebtPeriodOverview,
  },
  {
    path: '/accountant/detail-user-debt',
    // path: '/accountant/debt-overview/detailperiod/:id/list',
    title: 'accountant.UserDebtDetail',
    Component: UserDebtDetail,
  },
  {
    path: '/accountant/detail-debt-transaction/:id',
    title: 'accountant.detail',
    Component: AccountantPeriodOverviewDetailTransaction,
  },
  {
    path: '/accountant/detail-period',
    title: 'accountant.debtOverview',
    Component: AccountDebtByPeriod,
  },
  {
    path: '/accountant/detail-period',
    title: 'accountant.debtOverview',
    Component: AccountDebtByPeriod,
  },
  {
    path: '/accountant/partnership',
    title: 'accountant.partnership.title',
    Component: AccountPartnership,
  },
  {
    path: '/accountant/partnership/:id/detail',
    title: 'accountant.partnership.detail',
    Component: DetailAccountPartnership,
  },
  {
    path: '/accountant/partnership/:id/:key/listorder',
    title: 'accountant.partnership.listorder',
    Component: ListOrderSeller,
  },
  {
    path: '/warehousing',
    title: 'Kho hàng',
    Component: Warehousing,
  },
  {
    path: '/warehousing/uc/:id?',
    title: 'Kho hàng',
    Component: CreateAndUpdateWarehousing,
  },
  {
    path: '/source/uc/:id?',
    title: 'source_product.title',
    Component: CreateAndUpdateSource,
  },
  {
    path: '/products',
    title: 'product.list',
    Component: Products,
  },
  {
    path: '/products/Detail/:id',
    title: 'product.detail',
    Component: DetailProducts,
  },
  {
    path: '/products/uc/:id?',
    title: 'product.update',
    Component: CreateAndUpdateProducts,
  },
  {
    path: '/promotion',
    title: 'promotion.list',
    Component: Promotion,
  },
  {
    path: '/promotion/detail/:id',
    title: 'promotion.detail',
    Component: Detail,
  },
  {
    path: '/orders',
    title: 'order.list',
    Component: Orders,
  },
  {
    path: '/orders/update/:id',
    title: 'order.detail',
    Component: UpdateOrder,
  },
  {
    path: '/categories',
    title: 'category.list',
    Component: Categories,
  },
  {
    path: '/categories/Detail/:id',
    title: 'category.detail',
    Component: DetailCategories,
  },
  {
    path: '/categories/uc',
    title: 'category.create',
    Component: CreateCategories,
  },
  {
    path: '/categories/uc/:id?',
    title: 'category.update',
    Component: UpdateCategories,
  },
  {
    path: '/myprofile',
    title: 'myprofile.info',
    Component: MyProfile,
  },
  {
    path: '/infobusiness',
    title: 'infobusiness.info',
    Component: InfoBusiness,
  },
  {
    path: '/mywallet',
    title: 'mywallet.list',
    Component: MyWallet,
  },
  {
    path: '/report',
    title: 'report.detail',
    Component: Report,
  },
  {
    path: '/mywallet/:id/detail',
    title: 'mywallet.detail',
    Component: DetailTransaction,
  },
  {
    path: '/mywallet/deposit',
    title: 'mywallet.deposit',
    Component: DepositMoney,
  },
  {
    path: '/mywallet/withdrawal',
    title: 'mywallet.withdrawal',
    Component: WithdrawalMoney,
  },
  {
    path: '/revenue',
    title: 'revenue.list',
    Component: Revenue,
  },
  {
    path: '/revenue/:id/detail',
    title: 'revenue.detail',
    Component: DetailRevenue,
  },
  {
    path: '/employees',
    title: 'employee.list',
    Component: Employees,
  },
  {
    path: '/employees/:id/detail/:type',
    title: 'employee.info',
    Component: DetailEmployee,
  },
  {
    path: '/logistics/import',
    title: 'logistics.import.list',
    Component: LogisticsImport,
  },
  {
    path: '/logistics/import/detail/:id?',
    title: 'logistics.import.detail',
    Component: LogisticsImportDetail,
  },
  {
    path: '/export',
    title: 'logistics.export.list',
    Component: LogisticsExport,
  },
  {
    path: '/export/detail/:id?',
    title: 'logistics.export.detail',
    Component: LogisticsExportDetail,
  },
  {
    path: '/distribution',
    title: 'distribution.detail',
    Component: Distribution,
  },
  {
    path: '/distribution/uc/:id?',
    title: 'product.update',
    Component: CreateAndUpdateDistribution,
  },
];

export const PrivateRoutes = memo(props => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();

  const roles = useSelector(selectRoles);
  const loading = useSelector(selectLoading);

  const userInfo = useSelector(selectCurrentUser);

  React.useEffect(() => {
    if (userInfo?.status === 'inactive') {
      window.location.href = '/auth/sigin';
    }
  }, [userInfo]);

  const routerList = useMemo(() => {
    const admin = isAdmin(roles);

    const handleRouterShow = params => {
      if (
        admin ||
        isEmpty(params.requiredRoles) ||
        roles.some(
          v =>
            isEmpty(params.requiredRoles) || params.requiredRoles?.includes(v),
        )
      ) {
        return lists.filter(r => r.path.includes(params.link));
      }
      return [];
    };

    const listFinal = menus.reduce(
      (final, item) => {
        if (item.link) {
          final = final.concat(handleRouterShow(item));
        } else {
          item.subMenus.forEach(content => {
            final = final.concat(handleRouterShow(content));
          });
        }
        return final;
      },
      [
        {
          path: '/',
          title: 'Home',
          Component: HomePage,
        },
        {
          path: '/dashboard',
          title: 'dashboard.title',
          Component: Dashboard,
        },
        {
          path: '/myprofile',
          title: 'myprofile.info',
          Component: MyProfile,
        },
        {
          path: '/infobusiness',
          title: 'infobusiness.info',
          Component: InfoBusiness,
        },
        {
          path: '/warehousing',
          title: 'warehouse.title',
          Component: Warehousing,
        },
        {
          path: '/warehousing/uc/:id?',
          title: 'warehouse.title',
          Component: CreateAndUpdateWarehousing,
        },
        {
          path: '/source/uc/:id?',
          title: 'source_product.title',
          Component: CreateAndUpdateSource,
        },
        {
          path: '/incoming1',
          title: 'incoming.title',
          Component: Incoming,
        },
        {
          path: '/incoming2',
          title: 'incoming.title',
          Component: Incoming,
        },
        {
          path: '/incoming3',
          title: 'incoming.title',
          Component: Incoming,
        },
        {
          path: '/accountant/detail-user-debt',
          // path: '/accountant/debt-overview/detailperiod/:id/list',
          title: 'accountant.UserDebtDetail',
          Component: UserDebtDetail,
        },
        {
          path: '/accountant/detail-debt-transaction/:id',
          title: 'accountant.detail',
          Component: AccountantPeriodOverviewDetailTransaction,
        },
        {
          path: '/accountant/detail-period',
          title: 'accountant.debtOverview',
          Component: AccountDebtByPeriod,
        },
        {
          path: '/accountant/detail-period',
          title: 'accountant.debtOverview',
          Component: AccountDebtByPeriod,
        },
      ],
    );
    return listFinal;
  }, [roles]);

  return (
    <AppLayout>
      <Div>
        <Breadcrumb location={props.location} />
        <Switch>
          {routerList.map(item => (
            <AuthRoute
              {...props}
              path={item.path}
              exact={item.exact === false ? false : true}
              key={item.path}
              title={t(item.title)}
              component={item.Component}
            />
          ))}
          {!loading && <Route component={NotFoundPage} />}
        </Switch>
      </Div>
    </AppLayout>
  );
});

const Div = styled.div`
  .site-layout {
    min-height: 100vh;
  }
`;
