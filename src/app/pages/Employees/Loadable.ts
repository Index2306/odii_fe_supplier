/**
 *
 * Asynchronously loads the component for Employees
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Employees = lazyLoad(
  () => import('./index'),
  module => module.Employees,
);
