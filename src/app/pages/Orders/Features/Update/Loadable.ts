/**
 *
 * Asynchronously loads the component for Products
 *
 */

import { lazyLoad } from 'utils/loadable';

export const UpdateOrder = lazyLoad(
  () => import('./index'),
  module => module.UpdateOrder,
);
