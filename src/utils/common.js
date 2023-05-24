import { isEmpty } from 'lodash';

export const checkSecurityCode = () => {
  // Ignore this case when security code is empty
  if (isEmpty(process.env.REACT_APP_SECURITY_CODE)) return true;
  const securityCodeStorage = localStorage.getItem('securityCode');

  return securityCodeStorage === process.env.REACT_APP_SECURITY_CODE;
};
