'use strict';
var redis = require('redis');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var serverInfo = require('../info/server-info');
var keythereum = require("keythereum-pure-js");
// logger setup
var Logger = require('./logger');
var logger = Logger('routes/commonLib');
var lang = require('../config/lang');
var sqlHelper = require('./mssql-helper')
var nodemailer = require('nodemailer');
var coinHelper = require('./coinHelper');
var curl = require('curl');
var countryInfo = require('../info/countryInfo');
var countryCode = require('../config/countryCodeFormat.json');
var NodeCache = require("node-cache");
var cryptico = require('cryptico');
var moment = require('moment');
var commonLib = require('./commonLib');
var myCache = new NodeCache();
var app;

var q = require('q');
var request = require('request');


var sessionStore;
var io;
var serverInfo;
var {
  forEach
} = require('p-iteration');
var fs = require('fs');
var path = require('path');

exports.initialize = async function() {
  app = require('../app');
  sessionStore = app.sessionStore;
  io = app.io;
  serverInfo = app.serverInfo;
}
var encodeBase64 = function(str) {
  return new Buffer(str).toString('base64');
};
var phoneNumber = function(mobile) {
  var result;
  if ((/^\d{3}-\d{3,4}-\d{4}$/).test(mobile)) {
    result = mobile;
  } else if ((/^\d{10}$/).test(mobile)) {
    result = mobile.substr(0, 3) + '-' + mobile.substr(3, 3) + '-' + mobile.substr(6, 4)
  } else if ((/^\d{11}$/).test(mobile)) {
    result = mobile.substr(0, 3) + '-' + mobile.substr(3, 4) + '-' + mobile.substr(7, 4)
  } else {
    result = undefined;
  }
  return result;
};

var checkParams = function(params) {
  return params &&
    params.user_id &&
    params.secure &&
    params.msg &&
    params.rphone;
};

const Nexmo = require('nexmo');
var sendSMSUSECAFE24 = function(target, msg) {
  var deferred = q.defer();
  var parameters = {
    user_id: encodeBase64('smsoft386'),
    secure: encodeBase64('0f7db9b06fc274240b338b34923538fe'),
    msg: encodeBase64(msg),
    rphone: encodeBase64(target),
    sphone1: encodeBase64('010'),
    sphone2: encodeBase64('2661'),
    sphone3: encodeBase64('8440'),
    rdate: encodeBase64(''),
    rtime: encodeBase64(''),
    mode: encodeBase64('1'),
    testflag: encodeBase64(''),
    destination: encodeBase64(''),
    repeatFlag: encodeBase64(''),
    repeatNum: encodeBase64(''),
    repeatTime: encodeBase64(''),
    returnurl: encodeBase64(''),
    nointeractive: encodeBase64('')
  };
  if (!checkParams(parameters)) deferred.reject();

  var smsRequest = request.post('http://sslsms.cafe24.com/sms_sender.php', function(err, res, body) {
    if (err) {
      deferred.reject(err);
    } else {
      if (body.substr(0, 7) === 'success') deferred.resolve(body);
      else deferred.reject(body);
    }
  });

  var reqForm = smsRequest.form();
  for (var param in parameters) {
    reqForm.append(param, parameters[param]);
  }

  return deferred.promise;
};

function jiniTest() {
  //curl -X POST  -d '{"user_id": "slsdk3ek2"}' -H "Accept: application/json" -H "Content-Type: application/json" "https://gini.fun/api/data/external/userid"
  var deferred = q.defer();
  var parameters = {
    user_id: encodeBase64('smsoft386')
  };
  if (!checkParams(parameters)) deferred.reject();

  var smsRequest = request.post('https://gini.fun/api/data/external/userid', function(err, res, body) {
    if (err) {
      deferred.reject(err);
    } else {
      if (body.substr(0, 7) === 'success') deferred.resolve(body);
      else deferred.reject(body);
    }
  });

  var reqForm = smsRequest.form();
  for (var param in parameters) {
    reqForm.append(param, parameters[param]);
  }
  return deferred.promise;
}

