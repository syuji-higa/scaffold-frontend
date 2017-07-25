import config from '../tasks-config';
import { readFileSync } from 'fs';
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
    this._log        = new Log('pug');
    this._factoryLog = new Log('pug factory');
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

  get _pugOpts() {
    return {
      pretty : true,
      filters: this._getFilters(),
    };
  }

  _watch() {
    const { argv } = NS;
    const { root, src, tmp, factory } = config.pug;
    const { _fileCache } = this;

    // init
    chokidar.watch(join(root, '**/*.(pug|json)'), { persistent: false })
      .on('add', (path) => {
        _fileCache.set(path);
      });

    // src
    chokidar.watch(join(src, '**/*.pug'), { ignoreInitial: true })
      .on('all', (event, path) => {
        if(!event.match(/(add|change)/) || _fileCache.mightUpdate(path)) return;
        console.log(`# ${ event } -> ${ path }`);
        const { root: _root } = config.path;
        this._build([relative(_root, path)]);
      });

    // extend or include
    if(!argv['pug-watch-src-only']) {
      chokidar.watch(join(tmp, '**/*.pug'), { ignoreInitial: true })
        .on('all', (event, path) => {
          if(!event.match(/(add|change)/) || _fileCache.mightUpdate(path)) return;
          console.log(`# ${ event } -> ${ path }`);
          this._buildAll();
        });
    }

    // factorys json
    chokidar.watch(join(factory, '**/*.json'), { ignoreInitial: true })
      .on('all', (event, path) => {
        if(!event.match(/(add|change)/) || _fileCache.mightUpdate(path)) return;
        console.log(`# ${ event } -> ${ path }`);
        this._factoryBuild([relative(root, path)]);
      });

    // factorys template
    if(!argv['pug-factory-watch-json-only']) {
      chokidar.watch(join(factory, '**/*.pug'), { ignoreInitial: true })
        .on('all', (event, path) => {
          if(!event.match(/(add|change)/) || _fileCache.mightUpdate(path)) return;
          console.log(`# ${ event } -> ${ path }`);
          this._factoryBuild([relative(root, path)]);
        });
    }
  }

  /**
   * @return {Promsie}
   */
  _buildAll() {
    return (async () => {
      const { src } = config.pug;
      const { pugSet } = NS.curtFiles;
      const _files      = await glob(join(src, '**/*.pug'));
      const _curtFiles  = [];
      const _otherFiles = [];
      for(const file of _files) {
        pugSet.has(file) ? _curtFiles.push(file) : _otherFiles.push(file);
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

  /**
   * @return {Promsie}
   */
  _factoryBuildAll() {
    return (async () => {
      const { factory } = config.pug;
      const _files = await glob(join(factory, '**/*.json'));
      if(_files.length) await this._factoryBuild(_files);
    })();
  }

  /**
   * @param {Array<string>} files
   * @return {Promise}
   */
  _factoryBuild(files) {
    const { _factoryLog, _pugOpts } = this;
    const { charset, root, src, dest } = config.pug;
    return (async () => {
      _factoryLog.start();
      await Promise.all(files.map((file, i) => {
        if(i === 0) console.log('# Created files');
        const _buf  = readFileSync(join(root, file));
        const _tmps = JSON.parse(_buf.toString());
        return Promise.all(Object.entries(_tmps).map(([tmpFile, pages]) => {
          const _tmpBuf   = readFileSync(join(root, tmpFile));
          const _tmp      = _tmpBuf.toString();
          const _splitTmp = _tmp.split('{{vars}}');
          return Promise.all(Object.entries(pages).map(([pageFile, vals]) => {
            return (async() => {
              const _valsStr = Object.entries(vals).reduce((memo, [key, val]) => {
                return `${ memo }  - var ${ key } = ${ JSON.stringify(val) }\n`;
              }, '');
              const _contents = _splitTmp[0] + _valsStr + _splitTmp[1];
              const _members  = this._getMembers(join(root, pageFile));
              const _opts     = Object.assign(_pugOpts, _members);
              let _html = pug.render(_contents, _opts);
              if(charset !== 'utf8') {
                _html = iconv.encode(_html, charset).toString();
              }
              const _dest = join(dest, pageFile).replace('.pug', '.html');
              await mkfile(_dest, _html);
              console.log(`  - ${ _dest }`);
            })();
          }));
        }));
      }));
      _factoryLog.finish();
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
