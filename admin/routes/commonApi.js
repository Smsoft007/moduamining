'use strict';
var express = require('express');
var router = express.Router();
var request = require("request");
var cryptico = require('cryptico');
var web3 = require('web3');
var app = require('../app');
var commonLib = require('../lib/commonLib');
var demux = require('../lib/EosDemux');
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
var csrf = require('csurf');
var multer = require('multer');
const path = require("path");
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, app.serverInfo.UPLOADIMAGEPATH);
  },
  filename: function(req, file, cb) {
    let extension = path.extname(file.originalname);
    cb(null, req.session.userInfo['D_UID'] + '-' + new Date().getTime() + extension);
  }
});


var upload = multer({
  limit: {
    fileSize: 10 * 1024 * 1024
  }, //5MB
  storage: storage
});
var csrfProtection = csrf({
  cookie: true
});
var apiOptions = {
  verbose: 1,
  raw: 1,
  timeout: 50000 //5초
}
router.get('/getOrgData', csrfProtection, async function(req, res, next) {
  if (req.session.userInfo == undefined) {
    commonLib.SystemErrorHandling(req, res)
    return
  }
  // var prcName = (req.query.id == 1) ? 'SP_BOX_ORG_P' : 'SP_BOX_ORG_S'
  var orgData = await sqlHelper.callProcedure('SP_ORG_CHART_P', {
    // D_UID: 'EOS'
    D_UID: req.session.userInfo.D_UID
  });
  var result = commonLib.dataFormat(0, orgData.recordset)
  res.json(result)
});
router.get('/langChange', function(req, res, next) {
  req.session.num = req.query.langNum
  var result = {}
  result['num'] = req.session.num
  res.json(result);
});
router.get('/getServerInfo', async function(req, res, next) {
  var result = `
  start block id = ${demux.blockData().startBlock} \n
  nowReading block id = ${demux.blockData().nowBlock}
  now Using Memory = ${process.memoryUsage().rss / 1024 / 1024} MB
  `

  // highestBlock is ${demux.blockData().HighestBlock}
  // distance = ${demux.blockData().HighestBlock-demux.blockData().nowBlock}
  // Estimated Time to Highest ${(demux.blockData().HighestBlock-demux.blockData().nowBlock)/60} min
  res.send(result)
});

router.post('/adminLogin', csrfProtection, async (req, res, next) => {
  const returnData = {}
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
  if (req.session.userInfo == undefined && req.rawHeaders.indexOf('/front') != -1) {
    commonLib.loginCheck(req, res)
    return
  }
  Param['D_IP'] = commonLib.getClientIpAddress(req);
  var PROCEDDATA = await sqlHelper.callProcedure(procedureNamse[urlName].name, Param);
  if (PROCEDDATA == null) {
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
  } else {
    if (PROCEDDATA.recordset[0].RESULT == 0) {
      req.session.userInfo = {};
      req.session.userInfo['ADMINLOGIN'] = true;
      req.session.userInfo['ADMINID'] = Param["D_UID"];
    }
    returnData[procedureNamse[urlName].returnName] = PROCEDDATA.recordset[0]
  }
  res.json(returnData);
});

router.post('/logout', csrfProtection, function(req, res, next) {
  var returnData = {};
  if (req.session.userInfo == undefined) {
    returnData['LOGOUT'] = 1;
  } else {
    returnData['LOGOUT'] = 0;
  }
  req.session.destroy(function(err) {

  });
  res.clearCookie('express.sid');
  res.json(returnData);
});

router.post('/reqAdminWithdrawal', csrfProtection, async function(req, res, next) {
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
  console.log(Param['AMOUNT']);
  var r = await coinHelper.sendEOS(Param['TARGET'], Param['AMOUNT'], Param["MEMO"])
  Param['TXID'] = r
  Param['RESULT'] = (r == null) ? "9" : "0"
  Param['FEE'] = 0
  if (r) {
    var PROCEDDATA = await sqlHelper.callProcedure(procedureNamse[urlName].name, Param);
    if (PROCEDDATA == null) {
      commonLib.SystemErrorHandling(req, res);
      returnData["returnValue"] = 100
    } else {
      returnData[procedureNamse[urlName].returnName] = 0
    }
  } else {
    returnData[procedureNamse[urlName].returnName] = 9
  }
  res.json(returnData);
});

