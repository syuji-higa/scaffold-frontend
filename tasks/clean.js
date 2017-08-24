import config from '../tasks-config';
import { unlink } from 'fs';
import TaskLog from './utility/task-log';
import { glob } from './utility/glob';
import { fileLog } from './utility/file-log';

export default class Clean {

  constructor() {
    this._taskLog = new TaskLog('clean');
  }

  /**
   * @return {Promsie}
   */
  start() {
    const { _taskLog } = this;

    return (async () => {
      _taskLog.start();
      const { deletes } = config;
      const _paths = await glob(deletes);
      if(_paths) {
        await Promise.all(_paths.map((path) => {
          return new Promise((resolve) => {
            unlink(path, (err) => {
              if(err) console.log(err);
              fileLog('unlink', path);
              resolve();
            });
          });
        }));
      }
      _taskLog.finish();
    })();
  }

}
