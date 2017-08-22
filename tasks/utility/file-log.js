import { ucfirst } from './string-convert';

const _colors = {
  black : '\u001b[1;30m',
  green : '\u001b[1;32m',
  blue  : '\u001b[1;34m',
  red   : '\u001b[1;31m',
  yellow: '\u001b[1;33m',
  reset : '\u001b[1;0m',
};

/**
 * @param {string} status
 */
const _getStatus = (status) => {
  const { green, blue, red, yellow } = _colors;
  return ({
    create: { ico: '=', color: green },
    add   : { ico: '+', color: blue },
    unlink: { ico: '-', color: red },
    change: { ico: '*', color: yellow },
  })[status];
};

/**
 * @param {string} status
 * @param {string} path
 */
export const fileLog = (status, path) => {
  const { black, reset } = _colors;
  const { ico, color } = _getStatus(status);
  const _msg = `  ${ color + ico } ${ ucfirst(status) + reset } ${ black }->${ reset } ${ path }`;

  console.log(_msg);
};
