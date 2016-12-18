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
   * @param  {Array<string>} ...args
   * @returns {string} Yellow CLI text
   */
  static info = (...args: Array<string>) => chalk.yellow(...args);

  /**
   * Show magenta colorized CLI text
   *
   * @param  {Array<string>} ...args
   * @returns {string} Magenta CLI text
   */
  static warn = (...args: Array<string>) => chalk.magenta(...args);

  /**
   * Show red colorized CLI text
   *
   * @param  {Array<string>} ...args
   * @returns {string} Red CLI text
   */
  static danger = (...args: Array<string>) => chalk.red(...args);
}
