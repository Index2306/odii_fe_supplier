/**
 *
 * Asynchronously loads the component for MyWallet
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MyWallet = lazyLoad(
  () => import('./index'),
  module => module.MyWallet,
);
