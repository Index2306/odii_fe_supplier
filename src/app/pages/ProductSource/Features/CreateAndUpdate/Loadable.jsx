/**
 *
 * Asynchronously loads the component for CreateAndUpdateWarehousing
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CreateAndUpdateSource = lazyLoad(
  () => import('./index'),
  module => module.CreateAndUpdateSource,
);
