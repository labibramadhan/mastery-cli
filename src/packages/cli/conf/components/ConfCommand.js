import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const ColorizeText = requireF('services/ColorizeText');

/**
 * The main class that handles the 'conf' command execution.
 *
 * @export
 * @class ConfCommand
 * @property {string} MK_CONF_SUCCESS The translation key of 'writing configuration success' phase message
 * @property {string} MK_CONF_NOT_EXIST The translation key of 'key does not exist' phase message
 */
export default class ConfCommand {
  MK_CONF_SUCCESS = 'cli.conf.success';
  MK_CONF_NOT_EXIST = 'cli.conf.notExist';

  /**
   * The main method that handles configuration changes and then save the results back to the configuration file.
   */
  execute(key: string, value: string) {
    if (key) {
      if (_.isUndefined(conf.get(key))) {
        throwError(i18n.t(this.MK_CONF_NOT_EXIST, {
          key,
        }));
      } else {
        conf.set(key, value);
        fs.writeFileSync(path.join(rootPath, 'config.json'), JSON.stringify(conf.get(), null, 2));

        console.log(ColorizeText.info(i18n.t(this.MK_CONF_SUCCESS, {
          key,
          value,
        })));
        console.log('');
      }
    }
  }
}
