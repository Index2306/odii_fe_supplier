/**
 *
 * Asynchronously loads the component for Categories
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DetailTransactionAcountant = lazyLoad(
  () => import('./index'),
  module => module.Detail,
);
