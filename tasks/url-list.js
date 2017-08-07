import config from '../tasks-config';
import { join, relative, dirname, extname } from 'path';
import { readFileSync } from 'fs';
import Log from './utility/log';
import { glob } from './utility/glob';
import { mkfile } from './utility/file';
import chokidar from 'chokidar';
import deepAssign from 'deep-assign';

export default class UrlList {

  constructor() {
    this._log = new Log('url-list');
  }

  /**
   * @return {Promsie}
   */
  start() {
    return (async () => {
      await this._build();
      new Log(`watch url-list`).start();
      this._watch();
    })();
  }

  _watch() {
    const { dest } = config.path;
    chokidar.watch(join(dest, '**/*.+(html|php)'), { ignoreInitial: true })
      .on('all', (evt, path) => {
        if(!evt.match(/(add|unlink)/)) return;
        console.log(`# ${ evt } -> ${ path }`);
        this._build();
      });
  }

  /**
   * @return {Promise}
   */
  _build() {
    const { path, urlList: { tmp, dest } } = config;
    const { _log } = this;
    return (async () => {
      _log.start();
      const _paths = await glob(join(path.dest, '**/*.+(html|php)'));
      const _urlHash = {};
      for(const path of _paths) {
        const _url = path.replace('htdocs/', '');
        const _obj = this._getUrlHash(_url);
        deepAssign(_urlHash, _obj);
      }
      const _buf  = await readFileSync(tmp);
      const _html = _buf.toString().replace('{{data}}', JSON.stringify(_urlHash));
      await mkfile(dest, _html);
      _log.finish();
    })();
  }

  /**
   * @param {string} url
   */
  _getUrlHash(url) {
    const _strs = url.split('/');
    let _obj    = {};
    let _isFile = true;
    const _set = () => {
      const _last = _strs.pop();
      if(_isFile) {
        _obj    = { [_last]: url };
        _isFile = false;
      } else {
        _obj = { [_last]: _obj }
      }
      if(_strs.length) _set();
    };
    _set();
    return _obj;
  }

}
