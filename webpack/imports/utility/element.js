/**
 * element
 */

/**
 * @param {string} str
 * @param {Element} [$el]
 */
export const getElement = (str, $el = document) => {
  if(str.match(/^\#[^\s]+$/)) {
    return $el.getElementById(str.replace('#', ''));
  }
  if(str.match(/^\.[^\s]+$/)) {
    return $el.getElementsByClassName(str.replace('.', ''));
  }
  if(str.match(/^[^\s]+$/)) {
    return $el.getElementsByTagName(str);
  }
  return $el.querySelectorAll(str);
};
