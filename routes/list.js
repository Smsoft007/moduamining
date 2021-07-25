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
router.post('/idsearch', csrfProtection, async (req, res, next) => {
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
  if (req.session.userInfo == undefined && req.rawHeaders.indexOf('/front') != -1) {
    commonLib.loginCheck(req, res)
    return
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
router.post('/getEthHistory', csrfProtection, async (req, res, next) => {
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
  var url="http://api.etherscan.io/api?module=account&action=txlist&address="+Param['ADDRESS']+"&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken"
  var reault = await commonLib.getJSON(url,apiOptions)
  returnData['ETHHISTORY']=reault.result
  res.json(returnData);
});

router.post('/getCoinAddrs', csrfProtection, async (req, res, next) => {
  const returnData = {}
  var urlName = (req.url).replace('/', '')
  var urls = app.serverInfo.COIN_RATE
  var RSAKey = cryptico.RSAKey.parse(req.session.rsakey);
  var Param;
  try {
    Param = commonLib.decryptAll(req.body, RSAKey)
    Param["D_UID"] = (Param["D_UID"] == null) ? (req.session.userInfo == undefined) ? "" : req.session.userInfo['D_UID'] : Param["D_UID"]
  } catch (e) {
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
    return
  }
  var PROCEDDATA = await sqlHelper.callProcedure(procedureNamse[urlName].name, Param);
  if (PROCEDDATA == null) {
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
  } else {
    for(var i=0;i<PROCEDDATA.recordsets[0].length;i++){
      if(PROCEDDATA.recordsets[0][i].D_GUBUN.indexOf("USDT")==-1){
        console.log(PROCEDDATA.recordsets[0][i].D_GUBUN);
        var Price = await commonLib.getJSON(urls[PROCEDDATA.recordsets[0][i].D_GUBUN], apiOptions)
      }
      PROCEDDATA.recordsets[0][i]['QRCODE']=await commonLib.generateQRCode(PROCEDDATA.recordsets[0][i].ADDRESS);
      PROCEDDATA.recordsets[0][i]['RATE']=(PROCEDDATA.recordsets[0][i].D_GUBUN.indexOf('USD')!=-1)?"1":(Price.data['CSPA:'+PROCEDDATA.recordsets[0][i].D_GUBUN].cspa * 1).toFixed(4)
    }
    returnData[procedureNamse[urlName].returnName] = PROCEDDATA.recordsets
  }
  res.json(returnData);
});
router.post('*', csrfProtection, async (req, res, next) => {
  const returnData = {}
  var urls = app.serverInfo.COIN_RATE
  var urlName = (req.url).replace('/', '')
  var RSAKey = cryptico.RSAKey.parse(req.session.rsakey);
  var Param;
  try {
    Param = commonLib.decryptAll(req.body, RSAKey)
    Param["D_UID"] = (Param["D_UID"] == null) ? (req.session.userInfo == undefined) ? "" : req.session.userInfo['D_UID'] : Param["D_UID"]
  } catch (e) {
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
    return
  }
  // if (req.session.userInfo == undefined) {
  //   // commonLib.loginCheck(req, res)
  //   // return
  // }else{
  //   Param['D_UID'] = req.session.userInfo['D_UID']
  // }

  //Param['D_COUNTRY'] = req.session['D_COUNTRY']
  if (Param['CNT']) {
    var CNT = await sqlHelper.callProcedure(procedureNamse[urlName].name + "_CNT", Param);
    if (CNT == null) {
      commonLib.SystemErrorHandling(req, res);
      returnData["returnValue"] = 100
    } else {
      returnData['CNT'] = CNT.recordset[0]
    }
  }

  var PROCEDDATA = await sqlHelper.callProcedure(procedureNamse[urlName].name, Param);
  if (PROCEDDATA == null) {
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
  } else {
    if (Param['RATE']) {
      for(var i=0;i<PROCEDDATA.recordsets[0].length;i++){
        var Price = await commonLib.getJSON(urls[PROCEDDATA.recordsets[0][i].D_GUBUN], apiOptions)
        PROCEDDATA.recordsets[0][i]['RATE']=(PROCEDDATA.recordsets[0][i].D_GUBUN.indexOf('USD')!=-1)?"1":(Price.data['CSPA:'+PROCEDDATA.recordsets[0][i].D_GUBUN].cspa * 1).toFixed(4)
      }
    }
    returnData[procedureNamse[urlName].returnName] = PROCEDDATA.recordsets

  }
  res.json(returnData);
});


module.exports = router;
