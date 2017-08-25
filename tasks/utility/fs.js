import fs from 'fs';
import { getType } from './type';

export const hasAccess = (path) => {
  return new Promise((resolve) => {
    fs.access(path, (err) => {
      if(err) return resolve(false);
      resolve(true);
    });
  });
};

/**
 * @param {string} path
 * @param {string|function} [...args]
 * @return {Promise}
 */
export const readFile = (path, ...args) => {
  let _encoding = 'utf8';
  let _errFn    = null;

  for(const arg of args) {
    switch(getType(arg)) {
      case 'String':
        _encoding = arg;
        break;
      case 'Function':
        _errFn = arg;
        break;
    }
  }

  return new Promise((resolve, reject) => {
    fs.readFile(path, _encoding, (err, data) => {
      if(err) return reject(err, path);
      resolve(data);
    });
  })
    .catch((err, path) => {
      if(_errFn) _errFn(err, path);
    });
};
