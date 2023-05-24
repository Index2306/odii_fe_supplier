/**
 *
 * Asynchronously loads the component for AccountingPartnership
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DetailAccountPartnership = lazyLoad(
  () => import('./index'),
  module => module.DetailAccountPartnership,
);
