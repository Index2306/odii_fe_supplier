/**
 * Asynchronously loads the component for HomePage
 */

import { lazyLoad } from 'utils/loadable';

export const Report = lazyLoad(
  () => import('./index'),
  module => module.Report,
);
