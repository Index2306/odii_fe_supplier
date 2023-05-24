/**
 *
 * Asynchronously loads the component for LogisticsImport
 *
 */
import { lazyLoad } from 'utils/loadable';

export const LogisticsImport = lazyLoad(
  () => import('./index'),
  module => module.LogisticsImport,
);
