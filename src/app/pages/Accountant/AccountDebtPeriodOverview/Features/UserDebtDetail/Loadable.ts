/**
 *
 * Asynchronously loads the component for AccountantDetailPeriodList
 *
 */

import { lazyLoad } from 'utils/loadable';

export const UserDebtDetail = lazyLoad(
  () => import('./index'),
  module => module.UserDebtDetail,
);
