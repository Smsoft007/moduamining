'use strict';
const express = require('express');
const router = express.Router();

var commonLib = require('../lib/commonLib');
var coinHelper = require('../lib/coinHelper');
var sqlHelper = require('../lib/mssql-helper');
var lang = require('../config/lang');
// logger setup
var Logger = require('../lib/logger');
var logger = Logger('routes/api1');

// csrf setup
var csrf = require('csurf');
var csrfProtection = csrf({
  cookie: true
});


router.get('/:txid', async function(req, res, next) {
  console.log("gdd1");
  logger.info('BTC notiProcess');
  var txid = req.params.txid;
  var notiresult = await commonLib.notiProcess('MDB', txid);
  res.json({
    RESULT: "0"
  });
});

// router.get('/:txid/', async function(req, res, next) {
//   console.log("MDB-mining");
//   logger.info('mdb-mining notiProcess');
//   var txid = req.params.txid;
//   var result = await commonLib.notiProcess('MDB', txid);
 
//     if (result) {
//       res.json({RESULT: 0}); 
//     } else {
//       res.json({RESULT: 9});
//     }
//     //RESULT: result.returnValue

//   if (result.recordset[0].REJULT==0)commonLib.callSocket(result.data.RECIVE_ID, "alertMsg", result.recordset[0].RECIVE_ID)
// });
// router.get('/', async function(req, res, next) {
//   console.log("gdd");
//   logger.info('BTC notiProcess');
//   var txid = req.params.txid;
//   var result = await commonLib.notiProcess('BTC', txid);
// });


module.exports = router;
