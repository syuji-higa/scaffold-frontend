const _dest = 'htdocs';
const _pug  = 'pug';

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
  deletes: [
    'htdocs/**/.DS_Store', 'htdocs/**/Thumb.db',
    'htdocs/url-list.html', 'htdocs/**/*.map',
  ],
}
