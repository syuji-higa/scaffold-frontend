import { join, relative } from 'path';
import minimist from 'minimist';
import BrowserSync from './tasks/browser-sync';
import Pug from './tasks/pug';
import PugFactory from './tasks/pug-factory';
import Stylus from './tasks/stylus';
import Fusebox from './tasks/fusebox';
import Imagemin from './tasks/imagemin';
import Sprite from './tasks/sprite';
import Clean from './tasks/clean';
import UrlList from './tasks/url-list';

global.NS = {};
NS.argv      = minimist(process.argv.slice(2));
NS.curtFiles = {
  destSet: new Set(), pugSet: new Set(), stylusSet: new Set(), fuseboxSet: new Set(),
};

const { argv } = NS;
const isProduction = argv['production'];

const firstTasks = [
  new Pug().start(), new PugFactory().start(),
  new Stylus().start(), new Fusebox().start(), new Sprite().start(),
];
if(isProduction) {
  firstTasks.push(new Imagemin().start());
}

(async() => {
  await Promise.all(firstTasks);
  if(isProduction) {
    await new Clean().start();
  }
  await new UrlList().start();
  await new BrowserSync().start();
})();
