import config from '../tasks-config';
import { join, relative, dirname, extname } from 'path';
import TaskLog from './utility/task-log';
import { errorLog } from './utility/error-log';
import { mkfile, sameFile } from './utility/file';
import { fileLog } from './utility/file-log';
import { readFile } from './utility/fs';
import { glob } from './utility/glob';
import imagemin from 'imagemin';
import pngquant from 'imagemin-pngquant';
import jpegtran from 'imagemin-jpegtran';
import gifsicle from 'imagemin-gifsicle';
import svgo from 'imagemin-svgo';

export default class Imagemin {

  constructor() {
    this._taskLog = new TaskLog('imagemin');
    this._plugins = {
      png: pngquant({ quality: 100, speed: 1 }),
      jpg: jpegtran({ progressive: true }),
      gif: gifsicle(),
      svg: svgo(),
    };
  }

  /**
   * @return {Promsie}
   */
  start() {
    return this._minifyMultiple();
  }

  /**
   * @return {Promsie}
   */
  _minifyMultiple() {
    const { minify } = config.images;
    const { _taskLog } = this;

    return (async () => {
      _taskLog.start();
      const _paths = await glob(join(minify, '**/*.+(png|jpg|gif|svg)'));
      await Promise.all(_paths.map((p) => this._minify(p)));
      _taskLog.finish();
    })();
  }

  /**
   * @param {string} path
   * @return {Promsie}
   */
  _minify(path) {
    const { minify, dest } = config.images;
    const { _plugins } = this;

    return (async () => {
      const _dest = join(dest, relative(minify, path));
      const _ext  = extname(path).replace('.', '');
      const _buf  = await readFile(path, (err) => errorLog('imagemin', err));
      if(!_buf) return;

      const _minBuf = await imagemin.buffer(_buf, { plugins: [_plugins[_ext]] });
      const _isSame = await sameFile(_dest, _minBuf);
      if(!_isSame) {
        await mkfile(_dest, _minBuf.toString('base64'), 'base64');
        fileLog('create', _dest);
      }
    })();
  }

}
