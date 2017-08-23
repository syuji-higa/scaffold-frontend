import { dirname } from 'path';
import { readFile, writeFile } from 'fs';
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

/**
 * @param {string} path
 * @param {Buffer} buf
 * @return {Promise}
 */
export const sameFile = (path, buf) => {
  return new Promise((resolve) => {
    readFile(path, (err, buf_) => {
      if(err) resolve(false);
      resolve(Buffer.compare(buf, buf_) === 0);
    });
  });
};
