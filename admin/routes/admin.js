'use strict';
var express = require('express');
var router = express.Router();
var request = require("request");
var cryptico = require('cryptico');
var app = require('../app');
var commonLib = require('../lib/commonLib');
const coinHelper = require('../lib/coinHelper');
var sqlHelper = require('../lib/mssql-helper');
// logger setup
var Logger = require('../lib/logger');
const procedureNamse = require('../lib/procedure-info').procedureNames
var logger = Logger('routes/index');
var lang = require('../config/lang');
var fs = require('fs')
// csrf setup
var countryCode = require('../config/countryCodeFormat.json');
/* GET home page. */
router.get('/', function(req, res, next) {
  var num = req.query.lang;
  if (num != undefined) {
    req.session.num = num;
  }
  res.render('default/signin');
});
router.get('/coin/withdrawal-application-btc', function(req, res, next) {
  var title = req.query.type;
  // if (num != undefined) {
  //   req.session.num = num;
  // }
  res.render('coin/withdrawal-application-btc',{GUBUN:title});
});

router.get('*', function(req, res, next) {
  var urlName = (req.url).replace('/', '')
  if (urlName.indexOf('?') != -1) {
    urlName=urlName.substring(0,urlName.indexOf('?'))
  }
  if (urlName.indexOf('signup') != -1) {
    var R_UID = (req.query.recId) ? req.query.recId : ""
    res.render('signup', {
      R_UID: R_UID
    });
    return
  }
  if (req.session.userInfo == undefined) {
    res.render('default/signin')
    return
  }
  res.render(urlName);
});
module.exports = router;
