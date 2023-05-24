/**
 *
 * Asynchronously loads the component for Distribution
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Distribution = lazyLoad(
  () => import('./index'),
  module => module.Distribution,
);
