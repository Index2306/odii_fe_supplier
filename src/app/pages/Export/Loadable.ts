/**
 *
 * Asynchronously loads the component for LogisticsImport
 *
 */
import { lazyLoad } from 'utils/loadable';

export const LogisticsExport = lazyLoad(
  () => import('./index'),
  module => module.LogisticsExport,
);
