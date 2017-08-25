import config from '../tasks-config';
import fs from 'fs';
import { join, dirname, extname } from 'path';
import bs from 'browser-sync';
import TaskLog from './utility/task-log';
import { errorLog } from './utility/error-log';
import { hasFile, readFile } from './utility/fs';
import chokidar from 'chokidar';
import iconv from 'iconv-lite';
import deepAssign from 'deep-assign';

const browserSync        = bs.create();
const browserSyncUrlList = bs.create();

export default class BrowserSync {

  get _bsUrlListOpts() {
    const { root } = config.urlList;
    return {
      server: {
        baseDir: root,
      },
      port                : 3002,
      ui                  : false,
      open                : false,
      notify              : false,
      reloadOnRestart     : true,
      scrollProportionally: false,
    };
  }

  get _bsBaseOpts() {
    return {
      open                : false,
      notify              : false,
      reloadOnRestart     : true,
      scrollProportionally: false,
      server: {
        middleware: [
          this._convert.bind(this),
          this._setViewingFile.bind(this),
        ],
      },
    };
  }

  get _bsOpts() {
    const { dest } = config.path;
    const { _bsBaseOpts } = this;
    return deepAssign(_bsBaseOpts, {
      server: {
        baseDir: dest,
      },
    });
  }

  get _bsPhpOpts() {
    const { _bsBaseOpts } = this;
    return deepAssign(_bsBaseOpts, {
      proxy: '0.0.0.0:3010',
    });
  }

  constructor() {
    this._taskLog = new TaskLog('browser-sync');
  }

  /**
   * @return {Promsie}
   */
  start() {
    const { _taskLog } = this;
    return (async () => {
      _taskLog.start();
      await Promise.all([
        this._browserSyncUrlList(),
        this._browserSync(),
      ]);
      const { argv } = NS;
      if(!argv['production']) {
        this._watch();
      }
    })();
  }

  /**
   * @return {Promise}
   */
  _browserSyncUrlList() {
    return new Promise((resolve) => {
      const { _bsUrlListOpts } = this;
      browserSyncUrlList.init(_bsUrlListOpts, resolve);
    });
  }

  /**
   * @return {Promise}
   */
  _browserSync() {
    return new Promise((resolve) => {
      const { argv } = NS;
      const { _bsOpts, _bsPhpOpts } = this;
      const _opts = !argv['php'] ? _bsOpts : _bsPhpOpts;
      browserSync.init(_opts, resolve);
    })
  }

  _watch() {
    const { dest } = config.path;
    const { destSet } = NS.curtFiles;

    const _opts = { ignoreInitial: true };

    // compile files
    chokidar.watch(join(dest, '**/*.(html|shtml|php|css|js)'), _opts)
      .on('all', (event, path) => {
        if(![...destSet].includes(path)) return;
        browserSync.reload(path);
      });

    // image files
    chokidar.watch(join(dest, '**/*.(png|jpg|jpeg|gif|svg)'), _opts)
      .on('all', (event, path) => {
        browserSync.reload(path);
      });
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   */
  _convert(req, res, next) {
    const { dest } = config.path;

    (async () => {
      let _path = join(dest, req.url);

      if(!_path) return next();

      if(!extname(_path)) {
        for(const ext of ['.html', '.shtml', '.php']) {
          const __path = join(_path, `index${ ext }`);
          if(hasFile(__path)) {
            _path = __path;
            break;
          }
        }
      }

      switch(extname(_path)) {
        case '.html':
        case '.shtml':
        case '.php':
          const _buf = await this._pageConvert(_path);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(_buf.toString());
          break;
        default:
          next();
      }
    })();
  }

  /**
   * @param {string} path
   * @return {Promise<Buffer>}
   */
  _pageConvert(path) {
    return new Promise((resolve) => {
      fs.readFile(path, (err, buf) => {
        if(err) return next();
        const { charset } = config.pug;
        (async () => {
          let _buf = buf;
          if(charset !== 'utf8') {
            _buf = this._decode(_buf, charset);
          }
          _buf = await this._ssi(dirname(path), _buf);
          resolve(_buf);
        })();
      });
    });
  }

  /**
   * @param {string} dir
   * @param {Buffer} buf
   * @return {Promise<Buffer>}
   */
  _ssi(dir, buf) {
    let _str        = buf.toString();
    const _rInc     = /<!--#include file=".+" -->/g;
    const _includes = _str.match(_rInc);

    return (async () => {
      if(_includes) {
        await Promise.all(_includes.map((inc) => {
          const _path = join(dir, inc.match(/file="(.+)"/)[1]);
          return (async () => {
            const _buf = await readFile(_path, (err, path) => {
              errorLog('browser-sync ssi', `No such file, open '${ path }'.`);
            });
            _str = _str.replace(inc, _buf.toString());
          })();
        }));
      }
      return new Buffer(_str);
    })();
  }

  /**
   * @param {Buffer} buf
   * @param {string} encoding
   * @return {Buffer}
   */
  _decode(buf, encoding) {
    const _str = iconv.decode(buf, encoding);
    return new Buffer(_str.replace(/(<meta charset=")(.+)(">)/g, '$1utf-8$3'));
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   */
  _setViewingFile(req, res, next) {
    const _urlStrs = req.url.match(/^([^.]+(\.[^/]+)?).*?$/);
    const _path    = _urlStrs[1];
    const _ext     = _urlStrs[2];

    const { destSet, pugSet } = NS.curtFiles;
    const { path: { dest }, pug } = config;

    if(_ext) {
      destSet.add(join(dest, _path));
      switch(_ext) {
        case '.html':
        case '.shtml':
        case '.php':
          pugSet.add(join(pug.src, _path.replace(_ext, '.pug')));
          break;
        case '.css':
          const { stylusSet } = NS.curtFiles;
          const { stylus } = config;
          stylusSet.add(join(stylus.src, _path.replace(_ext, '.styl')));
          break;
        case '.js':
          const { webpackSet } = NS.curtFiles;
          const { webpack } = config;
          webpackSet.add(join(webpack.src, _path));
          break;
      }
    } else {
      destSet.add(join(dest, _path, 'index.html'));
      destSet.add(join(dest, _path, 'index.php'));
      pugSet.add(join(pug.src, _path, 'index.pug'));
    }

    next();
  }

}
