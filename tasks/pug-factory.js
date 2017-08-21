import PugBase from './pug-base';
import config from '../tasks-config';
import { readFileSync } from 'fs';
import { join, relative } from 'path';
import { mkfile } from './utility/file';
import { getType } from './utility/type';
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
    this._watchOther(join(factorys, '**/*.pug'));
  }

  /**
   * @return {Promsie}
   */
  _buildAll() {
    const { factorys } = config.pug;
    return super._buildAll('pug', join(factorys, '**/*.json'), true);
  }

  /**
   * @param {string} path
   * @return {Promise}
   */
  _build(path) {
    const { argv, isFirstBuild } = NS;
    const { charset, root, dest } = config.pug;
    const { pugSet } = NS.curtFiles;
    const { _pugOpts } = this;
    const _buf  = readFileSync(path);
    const _tmps = (() => {
      try {
        return JSON.parse(_buf.toString());
      }
      catch(e) {
        console.log(e);
        return null;
      }
    })();
    if(!_tmps) return Promise.resolve();
    return Promise.all(Object.entries(_tmps).map(([tmpFile, pages]) => {
      const _tmpBuf   = readFileSync(join(root, tmpFile));
      const _tmp      = _tmpBuf.toString();
      const _splitTmp = _tmp.split('{{vars}}');
      return Promise.all(Object.entries(pages).map(([srcPath, vals]) => {
        return (async() => {
          if(!isFirstBuild && (argv['viewing-update'] || argv['viewing-update-pug'])) {
            if(!pugSet.has(srcPath)) return;
          }
          const _valsStr = Object.entries(vals).reduce((memo, [key, val]) => {
            return `${ memo }  - var ${ key } = ${ JSON.stringify(val) }\n`;
          }, '');
          const _contents = _splitTmp[0] + _valsStr + _splitTmp[1];
          const _members  = this._getMembers(join(root, srcPath));
          const _opts     = Object.assign(_pugOpts, _members);
          let _html = await new Promise((resolve) => {
            pug.render(_contents, _opts, (err, html) => {
              if(err) {
                console.log(err.Error);
                resolve(null);
              }
              resolve(html);
            });
          });
          if(!_html) return;
          if(charset !== 'utf8') {
            _html = iconv.encode(_html, charset).toString();
          }
          const _ext  = this._getExt(srcPath);
          const _dest = join(dest, srcPath).replace('.pug', _ext);
          await mkfile(_dest, _html);
          console.log(`# Created -> ${ _dest }`);
        })();
      }));
    }));
  }

}
