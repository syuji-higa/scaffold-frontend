import config from '../tasks-config';
import { unlink } from 'fs';
import Log from './utility/log';
import { glob } from './utility/glob';

export default class Clean {

  constructor() {
    this._log = new Log('clean');
  }

  /**
   * @return {!Promsie}
   */
  start() {
    const { _log } = this;

    return (async () => {
      const { deletes } = config;

      _log.start();
      const _delFiles = await glob(deletes);
      if(_delFiles) {
        await Promise.all(_delFiles.map((file, i) => {
          if(i === 0) console.log('# Deleted files');
          return new Promise((resolve) => {
            unlink(file, (err) => {
              if(err) console.log(err);
              console.log(`  - ${ file }`);
              resolve();
            });
          });
        }));
      }
      _log.finish();
    })();
  }

}
