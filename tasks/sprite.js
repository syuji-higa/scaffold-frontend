import config from '../tasks-config';
import { join, relative, dirname } from 'path';
import FileCache from './utility/file-cache';
import Log from './utility/log';
import { glob } from './utility/glob';
import { mkfile } from './utility/file';
import chokidar from 'chokidar';
import Spritesmith from 'spritesmith';
import imagemin from 'imagemin';
import pngquant from 'imagemin-pngquant';

export default class Sprite {

  get _pngquantOpts() {
    return {
      quality: 100,
      speed  : 1,
    };
  }

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
    this._log       = new Log('sprite');
    this._fileCache = new FileCache();
  }

  /**
   * @return {Promsie}
   */
  start() {
    return (async () => {
      await this._build();
      new Log('watch sprite').start();
      this._watch();
    })();
  }

  _watch() {
    const { sprite } = config.images;

    // sprite
    chokidar.watch(join(sprite, '**/*.png'), { ignoreInitial: true })
      .on('all', (evt, path) => {
        if(!evt.match(/(add|unlink|change)/)) return;
        console.log(`# ${ evt } -> ${ path }`);
        const { root } = config.path;
        this._build();
      });
  }

  /**
   * @return {Promsie}
   */
  _build() {
    const { sprite, styleDest } = config.images;
    const { _log, _fileCache } = this;
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
      if(_css && _fileCache.mightUpdate(styleDest, new Buffer(_css, 'utf8'))) {
        await mkfile(styleDest, _css);
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
    const { sprite } = config.images;
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
    const { sprite, dest } = config.images;
    const { _pngquantOpts, _spriteOpts, _fileCache } = this;

    return new Promise((resolve) => {
      Spritesmith.run(Object.assign({ src: paths }, _spriteOpts), (err, result) => {
        if(err) throw new Error(err);
        const { coordinates, properties, image } = result;
        const _key  = `${ key }.png`;
        const _dest = join(dest, _key);
        (async() => {
          const _img = await this._getImgBuf(image);
          if(_fileCache.mightUpdate(_dest, _img)) {
            await mkfile(_dest, _img.toString('base64'), 'base64');
            console.log(`# Created -> ${ _dest }`);
          };
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

  /**
   * @param {Buffer} buf
   */
  _getImgBuf(buf) {
    const { argv } = NS;
    if(argv['production']) {
      const { _pngquantOpts } = this;
      return imagemin.buffer(buf, {
        plugins: [pngquant(_pngquantOpts)],
      });
    } else {
      return new Promise((resolve) => {
        return resolve(buf);
      });
    }
  }

}
