import { join, relative } from 'path';
import minimist from 'minimist';
import BrowserSync from './tasks/browser-sync';
import Pug from './tasks/pug';
import PugFactory from './tasks/pug-factory';
import Stylus from './tasks/stylus';
import Fusebox from './tasks/fusebox';
import Clean from './tasks/clean';

global.NS = {};
NS.argv      = minimist(process.argv.slice(2));
NS.curtFiles = {
  destSet: new Set(), pugSet: new Set(), stylusSet: new Set(), fuseboxSet: new Set(),
};

const browserSync = new BrowserSync();
const pug         = new Pug();
const pugFactory  = new PugFactory();
const stylus      = new Stylus();
const fusebox     = new Fusebox();
const clean       = new Clean();

(async() => {
  await Promise.all([pug.start(), pugFactory.start(), stylus.start(), fusebox.start()]);
  await browserSync.start();
})();
