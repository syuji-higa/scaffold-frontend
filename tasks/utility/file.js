import { dirname } from 'path';
import { writeFile } from 'fs';
import mkdirp from 'mkdirp';

/**
 * @param {string} path
 * @param {string} data
 * @param {Object|string} [opts]
 * @return {Promise}
 */
export const mkfile = (path, data, opts = {}) => {
  return new Promise((resolve) => {
    mkdirp(dirname(path), () => {
      writeFile(path, data, opts, resolve);
    });
  });
};
