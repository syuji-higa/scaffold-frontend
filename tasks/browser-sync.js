import config from '../tasks-config';
import bs from 'browser-sync';
import Log from './utility/log';

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
            // middleware: browserSyncMiddleware,
          },
          open           : false,
          notify         : false,
          reloadOnRestart: true,
          // directory      : true,
        }, resolve);
      })
      _log.finish();
    })();
  }

}