router.post('/checkAddress', csrfProtection, async (req, res, next) => {
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
  var r = await coinHelper.validateAddress(Param['Address'], "ETH")
  returnData["ValidAddr"] = r
  res.json(returnData);
});
router.post('/getRateNBalance', csrfProtection, async (req, res, next) => {
  const returnData = {}
  var urls = app.serverInfo.COIN_RATE
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
  var r = await commonLib.getAdminCoinData(Param['ADDR'], Param['GUBUN'])
  var Price = await commonLib.getJSON(urls[Param['GUBUN']], apiOptions)
  returnData['RATE'] = (Param['GUBUN'].indexOf('USD') != -1) ? "1" : (Price.data['CSPA:' + Param['GUBUN']].cspa * 1).toFixed(4)
  returnData["COINDATA"] = r
  returnData['QRCODE'] = await commonLib.generateQRCode(Param['ADDR']);
  res.json(returnData);
});
router.post('/checkETH', csrfProtection, async (req, res, next) => {
  const returnData = {}
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

  var r = await commonLib.ethCoinNoti(req.session.userInfo['D_UID'], req.session.userInfo['MAINADDR'], req.session.userInfo['ETH_PASS'])
  returnData["SENDETH"] = r
  if (r == "9") {
    var checkId = await sqlHelper.callProcedure('SP_COIN_WAITING');
    for (var i = 0; i < checkId.recordset.length; i++) {
      var uid = checkId.recordset[i].MS_UID
      if (uid == Param['D_UID']) {
        returnData["SENDETH"] = "1"
        break
      }
    }
  }
  res.json(returnData);
});

router.post('/getSignupData', csrfProtection, async (req, res, next) => {
  var returnData = {}
  returnData['COUNTRYDATA'] = countryCode
  var CENTER = await sqlHelper.callProcedure('SP_CENTER');
  var BANKS = await sqlHelper.callProcedure('SP_BANK');
  returnData['BANKS'] = BANKS.recordset
  returnData['CENTER'] = CENTER.recordset
  res.json(returnData);
});

router.post('/setSocketMsg', csrfProtection, async (req, res, next) => {
  const returnData = {}
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
  commonLib.sendMsgBySocket(Param['TARGET'], Param['TYPE'], '{"sender":"' + Param['D_UID'] + '","value":"' + Param['QTY'] + '"}')
  res.json(returnData);
});
router.post('/sendSocketMsg', csrfProtection, async (req, res, next) => {
  const returnData = {}
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
  commonLib.sendMsgBySocket(Param['TARGET'], Param['TYPE'], Param['DATA'])
  res.json(returnData);
});
var imageupload = upload.fields([{
  name: 'image',
  maxCount: 1
}]);
router.post('/uploadImage', imageupload, async (req, res, next) => {
  var returnData = {}
  fs.readFile(app.serverInfo.UPLOADIMAGEPATH + req.files.image[0].filename, function(err, data) {
    if (err) {
      logger.log(err)
      returnData["returnValue"] = 100
    } else {
      returnData["returnValue"] = 0
      returnData["filePath"] = app.serverInfo.UPLOADIMAGEPATH + req.files.image[0].filename
      returnData["url"] = "/img/receipt/" + req.files.image[0].filename
    }
    res.json(returnData);
    return
  });

});

router.post('*', csrfProtection, async (req, res, next) => {
  const returnData = {}
  var urlName = (req.url).replace('/', '')
  var RSAKey = cryptico.RSAKey.parse(req.session.rsakey);
  var Param;
  try {
    Param = commonLib.decryptAll(req.body, RSAKey)
    Param["D_UID"] = (Param["D_UID"] == null) ? (req.session.userInfo == undefined) ? "" : req.session.userInfo['D_UID'] : Param["D_UID"]
    Param["B_UID"] = (Param["B_UID"] == null) ? 'admin' : Param["B_UID"]
  } catch (e) {
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
    return
  }
  if (req.session.userInfo == undefined && req.rawHeaders.indexOf('/front') != -1) {
    commonLib.loginCheck(req, res)
    return
  }
  if (Param['CRATE']) {
    var urls = app.serverInfo.COIN_RATE
    var Price = await commonLib.getJSON(urls.ETH, apiOptions)
    // returnData['RATE'] = 1
    returnData['RATE'] = (Price.data['CSPA:ETH'].cspa * 1).toFixed(4);
  }
  // if (Param['B_COUNTRY']) {
  //   Param['B_COUNTRY']=
  // }
  if (Param['IP']) {
    Param['IP']=commonLib.getClientIpAddress(req);
  }
  if (Param['CBALANCE']) {
    returnData['COINBALANCE'] = await coinHelper.getETHAmount(req.session.userInfo['MAINADDR'], true)
  }
  var PROCEDDATA = await sqlHelper.callProcedure(procedureNamse[urlName].name, Param);
  if (PROCEDDATA == null) {
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
  } else {
    returnData[procedureNamse[urlName].returnName] = PROCEDDATA.recordset[0]
  }
  res.json(returnData);
});


module.exports = router;
