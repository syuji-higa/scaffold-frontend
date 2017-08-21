import config from '../tasks-config';
import { join } from 'path';
import bs from 'browser-sync';
import Log from './utility/log';
import chokidar from 'chokidar';

const browserSync        = bs.create();
const browserSyncUrlList = bs.create();

export default class BrowserSync {

  constructor() {
    this._log = new Log('browser-sync');
  }

  /**
   * @return {Promsie}
   */
  start() {
    const { path, urlList } = config;
    const { argv } = NS;
    const { _log } = this;
    return (async () => {
      _log.start();
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
                middleware: this._middleware,
                baseDir   : path.dest,
              },
            });
          } else {
            Object.assign(_opts, {
              middleware: this._middleware,
              proxy     : '0.0.0.0:3010',
            });
          }
          browserSync.init(_opts, resolve);
        }),
      ]);
      this._watch();
    })();
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   */
  _middleware(req, res, next) {
    const _urlStrs = req.url.match(/^([^.]+(\.[^/]+)?).*?$/);
    const _path    = _urlStrs[1];
    const _ext     = _urlStrs[2];

    const { destSet, pugSet } = NS.curtFiles;
    const { path: { dest }, pug } = config;

    if(_ext) {
      destSet.add(join(dest, _path));
      switch(_ext) {
        case '.html':
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

}
