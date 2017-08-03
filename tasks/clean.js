import config from '../tasks-config';
import { unlink } from 'fs';
import Log from './utility/log';
import { glob } from './utility/glob';

export default class Clean {

  constructor() {
    this._log = new Log('clean');
  }

  /**
   * @return {Promsie}
   */
  start() {
    const { _log } = this;

    return (async () => {
      const { deletes } = config;

      _log.start();
      const _paths = await glob(deletes);
      if(_paths) {
        await Promise.all(_paths.map((path) => {
          return new Promise((resolve) => {
            unlink(path, (err) => {
              if(err) console.log(err);
              console.log(`#Deleted -> ${ path }`);
              resolve();
            });
          });
        }));
      }
      _log.finish();
    })();
  }

}
