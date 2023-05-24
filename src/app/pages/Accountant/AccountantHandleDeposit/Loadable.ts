/**
 *
 * Asynchronously loads the component for Transactions
 *
 */

import { lazyLoad } from 'utils/loadable';

export const AccountantHandleDeposit = lazyLoad(
  () => import('./index'),
  module => module.AccountantHandleDeposit,
);
