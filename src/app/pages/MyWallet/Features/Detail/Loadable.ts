/**
 *
 * Asynchronously loads the component for Revenue
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DetailTransaction = lazyLoad(
  () => import('./index'),
  module => module.Detail,
);
