/**
 *
 * Asynchronously loads the component for Products
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Products = lazyLoad(
  () => import('./index'),
  module => module.Products,
);
