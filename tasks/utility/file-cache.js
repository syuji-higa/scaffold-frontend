import { readFileSync } from 'fs';
import { createHash, update, digest } from 'crypto';

export default class FileCache {

  constructor() {
    this._cacheMap = new Map();
  }

  /**
   * @param {string} path
   */
  set(path) {
    const { _cacheMap } = this;
    const _buf  = readFileSync(path);
    const _hash = this._toHash(_buf);
    _cacheMap.set(path, _hash);
  }

  /**
   * @param {string} path
   * @return {boolean}
   */
  mightUpdate(path) {
    const { _cacheMap } = this;
    const _buf       = readFileSync(path);
    const _hash      = this._toHash(_buf);
    const _hashCache = _cacheMap.get(path);
    if(_hashCache === _hash) {
      return true;
    } else {
      _cacheMap.set(path, _hash);
      return false;
    }
  }

  /**
   * @param {Buffer} buf
   * @return {string}
   */
  _toHash(buf) {
    return createHash('md5').update(buf.toString('utf8')).digest('hex');
  }

}
