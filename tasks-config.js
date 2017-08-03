const charset = 'utf8';
const dest    = 'htdocs';
const pug     = 'pug';
const stylus  = 'stylus';
const fusebox = 'fusebox';
const image   = 'image';

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
  fusebox: {
    charset: charset,
    root   : fusebox,
    src    : `${ fusebox }/src`,
    imports: `${ fusebox }/imports`,
    dest   : dest,
  },
  image: {
    root     : image,
    minify   : `${ image }/minify`,
    sprite   : `${ image }/sprite`,
    dest     : dest,
    styleDest: `${ stylus }/imports/sprite.styl`,
  },
  deletes: [
    'htdocs/**/.DS_Store', 'htdocs/**/Thumb.db',
    'htdocs/url-list.html', 'htdocs/**/*.map',
  ],
}
