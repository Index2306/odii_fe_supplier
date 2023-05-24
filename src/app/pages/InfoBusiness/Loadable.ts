/**
 *
 * Asynchronously loads the component for InfoBusiness
 *
 */

import { lazyLoad } from 'utils/loadable';

export const InfoBusiness = lazyLoad(
  () => import('./index'),
  module => module.InfoBusiness,
);
