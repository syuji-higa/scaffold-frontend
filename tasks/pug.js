import PugBase from './pug-base';
import config from '../tasks-config';
import { join, relative } from 'path';
import { errorLog } from './utility/error-log';
import { mkfile, sameFile } from './utility/file';
import { fileLog } from './utility/file-log';
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
    this._watchOther(join(tmp, '**/*.pug'));
  }

  /**
   * @return {Promsie}
   */
  _buildAll() {
    const { src } = config.pug;
    return super._buildAll('pug', join(src, '**/*.pug'), true);
  }

  /**
   * @param {string} path
   * @param {Promise}
   */
  _build(path) {
    const { charset, src, dest } = config.pug;
    const { _pugOpts } = this;

    return (async() => {
      const _ext  = this._getExt(relative(src, path));
      const _dest = join(dest, relative(src, path)).replace('.pug', _ext);
      const _opts = Object.assign(_pugOpts, this._getMembers(path));

      let _html = await new Promise((resolve, reject) => {
        pug.renderFile(path, _opts, (err, html) => {
          if(err) return reject(err);
          resolve(html);
        });
      })
        .catch((err) => {
          errorLog('pug', err.message);
        });

      if(!_html) return;
      if(charset !== 'utf8') {
        _html = iconv.encode(_html, charset).toString();
      }

      const _isSame = await sameFile(_dest, _html);
      if(!_isSame) {
        await mkfile(_dest, _html);
        fileLog('create', _dest);
      }
    })();
  }

}