exports.sendSms = (title, target, text) => {
  logger.info('HP : ' + target);
  return sendSMSUSECAFE24(target, text)
}
// const nexmo = new Nexmo({
//   apiKey: 'df962006',
//   apiSecret: ' YkE3cRdntjRTKGt1',
// });
///bitlamp
// const nexmo = new Nexmo({
//   apiKey: 'd1ad0662',
//   apiSecret: 's4uZjMLjeCKe6CfG',
// });
//이팀장님꺼
const nexmo = new Nexmo({
  apiKey: '7b859157',
  apiSecret: 'Ei0tAqv2LmuFr9Fm',
});
// exports.sendSms = (title, target, text) => {
//   logger.info('HP : ' + target);
//   return new Promise(r => nexmo.message.sendSms(title, target, text, {
//     "type": "unicode"
//   }, (err) => {
//     r(err)
//   }))
// }

var _options = {
  SESSION_SECRET: '@#@$MYSIGN#@$#$',
  EXCHANGE_RATE_JSON: 500,
  CONFIG_FILE_PATH: path.join(appRoot + '/config/config.json')
}
exports.getCountryCode = async function(req) {
  var ipNo = commonLib.getClientIpAddress(req);

  var arrIp = ipNo.split('.');
  var ip1 = parseInt(arrIp[0]) * 16777216;
  var ip2 = parseInt(arrIp[1]) * 65536;
  var ip3 = parseInt(arrIp[2]) * parseInt(arrIp[3]);
  var Params = {};
  Params['IPNO'] = ip1 + ip2 + ip3;

  var result = await sqlHelper.callProcedure('SP_C_IPCHECK', Params);
  if (result == null) {
    return null;
  } else {
    return result.recordset[0].NAME;
  }
}
exports.getAdminCoinData = async (addr, gubun) => {
  var balance = (gubun == 'ETH') ? await coinHelper.getETHAmount(addr) : (gubun == 'BTC') ? await coinHelper.getBTCBalance() : "1"
  return balance
}
exports.ethCoinNoti = async function(d_uid, addr, ethpass) {
  var balance = await coinHelper.getETHAmount(addr)
  balance = balance * 0.000000000000000001
  if (balance > 0.0001) {
    logger.info("start transaction to admin user : " + d_uid + " address : " + addr)
    var apiOptions = {
      verbose: 1,
      raw: 1,
      timeout: 5000 //5초
    }
    var urls = app.serverInfo.COIN_RATE
    var Price = await commonLib.getJSON(urls.ETH, apiOptions)
    var txid;
    try {
      txid = await coinHelper.sendETHAmount(app.serverInfo.ADMINADDR, addr, (balance * 1) - 0.0001, ethpass, false)
    } catch (e) {
      logger.info(e)
    }
    if (txid != undefined) {
      var Params = {};
      Params['SENDADDR'] = addr;
      Params['RECEIVEADDR'] = app.serverInfo.ADMINADDR;
      Params['QTY'] = balance * 1;
      Params['RATE'] = (Price.data['CSPA:ETH'].cspa * 1).toFixed(4);
      Params['REAL_FEE'] = '0'
      Params['GUBUN'] = 'ETH';
      Params['TXID'] = txid;
      Params['CATEGORY'] = 'sender';
      await sqlHelper.callProcedure('SP_COIN_NOTI', Params);
      return "0"
    }
    return "1"
  } else {
    return "9"
  }
}
exports.sendEmail = async function(USERDATA, SMS_CODE) {
  var content = fs.readFileSync('C:/WEB_SERVICE/NODE/SHOP/static/mail02.html', 'utf8');
  content = content.replace('${USER_NAME}', USERDATA['D_UID']);
  content = content.replace('${USER_NUMBER}', SMS_CODE + "");
  var mailOptions = {
    from: commonLib.mailSender,
    to: USERDATA['D_MAIL'] + '',
    subject: "certification number",
    html: content
  };
  var sendReslut = await commonLib.smtpTransport.sendMail(mailOptions)
  return (sendReslut) ? 0 : 1
}
var timer = function() {};
timer.prototype = {
  start: function() {
    this._time = moment(new Date().getTime());
  },
  end: function() {
    return moment(new Date().getTime()).diff(this._time);
  }
}
exports.getCountryNum = (country) => {
  var target = country.toUpperCase()
  for (var i = 0; i < countryInfo.length; i++) {
    if (countryInfo[i].alpha2Code == target) return countryInfo[i].value[0]
  }
}
exports.timer = new timer();
var promiseTimeout = function(ms, promise) {

  var timeout = new Promise((resolve, reject) => {
    var id = setTimeout(() => {
      clearTimeout(id);
      logger.error('Promise Timeout in ' + ms + 'ms.');
      reject('timeout');
    }, ms);
  });
  return Promise.race([
    promise,
    timeout
  ]);
};
exports.promiseTimeout = promiseTimeout;

