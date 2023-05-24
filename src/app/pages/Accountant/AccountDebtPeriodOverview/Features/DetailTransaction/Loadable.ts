/**
 *
 * Asynchronously loads the component for DetailTransaction
 *
 */

import { lazyLoad } from 'utils/loadable';

export const AccountantPeriodOverviewDetailTransaction = lazyLoad(
  () => import('./index'),
  module => module.DetailTransaction,
);
