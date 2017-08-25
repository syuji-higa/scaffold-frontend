import Base from './base';
import config from '../tasks-config';
import MemoryFS from 'memory-fs';
import { join, relative, dirname, basename } from 'path';
import FileCache from './utility/file-cache';
import { errorLog } from './utility/error-log';
import { mkfile, sameFile } from './utility/file';
import { fileLog } from './utility/file-log';
import { glob } from './utility/glob';
import { encodeLineFeedCode } from './utility/line-feed-code';
import chokidar from 'chokidar';
import webpack from 'webpack';
import iconv from 'iconv-lite';

const memoryFs = new MemoryFS();

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
      webpack: { charset, lineFeedCode, src, dest },
    } = config;
    const { argv } = NS;

    return (async () => {
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

      if(argv['production'] && !_notMinifyFileNameSet.has(basename(_destFile, '.js'))) {
        Object.assign(_opts.plugins, _productionPlugins);
      }

      const _compiler = webpack(_opts);
      _compiler.outputFileSystem = memoryFs;
      const { jsBuf, sourcemapBuf } = await new Promise((resolve) => {
        _compiler.run((err, stats) => {
          if(err) {
            errorLog('webpack', err);
            return resolve();
          }
          const _err = stats.compilation.errors;
          if(_err.length) {
            errorLog('webpack', _err[0].message);
            return resolve();
          }
          const _path = join(root, _destDir, _destFile);

          (async () => {
            const _jsBuf        = await this._readFile(_path);
            const _sourcemapBuf = await this._readFile(`${ _path }.map`);
            resolve({ jsBuf: _jsBuf, sourcemapBuf: _sourcemapBuf });
          })();
        });
      });
      if(!jsBuf) return;

      let _jsBuf = jsBuf;

      if(lineFeedCode !== 'LF') {
        _jsBuf = encodeLineFeedCode(_jsBuf, lineFeedCode);
      }
      if(charset !== 'utf8') {
        _jsBuf = iconv.encode(_jsBuf, charset);
      }

      if(!sameFile(_dest, _jsBuf)) {
        await mkfile(_dest, _jsBuf);
        fileLog('create', _dest);

        if(sourcemapBuf) {
          const _mapPath = `${ _dest }.map`;
          await mkfile(_mapPath, sourcemapBuf.toString());
          fileLog('create', _mapPath);
        }
      }
    })();
  }

  /**
   * @param {string} path
   * @return {Promise<Buffer>}
   */
  _readFile(path) {
    return new Promise((resolve, reject) => {
      memoryFs.readFile(path, (err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    })
      .catch((err) => {
        errorLog('webpack', err);
      });
  }

}
