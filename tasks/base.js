import config from '../tasks-config';
import { readFileSync } from 'fs';
import { relative } from 'path';
import FileCache from './utility/file-cache';
import Log from './utility/log';
import { glob } from './utility/glob';
import chokidar from 'chokidar';

export default class Base {

  /**
   * @param {string} type
   */
  constructor(type) {
    this._log        = new Log(type);
    this._fileCache  = new FileCache();
  }

  /**
   * @return {Promise}
   */
  start() {
    return (async () => {
      await this._buildAll();
      this._watch();
    })();
  }

  /**
   * @param {string} target
   */
  _watchInit(target) {
    const { _fileCache } = this;
    chokidar.watch(target, { persistent: false })
      .on('add', (path) => {
        _fileCache.set(path);
      });
  }

  /**
   * @param {string} target
   * @param {function} fn
   */
  _watchObserve(target, fn) {
    const { _fileCache } = this;
    chokidar.watch(target, { ignoreInitial: true })
      .on('all', (evt, path) => {
        if(!evt.match(/(add|change)/) || _fileCache.mightUpdate(path)) return;
        console.log(`# ${ evt } -> ${ path }`);
        const { root } = config.path;
        fn([relative(root, path)]);
      });
  }

  /**
   * @param {string} target
   */
  _watchSrc(target) {
    const { root } = config.pug;
    this._watchObserve(target, (path) => this._build(path));
  }

  /**
   * @param {string} target
   */
  _watchOther(target) {
    this._watchObserve(target, () => this._buildAll());
  }

  /**
   * @param {string} name
   * @param {string} path
   * @return {Promsie}
   */
  _buildAll(name, path) {
    return (async () => {
      const _curtPathSet = NS.curtFiles[name];
      const _paths       = await glob(path);
      const _curtPaths   = [];
      const _otherPaths  = [];
      for(const p of _paths) {
        _curtPathSet.has(p) ? _curtPaths.push(p) : _otherPaths.push(p);
      }
      if(_curtPaths.length) await this._buildMultiple(_curtPaths);
      if(_otherPaths.length) await this._buildMultiple(_otherPaths);
    })();
  }

  /**
   * @param {Array<string>} paths
   * @return {Promise}
   */
  _buildMultiple(paths) {
    const { _log } = this;
    return (async () => {
      _log.start();
      await Promise.all(paths.map((p) => this._build(p)));
      _log.finish();
    })();
  }

  /**
   * @param {string}
   * @return {Promise}
   */
  _build(file) {}

}
