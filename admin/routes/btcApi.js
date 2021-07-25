'use strict';
var express = require('express');
var router = express.Router();

var commonLib = require('../lib/commonLib');
var coinHelper = require('../lib/coinHelper');
var sqlHelper = require('../lib/mssql-helper');
var lang = require('../config/lang');
// logger setup
var Logger = require('../lib/logger');
var logger = Logger('routes/api');

// csrf setup
var csrf = require('csurf');
var csrfProtection = csrf({
  cookie: true
});
//ALT: 1, BTC: 2, LITE: 3
router.get('/:txid', async function(req, res, next) {
  console.log("gdd1----------------------------");
  logger.info('BTC notiProcess');
  var txid = req.params.txid;
  var result = await commonLib.notiProcess('BTC', txid);
  // res.json({
  //   RESULT: result.returnValue
  // });
  // if (result.recordset[0].REJULT==0)commonLib.callSocket(result.data.RECIVE_ID, "alertMsg", result.recordset[0].RECIVE_ID)
});
router.get('/', async function(req, res, next) {
  console.log("gdd-------------------------------------------");
  logger.info('BTC notiProcess');
  var txid = req.params.txid;
  var result = await commonLib.notiProcess('BTC', txid);
  // res.json({
  //   RESULT: result.returnValue
  // });
  // if (result.recordset[0].REJULT==0)commonLib.callSocket(result.data.RECIVE_ID, "alertMsg", result.recordset[0].RECIVE_ID)
});


module.exports = router;
