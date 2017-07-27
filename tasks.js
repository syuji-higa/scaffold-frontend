import { join, relative } from 'path';
import minimist from 'minimist';
import BrowserSync from './tasks/browser-sync';
import Pug from './tasks/pug';
import Stylus from './tasks/stylus';
import Clean from './tasks/clean';

global.NS = {};
NS.argv      = minimist(process.argv.slice(2));
NS.curtFiles = {
  destSet: new Set(), pugSet: new Set(), stylusSet: new Set(), jsSet: new Set(),
};

const browserSync = new BrowserSync();
const pug         = new Pug();
const stylus      = new Stylus();
const clean       = new Clean();

(async() => {
  await Promise.all([pug.start(), stylus.start()]);
  await browserSync.start();
})();
