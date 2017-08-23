import Base from './base';
import config from '../tasks-config';
import { readFileSync } from 'fs';
import MemoryFS from 'memory-fs';
import { join, relative, dirname, basename } from 'path';
import { mkfile } from './utility/file';
import { fileLog } from './utility/file-log';
import { glob } from './utility/glob';
import FileCache from './utility/file-cache';
import chokidar from 'chokidar';
import webpack from 'webpack';
import iconv from 'iconv-lite';

const fs = new MemoryFS();

export default class Webpack extends Base {

  get _notMinifyFileNameSet() {
    return new Set(['vendor']);
  }

  get _webpackOpts() {
    const { root } = config.path;
    return {
      resolve: {
        descriptionFiles: ['package.json'],
        extensions      : ['.js'],
        modules: [
          join(root, 'webpack/imports'),
          'node_modules',
        ],
        alias: {},
      },
      module : {
        rules: [
          {
            test: /\.js$/,
            loader : 'babel-loader',
            options: {
              presets: ['latest', 'stage-0'],
            },
            exclude: /node_modules/,
          }
        ],
      },
      devtool: 'source-map',
      plugins: [],
    };
  }

  get _productionPlugins() {
    return [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug   : false,
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress : true,
        mangle   : true,
        beautify : false,
        output   : { comments: false },
        sourceMap: false,
      }),
    ];
  }

  constructor() {
    super('webpack');
  }

  _watch() {
    const { root, src, imports } = config.webpack;

    // init
    this._watchInit(join(root, '**/*.js'));

    // src
    this._watchSrc(join(src, '**/*.js'));

    // extend or include
    this._watchOther(join(imports, '**/*.js'));
  }

  /**
   * @return {Promsie}
   */
  _buildAll() {
    const { src } = config.webpack;
    return super._buildAll('webpack', join(src, '**/*.js'));
  }

  /**
   * @param {string} file
   * @param {Promise}
   */
  _build(file) {
    const {
      path   : { root },
      webpack: { charset, src, dest },
    } = config;
    const { argv } = NS;
    return (async() => {
      const _root     = relative(src, file);
      const _dest     = join(dest, _root);
      const _destDir  = dirname(_dest);
      const _destFile = basename(_dest);
      const { _notMinifyFileNameSet, _webpackOpts, _productionPlugins } = this;
      const _opts = Object.assign({
        entry: join(root, file),
        output: {
          path    : join(root, _destDir),
          filename: _destFile,
        },
      }, _webpackOpts);
      if(argv['production'] && !_notMinifyFileNameSet.has(_destName)) {
        Object.assign(_opts.plugins, _productionPlugins);
      }
      const _compiler = webpack(_opts);
      _compiler.outputFileSystem = fs;
      const _data = await new Promise((resolve) => {
        _compiler.run((err, stats) => {
          if(err) {
            console.log(err);
            return resolve();
          }
          const _err = stats.compilation.errors;
          if(_err.length) {
            console.log(_err[0].message);
            return resolve();
          }
          const _path      = join(root, _destDir, _destFile);
          const _js        = readFileSync(_path);
          const _sourcemap = readFileSync(`${ _path }.map`);
          resolve({ js: _js, sourcemap: _sourcemap });
        });
      });
      if(!_data) return;
      let { js, sourcemap } = _data;
      if(charset !== 'utf8') {
        js = iconv.encode(js, charset).toString();
      }
      await mkfile(_dest, js);
      fileLog('create', _dest);
      if(!argv['production']) {
        const _mapPath = `${ _dest }.map`;
        await mkfile(_mapPath, sourcemap);
        fileLog('create', _mapPath);
      }
    })();
  }

}
