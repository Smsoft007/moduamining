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
var logger = Logger('routes/list');
var lang = require('../config/lang');
// csrf setup
var csrf = require('csurf');
var csrfProtection = csrf({
  cookie: true
});
var apiOptions = {
  verbose: 1,
  raw: 1,
  timeout: 50000 //5초
}

router.post('*', csrfProtection, async (req, res, next) => {
  const returnData = {}
  var urlName = (req.url).replace('/', '')
  var RSAKey = cryptico.RSAKey.parse(req.session.rsakey);
  var Param;
  try {
    Param = commonLib.decryptAll(req.body, RSAKey)
  } catch (e) {
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
    return
  }
  if (req.session.userInfo == undefined) {
    commonLib.loginCheck(req, res)
    return
  }
  Param["D_UID"] = (Param["D_UID"] == null) ? (req.session.userInfo == undefined) ? "" : req.session.userInfo['D_UID'] : Param["D_UID"]
  Param["B_UID"] = Param["D_UID"]
  if (Param['IP']) {
    Param['IP_NO']=commonLib.getClientIpAddress(req);
  }
  if (Param['CNT']) {
    var CNT = await sqlHelper.callProcedure(procedureNamse[urlName].name + "_CNT", Param);
    if (CNT == null) {
      commonLib.SystemErrorHandling(req, res);
      returnData["returnValue"] = 100
    } else {
      returnData['CNT'] = CNT.recordset[0]
    }
  }
  if (Param['RATE']) {
    var urls = app.serverInfo.COIN_RATE
    var Price = await commonLib.getJSON(urls.ETH, apiOptions)
    // returnData['RATE']= 1
    returnData['RATE'] = (Price.data['CSPA:ETH'].cspa * 1).toFixed(4);
  }
  var PROCEDDATA = await sqlHelper.callProcedure(procedureNamse[urlName].name, Param);
  if (PROCEDDATA == null) {
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
  } else {
    returnData[procedureNamse[urlName].returnName] = PROCEDDATA.recordset

  }
  res.json(returnData);
});


module.exports = router;
