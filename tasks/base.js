import config from '../tasks-config';
import { readFileSync } from 'fs';
import { relative } from 'path';
import { glob } from './utility/glob';
import FileCache from './utility/file-cache';
import Log from './utility/log';
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
   * @param {string} filesName
   * @param {string} filePath
   * @return {Promsie}
   */
  _buildAll(filesName, filePath) {
    return (async () => {
      const _curtFilesSet = NS.curtFiles[filesName];
      const _files        = await glob(filePath);
      const _curtFiles    = [];
      const _otherFiles   = [];
      for(const file of _files) {
        _curtFilesSet.has(file) ? _curtFiles.push(file) : _otherFiles.push(file);
      }
      if(_curtFiles.length) await this._build(_curtFiles);
      if(_otherFiles.length) await this._build(_otherFiles);
    })();
  }

  /**
   * @param {Array<string>} files
   * @return {Promise}
   */
  _build(files) {
    const { _log } = this;
    return (async () => {
      _log.start();
      await Promise.all(files.map((file) => this._buildSingle(file)));
      _log.finish();
    })();
  }

  /**
   * @param {string}
   * @return {Promise}
   */
  _buildSingle(file) {}

}
