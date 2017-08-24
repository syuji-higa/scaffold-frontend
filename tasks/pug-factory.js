import PugBase from './pug-base';
import config from '../tasks-config';
import { readFileSync } from 'fs';
import { join, relative } from 'path';
import { mkfile, sameFile } from './utility/file';
import { fileLog } from './utility/file-log';
import { getType } from './utility/type';
import pug from 'pug';
import iconv from 'iconv-lite';

export default class PugFactory extends PugBase {

  constructor() {
    super('pug-factory');
  }

  _watch() {
    const { factory } = config.pug;

    // init
    this._watchInit(join(factory, '**/*.+(pug|json)'));

    // factory json
    this._watchSrc(join(factory, '**/*.json'));

    // factory template
    this._watchOther(join(factory, '**/*.pug'));
  }

  /**
   * @return {Promsie}
   */
  _buildAll() {
    const { factory } = config.pug;
    return super._buildAll('pug', join(factory, '**/*.json'), true);
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
      const _tmpBuf   = readFileSync(join(root, `${ tmpFile }.pug`));
      const _tmp      = _tmpBuf.toString();
      const _splitTmp = _tmp.split('{{vars}}');

      return Promise.all(Object.entries(pages).map(([srcPath, vals]) => {
        const _srcPath = `${ srcPath }.pug`;

        return (async() => {
          if(!isFirstBuild && (argv['viewing-update'] || argv['viewing-update-pug'])) {
            if(!pugSet.has(_srcPath)) return;
          }

          const _valsStr = Object.entries(vals).reduce((memo, [key, val]) => {
            return `${ memo }  - var ${ key } = ${ JSON.stringify(val) }\n`;
          }, '');
          const _contents = _splitTmp[0] + _valsStr + _splitTmp[1];
          const _members  = this._getMembers(join(root, _srcPath));
          const _opts     = Object.assign(_pugOpts, _members);
          let _html = await new Promise((resolve) => {
            pug.render(_contents, _opts, (err, html) => {
              if(err) {
                console.log(err.message);
                return resolve(null);
              }
              resolve(html);
            });
          });
          if(!_html) return;
          if(charset !== 'utf8') {
            _html = iconv.encode(_html, charset).toString();
          }

          const _ext  = this._getExt(_srcPath);
          const _dest = join(dest, _srcPath).replace('.pug', _ext);
          const _isSame = await sameFile(_dest, _html);
          if(!_isSame) {
            await mkfile(_dest, _html);
            fileLog('create', _dest);
          }
        })();
      }));
    }));
  }

}
