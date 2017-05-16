import { readFileSync } from 'fs';

export default class FileCache {

  constructor() {
    this._cacheMap = new Map();
  }

  /**
   * @param {!string} path
   */
  set(path) {
    const { _cacheMap } = this;
    const _buf = readFileSync(path);
    _cacheMap.set(path, _buf);
  }

  /**
   * @param {!string} path
   */
  check(path) {
    const { _cacheMap } = this;
    const _buf      = readFileSync(path);
    const _bufCache = _cacheMap.get(path);
    if(_bufCache && Buffer.compare(_bufCache, _buf) === 0) {
      return true;
    } else {
      _cacheMap.set(path, _buf);
      return false;
    }
  }

}
