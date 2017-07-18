const _dest   = 'htdocs';
const _pug    = 'pug';
const _stylus = 'stylus';
const _js     = 'js';

export default {
  path: {
    root: __dirname,
    dest: _dest,
  },
  pug: {
    charset: 'utf8',
    root   : _pug,
    src    : `${ _pug }/src`,
    tmp    : `${ _pug }/(extends|includes)`,
    factory: `${ _pug }/factorys`,
    dest   : _dest,
  },
  stylus: {
    charset: 'utf8',
    root   : _stylus,
    src    : `${ _stylus }/src`,
    import : `${ _stylus }/imports`,
    dest   : _dest,
  },
  js: {
    charset: 'utf8',
    root   : _js,
    src    : `${ _js }/src`,
    import : `${ _js }/imports`,
    dest   : _dest,
  },
  deletes: [
    'htdocs/**/.DS_Store', 'htdocs/**/Thumb.db',
    'htdocs/url-list.html', 'htdocs/**/*.map',
  ],
}
