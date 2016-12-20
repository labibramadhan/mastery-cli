import chalk from 'chalk';

/**
 * Provides static methods to colorize CLI text
 *
 * @export
 * @class ColorizeText
 */
export default class ColorizeText {
  /**
   * Show yellow colorized CLI text
   *
   * @example
   * ColorizeText.info('I am', 'an', 'info');
   *
   * // returns 'I am an info' in red color to show in Command Line Interface
   *
   * @function
   * @name ColorizeText.info
   * @param  {string[]} arguments The text strings to colorize
   * @returns {string} Yellow CLI text
   */
  static info(...args: string[]) {
    return chalk.yellow(...args);
  }

  /**
   * Show magenta colorized CLI text
   *
   * @example
   * ColorizeText.warn('I am', 'a', 'warn!');
   *
   * // returns 'I am a warn!' in magenta color to show in Command Line Interface
   *
   * @function
   * @name ColorizeText.warn
   * @param  {string[]} arguments The text strings to colorize
   * @returns {string} Magenta CLI text
   */
  static warn(...args: string[]) {
    return chalk.magenta(...args);
  }

  /**
   * Show red colorized CLI text
   *
   * @example
   * ColorizeText.danger('I am', 'dangerous!');
   *
   * // returns 'I am dangerous!' in red color to show in Command Line Interface
   *
   * @function
   * @name ColorizeText.danger
   * @param  {string[]} arguments The text strings to colorize
   * @returns {string} Red CLI text
   */
  static danger(...args: string[]) {
    return chalk.red(...args);
  }
}
