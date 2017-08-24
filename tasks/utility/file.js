import { dirname } from 'path';
import { readFile, writeFile } from 'fs';
import mkdirp from 'mkdirp';
import { getType } from './type';

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

/**
 * @param {string} path
 * @param {Buffer|string} data
 * @return {Promise<boolean>}
 */
export const sameFile = (path, data) => {
  return new Promise((resolve) => {
    readFile(path, (err, buf) => {
      if(err) {
        return resolve(false);
      }
      const _buf = getType(data) === 'String' ? new Buffer(data) : data;
      resolve(Buffer.compare(_buf, buf) === 0);
    });
  });
};
