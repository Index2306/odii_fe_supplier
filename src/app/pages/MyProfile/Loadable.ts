/**
 *
 * Asynchronously loads the component for MyProfile
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MyProfile = lazyLoad(
  () => import('./index'),
  module => module.MyProfile,
);
