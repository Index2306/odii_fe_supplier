/**
 *
 * Asynchronously loads the component for Products
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DetailProducts = lazyLoad(
  () => import('./index'),
  module => module.Detail,
);
