import config from '../tasks-config';
import { join, relative, dirname } from 'path';
import { mkfile } from './utility/file';
import { glob } from './utility/glob';
import FileCache from './utility/file-cache';
import Log from './utility/log';
import chokidar from 'chokidar';
import pug from 'pug';
import iconv from 'iconv-lite';

export default class Pug {

  constructor() {
    this._log       = new Log('pug');
    this._fileCache = new FileCache();

    this._pugOpts = {
      pretty : true,
      filters: this._getFilters(),
    };
  }

  /**
   * @return {Promise}
   */
  start() {
    return (async () => {
      await this._buildAll();
      this._observe();
    })();
  }

  _observe() {
    const { srcAll, src, tmp } = config.pug;
    const { root } = NS;
    const { _fileCache, _initWatcher, _srcWatcher, _tmpWatcher } = this;

    // init
    chokidar.watch(join(srcAll, '**/*.pug'), { persistent: false })
      .on('add', (path) => {
        _fileCache.set(path);
      });

    // src
    chokidar.watch(join(src, '**/*.pug'), { ignoreInitial: true })
      .on('all', (event, path) => {
        if(!event.match(/(add|change)/) || _fileCache.mightUpdate(path)) return;
        console.log(`# ${ event } -> ${ path }`);
        this._build([relative(root, path)]);
      });

    // extends or includes
    chokidar.watch(join(tmp, '**/*.pug'), { ignoreInitial: true })
      .on('all', (event, path) => {
        if(!event.match(/(add|change)/) || _fileCache.mightUpdate(path)) return;
        console.log(`# ${ event } -> ${ path }`);
        this._buildAll();
      });
  }

  /**
   * @return {Promsie}
   */
  _buildAll() {
    return (async () => {
      const { src } = config.pug;
      const _files = await glob(join(src, '**/*.pug'));
      if(_files.length) await this._build(_files);
    })();
  }

  /**
   * @param {Array<string>} files
   * @return {Promise}
   */
  _build(files) {
    const { _log, _pugOpts } = this;
    const { charset, src, dest } = config.pug;
    return (async () => {
      _log.start();
      await Promise.all(files.map((file, i) => {
        if(i === 0) console.log('# Created files');
        return (async() => {
          const _dest = join(dest, relative(src, file)).replace('.pug', '.html');
          const _opts = Object.assign(_pugOpts, this._getMembers(file));
          let _html = pug.renderFile(file, _opts);
          if(charset !== 'utf8') {
            _html = iconv.encode(_html, charset).toString();
          }
          await mkfile(_dest, _html);
          console.log(`  - ${ _dest }`);
        })();
      }));
      _log.finish();
    })();
  }

  _getFilters() {
    return {
      'do-nothing': (block) => {
        const _indentData = block.match(/^\{\{indent=([0-9])\}\}\n/);
        const _block = (() => {
          if(!_indentData) return block;
          const _notVarBlock = block.replace(_indentData[0], '');
          let _indent = '';
          for(let _i = 0; _indentData[1] > _i; _i++) _indent += ' ';
          return _indent + _notVarBlock.replace(/\n/g, `\n${ _indent }`);
        })();
        return `\n${ _block }`;
      },
    };
  }

  /**
   * @param {string} file
   */
  _getMembers(file) {
    const { root, src } = config.pug;
    const { production } = NS.argv;
    return {
      isProduction: production,
      basedir     : root,
      relative    : (path) => {
        const _path = relative(relative(src, dirname(file)), path);
        return _path ? _path + '/' : '';
      },
    };
  }

}
