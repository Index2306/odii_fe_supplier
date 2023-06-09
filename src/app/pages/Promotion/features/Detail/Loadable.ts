/**
 *
 * Asynchronously loads the component for Transactions
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Detail = lazyLoad(
  () => import('./index'),
  module => module.Detail,
);
