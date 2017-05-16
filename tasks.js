import { join, relative } from 'path';
import minimist from 'minimist';
import BrowserSync from './tasks/browser-sync';
import Clean from './tasks/clean';
import Pug from './tasks/pug';

global.NS = {};
NS.argv = minimist(process.argv.slice(2));
NS.root = __dirname;

const browserSync = new BrowserSync();
const pug         = new Pug();
const clean       = new Clean();

(async() => {
  await pug.start();
  await browserSync.start();
})();