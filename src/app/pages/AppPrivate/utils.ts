import CryptoJS from 'crypto-js';

export function saveToken(tokens: object) {
  try {
    const value = CryptoJS.AES.encrypt(
      JSON.stringify(tokens),
      'token_supplier',
    );
    window.localStorage && localStorage.setItem('accessTokenSupplier', value);
  } catch (error) {
    console.log(`saveToken`, error);
  }
}

/* istanbul ignore next line */
export function getTokenFromStorage() {
  try {
    const item = window.localStorage
      ? (localStorage.getItem('accessTokenSupplier') as string) || ''
      : '';
    if (!item) return '';
    const value = CryptoJS.AES.decrypt(item, 'token_supplier').toString(
      CryptoJS.enc.Utf8,
    );
    return JSON.parse(value);
  } catch (error) {
    console.log(`getTokenFromStorage`, error);
  }
}
