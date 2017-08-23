import config from '../tasks-config';
import { readFile } from 'fs';
import { join, dirname, extname } from 'path';
import bs from 'browser-sync';
import TaskLog from './utility/task-log';
import { errorLog } from './utility/error-log';
import chokidar from 'chokidar';

const browserSync        = bs.create();
const browserSyncUrlList = bs.create();

export default class BrowserSync {

  constructor() {
    this._taskLog = new TaskLog('browser-sync');
  }

  /**
   * @return {Promsie}
   */
  start() {
    const { path, urlList } = config;
    const { argv } = NS;
    const { _taskLog } = this;
    return (async () => {
      _taskLog.start();
      await Promise.all([
        new Promise((resolve) => {
          browserSyncUrlList.init({
            server: {
              baseDir: urlList.root,
            },
            port                : 3002,
            ui                  : false,
            open                : false,
            notify              : false,
            reloadOnRestart     : true,
            scrollProportionally: false,
          }, resolve);
        }),
        new Promise((resolve) => {
          const _opts = {
            open                : false,
            notify              : false,
            reloadOnRestart     : true,
            scrollProportionally: false,
          };
          if(!argv['php']) {
            Object.assign(_opts, {
              server: {
                middleware: [this._replace.bind(this), this._setViewingFile.bind(this)],
                baseDir   : path.dest,
              },
            });
          } else {
            Object.assign(_opts, {
              middleware: [this._replace.bind(this), this._setViewingFile.bind(this)],
              proxy     : '0.0.0.0:3010',
            });
          }
          browserSync.init(_opts, resolve);
        }),
      ]);
      if(!argv['production']) {
        this._watch();
      }
    })();
  }

  _watch() {
    const { dest } = config.path;
    const { destSet } = NS.curtFiles;

    // compile files
    chokidar.watch(join(dest, '**/*.(html|php|css|js)'), { ignoreInitial: true })
      .on('all', (event, path) => {
        if(![...destSet].includes(path)) return;
        browserSync.reload(path);
      });

    // image files
    chokidar.watch(join(dest, '**/*.(png|jpg|jpeg|gif|svg)'), { ignoreInitial: true })
      .on('all', (event, path) => {
        browserSync.reload(path);
      });
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   */
  _replace(req, res, next) {
    const _urlStrs = req.url.match(/^([^.]+(\.(.+))?)?$/);

    if(!_urlStrs) {
      return next();
    }

    const _path = (() => {
      const _p = _urlStrs[2] ? _urlStrs[0] : join(_urlStrs[0], 'index.html');
      const { dest } = config.path;
      return join(dest, _p);
    })();

    if(err) return next();
    switch(extname(_path)) {
      case '.html':
      case '.shtml':
        readFile(_path, (err, buf) => {
          if(err) {
            return next();
          }
          (async() => {
            let _html = buf.toString();
            _html = await this._ssi(dirname(_path), _html);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(_html);
          })();
        });
        break;
      default:
        next();
    }
  }

  /**
   * @param {string} dir
   * @param {string} html
   * @return {Promise}
   */
  _ssi(dir, html) {
    return html.replace(/<!--#include file="(.+)" -->/g, (str, path) => {
      const _path = join(dir, path);
      return new Promise((resolve) => {
        readFile(_path, (err, buf) => {
          if(err) {
            errorLog('browser-sync ssi', `No such file, open '${ _path }'.`);
            resolve('');
          }
          resolve(buf.toString());
        });
      });
    });
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
