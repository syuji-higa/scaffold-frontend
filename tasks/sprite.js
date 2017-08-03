import config from '../tasks-config';
import { join, relative, dirname, extname } from 'path';
import Log from './utility/log';
import { glob } from './utility/glob';
import { mkfile } from './utility/file';
import Spritesmith from 'spritesmith';

export default class Spraite {

  get _spriteOpts() {
    return {
      algorithm    : 'top-down',
      algorithmOpts: { sort: false },
    };
  }

  get _mixin() {
    return `sprite(filepath, scale = 1)
  image-hash = sprite-hash[filepath]
  if !image-hash
    error('Not found image file ' + filepath + '.')
  width: (image-hash.width * scale)px
  height: (image-hash.height * scale)px
  url = image-hash.url
  background: url(url) no-repeat
  background-position: (-1 * image-hash.x * scale)px (-1 * image-hash.y * scale)px
  if scale != 1
    background-size: (image-hash.width * scale)px, (image-hash.height * scale)px
sprite-retina(filepath)
  sprite filepath, 0.5`;
  }

  constructor() {
    this._log    = new Log('sprite');
    this._dirSet = new Set();
  }

  /**
   * @return {Promsie}
   */
  start() {
    return this._build();
  }

  /**
   * @return {Promsie}
   */
  _build() {
    const { sprite, styleDest } = config.image;
    const { _log } = this;
    return (async () => {
      _log.start();
      const _paths   = await glob(join(sprite, '**/*.+(png|jpg|gif|svg)'));
      const _pathMap = this._groupBy(_paths);
      const _spritehashs = await Promise.all((() => {
        const _promises = [];
        _pathMap.forEach((paths, key) => {
          _promises.push(this._spritesmith(key, paths));
        });
        return _promises;
      })());
      const _css = this._getCss(this._flatten(_spritehashs));
      if(_css) {
        await mkfile(styleDest, _css.toString());
        console.log(`# Created -> ${ styleDest }`);
      }
      _log.finish();
    })();
  }

  /**
   * @param {Array} paths
   * @return {Map}
   */
  _groupBy(paths) {
    const { sprite } = config.image;
    return paths.reduce((memo, path) => {
      const _dir  = dirname(relative(sprite, path));
      if(!memo.has(_dir)) memo.set(_dir, []);
      memo.get(_dir).push(path);
      return memo;
    }, new Map());
  }

  /**
   * @param {string} key
   * @param {Array<string>} paths
   * @return {Promsie}
   */
  _spritesmith(key, paths) {
    const { sprite, dest } = config.image;
    const { _spriteOpts } = this;

    return new Promise((resolve) => {
      Spritesmith.run(Object.assign({ src: paths }, _spriteOpts), (err, result) => {
        if(err) throw new Error(err);
        const { coordinates, properties, image } = result;
        const _key  = `${ key }.png`;
        const _dest = join(dest, _key);
        (async() => {
          await mkfile(_dest, image.toString('base64'), 'base64');
          console.log(`# Created -> ${ _dest }`);
          resolve(Object.entries(coordinates).reduce((memo, [path, style]) => {
            memo[relative(sprite, path)] = Object.assign(style, { url: _key });
            return memo;
          }, {}));
        })();
      });
    });
  }

  /**
   * @param {object} hash
   * @return {string}
   */
  _getCss(hash) {
    if(!Object.keys(hash).length) return '';
    const { _mixin } = this;
    return `sprite-hash = ${ JSON.stringify(hash) }
${ _mixin }`;
  }

  /**
   * @param {Array<Object>} arr
   * @return {Object}
   */
  _flatten(arr) {
    return arr.reduce((memo, obj) => {
      Object.assign(memo, obj);
      return memo;
    }, {});
  }

}