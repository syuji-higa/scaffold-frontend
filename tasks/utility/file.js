import { dirname } from 'path';
import { writeFile } from 'fs';
import mkdirp from 'mkdirp';

/**
 * @param {string} path
 * @param {string} data
 * @param {function} [callback]
 * @return {Promise}
 */
export const mkfile = (path, data, callback = null) => {
  return new Promise((resolve) => {
    mkdirp(dirname(path), () => {
      writeFile(path, data, () => {
        if(callback) callback();
        resolve();
      });
    });
  });
};
