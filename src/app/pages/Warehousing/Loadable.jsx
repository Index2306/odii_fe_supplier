/**
 *
 * Asynchronously loads the component for Warehousing
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Warehousing = lazyLoad(
  () => import('./index'),
  module => module.Warehousing,
);
