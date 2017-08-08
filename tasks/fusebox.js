import Base from './base';
import config from '../tasks-config';
import { readFileSync } from 'fs';
import { join, relative, dirname, basename } from 'path';
import { mkfile } from './utility/file';
import { glob } from './utility/glob';
import FileCache from './utility/file-cache';
import Log from './utility/log';
import chokidar from 'chokidar';
import { FuseBox, BabelPlugin, UglifyESPlugin } from 'fuse-box';
import iconv from 'iconv-lite';

export default class Fusebox extends Base {

  get _notMinifyFileNameSet() {
    return new Set(['vendor']);
  }

  constructor() {
    super('fusebox');
  }

  _watch() {
    const { root, src, imports } = config.fusebox;

    // init
    this._watchInit(join(root, '**/*.js'));

    // src
    this._watchSrc(join(src, '**/*.js'));

    // extend or include
    const { argv } = NS;
    if(argv['all-watch'] || argv['fusebox-all-watch']) {
      this._watchOther(join(imports, '**/*.js'));
    }
  }

  /**
   * @return {Promsie}
   */
  _buildAll() {
    const { src } = config.fusebox;
    return super._buildAll('fuseboxSet', join(src, '**/*.js'));
  }

  /**
   * @param {string} file
   * @param {Promise}
   */
  _build(file) {
    const { charset, src, dest } = config.fusebox;
    const { argv } = NS;
    return (async() => {
      const _root     = relative(src, file);
      const _dest     = join(dest, _root);
      const _destDir  = dirname(_dest);
      const _destName = basename(_dest, '.js');
      const _plugins  = [
        BabelPlugin({
          extensions: ['.js'],
          test      : /\.js$/,
        }),
      ];
      const { _notMinifyFileNameSet } = this;
      if(argv['production'] && !_notMinifyFileNameSet.has(_destName)) {
        _plugins.push(UglifyESPlugin());
      }
      const _fuse = FuseBox.init({
        homeDir   : src,
        output    : `${ _destDir }/$name.js`,
        sourceMaps: !argv['production'],
        cache     : false,
        // writeBundles: false,
        natives: {
          stream : false,
          Buffer : false,
          http   : false,
        },
        plugins: _plugins,
      });
      _fuse.bundle(_destName).instructions(`>${ _root }`).target('browser');
      await _fuse.run();
      // TODO character code convert
      // await _fuse.run().then((producer) => {
      //   const _bundle = producer.bundles.get(_destName);
      //   console.log(_bundle.context.output.lastPrimaryOutput);
      // });
      // if(charset !== 'utf8') {
      //   _js = iconv.encode(_js, charset).toString();
      // }
      // await mkfile(_dest, _js);
      console.log(`# Created -> ${ _dest }`);
      if(!argv['production']) {
        console.log(`# Created -> ${ _dest }.map`);
      }
    })();
  }

}
