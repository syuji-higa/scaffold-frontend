import PugBase from './pug-base';
import config from '../tasks-config';
import { readFileSync } from 'fs';
import { join, relative } from 'path';
import { mkfile } from './utility/file';
import pug from 'pug';
import iconv from 'iconv-lite';

export default class PugFactory extends PugBase {

  constructor() {
    super('pug-factory');
  }

  _watch() {
    const { factorys } = config.pug;

    // init
    this._watchInit(join(factorys, '**/*.+(pug|json)'));

    // factorys json
    this._watchSrc(join(factorys, '**/*.json'));

    // factory template
    const { argv } = NS;
    if(!argv['pug-factory-watch-src']) {
      this._watchOther(join(factorys, '**/*.pug'));
    }
  }

  /**
   * @return {Promsie}
   */
  _buildAll() {
    const { factorys } = config.pug;
    return super._buildAll('pugSet', join(factorys, '**/*.json'));
  }

  /**
   * @param {string} path
   * @return {Promise}
   */
  _build(path) {
    const { _pugOpts } = this;
    const { charset, root, dest } = config.pug;
    const _buf  = readFileSync(path);
    const _tmps = JSON.parse(_buf.toString());
    return Promise.all(Object.entries(_tmps).map(([tmpFile, pages]) => {
      const _tmpBuf   = readFileSync(join(root, tmpFile));
      const _tmp      = _tmpBuf.toString();
      const _splitTmp = _tmp.split('{{vars}}');
      return Promise.all(Object.entries(pages).map(([pageFile, vals]) => {
        return (async() => {
          const _valsStr = Object.entries(vals).reduce((memo, [key, val]) => {
            return `${ memo }  - var ${ key } = ${ JSON.stringify(val) }\n`;
          }, '');
          const _contents = _splitTmp[0] + _valsStr + _splitTmp[1];
          const _members  = this._getMembers(join(root, pageFile));
          const _opts     = Object.assign(_pugOpts, _members);
          let _html = pug.render(_contents, _opts);
          if(charset !== 'utf8') {
            _html = iconv.encode(_html, charset).toString();
          }
          const _dest = join(dest, pageFile).replace('.pug', '.html');
          await mkfile(_dest, _html);
          console.log(`# Created -> ${ _dest }`);
        })();
      }));
    }));
  }

}
