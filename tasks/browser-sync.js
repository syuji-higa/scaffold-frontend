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

    const _path = _urlStrs[1];
    const _ext  = _urlStrs[2];

    const { dest } = config.path;
    const { destSet, pugSet, stylusSet, jsSet } = NS.curtFiles;

    if(_ext) {
      destSet.add(join(dest, _path));
    } else {
      destSet.add(join(dest, _path, 'index.html'));
      pugSet.add(join(_path, 'index.pug'));
    }

    switch(_ext) {
      case '.html':
      case '.php':
        pugSet.add(_path.replace(_ext, '.pug'));
        break;
      case '.css':
        stylusSet.add(_path.replace(_ext, '.styl'));
        break;
      case '.js':
        jsSet.add(_path);
        break;
    }

    // console.log(NS.curtFiles);

    // if(_otherUrl) {
    //   const { dest } = config.path;
    //   const _url = join(__dirname, dest, _otherUrl[1]);
    //   if((viewPageFiles.length === 0) || viewPageFiles.every((file) => _url !== file)) {
    //     viewPageFiles.push(_url);
    //   }
    // }
    //
    // if(_pageUrl && _exclusionFiles.every((file) => (file !== _pageUrl[0]))) {
    //   NS.curtPage = _pageUrl[0].match(/\/$/) ? `${ _pageUrl[0] }index.html` : _pageUrl[0];
    // }
    next();
  }

  _watch() {
    const { dest } = config.path;
    const { destSet } = NS.curtFiles;

    // compile files
    chokidar.watch(join(dest, '**/*.(html|php|css|js)'), { ignoreInitial: true })
      .on('all', (event, path) => {
        if(![...destSet].includes(path)) return;
        console.log('reloaded');
        browserSync.reload(path);
      });

    // image files
    chokidar.watch(join(dest, '**/*.(png|jpg|jpeg|gif|svg)'), { ignoreInitial: true })
      .on('all', (event, path) => {
        browserSync.reload(path);
      });
  }

}
