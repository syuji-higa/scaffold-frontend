import config from '../tasks-config';
import { join, relative, dirname, extname } from 'path';
import TaskLog from './utility/task-log';
import { glob } from './utility/glob';
import { mkfile } from './utility/file';
import { fileLog } from './utility/file-log';
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
      const _dest = dirname(join(dest, relative(minify, path)));
      const _ext  = extname(path).replace('.', '');
      const _files = await imagemin([path], _dest, {
        plugins: [_plugins[_ext]],
      });
      const { data, path: __dest } = _files[0];
      await mkfile(__dest, data.toString('base64'), 'base64');
      fileLog('create', __dest);
    })();
  }

}
