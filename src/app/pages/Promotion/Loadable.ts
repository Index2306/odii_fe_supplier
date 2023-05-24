/**
 *
 * Asynchronously loads the component for Transactions
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Promotion = lazyLoad(
  () => import('./index'),
  module => module.Promotion,
);