exports._options = _options;
var smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bitlampceo@gmail.com',
    pass: '@a4809Gm5735'
  }
  // service: 'gmail',
  // auth: {
  //   user: 'bitlamp365@gmail.com',
  //   pass: '@a4809Gm5735'
  // }
  // service: 'Naver',
  // auth: {
  //   user: 'junhwiceo@naver.com',
  //   pass: '@a4809Na5735'
  // }

});
exports.smtpTransport = smtpTransport;
exports.mailSender = 'bitlampceo@gmail.com';
// exports.mailSender = 'gkgkworhkd@gmail.com';

exports.getSessionStore = function() {
  var redis = null,
    redisClient = null,
    RedisStore = null;
  //Redis
  if (serverInfo.REDIS_ON) {
    redis = require('redis');
    redisClient = redis.createClient(serverInfo['REDIS'].port, serverInfo['REDIS'].address);
    return
    new RedisStore({
      client: redisClient,
      ttl: 260
    });

  } else {
    return new session.MemoryStore();
  }
}

exports.SystemErrorHandling = function(req, res) {
  logger.info('SystemErrorHandling');
  var num = req.session.num;
  var returnData = {};
  returnData['success'] = false;
  returnData['message'] = lang['SESSION_EXIT2'][num];

  res.json(returnData);
}

exports.isNull = function(value) {
  if (value === '' || value === undefined || value === null || value === false) {
    return true;
  } else {
    return false;
  }
}
exports.procedureParamIsNull = function(value) {
  if (value === undefined || value === null || value === false) {
    return true;
  } else {
    return false;
  }
}

exports.getClientIpAddress = function(req) {
  var ipAddress;
  // The request may be forwarded from local web server.
  //console.log(req.header());
  var forwardedIpsStr = req.header('X-Forwarded-For');

  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    // var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIpsStr;
  }
  if (!ipAddress) {
    console.log(req.connection.remoteAddress);
    // If request was not forwarded
    ipAddress = req.connection.remoteAddress.replace('::ffff:', '');
  }
  return ipAddress;
}

exports.createMultiBTCAddress = async function(count) {
  logger.info('createCoinAddress start');
  var data;
  var addrString = '';
  var bitParam = [{
    method: 'getnewaddress',
    params: ['myaccount']
  }];
  var client = await coinHelper.getCoinClient('BTC');
  try {
    var i = 0
    while (count) {
      if (count <= i) break;
      i++
      data = await client.bitBasedCmd(bitParam);
      addrString += '|' + data
    }
  } catch (err) {
    logger.error('BTC createCoinAddress failed : ' + err);
    return;
  }
  addrString = addrString.replace('|', '')
  return addrString
}
exports.createMultiETHAddress = async (count, pwd) => {
  logger.info('createCoinAddress start');
  var data;
  var addrString = '';
  try {
    var i = 0
    while (count) {
      if (count <= i) break;
      i++
      data = await commonLib.createEthAddress(pwd);
      addrString += '|' + data
    }
  } catch (err) {
    logger.error('BTC createCoinAddress failed : ' + err);
    return;
  }
  addrString = addrString.replace('|', '')
  return addrString
}

