/**
 *
 * Asynchronously loads the component for My wallet
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DepositMoney = lazyLoad(
  () => import('./index'),
  module => module.Deposit,
);
