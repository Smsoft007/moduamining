'use strict';
var express = require('express');
var router = express.Router();
var request = require("request");
var cryptico = require('cryptico');
var web3 = require('web3');
var app = require('../app');
var commonLib = require('../lib/commonLib');
const coinHelper = require('../lib/coinHelper');
var sqlHelper = require('../lib/mssql-helper');
// logger setup
var keythereum = require("keythereum-pure-js");
var Logger = require('../lib/logger');
const procedureNamse = require('../lib/procedure-info').procedureNames
var logger = Logger('routes/index');
var lang = require('../config/lang');
var fs = require('fs')
// csrf setup
var countryCode = require('../config/countryCodeFormat.json');
var procision = require('../config/procision.json');
var csrf = require('csurf');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, app.serverInfo.UPLOADIMAGEPATH);
  },
  filename: function(req, file, cb) {
    cb(null, req.session.userInfo['D_UID'] + '-' + file.originalname);
  }
});
var upload = multer({
  limit: {
    fileSize: 5 * 1024 * 1024
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
router.post('/autoSendEth', csrfProtection, async (req, res, next) => {
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
  var r = await commonLib.ethCoinNoti(req.session.userInfo['D_UID'], req.session.userInfo['MAINADDR'], req.session.userInfo['ETH_PASS'])
  returnData["AUTOSEND"] = r
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
router.post('/langChange', csrfProtection, function(req, res, next) {
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
  console.log(req.session.num);
  req.session.num = Param['langNum']
  returnData['num'] = req.session.num
  res.json(returnData);
});

router.post('/createAddrTypebit', csrfProtection, async (req, res, next) => {
  console.log('3, Backend-router.post in ==> createAddrTypebit');
  const returnData = {}
  const urlName = (req.url).replace('/', '')
  const RSAKey = cryptico.RSAKey.parse(req.session.rsakey);
  console.log(`4, Backend-router.post in ==> createAddrTypebit-urlName ${urlName}  `);
  var Param;
  var urls = app.serverInfo.COIN_RATE
  console.log(`5, Backend-router.post in ==> createAddrTypebit-COIN_RATE `);
  console.table(urls);

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
    var PROCEDDATA = await sqlHelper.callProcedure(procedureNamse[urlName].name, Param);
    if (PROCEDDATA == null) {
      commonLib.SystemErrorHandling(req, res);
      returnData["returnValue"] = 100
    } else {
      if (PROCEDDATA.recordset[0].ADDRESS == null) {
        Param['PASS'] = commonLib.getRandomPwd()
        Param['ADDR'] = await commonLib.getMDbCoinaddress(Param['D_UID'],Param['PASS'] ,Param['GUBUN']);
       //Param['GUBUN'] = Param['D_GUBUN']
       sqlHelper.callProcedure("SP_COIN_ADDR_CREATE", Param);
       req.session.userInfo[Param['GUBUN'] + 'ADDR'] = Param['ADDR']
       req.session.userInfo[Param['GUBUN'] + 'ADDRPASS'] = Param['PASS']
       req.session.userInfo[Param['GUBUN'] + 'ADDRQR']=(req.session.userInfo[Param['GUBUN'] + 'ADDR']!=null)?await commonLib.generateQRCode(req.session.userInfo[Param['GUBUN'] + 'ADDR']):""
       returnData[procedureNamse[urlName].returnName] = 0
      } else {
        returnData[procedureNamse[urlName].returnName] = {
          RESULT: "C02"
        }
      }
    }
    res.json(returnData);
  }
  });

router.post('/createAddrTypeEth', csrfProtection, async (req, res, next) => {
  const returnData = {}
  var urlName = (req.url).replace('/', '')
  var RSAKey = cryptico.RSAKey.parse(req.session.rsakey);
  var Param;
  var urls = app.serverInfo.COIN_RATE
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
    if (PROCEDDATA.recordset[0].ADDRESS == null) {
      Param['PASS'] = commonLib.getRandomPwd()
      Param['ADDR'] = await coinHelper.createEthAddress(Param['PASS'], "")
      //Param['GUBUN'] = Param['D_GUBUN']
      sqlHelper.callProcedure("SP_COIN_ADDR_CREATE", Param);
      req.session.userInfo[Param['GUBUN'] + 'ADDR'] = Param['ADDR']
      req.session.userInfo[Param['GUBUN'] + 'ADDRPASS'] = Param['PASS']
      req.session.userInfo[Param['GUBUN'] + 'ADDRQR']=(req.session.userInfo[Param['GUBUN'] + 'ADDR']!=null)?await commonLib.generateQRCode(req.session.userInfo[Param['GUBUN'] + 'ADDR']):""
      returnData[procedureNamse[urlName].returnName] = 0
    } else {
      returnData[procedureNamse[urlName].returnName] = {
        RESULT: "C02"
      }
    }
  }
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
// router.post('/isAddr', csrfProtection, async function(req, res, next) {
//   const returnData = {}
//   var urlName = (req.url).replace('/', '')
//   var RSAKey = cryptico.RSAKey.parse(req.session.rsakey);
//   var Param;
//   try {
//     Param = commonLib.decryptAll(req.body, RSAKey)
//   } catch (e) {
//     commonLib.SystemErrorHandling(req, res);
//     returnData["returnValue"] = 100
//     return
//   }
//   var url = "https://api.etherscan.io/api?module=account&action=balance&address=" + Param['ADDR'] + "&tag=latest&apikey=K2FEEGIVRR9JT4RRQSI664JQMHKJJCXQ94"
//   var ethPrice = await commonLib.getJSON(url, apiOptions)
//   returnData['ISADDR'] = ethPrice.status
//   res.json(returnData)
//   return
// });
router.post('/signin', csrfProtection, async (req, res, next) => {
  const returnData = {}
  var urlName = (req.url).replace('/', '')
  var RSAKey = cryptico.RSAKey.parse(req.session.rsakey);
  var Param;
  var urls = app.serverInfo.COIN_RATE
  try {
    Param = commonLib.decryptAll(req.body, RSAKey)
  } catch (e) {
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
    return
  }
  Param['inUser_IP'] = commonLib.getClientIpAddress(req);
  Param['sessionID'] = req.sessionID;
  //Param['D_COUNTRY'] = await commonLib.getCountryCode(req)
  var userInfo = {};
  //userInfo['D_UID'] = Param['inUser_ID'];
  userInfo['LOGIN'] = false;

  req.session.userInfo = userInfo;
  var PROCEDDATA
  var prcname = (Param['inUser_ID'] != undefined) ? procedureNamse[urlName].name : "SP_PHONE_LOGIN"
  var PROCEDDATA = await sqlHelper.callProcedure(prcname, Param);
  if (PROCEDDATA == null) {
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
  } else if (PROCEDDATA.recordset[0].RESULT == "N") {
    req.session.userInfo['LOGIN'] = false;
    returnData[procedureNamse[urlName].returnName] = 0
  } else {
    // commonLib.checkDuplicateLogin(req, userInfo['D_UID'])
    // var createCoinAddressResult = await commonLib.createCoinAddress(Param['inUser_ID'], commonLib.getRandomPwd());
    // var addressOn = true
    // if (!createCoinAddressResult) {
    //   addressOn = false;
    //   logger.error('createCoinAddress fail');
    // }
    // var MYINFO = await sqlHelper.callProcedure('SP_MY_INFO', userInfo);
    // await sqlHelper.callProcedure('SP_ACCOUNT_CREATE', userInfo);
    var ETHADDR = await sqlHelper.callProcedure("SP_COIN_ADDR_STATE", {
      D_UID: (Param['inUser_ID'] != undefined) ? Param['inUser_ID'] : Param['D_HP'],
      GUBUN: "ETH"
    })
    var MDBADDR = await sqlHelper.callProcedure("SP_COIN_ADDR_STATE", {
      D_UID: (Param['inUser_ID'] != undefined) ? Param['inUser_ID'] : Param['D_HP'],
      GUBUN: "MDB"
    })
    req.session.userInfo['LOGIN'] = true;
    req.session.userInfo['D_UID'] = PROCEDDATA.recordset[0].D_UID
    var MYINFO = await sqlHelper.callProcedure('SP_MY_INFO', req.session.userInfo);

    req.session.userInfo['ETHADDR'] = ETHADDR.recordset[0].ADDRESS
    req.session.userInfo['ETHADDRPASS'] = ETHADDR.recordset[0].PASS
    req.session.userInfo['ETHADDRQR']=(req.session.userInfo['ETHADDR']!=null)?await commonLib.generateQRCode(req.session.userInfo['ETHADDR']):""
    req.session.userInfo['MDBADDR'] = MDBADDR.recordset[0].ADDRESS
    req.session.userInfo['MDBADDRPASS'] = MDBADDR.recordset[0].PASS
    req.session.userInfo['MDBADDRQR']=(req.session.userInfo['MDBADDR']!=null)?await commonLib.generateQRCode(req.session.userInfo['MDBADDR']):""
    req.session.userInfo['MY_INFO'] = MYINFO.recordset[0];
    // req.session.userInfo['MAINADDR'] = MYINFO.recordset[0].ETH_ADDR;
    // req.session.userInfo['ETH_PASS'] = MYINFO.recordset[0].ETH_PASS;
    //req.session.userInfo['FIRSTLOGIN'] = true;
    // req.session.userInfo['REGURL'] = await commonLib.generateQRCode("https://bike20.net/signup?recId=" + Param['inUser_ID']);
    req.session.userInfo['DATA'] = PROCEDDATA.recordset[0];
    //commonLib.ethCoinNoti(req.session.userInfo['D_UID'], req.session.userInfo['MAINADDR'], req.session.userInfo['ETH_PASS'])
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
  res.json(returnData);
});
router.post('/isLogin', csrfProtection, function(req, res, next) {
  var returnData = {};
  if (req.session.userInfo == undefined) {
    returnData['LOGIN'] = false;
  } else {
    returnData['LOGIN'] = req.session.userInfo['LOGIN'];
  }
  res.json(returnData);
});
router.post('/logined', csrfProtection, function(req, res, next) {
  req.session.userInfo['FIRSTLOGIN'] = false;
  res.json({})
});
router.post('/isAddr', csrfProtection, async function(req, res, next) {
  var returnData = {};

  if (req.session.userInfo == undefined) {
    commonLib.SystemErrorHandling(req, res)
    return
  }
  var RSAKey = cryptico.RSAKey.parse(req.session.rsakey);
  var Params = {}
  Params['GUBUN'] = cryptico.decrypt(req.body['GUBUN'], RSAKey).plaintext;
  Params['ADDR'] = cryptico.decrypt(req.body['ADDR'], RSAKey).plaintext;
  var isAddr
  if (Params['GUBUN'] == "ETH") {
    var url = "https://api.etherscan.io/api?module=account&action=balance&address=" + Params['ADDR'] + "&tag=latest&apikey=K2FEEGIVRR9JT4RRQSI664JQMHKJJCXQ94"
    var ethPrice = await commonLib.getJSON(url, apiOptions)
    isAddr = ethPrice.status
  } else {
    isAddr = await coinHelper.isBTCAddr(Params['ADDR'])
  }
  returnData['ISADDR'] = isAddr
  res.json(returnData)
  return

});
router.post('/pwdChangeMail', csrfProtection, async (req, res, next) => {
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
  Param['D_IP'] = commonLib.getClientIpAddress(req);
  Param['D_SESSION'] = req.sessionID
  var PROCEDDATA = await sqlHelper.callProcedure(procedureNamse[urlName].name, Param);
  console.log(PROCEDDATA);
  if (PROCEDDATA == null) {
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
  } else {
    if (PROCEDDATA.recordset[0].RESULT == 0) {
      var content = fs.readFileSync(app.rootDir + '/views' + '/changPwd.html', 'utf8');
      content = content.replace('${USER_NAME}', Param['D_UID']);
      content = content.replace('${USER_NUMBER}', PROCEDDATA.recordset[0].NAN_NUM + "");
      content = content.replace('${pw_key}', PROCEDDATA.recordset[0].PW_KEY + "");
      var mailOptions = {
        from: commonLib.mailSender,
        to: Param['EMAIL'] + '',
        subject: "Find Password Email",
        html: content
      };
      commonLib.smtpTransport.sendMail(mailOptions, function(err, data) {
        if (err) {
          logger.info('sendMail failed...')
          logger.info(err)
          returnData[procedureNamse[urlName].returnName] = 0
          res.json(returnData);
        } else {
          returnData[procedureNamse[urlName].returnName] = PROCEDDATA.recordset[0]
          res.json(returnData);
        }
      });
    } else {
      returnData[procedureNamse[urlName].returnName] = PROCEDDATA.recordset[0]
      res.json(returnData);
    }
  }
});
router.post('/mailSender/*', csrfProtection, async (req, res, next) => {
  const returnData = {}
  var urlName = (req.url).replace('/mailSender/', '')
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
  Param['D_IP'] = commonLib.getClientIpAddress(req);
  Param['D_SESSION'] = req.sessionID
  var PROCEDDATA = await sqlHelper.callProcedure(procedureNamse[urlName].name, Param);
  if (PROCEDDATA == null) {
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100

  } else if (PROCEDDATA.recordset[0].RESULT != 0) {
    returnData[procedureNamse[urlName].returnName] = 0
    res.json(returnData);
  } else {
    var content = fs.readFileSync(app.rootDir + '/views/' + 'mail02.html', 'utf8');
    console.log(PROCEDDATA.recordset[0]);
    content = content.replace('${USER_NAME}', Param['D_UID']);
    content = content.replace('${USER_NUMBER}', (PROCEDDATA.recordset[0].SMS_CODE != undefined) ? PROCEDDATA.recordset[0].SMS_CODE : PROCEDDATA.recordset[0].NEWPASS + "");
    var mailOptions = {
      from: commonLib.mailSender,
      to: Param['D_MAIL'] + '',
      subject: Param['TITLE'],
      html: content
    };
    commonLib.smtpTransport.sendMail(mailOptions, function(err, data) {
      if (err) {
        logger.info('sendMail failed...')
        logger.info(err)
        returnData[procedureNamse[urlName].returnName] = -1
        res.json(returnData);
      } else {
        returnData[procedureNamse[urlName].returnName] = PROCEDDATA.recordset[0].CUR_KEY
        res.json(returnData);
      }
    });
  }
});
router.post('/countryCode', csrfProtection, async (req, res, next) => {
  var returnData = {}
  returnData['COUNTRYDATA'] = countryCode
  //returnData['PROCISION'] = procision
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
      console.log(err);
      logger.log(err)
      returnData["returnValue"] = 100
    } else {
      returnData["returnValue"] = 0
      returnData["filePath"] = app.serverInfo.UPLOADIMAGEPATH + req.files.image[0].filename
      returnData["url"] = "/images/products/" + req.files.image[0].filename
    }
    console.log(returnData);
    res.json(returnData);
    return
  });
});
router.post('/purchInit', csrfProtection, async function(req, res, next) {
  var result = {}
  var Param = {}
  if (req.session.userInfo == undefined) {
    commonLib.SystemErrorHandling(req, res)
    return
  }
  Param['D_UID'] = req.session.userInfo['D_UID']
  var urls = app.serverInfo.COIN_RATE
  var ethPrice = await commonLib.getJSON(urls.ETH, apiOptions)
  var product = await sqlHelper.callProcedure('SP_PRODUCT', Param);
  var myInfo = await sqlHelper.callProcedure('SP_MY_INFO', Param);
  var bonusBal = await sqlHelper.callProcedure('SP_BONUS_BALANCE', Param);
  var coin_balance = await sqlHelper.callProcedure('SP_COIN_BALANCE', Param);
  var coin_addr = req.session.userInfo['MY_INFO']["ETH_ADDR"]
  result['COIN_ADDRESS'] = coin_addr
  result['qrCode'] = await commonLib.generateQRCode(coin_addr);
  result['email'] = req.session.userInfo['EMAIL']
  result['ETH'] = ethPrice.data['CSPA:ETH'].cspa
  result['PRODUCTS'] = product.recordset
  result['BALANCE'] = coin_balance.recordset[0]
  result['MYINFO'] = myInfo.recordset[0]
  result['BBAL'] = bonusBal.recordset[0]
  res.json(result)
});
router.post('/sendEth', csrfProtection, async function(req, res, next) {
  const returnData = {}
  var urlName = (req.url).replace('/', '')
  var RSAKey = cryptico.RSAKey.parse(req.session.rsakey);
  var Param;
  if (req.session.userInfo == undefined) {
    commonLib.SystemErrorHandling(req, res)
    return
  }
  try {
    Param = commonLib.decryptAll(req.body, RSAKey)
    Param["D_UID"] = (Param["D_UID"] == null) ? (req.session.userInfo == undefined) ? "" : req.session.userInfo['D_UID'] : Param["D_UID"]
  } catch (e) {
    console.log(e);
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
    return
  }
  try {
    var txid = await coinHelper.sendEthereum(Param['RECEIVEADDR'], Param['SENDADDR'], (Param['QTY'] * 1), req.session.userInfo[Param['GUBUN'] + 'ADDRPASS'], (Param['GUBUN'] != "ETH") ? true : false, true)
    logger.info(txid);
    Param['TXID'] = txid
    var coin_balance = await sqlHelper.callProcedure('SP_COIN_NOTI', Param);
    console.log(coin_balance);
  } catch (e) {
    logger.info(e)
    returnData['RESULT'] = 1;
  }
  res.json(returnData)
});
router.post('/sendEthNotr', csrfProtection, async function(req, res, next) {
  const returnData = {}
  var urlName = (req.url).replace('/', '')
  var RSAKey = cryptico.RSAKey.parse(req.session.rsakey);
  var Param;
  if (req.session.userInfo == undefined) {
    commonLib.SystemErrorHandling(req, res)
    return
  }
  try {
    Param = commonLib.decryptAll(req.body, RSAKey)
    Param["D_UID"] = (Param["D_UID"] == null) ? (req.session.userInfo == undefined) ? "" : req.session.userInfo['D_UID'] : Param["D_UID"]
  } catch (e) {
    console.log(e);
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
    return
  }
  try {
    var txid = await coinHelper.sendEthereum(Param['RECEIVEADDR'], Param['SENDADDR'], (Param['QTY'] * 1), req.session.userInfo[Param['GUBUN'] + 'ADDRPASS'], (Param['GUBUN'] != "ETH") ? true : false, true)
    logger.info(txid);
    Param['TXID'] = txid
    // var coin_balance = await sqlHelper.callProcedure('SP_COIN_NOTI', Param);
    // console.log(coin_balance);
  } catch (e) {
    logger.info(e)
    returnData['RESULT'] = 1;
  }
  res.json(returnData)
});
router.post('/getTreeView', csrfProtection, async function(req, res, next) {
  var result = {}
  var Param = {}
  if (req.session.userInfo == undefined) {
    commonLib.SystemErrorHandling(req, res)
    return
  }
  Param['D_UID'] = req.session.userInfo['D_UID']
  var product = await sqlHelper.callProcedure('SP_TREE_VIEW', Param);
  result["treeData"] = commonLib.dataFormat(0, product.recordsets[0])
  res.json(result)
});
router.post('/withdrawInit', csrfProtection, async function(req, res, next) {
  var returnData = {}
  var Param = {}
  var urlName = (req.url).replace('/', '')
  if (req.session.userInfo == undefined) {
    commonLib.SystemErrorHandling(req, res)
    return
  }
  Param['D_UID'] = req.session.userInfo['D_UID']
  Param['AD_UID'] = 'admin'
  var urls = app.serverInfo.COIN_RATE
  var ethPrice = await commonLib.getJSON(urls.ETH, apiOptions)
  var PROCEDDATA = await sqlHelper.callProcedure(procedureNamse[urlName].name, Param);
  if (PROCEDDATA == null) {
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
  } else {
    returnData[procedureNamse[urlName].returnName] = PROCEDDATA.recordset[0]
    returnData[procedureNamse[urlName].returnName]['RATE'] = ethPrice.data['CSPA:ETH'].cspa.toFixed(4)
  }
  res.json(returnData)
});
router.post('/adminReqInit', csrfProtection, async function(req, res, next) {
  var returnData = {}
  var Param = {}
  var result = {}
  var coin_addr = req.session.userInfo['MY_INFO']['ETH_ADDR']
  var urlName = (req.url).replace('/', '')
  var urls = app.serverInfo.COIN_RATE
  var ethPrice = await commonLib.getJSON("https://api.etherscan.io/api?module=account&action=balance&address=" + coin_addr + "&tag=latest&apikey=EJ2K9KPN6M5YSVFRIBX2RC1HR2C2KQRRJ9", apiOptions)
  if (req.session.userInfo == undefined) {
    commonLib.SystemErrorHandling(req, res)
    return
  }
  result['QRCODE'] = await commonLib.generateQRCode(coin_addr);
  result['ADMINADDR'] = coin_addr;
  result['ETHAMOUNT'] = await coinHelper.getToEth(ethPrice.result);
  returnData['ADMIN'] = result
  res.json(returnData)
});

router.post('/startDeposit', csrfProtection, async function(req, res, next) {
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
  Param['D_UID'] = req.session.userInfo['D_UID']
  var ethPrice = await commonLib.getJSON(app.serverInfo.COIN_RATE.ETH, apiOptions)
  if (Param['GUBUN'] == "ETH") {
    Param['RATE'] = ethPrice[0].price_usd
  } else {
    Param['RATE'] = 1
  }
  var coin_addr = req.session.userInfo[Param['GUBUN'] + "_ADDR"]
  var product = await sqlHelper.callProcedure('SP_PRODUCT');
  var pendList = await sqlHelper.callProcedure('SP_BIT_TEMP_LIST', Param);
  result['PRICE_USD'] = Param['RATE']
  result['COIN_ADDRESS'] = coin_addr
  result['qrCode'] = await commonLib.generateQRCode(coin_addr);
  result['pendList'] = pendList.recordset
  result['email'] = req.session.userInfo['EMAIL']
  result['PRODUCTS'] = product.recordset
  returnData['STARTDEPOSIT'] = result
  res.json(returnData)
});

router.post('/adminReq', csrfProtection, async (req, res, next) => {
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
  Param['AD_UID'] = req.session.userInfo['D_UID']
  var adminReqStart = await sqlHelper.callProcedure('SA_COIN_WITHDRAWAL_DETAIL', Param);
  var reqData = adminReqStart.recordset[0]
  var adminAddrInfo = await sqlHelper.callProcedure('SP_COIN_TR_WBALANCE', Param);
  var transactionResult;
  var dataDir = "D:/Node/server"
  try {
    var keyObject = keythereum.importFromFile(adminAddrInfo.recordset[0].AD_ADDRESS, dataDir);
    var privateKey = keythereum.recover(adminAddrInfo.recordset[0].AD_PW, keyObject);
    transactionResult = await coinHelper.sendEth(adminReqStart.recordset[0].MS_RECIVEADDR, adminAddrInfo.recordset[0].AD_ADDRESS, (adminReqStart.recordset[0].MS_QTY * 1) + 0.000126, privateKey.toString('hex'))
  } catch (e) {
    transactionResult = null
    console.log(e);
  }
  if (transactionResult != null) {
    var parma = {}
    parma['OUTKEY'] = Param['IDX']
    parma['TXID'] = transactionResult
    parma['RESULT'] = 0
    parma['FEE'] = 0.000042
    var PROCEDDATA = await sqlHelper.callProcedure(procedureNamse[urlName].name, parma);
    if (PROCEDDATA == null) {
      commonLib.SystemErrorHandling(req, res);
      returnData["returnValue"] = 100
    } else {
      console.log(PROCEDDATA);
      // returnData[procedureNamse[urlName].returnName] = PROCEDDATA.returnValue[0]
      returnData[procedureNamse[urlName].returnName] = 99
    }
  } else {
    returnData[procedureNamse[urlName].returnName] = -1
  }
  res.json(returnData)
});


router.post('/adminReqAll', csrfProtection, async (req, res, next) => {
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
  var PROCEDDATA = await sqlHelper.callProcedure("SA_COIN_WITHDRAWAL_LIST", Param);
  if (PROCEDDATA == null) {
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
  } else {
    var adminReqList = PROCEDDATA.recordsets[0]
    for (var i = 0; i < adminReqList.length; i++) {
      Param['AD_UID'] = req.session.userInfo['D_UID']
      Param['IDX'] = adminReqList[i].MS_KEY
      var adminReqStart = await sqlHelper.callProcedure('SA_COIN_WITHDRAWAL_DETAIL', Param);
      var reqData = adminReqStart.recordset[0]
      var adminAddrInfo = await sqlHelper.callProcedure('SP_COIN_TR_WBALANCE', Param);
      var transactionResult;
      var dataDir = "D:/Node/server"
      try {
        var keyObject = keythereum.importFromFile(adminAddrInfo.recordset[0].AD_ADDRESS, dataDir);
        var privateKey = keythereum.recover(adminAddrInfo.recordset[0].AD_PW, keyObject);
        transactionResult = await coinHelper.sendEth(adminReqStart.recordset[0].MS_RECIVEADDR, adminAddrInfo.recordset[0].AD_ADDRESS, (adminReqStart.recordset[0].MS_QTY * 1) + 0.000042, privateKey.toString('hex'))
      } catch (e) {
        transactionResult = null
      }
      if (transactionResult != null) {
        var parma = {}
        parma['OUTKEY'] = Param['IDX']
        parma['TXID'] = transactionResult
        parma['RESULT'] = 0
        parma['FEE'] = 0.000042
        var PROCEDDATA = await sqlHelper.callProcedure("SP_COIN_TRANSFER_COMPLETE", parma);
      }
    }
  }
  returnData["ADMINTRANALL"] = 0
  res.json(returnData);

});

router.post('/setGameUser', csrfProtection, async (req, res, next) => {
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
  var r = await commonLib.callApi("http://admin.sshaday.io/api/getDiceUserCheck/" + Param["D_GUID"], null, apiOptions)
  r = r.trim()
  r = JSON.parse(r)
  if (r.code != "0000") {
    returnData[procedureNamse[urlName].returnName] = -1
    res.json(returnData);
    return
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
router.post('/convertPoint', csrfProtection, async (req, res, next) => {
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
  var r = await commonLib.callApi("http://admin.sshaday.io/api/setDiceUserPoint/" + Param["D_GUID"] + "/" + Param["D_AMT"], {
    point: Param["D_AMT"]
  }, apiOptions)
  r = r.trim()
  r = JSON.parse(r)
  if (r.code != "0000") {
    returnData[procedureNamse[urlName].returnName] = -1
    res.json(returnData);
    return
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

router.post('*', csrfProtection, async (req, res, next) => {
  const returnData = {}
  var urlName = (req.url).replace('/', '')
  var RSAKey = cryptico.RSAKey.parse(req.session.rsakey);
  var Param;
  try {
    Param = commonLib.decryptAll(req.body, RSAKey)
    Param["D_UID"] = (Param["D_UID"] == null) ? (req.session.userInfo == undefined) ? "" : req.session.userInfo['D_UID'] : Param["D_UID"]
    if (Param["IP_NO"] != null) Param["IP_NO"] = commonLib.getClientIpAddress(req);
  } catch (e) {
    commonLib.SystemErrorHandling(req, res);
    returnData["returnValue"] = 100
    return
  }
  if (Param['TIME']) {
    returnData['TIME'] = new Date()
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
    returnData[procedureNamse[urlName].returnName] = PROCEDDATA.recordset[0]
  }
  res.json(returnData);
});



module.exports = router;
