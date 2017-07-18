import config from '../tasks-config';
import { join } from 'path';
import bs from 'browser-sync';
import Log from './utility/log';
import chokidar from 'chokidar';

const browserSync = bs.create();

export default class BrowserSync {

  constructor() {
    this._log = new Log('browser-sync');
  }

  /**
   * @return {Promsie}
   */
  start() {
    const { dest } = config.path;
    const { _log } = this;
    return (async () => {
      _log.start();
      await new Promise((resolve) => {
        browserSync.init({
          server: {
            baseDir   : dest,
            middleware: this._middleware,
          },
          open           : false,
          notify         : false,
          reloadOnRestart: true,
        }, resolve);
      })
      this._watch();
      _log.finish();
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
          const { jsSet } = NS.curtFiles;
          const { js } = config;
          jsSet.add(join(js.src, _path));
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
