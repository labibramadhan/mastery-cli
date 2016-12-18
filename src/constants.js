import path from 'path';

export const DEFAULT_SERVER_NAME = 'MasteryJS';

export const PM2_BIN = path.resolve(path.join(rootPath), '../node_modules/.bin/pm2');

export const BABEL_NODE_BIN = path.resolve(path.join(rootPath), '../node_modules/.bin/babel-node');

export const RUN_FILE = 'mastery.run.json';

export const DEFAULT_RUN_CONF = {
  script: './index.js',
  exec_mode: 'cluster',
  instances: 0,
};

export const DEFAULT_SPINNER = 18;
