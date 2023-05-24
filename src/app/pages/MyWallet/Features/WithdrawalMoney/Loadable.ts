/**
 *
 * Asynchronously loads the component for Categories
 *
 */

import { lazyLoad } from 'utils/loadable';

export const WithdrawalMoney = lazyLoad(
  () => import('./index'),
  module => module.Withdrawal,
);
