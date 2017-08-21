import { accessSync, readFileSync } from 'fs';
import { createHash, update, digest } from 'crypto';

export default class FileCache {

  constructor() {
    this._cacheMap = new Map();
  }

  /**
   * @param {string} path
   * @param {Buffer} buf
   */
  set(path, buf = null) {
    const { _cacheMap } = this;
    const _buf  = buf || readFileSync(path);
    const _hash = this._toHash(_buf);
    _cacheMap.set(path, _hash);
  }

  /**
   * @param {string} path
   * @param {Buffer} buf
   * @return {boolean}
   */
  mightUpdate(path, buf) {
    const { _cacheMap } = this;
    try {
      accessSync(path);
      const _buf       = buf || readFileSync(path);
      const _hash      = this._toHash(_buf);
      const _hashCache = _cacheMap.get(path);
      if(_hashCache === _hash) {
        return false;
      } else {
        _cacheMap.set(path, _hash);
        return true;
      }
    } catch(err) {
      _cacheMap.delete(path);
      return true;
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
