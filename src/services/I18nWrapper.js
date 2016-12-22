import Polyglot from 'node-polyglot';

/**
 * A wrapper for MasteryCLI i18n feature
 *
 * @export
 * @class I18nWrapper
 * @extends {Polyglot}
 * @property {string} CK_LOCALE Configuration key to retrieve the locale code from config.json
 */
export default class I18nWrapper extends Polyglot {
  CK_LOCALE = 'locale';

  /**
   * Retrieve current selected locale from global.conf
   *
   * @param {string} lang
   * @returns {string} The default locale
   */
  getLocale() {
    return conf.get(this.CK_LOCALE);
  }

  /**
   * Check if a translation key has its translated message
   *
   * @param {string} key The translation key to check
   * @param {string} lang Language code
   * @returns {Boolean} Return true if translated message, otherwise return false
   */
  has(key: string, lang: string) {
    let locale;
    if (lang) {
      locale = lang;
    } else {
      locale = this.getLocale();
    }
    return super.has(`${locale}.${key}`);
  }

  /**
   * Find the translation message based on translation key and current locale
   *
   * @param {string} key The translation key to translate
   * @param {Object} [options={}] The translation variable values if the translated message does have any variable to replace
   * @returns {string} The translated message if exists, otherwise return its key back
   * @see {@link https://github.com/airbnb/polyglot.js#polyglotprototypetkey-interpolationoptions}
   */
  t(key: string, options: Object = {}) {
    if (!this.has(key)) {
      if (this.has(key, 'en')) {
        return super.t(`en.${key}`, options);
      }
      return key;
    }
    const locale = this.getLocale();
    return super.t(`${locale}.${key}`, options);
  }
}
