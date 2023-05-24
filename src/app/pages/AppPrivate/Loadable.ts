/**
 *
 * Asynchronously loads the component for AppPrivate
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PrivateRoutes = lazyLoad(
  () => import('./index'),
  module => module.PrivateRoutes,
);
