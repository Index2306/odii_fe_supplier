/**
 *
 * Asynchronously loads the component for Categories
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DetailEmployee = lazyLoad(
  () => import('./index'),
  module => module.Detail,
);
