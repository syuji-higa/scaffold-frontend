import { createInstance, createSingleInstance } from 'utility/instance';
import mediaObserver from 'controller/media-observer';
import Sample from 'view/sample';

if(typeof NS !== 'undefined') {
  throw new Error('namespace "NS" is already exists.');
}
window.NS = {};

if(typeof NS !== 'undefined') {
  throw new Error('namespace "NS" is already exists.');
}
window.NS = {};

NS.status = {
  media: '',  // ['sp'|'pc']
};
new mediaObserver();

window.addEventListener('DOMContentLoaded', () => {

  const _modules = [
    [ Sample, '.js-sample' ],
  ];

  const _singleModules = [
    [ Sample, '.js-sample' ],
  ];

  _modules.forEach((arr) => {
    createInstance(...arr);
  });

  _singleModules.forEach((arr) => {
    createSingleInstance(...arr);
  });

});
