/**
 * index
 */

const toString = Object.prototype.toString;

/**
 * @param {*} target
 * @return {string}
 */
export const getType = (target) => {
  const _strs = toString.call(target).match(/^\[object (.+)\]$/);
  if(!_strs) return;
  const _type   = _strs[1];
  const _elStrs = _type.match(/^HTML.+Element$/);
  return _elStrs ? 'Element' : _type;
};
