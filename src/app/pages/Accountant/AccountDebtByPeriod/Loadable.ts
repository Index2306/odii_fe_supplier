import { lazyLoad } from 'utils/loadable';

export const AccountDebtByPeriod = lazyLoad(
  () => import('./index'),
  module => module.AccountDebtByPeriod,
);
