export default {
  path: {
    'dest': 'htdocs',
  },
  pug: {
    'charset': 'utf8',
    'root'   : 'pug',
    'srcAll' : 'pug/(src|extends|includes)',
    'src'    : 'pug/src',
    'tmp'    : 'pug/(extends|includes)',
    'dest'   : 'htdocs',
  },
  deletes: [
    'htdocs/**/.DS_Store', 'htdocs/**/Thumb.db',
    'htdocs/url-list.html', 'htdocs/**/*.map',
  ],
}
