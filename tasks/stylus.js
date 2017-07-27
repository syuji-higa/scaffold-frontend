import config from '../tasks-config';
import { readFileSync } from 'fs';
import { join, relative, basename } from 'path';
import { mkfile } from './utility/file';
import { glob } from './utility/glob';
import FileCache from './utility/file-cache';
import Log from './utility/log';
import chokidar from 'chokidar';
import stylus from 'stylus';
import nib from 'nib';
import iconv from 'iconv-lite';

export default class Stylus {

  constructor() {
    this._log        = new Log('stylus');
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

  _watch() {
    const { root, src, imports } = config.stylus;
    const { argv } = NS;
    const { _fileCache } = this;

    // init
    chokidar.watch(join(root, '**/*.styl'), { persistent: false })
      .on('add', (path) => {
        _fileCache.set(path);
      });

    // src
    chokidar.watch(join(src, '**/*.styl'), { ignoreInitial: true })
      .on('all', (event, path) => {
        if(!event.match(/(add|change)/) || _fileCache.mightUpdate(path)) return;
        console.log(`# ${ event } -> ${ path }`);
        const { root: _root } = config.path;
        this._build([relative(_root, path)]);
      });

    // imports
    if(!argv['stylus-watch-src']) {
      chokidar.watch(join(imports, '**/*.styl'), { ignoreInitial: true })
        .on('all', (event, path) => {
          if(!event.match(/(add|change)/) || _fileCache.mightUpdate(path)) return;
          console.log(`# ${ event } -> ${ path }`);
          this._buildAll();
        });
    }
  }

  /**
   * @return {Promsie}
   */
  _buildAll() {
    return (async () => {
      const { src } = config.stylus;
      const { stylusSet } = NS.curtFiles;
      const _files      = await glob(join(src, '**/*.styl'));
      const _curtFiles  = [];
      const _otherFiles = [];
      for(const file of _files) {
        stylusSet.has(file) ? _curtFiles.push(file) : _otherFiles.push(file);
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
    const { path: { root }, stylus: { charset, src, imports, dest } } = config;
    const { argv } = NS;
    const { _log, _stylusOpts } = this;
    return (async () => {
      _log.start();
      await Promise.all(files.map((file) => {
        return (async() => {
          const _str = readFileSync(join(root, file), 'utf-8');
          const _stylus = stylus(_str)
            .use(nib())
            .set('filename', basename(file))
            .set('include css', true)
            .set('resolve url', true)
            .define('url', stylus.resolver())
            .set('compress', argv['production'])
            .set('sourcemap', !argv['production']);
          let _css = _stylus.render();
          if(charset !== 'utf8') {
            _css = iconv.encode(_css, charset).toString();
          }
          const _dest = join(dest, relative(src, file)).replace('.styl', '.css');
          await mkfile(_dest, _css);
          console.log(`# Created -> ${ _dest }`);
          if(!argv['production']) {
            const _sourcemapDest = `${ _dest }.map`;
            await mkfile(_sourcemapDest, JSON.stringify(_stylus.sourcemap));
            console.log(`# Created -> ${ _sourcemapDest }`);
          }
        })();
      }));
      _log.finish();
    })();
  }

}
