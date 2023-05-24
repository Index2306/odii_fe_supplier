/**
 *
 * Asynchronously loads the component for Categories
 *
 */

import { lazyLoad } from 'utils/loadable';

export const UpdateCategories = lazyLoad(
  () => import('./index'),
  module => module.CreateAndUpdateCategories,
);

export const CreateCategories = lazyLoad(
  () => import('./index'),
  module => module.CreateAndUpdateCategories,
);
