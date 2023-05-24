/**
 *
 * Asynchronously loads the component for Products
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CreateAndUpdateProducts = lazyLoad(
  () => import('./index'),
  module => module.CreateAndUpdateProducts,
);
