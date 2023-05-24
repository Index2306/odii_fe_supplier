/**
 *
 * Asynchronously loads the component for Revenue
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Revenue = lazyLoad(
  () => import('./index'),
  module => module.Revenue,
);
