const charset = 'utf8';
const dest    = 'htdocs';
const pug     = 'pug';
const stylus  = 'stylus';
const js      = 'js';

export default {
  path: {
    root: __dirname,
    dest: dest,
  },
  pug: {
    charset : charset,
    root    : pug,
    src     : `${ pug }/src`,
    tmp     : `${ pug }/(extends|includes)`,
    factorys: `${ pug }/factorys`,
    dest    : dest,
  },
  stylus: {
    charset: charset,
    root   : stylus,
    src    : `${ stylus }/src`,
    imports: `${ stylus }/imports`,
    dest   : dest,
  },
  js: {
    charset: charset,
    root   : js,
    src    : `${ js }/src`,
    imports: `${ js }/imports`,
    dest   : dest,
  },
  deletes: [
    'htdocs/**/.DS_Store', 'htdocs/**/Thumb.db',
    'htdocs/url-list.html', 'htdocs/**/*.map',
  ],
}
