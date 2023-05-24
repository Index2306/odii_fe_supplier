/**
 *
 * Asynchronously loads the component for Products
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CreateAndUpdateDistribution = lazyLoad(
  () => import('./index'),
  module => module.CreateAndUpdateDistribution,
);
