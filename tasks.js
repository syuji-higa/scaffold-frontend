import { join, relative } from 'path';
import minimist from 'minimist';
import BrowserSync from './tasks/browser-sync';
import Pug from './tasks/pug';
import PugFactory from './tasks/pug-factory';
import Stylus from './tasks/stylus';
import Webpack from './tasks/webpack';
import Imagemin from './tasks/imagemin';
import Sprite from './tasks/sprite';
import Clean from './tasks/clean';
import UrlList from './tasks/url-list';

global.NS = {};
NS.argv         = minimist(process.argv.slice(2));
NS.isFirstBuild = true;
NS.curtFiles    = {
  destSet: new Set(), pugSet: new Set(), stylusSet: new Set(), webpackSet: new Set(),
};

const { argv } = NS;
const _isAllTask = !argv['coding'] && !argv['scripting'];

const firstTasks = [];
if(_isAllTask || argv['coding']) {
  firstTasks.concat([
    new Pug().start(), new PugFactory().start(), new Stylus().start(), new Sprite().start(),
  ]);
}
if(_isAllTask || argv['scripting']) {
  firstTasks.push(new Webpack().start());
}
if(argv['production']) {
  firstTasks.push(new Imagemin().start());
}

(async() => {
  await Promise.all(firstTasks);
  if(argv['production']) {
    await new Clean().start();
  }
  await new UrlList().start();
  NS.isFirstBuild = false;
  await new BrowserSync().start();
})();
