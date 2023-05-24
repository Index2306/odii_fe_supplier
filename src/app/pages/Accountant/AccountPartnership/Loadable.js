/**
 *
 * Asynchronously loads the component for AccountingPartnership
 *
 */

import { lazyLoad } from 'utils/loadable';

export const AccountPartnership = lazyLoad(
  () => import('./index'),
  module => module.AccountPartnership,
);
