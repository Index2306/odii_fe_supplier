/**
 *
 * Asynchronously loads the component for AccountingPartnership
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ListOrderSeller = lazyLoad(
  () => import('./index'),
  module => module.ListOrderSeller,
);
