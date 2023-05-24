/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
  title: () => _t(translations.myprofile.title, ''),
  password: () => _t(translations.auth.password, ''),
  old_password: () => _t(translations.auth.oldpassword, ''),
  new_password: () => _t(translations.auth.newpassword, ''),
  confirm_password: () => _t(translations.auth.confirmpassword, ''),
  changepass: () => _t(translations.auth.changepass, ''),
  back: () => _t(translations.auth.back, ''),
};
