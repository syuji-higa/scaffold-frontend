const charset = 'utf8';
const dest    = 'htdocs';
const pug     = 'pug';
const stylus  = 'stylus';
const fusebox = 'fusebox';
const images  = 'images';
const urlList = '.url-list';

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
    php     : [],  // 'all', ['index.pug', 'sp/index.pug']
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
  images: {
    root     : images,
    minify   : `${ images }/minify`,
    sprite   : `${ images }/sprite`,
    dest     : dest,
    styleDest: `${ stylus }/imports/sprite.styl`,
  },
  urlList: {
    root: urlList,
    tmp : `${ urlList }/index.tmp`,
    dest: `${ urlList }/index.html`,
  },
  deletes: [
    'htdocs/**/.DS_Store', 'htdocs/**/Thumb.db', 'htdocs/**/*.map',
  ],
}
