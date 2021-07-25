'use strict';
var winston = require('winston');
var fs = require('fs');
var logDir = 'log';
var util = require('util');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

var CustomLogger = function(options) {
  CustomLogger.super_.apply(this, arguments);
}
util.inherits(CustomLogger, winston.Logger);

CustomLogger.prototype.log = function() {
  // var args = Array.prototype.slice.call(arguments);

  // if (req.session) {
  //   var meta = {sessionID: req.sessionID};
  //   CustomLogger.super_.prototype.log.call(this, args[0], args[2] + ' | ', req);
  // } else {

    // no req.session, assume req hasnt been passed in as 1st param
    CustomLogger.super_.prototype.log.apply(this, arguments);
  // }
}

var Logger = function(fileName) {
  return new CustomLogger({
    transports: [
      new winston.transports.Console({
        level: 'debug', 
        timestamp: function() {
          return getTime('Y-m-d H:i:s');
        },
        formatter: function(options) {

          return fileName + ' | ' + options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
        }
      }),
      new(require('winston-daily-rotate-file'))({
        level: 'debug',
        json: false,
        filename: `${logDir}/-logs.log`,
        timestamp: function() {
          return getTime('Y-m-d H:i:s');
        },
        datePattern: 'yyyy-MM-dd',
        prepend: true,
        localTime: true,
        json: false,
        formatter: function(options) {

          //console.log(options);
          return '[' + options.timestamp() + '] ' + options.level.toUpperCase() + ' # ' + (undefined !== options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
        }
      })
    ]
  });
}

function fix2num(n) {
  return [0, n].join('').slice(-2);
}

function getTime(format) {
  var curdate = new Date();
  if (format == undefined) return curdate;
  format = format.replace(/Y/i, curdate.getFullYear());
  format = format.replace(/m/i, fix2num(curdate.getMonth() + 1));
  format = format.replace(/d/i, fix2num(curdate.getDate()));
  format = format.replace(/H/i, fix2num(curdate.getHours()));
  format = format.replace(/i/i, fix2num(curdate.getMinutes()));
  format = format.replace(/s/i, fix2num(curdate.getSeconds()));
  format = format.replace(/ms/i, curdate.getMilliseconds());
  return format;
}

module.exports = Logger;
