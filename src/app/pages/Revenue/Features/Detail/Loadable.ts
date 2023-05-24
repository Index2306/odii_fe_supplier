/**
 *
 * Asynchronously loads the component for Revenue
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DetailRevenue = lazyLoad(
  () => import('./index'),
  module => module.Detail,
);
