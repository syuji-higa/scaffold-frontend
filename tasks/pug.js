import PugBase from './pug-base';
import config from '../tasks-config';
import { join, relative } from 'path';
import { mkfile } from './utility/file';
import pug from 'pug';
import iconv from 'iconv-lite';

export default class Pug extends PugBase {

  constructor() {
    super('pug');
  }

  _watch() {
    const { src, tmp } = config.pug;

    // init
    this._watchInit(join(src, '**/*.pug'));
    this._watchInit(join(tmp, '**/*.pug'));

    // src
    this._watchSrc(join(src, '**/*.pug'));

    // extend or include
    const { argv } = NS;
    if(!argv['pug-watch-src']) {
      this._watchOther(join(tmp, '**/*.pug'));
    }
  }

  /**
   * @return {Promsie}
   */
  _buildAll() {
    const { src } = config.pug;
    super._buildAll('pugSet', join(src, '**/*.pug'));
  }

  /**
   * @param {string} path
   * @param {Promise}
   */
  _build(path) {
    const { charset, src, dest } = config.pug;
    const { _pugOpts } = this;
    return (async() => {
      const _dest = join(dest, relative(src, path)).replace('.pug', '.html');
      const _opts = Object.assign(_pugOpts, this._getMembers(path));
      let _html = pug.renderFile(path, _opts);
      if(charset !== 'utf8') {
        _html = iconv.encode(_html, charset).toString();
      }
      await mkfile(_dest, _html);
      console.log(`# Created -> ${ _dest }`);
    })();
  }

}
