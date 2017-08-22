export default class TaskLog {

  constructor(taskName) {
    this._taskName  = taskName;
    this._startTime = 0;
    this._colors = {
      black  : '\u001b[1;30m',
      magenta: '\u001b[1;35m',
      cyan   : '\u001b[1;36m',
      reset  : '\u001b[1;0m',
    };
  }

  start() {
    const { _taskName, _colors } = this;
    const { black, cyan, reset } = _colors;

    const _date     = new Date();
    const _time     = this._getTime(_date);
    this._startTime = _date.getTime();

    const _msg = `[${ black + _time + reset }] Starting '${ cyan + _taskName + reset }'...`;

    console.log(_msg);
  }

  finish() {
    const { _taskName, _startTime, _colors } = this;
    const { black, magenta, cyan, reset } = _colors;

    const _date       = new Date();
    const _time       = this._getTime(_date);
    const _finishTime = _date.getTime() - _startTime;

    const _msg = `[${ black + _time + reset }] Finished '${ cyan + _taskName + reset }' after ${ magenta + _finishTime } ms ${ reset }`;

    console.log(_msg);
  }

  /**
   * @param {number} date
   */
  _getTime(date) {
    return `${ date.getHours() }:${ date.getMinutes() }:${ date.getSeconds() }`;
  }

}
