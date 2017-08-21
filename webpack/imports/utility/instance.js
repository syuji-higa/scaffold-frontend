import { getType } from '../model/type';
import { getElement } from './element';

/**
 * incetance
 */

/**
 * @param {Class} Cls
 * @param {string} selector
 * @param {...*} [opts]
 * @return {Array<Instance>}
 */
export const createInstance = (Cls, selector, ...opts) => {
  const _el = getElement(selector);
  if(!_el) return null;
  if(_el instanceof HTMLCollection || _el instanceof NodeList){
    const _instances = [];
    Array.from(_el, ($el) => {
      const _arg = [$el];
      if(opts) _arg.push.apply(_arg, opts);
      _instances.push(new Cls(..._arg));
    });
    return _instances;
  }
  else if(_el instanceof HTMLElement) {
    return new Cls(...[_el, opts]);
  }
};

/**
 * @param {Class} Cls
 * @param {string} selector
 * @param {...*} [opts]
 * @return {Instance}
 */
export const createSingleInstance = (Cls, selector, ...opts) => {
  const _el   = getElement(selector);
  const _type = getType(_el);
  if(!_el || !_type.match(/^(HTMLCollection|NodeList)$/) || !_el.length) return;
  const _arg = [_el];
  if(opts) _arg.push.apply(_arg, opts);
  return new Cls(..._arg);
};
