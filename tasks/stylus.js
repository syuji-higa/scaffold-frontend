import Base from './base';
import config from '../tasks-config';
import { readFileSync } from 'fs';
import { join, relative, basename } from 'path';
import { mkfile, sameFile } from './utility/file';
import { fileLog } from './utility/file-log';
import stylus from 'stylus';
import nib from 'nib';
import iconv from 'iconv-lite';

export default class Stylus extends Base {

  constructor() {
    super('stylus');
  }

  _watch() {
    const { root, src, imports } = config.stylus;

    // init
    this._watchInit(join(root, '**/*.styl'));

    // src
    this._watchSrc(join(src, '**/*.styl'));

    // extend or include
    this._watchOther(join(imports, '**/*.styl'));
  }

  /**
   * @return {Promsie}
   */
  _buildAll() {
    const { src } = config.stylus;
    return super._buildAll('stylus', join(src, '**/*.styl'));
  }

  /**
   * @param {string} path
   * @param {Promise}
   */
  _build(path) {
    const { path: { root }, stylus: { charset, src, dest } } = config;
    const { argv } = NS;

    return (async() => {
      const _str = readFileSync(join(root, path), 'utf-8');
      const _stylus = stylus(_str)
        .use(nib())
        .set('filename', basename(path))
        .set('include css', true)
        .set('resolve url', true)
        .define('url', stylus.resolver())
        .set('compress', argv['production'])
        .set('sourcemap', !argv['production']);

      let _css = await new Promise((resolve) => {
        _stylus.render((err, css) => {
          if(err) {
            console.log(err.message);
            return resolve(null);
          }
          resolve(css);
        });
      });
      if(!_css) return;
      if(charset !== 'utf8') {
        _css = iconv.encode(_css, charset).toString();
      }

      const _dest   = join(dest, relative(src, path)).replace('.styl', '.css');
      const _isSame = await sameFile(_dest, _css);
      if(!_isSame) {
        await mkfile(_dest, _css);
        fileLog('create', _dest);
        const { sourcemap } = _stylus;
        if(sourcemap) {
          const _mapDest = `${ _dest }.map`;
          await mkfile(_mapDest, JSON.stringify(sourcemap));
          fileLog('create', _mapDest);
        }
      }
    })();
  }

}
