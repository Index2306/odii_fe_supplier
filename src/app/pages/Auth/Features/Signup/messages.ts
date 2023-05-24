/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
  signin: () => _t(translations.auth.signin, ''),
  signup: () => _t(translations.auth.signup, ''),
  password: () => _t(translations.auth.password, ''),
  username: () => _t(translations.auth.username, ''),
  firstname: () => _t(translations.auth.firstname, ''),
  lastname: () => _t(translations.auth.lastname, ''),
  phone: () => _t(translations.auth.phone, ''),
  forgotpass: () => _t(translations.auth.forgotpass, ''),
};
