/**
 *
 * Asynchronously loads the component for Transactions
 *
 */

import { lazyLoad } from 'utils/loadable';

export const AccountantHandleWithdrawal = lazyLoad(
  () => import('./index'),
  module => module.AccountantHandleWithdrawal,
);
