import { lazyLoad } from 'utils/loadable';

export const AccountDebtPeriodOverview = lazyLoad(
  () => import('./index'),
  module => module.AccountDebtPeriodOverview,
);
