import Base from './base';
import config from '../tasks-config';
import { readFileSync } from 'fs';
import { join, relative, basename } from 'path';
import { mkfile } from './utility/file';
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
    const { argv } = NS;
    if(!argv['stylus-watch-src']) {
      this._watchOther(join(imports, '**/*.styl'));
    }
  }

  /**
   * @return {Promsie}
   */
  _buildAll() {
    const { src } = config.stylus;
    super._buildAll('stylusSet', join(src, '**/*.styl'));
  }

  /**
   * @param {string} file
   * @param {Promise}
   */
  _buildSingle(file) {
    const { path: { root }, stylus: { charset, src, dest } } = config;
    const { argv } = NS;
    return (async() => {
      const _str = readFileSync(join(root, file), 'utf-8');
      const _stylus = stylus(_str)
        .use(nib())
        .set('filename', basename(file))
        .set('include css', true)
        .set('resolve url', true)
        .define('url', stylus.resolver())
        .set('compress', argv['production'])
        .set('sourcemap', !argv['production']);
      let _css = _stylus.render();
      if(charset !== 'utf8') {
        _css = iconv.encode(_css, charset).toString();
      }
      const _dest = join(dest, relative(src, file)).replace('.styl', '.css');
      await mkfile(_dest, _css);
      console.log(`# Created -> ${ _dest }`);
      if(!argv['production']) {
        const _sourcemapDest = `${ _dest }.map`;
        await mkfile(_sourcemapDest, JSON.stringify(_stylus.sourcemap));
        console.log(`# Created -> ${ _sourcemapDest }`);
      }
    })();
  }

}