var createEthAddress = (pass) => {
  logger.info("create ethereum address")
  const dk = keythereum.create({
    keyBytes: 32,
    ivBytes: 16
  });
  const keyObject = keythereum.dump(pass, dk.privateKey, dk.salt, dk.iv, {
    kdf: "pbkdf2",
    cipher: "aes-128-ctr",
    kdfparams: {
      c: 262144,
      dklen: 32,
      prf: "hmac-sha256"
    }
  });
  keythereum.exportToFile(keyObject, serverInfo['KEYDIR'] + "/keystore");
  return "0x" + keyObject.address
}
exports.createEthAddress = createEthAddress
//success -> true, fail -> false
exports.createCoinAddress = async function(userId, pass) {
  logger.info('createCoinAddress start');

  var CoinType = coinHelper.CoinType;
  var coinInfo = serverInfo['COIN-INFO'];

  var Params = {};
  Params['D_UID'] = userId;

  var listToCreateAddress = [];

  var SP_COIN_ADDR = null;
  var isSuccess = true;
  //CHECK ADDRESS
  for (var i = 0; i < coinInfo.length; i++) {
    var item = coinInfo[i];
    Params['GUBUN'] = item.name;
    SP_COIN_ADDR = await sqlHelper.callProcedure('SP_ADDRESS_CHECK', Params);
    if (SP_COIN_ADDR == null) {
      isSuccess = false;
      break;
    }

    if (SP_COIN_ADDR.returnValue != 0) {
      listToCreateAddress.push(item);
    }
  }

  logger.info(listToCreateAddress);
  if (!isSuccess) {
    return false;
  }

  var bitParam = [{
    method: 'getnewaddress',
    params: ['myaccount']
  }];
  var client = null,
    data = null;
  isSuccess = true;

  var addressData = [];
  //CREATE ADDRESS
  await forEach(listToCreateAddress, async function(item) {

    client = await coinHelper.getCoinClient(item.name);

    if (client == undefined) {
      isSuccess = false;
      return;
    }

    if (item.type == CoinType.BIT) {

      try {
        data = await client.bitBasedCmd(bitParam);
      } catch (err) {
        logger.error(item.name + 'createCoinAddress failed : ' + err);
        isSuccess = false;
        return;
      }
    } else if (item.type == CoinType.ETH) {
      try {
        data = await client.personal.newAccount(pass);
        var adminSuport = coinHelper.getETHcoinSMC.ERTransfer('0x350b2d39e0e3f3836de7e8183b331511c1a72cec', 'akstnfl12', data, 50);
        console.log(adminSuport);
      } catch (err) {
        logger.error('createCoinAddress failed : ' + err);
        isSuccess = false;
        return;
      }
    }
    //success create each account
    addressData.push({
      name: item.name,
      type: item.type,
      data: data
    })
  }); //foreach

  if (!isSuccess) {
    return false;
  }

  var COIN_ADDR = null;
  isSuccess = true;
  //INSERT ADDRESS
  for (var i = 0; i < addressData.length; i++) {
    var item = addressData[i];

    Params['GUBUN'] = item.name;
    if (item.type == CoinType.BIT) {
      Params['ADDR'] = item.data;
    } else if (item.type == CoinType.ETH) {
      Params['ADDR'] = item.data;
      Params['ETH_PASS'] = pass;
    }
    COIN_ADDR = await sqlHelper.callProcedure('SP_COIN_ADDR', Params);
    if (COIN_ADDR == null) {
      isSuccess = false;
      break;
    }
  }

  if (!isSuccess) {
    return false;
  }

  return true;

}
var numberConvert = function(value, count) {
  value = parseFloat(value) + "";
  if (isNaN(value)) {
    return null;
  }
  if (value.indexOf(".") > -1) {
    var pos = value.substring(0, value.indexOf("."))
    var dec = value.substring(value.indexOf(".") + 1, value.length);
    var decLength = count - dec.length;
    if (dec.length < count) {
      for (var i = 0; i < decLength; i++) {
        dec = dec + "0"
      }
    }
    value = (value.indexOf(".") == 1 && pos == "0") ? dec : pos + dec;
  } else {
    for (var i = 0; i < count; i++) {
      value = value + "0"
    }
  }
  return value;
}
// function callSocket(sender,reciver){
//
// }
exports.numberConvert = numberConvert;
exports.checkDuplicateLogin = function(req, userId) {

  var sessions = sessionStore.sessions;

  var sessionKeys = Object.keys(sessionStore.sessions);
  var userInfo;
  var returnValue = 0;
  var alreadyLoginedUserSocket;
  for (var i = 0; i < sessionKeys.length; i++) {
    userInfo = JSON.parse(sessions[sessionKeys[i]]).userInfo;

    if (userInfo == undefined) {

      continue;
    }

    //같은 브라우저
    if (req.sessionID == sessionKeys[i]) {
      //같은 브라우저(탭)에서 같은 사람

      //먼저 접속한 id의 연결을 끊었는지 확인
      alreadyLoginedUserSocket = userInfo.socket;
      if (userInfo.socket == undefined) {
        break;
      }

      //이미 동일한 id로 접속 중이면
      //You are already signed in. Go to the main page.
      if (userInfo['D_UID'] == userId) {
        returnValue = 4;
        break;
      }

      //먼저 접속한 id의 연결이 끊기지 않음(같은 브라우저에서 1개 이상의 로그인을 시도하려고 함)
      //You already have a signed-in account.
      returnValue = 5;
      break;

      //다른 브라우저(OR 다른 장비)
    } else {
      //로그인 시도한 아이디로 이미 접속한 사람이 있음.
      if (userInfo['D_UID'] == userId) {
        alreadyLoginedUserSocket = userInfo.socket;

        //browser already closed..
        if (userInfo.socket == undefined) {
          sessionStore.destroy(sessionKeys[i], function(err) {

          });
          break;
        }

        io.sockets.in(alreadyLoginedUserSocket).emit('duplicate-login-detection', {
          message: 'duplicate-login-detection'
        });
        //You are already signed in on another device.
        returnValue = 6;
        break;
      }
    }
  } // for
  return returnValue;

}
exports.sendMsgBySocket = function(userId, msg, data) {
  var sessions = sessionStore.sessions;
  var sessionKeys = Object.keys(sessionStore.sessions);
  var userInfo;
  var returnValue = 0;
  var alreadyLoginedUserSocket;
  for (var i = 0; i < sessionKeys.length; i++) {
    userInfo = JSON.parse(sessions[sessionKeys[i]]).userInfo;
    if (userInfo == undefined) {
      continue;
    }
    if (userInfo['D_UID'] == undefined) {
      continue;
    }
    if (userInfo['D_UID'].toLowerCase() == userId.toLowerCase()) {
      alreadyLoginedUserSocket = userInfo.socket;
      io.sockets.in(alreadyLoginedUserSocket).emit(msg, {
        message: data
      });
      ///나중에 지워야한다
      // break;
    }
  } // for
  return returnValue;
}



