/**
 *
 * Asynchronously loads the component for CreateAndUpdateWarehousing
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CreateAndUpdateWarehousing = lazyLoad(
  () => import('./index'),
  module => module.CreateAndUpdateWarehousing,
);