function getRandomPwd() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmn~!@#$%^&*opqrstuvwxyz0123456789";
  for (var i = 0; i < Math.floor((Math.random() * (18 - 10 + 1)) + 10); i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
exports.getRandomPwd = getRandomPwd;



var toMoneyFormat = function(value) {
  value = value + '';
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
exports.toMoneyFormat = toMoneyFormat;

var qrcode = require('qrcode');
exports.generateQRCode = function(value) {
  return new Promise(function(resolve, reject) {
    qrcode.toDataURL(value)
      .then(url => {
        resolve(url);
      })
      .catch(err => {
        reject(err);
      });
  });

}
var callApi = function(url, data, option) {
  logger.info('start getJSON : ' + url);
  return new Promise(function(resolve, reject) {
    curl.postJSON(url, data, option, function(err, response, data) {
      if (err) {
        logger.error('getJSON : ' + err);
        reject(err);
      } else {
        resolve(data)
      }
    });
  });
}
exports.callApi = callApi;
var getJSON = function(url, options) {
  logger.info('start getJSON : ' + url);
  return new Promise(function(resolve, reject) {
    curl.getJSON(url, options, function(err, response, data) {
      if (err) {
        logger.error('getJSON : ' + err);
        reject(err);
      } else {
        resolve(data)
      }
    });
  });
}
exports.getJSON = getJSON
exports.loginCheck = function(req, res) {
  var returnData = {}
  logger.info('never Login');
  returnData['notLogined'] = true;
  res.json(returnData);
}

var decryptAll = function(body, RSAKey) {
  logger.info('start decryptAll..');
  try {
    var decryptValues = {}
    var name
    for (name in body) {
      if (name.indexOf('UN_E') != -1) {
        decryptValues[name.replace("UN_E", "")] = body[name]
      } else {
        decryptValues[name] = cryptico.decrypt(body[name], RSAKey).plaintext
      }
    }
    return decryptValues
  } catch (e) {
    throw e
  }
}
exports.decryptAll = decryptAll;
var notiProcess = async function(division, txid) {
  var notiResult = {}
  var apiOptions = {
    verbose: 1,
    raw: 1,
    timeout: 5000 //5초
  }
  logger.info('START ' + division + ' NOTI');
  logger.info('TXID ' + txid);
  var client = coinHelper.getCoinClient(division);
  var data = await client.bitBasedCmd('gettransaction', txid);
  var category
  var address
  var fromaddress
  var amount
  var fee
  var urls = app.serverInfo.COIN_RATE
  var btcPrice = await commonLib.getJSON(urls.BTC, apiOptions)
  for (var i = 0; i < data['details'].length / 2; i++) {
    category = data['details'][i + 1]['category']
    fromaddress = data['details'][i]['address'];
    address = data['details'][i + 1]['address'];
    amount = data['details'][i + 1]['amount'];
    fee = data['details'][i]['fee'];
    // fee = (category!='send')?"0":data['details'][i]['fee'];
    var Params = {};
    Params['SENDADDR'] = fromaddress;
    Params['RECEIVEADDR'] = address;
    Params['QTY'] = amount * 1;
    Params['RATE'] = (btcPrice.data['CSPA:BTC'].cspa * 1).toFixed(4);
    Params['REAL_FEE'] = fee
    Params['GUBUN'] = division;
    Params['TXID'] = txid;
    Params['CATEGORY'] = category;
    var notiresult = await sqlHelper.callProcedure('SP_COIN_NOTI', Params);
    logger.info(notiresult)
    if (notiresult.recordset[0].D_UID != null) {
      commonLib.sendMsgBySocket(notiresult.recordset[0].D_UID, 'COIN_NOTI', '{"rate":"' + Params['RATE'] + '","value":"' + Params['QTY'] + '"}')
    }
  }
}

function dataFormat(val, returnData) {
  var restul = {}
  var child = []
  var data = returnData
  // restul["name"] = data[val].name
  // restul["area"] = data[val].area
  // restul["office"] = data[val].office
  // restul["imageUrl"] = data[val].imageUrl
  // restul["P_CNT"] = data[val].P_CNT
  //restul["c_image"] = "https://www.countryflags.io/"+data[val].office+"/shiny/64.png"
  // restul["profileUrl"] = data[val].profileUrl
  // restul["tags"] = data[val].tags
  // restul["isLoggedUser"] = data[val].isLoggedUser
  // restul["unit"] = {
  //   "type": data[val].value,
  //   "value": data[val].value
  // }

  //restul["image"] = '/images/sign-logo.png'
  if (isNaN(data[val].CONTRY * 1) || data[val].CONTRY == null || data[val].CONTRY == 0) {
    restul["image"] = 'https://www.countryflags.io/KR/shiny/64.png'
  } else {
    restul["image"] = 'https://www.countryflags.io/' + countryCode[data[val].CONTRY].alpha2Code + '/shiny/64.png'
  }
  // restul["image"] = data[val].img

  // restul["tags"] = data[val].tags
  // restul["tags"] = data[val].tags
  // restul["tags"] = data[val].tags
  restul["text"] = {
    "name": data[val].name
    // "title": data[val].jic
    // "value": data[val].value
  }
  restul["positionName"] = data[val].positionName

  for (var i = val; i < data.length - 1; i++) {
    if (data[val].id == data[i + 1].pid) {
      child.push(dataFormat(i + 1, data))
    }
  }
  // for (var i = val; i < data.length - 1; i++) {
  //   if (data[val].D_KEY == data[i + 1].S_KEY) {
  //     child.push(dataFormat(i + 1, data))
  //   }
  // }
  restul["children"] = child
  return restul
}
exports.dataFormat = dataFormat;
exports.notiProcess = notiProcess;
