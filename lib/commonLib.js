'use strict';
var redis = require('redis');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var serverInfo = require('../info/server-info');
// logger setup
var Logger = require('./logger');
var logger = Logger('routes/commonLib');
var lang = require('../config/lang');
var sqlHelper = require('./mssql-helper')
var nodemailer = require('nodemailer');
var coinHelper = require('./coinHelper');
var curl = require('curl');
var countryInfo = require('../info/countryInfo');
var NodeCache = require("node-cache");
var cryptico = require('cryptico');
var moment = require('moment');
var commonLib = require('./commonLib');
var myCache = new NodeCache();
var countryCode = require('../config/countryCodeFormat.json');
var app;
var sessionStore;
var io;
var serverInfo;

var schedule = require("node-schedule");
var activeAggs = [];
var delayAggs = [];
var aggFlag = false;



var {
  forEach
} = require('p-iteration');
var fs = require('fs');
var path = require('path');
var apiOptions = {
  verbose: 1,
  raw: 1,
  timeout: 50000 //5초
}
exports.initialize = function() {
  app = require('../app');
  sessionStore = app.sessionStore;
  io = app.io;
  serverInfo = app.serverInfo;
  var data = {
    point: 99
  }
  var data = {
    point: 10
  }
}
exports.afterDb = () => {
init();
}
async function init() {
  // var r = await sqlHelper.callProcedure('SP_MACHING_TIME');
  // var matTimes = r.recordsets[0]
  // logger.info("Total Maching Length = " + matTimes.length)
  // for (var i = 0; i < matTimes.length; i++) {
  //   var srule = new schedule.RecurrenceRule();
  //   srule.hour = matTimes[i].S_SHOUR
  //   srule.minute = matTimes[i].S_SMINUTE
  //   schedule.scheduleJob(srule, async function() {
  //     logger.info("getAgg Start");
  //     console.log("@@@@@@@@@@@  40 @@@@@@@@@@@@");
  //     var MatTime = await sqlHelper.callProcedure('SP_MACHING_TIME');
  //     var Param = {}
  //     var RoundData=await commonLib.getMachingData()
  //     Param['ROUND'] = MatTime.recordsets[0][RoundData.NEXTMAT-1].S_ALLCNT
  //     var r = await sqlHelper.callProcedure('SP_STAUTO', Param);
  //   })
  //   var erule = new schedule.RecurrenceRule();
  //   erule.hour = matTimes[i].S_EHOUR
  //   erule.minute = matTimes[i].S_EMINUTE
  //   schedule.scheduleJob(erule, async function() {
  //     logger.info("getAgg End");
  //     var MatTime = await sqlHelper.callProcedure('SP_MACHING_TIME');
  //     var Param = {}
  //     var RoundData=await commonLib.getMachingData()
  //     Param['ROUND'] = MatTime.recordsets[0][RoundData.NEXTMAT-2].S_ALLCNT
  //     var r = await sqlHelper.callProcedure('SP_END_AUTO', Param);
  //   })
  // }

  // setTimeout(()=>{
  //   commonLib.sendMsgBySocket('goldegg1', 'INSERTCOIN', JSON.stringify({}))
  // },1000*40)
  setInterval(async () => {
    // setTimeout(async () => {
    var r = await sqlHelper.callProcedure('SP_COIN_WAITING');
    var pendingList = r.recordset
    var apiOptions = {
      verbose: 1,
      raw: 1,
      timeout: 5000 //5초
    }
    var urls = app.serverInfo.COIN_RATE

    for (var i = 0; i < pendingList.length; i++) {
      var txid = pendingList[i].MS_TXID
      // var txid = '0x053f76a09e7a35ebb6097660a14b0d24d2497d5c7fda4da787a649d8715dd2d5'
      var r = coinHelper.getETHTranscation(txid)
      if (r != null) {
        if (r.blockHash != null) {
          var etherScanUrl = "https://api.etherscan.io/api?module=transaction&action=getstatus&txhash=" + txid + "&apikey=YourApiKeyToken"
          var txResult = await commonLib.getJSON(etherScanUrl, apiOptions)
          var PARAM = {}
          PARAM['OUTKEY'] = pendingList[i].MS_KEY
          PARAM['TXID'] = pendingList[i].MS_TXID
          PARAM['FEE'] = (r.gas * r.gasPrice.toString() * 0.000000000000000001).toFixed(6)
          PARAM['RESULT'] = 0
          if (txResult.result.isError == '0') {
            logger.info("Transcation Complate : " + txid)
            PARAM['RESULT'] = 0
            var notiresult = await sqlHelper.callProcedure('SP_COIN_NOTI_COMPLETE', PARAM);
            if (notiresult.recordset[0].UID != null) {
              commonLib.sendMsgBySocket(notiresult.recordset[0].UID, 'INSERTCOIN', JSON.stringify(notiresult.recordset[0]))
            }

          } else if (txResult.result.isError == '1') {
            logger.info("Failed Transcation : " + txid)
            PARAM['RESULT'] = 9
            var notiresult = await sqlHelper.callProcedure('SP_COIN_NOTI_COMPLETE', PARAM);
          }

        }
      }

    }
    // }, 1000 * 10)
  }, 1000 * 60 * 3)
  // setTimeout(()=>{
  //   commonLib.sendMsgBySocket('test', 'INSERTCOIN', JSON.stringify({
  //     PLAG: '0',
  //     UID: 'test',
  //     GUBUN: 'ETH',
  //     QTY: 0.01,
  //     RATE: 316.9507,
  //     M_AMOUNT: 3.169507,
  //     SADDR: '0xcc5074ed7e46a128c7ee07d6014dd10f27f4bd45'
  //   }))
  // },1000*30)

}

var countAgg = (seq, leftTime) => {
  logger.info("left Time = ", leftTime, ' sec');
  activeAggs.push(seq)
  logger.info("active Agg Length = ", activeAggs.length);
  setTimeout(async () => {
    activeAggs.splice(activeAggs.indexOf("seq"), 1);
    logger.info("Call Procedure !!");
    logger.info("Remove Agg" + seq);
    logger.info("after finsh active Agg Length = ", activeAggs.length);
  }, leftTime * 1000)
}
exports.countAgg = countAgg

function delayCount(seq, delayTime) {
  logger.info("delay Time = ", delayTime, ' sec');
  delayAggs.push(seq)
  logger.info("delay Agg Length = ", delayAggs.length);
  setTimeout(async () => {
    delayAggs.splice(delayAggs.indexOf("seq"), 1);
    logger.info("after finsh delay Agg Length = ", delayAggs.length);
    if (aggFlag) {
      logger.info("Start Agg" + seq);
    }
  }, delayTime)
}


exports.ethCoinNoti = async function(d_uid, addr, ethpass) {
  var balance = await coinHelper.getETHAmount(addr)
  console.log(addr);
  balance = balance * 0.000000000000000001
  console.log(balance);
  if (balance > 0) {
    // if (balance > 0.0001) {
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
      txid = await coinHelper.sendETHAmount(app.serverInfo.ADMINADDR, addr, (balance * 1), ethpass, false, true)
      logger.info(txid);
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

var _options = {
  SESSION_SECRET: '@#@$MYSIGN#@$#$',
  EXCHANGE_RATE_JSON: 500,
  CONFIG_FILE_PATH: path.join(appRoot + '/config/config.json')
}

function getRandomPwd() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < Math.floor((Math.random() * (18 - 10 + 1)) + 10); i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
exports.getRandomPwd = getRandomPwd;
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
  // host: 'smtp.gmail.com',
  auth: {
    user: 'cjy690218@gmail.com',
    pass: 'cjy0218@'
  }
});
exports.smtpTransport = smtpTransport;
exports.mailSender = 'cjy690218@gmail.com';

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
  returnData['message'] = 'Session Out'

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
  var forwardedIpsStr = req.header('x-real-ip');
  if (forwardedIpsStr) {
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    ipAddress = req.connection.remoteAddress.replace('::ffff:', '');
  }
  return ipAddress;
}

exports.getCoinData = async function() {

  var operations = ['BTC/USD', 'ETH/USD', 'BTC/KRW', 'LTC/USD', 'USD/KRW', 'ALT/USD', 'ALT/KRW', 'BTC/DAY_BEFORE', 'ETH/DAY_BEFORE', 'LTC/DAY_BEFORE'];
  var workList = [];
  var returnData = {};

  for (var i = 0; i < operations.length; i++) {
    var operation = operations[i];
    logger.debug(operation + ' start');
    var data = await getCoinTicker(operation);
    if (data == null) {
      logger.error('getCoinData - ' + operation + ' fail');
      return null;
    }
    returnData[operation] = data;
  }
  return returnData;
}

//---getMDbCoinaddress
exports.getMDbCoinaddress = async(userId, pass, gubun ) => {

  var CoinType = coinHelper.CoinType;
  var coinInfo = serverInfo['COIN-INFO'];

  var Param = {};
  Param['D_UID'] = userId;
  var listToCreateAddress = [];
  var SP_COIN_ADDR = null;
  var isSuccess = true;
  Param['D_GUBUN'] = gubun;
  
  SP_COIN_ADDR = await sqlHelper.callProcedure('SP_CHECK_ADDRESS', Param);
 if (SP_COIN_ADDR == null) {
       isSuccess = false;
 } 
//  if (SP_COIN_ADDR.recordset[0].RESULT != 0) {
//     listToCreateAddress.push(gubun);
//  }

  // logger.info(`listToCreateAddress : ${listToCreateAddress}`);
  // if (!isSuccess) {
  //   return false;
  // }

  var bitParam = [{
    method: 'getnewaddress',
    params: ['myaccount']
  }];
  var client = null,
       data = null;
  isSuccess = true;


  //CREATE ADDRESS
  //await forEach(listToCreateAddress, async function(gubun) {
    client = await coinHelper.getCoinClient(gubun);

    if (client == undefined) {
      isSuccess = false;
      return;
    }
    
  
     console.table(coinInfo.name);
     console.table(gubun);

    if (gubun == 'MDB' ) {
    try {
      data = await client.bitBasedCmd(bitParam);
       console.table(data);
    } catch (err) {
      logger.error(gubun + 'createCoinAddress failed : ' + err);
      isSuccess = false;
      return;
    }
  }


  // if (!isSuccess) {
  //   return false;
  // }

  // var COIN_ADDR = null;
  // isSuccess = true;

  // Param['GUBUN'] =gubun;
  // Param['ADDR'] = data;
  // Param['PASS'] = pass;
  //  req.session.userInfo[Param['GUBUN'] + 'ADDR'] = data
  //  req.session.userInfo[Param['GUBUN'] + 'ADDRPASS'] = pass
  //  req.session.userInfo[Param['GUBUN'] + 'ADDRQR']= (req.session.userInfo[Param['GUBUN'] + 'ADDR'] != null) 
  //  ? await commonLib.generateQRCode(req.session.userInfo[Param['GUBUN'] + 'ADDR']): ""

  //COIN_ADDR = await sqlHelper.callProcedure('SP_COIN_ADDR_CREATE', Param);

 



  return data; 

}




exports.createCoinAddress = async(userId, pass ) => {
  logger.info('createCoinAddress start---------->>>>>>');
  console.log(`6, Backend-router.post in ==> createCoinAddress userId :  ${userId}`);
  console.log(`7, Backend-router.post in ==> createCoinAddress   pass :  ${pass}  gubun  ${gubun} `);

  var CoinType = coinHelper.CoinType;
  var coinInfo = serverInfo['COIN-INFO'];
  console.log(`8, Backend-router.post in ==> serverInfo['COIN-INFO]`);
  console.table(coinInfo);

  var Params = {};
  Params['D_UID'] = userId;

  var listToCreateAddress = [];

  const SP_COIN_ADDR = null;
  var isSuccess = true;
  coinInfo.forEach
  .forEach(element => {
    
  });
  for (var i = 0; i < coinInfo.length; i++) {
    var item = coinInfo[i];
    Params['D_GUBUN'] = item.name;
   
    
     SP_COIN_ADDR = await sqlHelper.callProcedure('SP_CHECK_ADDRESS', Params);
     
    //  if (SP_COIN_ADDR == null) {
    //     console.log(`item.name  :  ===============> ${item.name}`)
    //  }
     if (SP_COIN_ADDR == null) {
       isSuccess = false;
       break;
     }
     if (SP_COIN_ADDR.recordset[0].RESULT != 0) {
       listToCreateAddress.push(item);
     }
  }

  logger.info(listToCreateAddress);
  if (!isSuccess) {
    return false;
  }

  const bitParam = [{
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
        data = await coinHelper.createEthAddress(pass, '')
        logger.info("pass = " + pass)
        logger.info("addr = " + data)

      } catch (err) {
        logger.error('createCoinAddress failed : ' + err);
        isSuccess = false;
        return;
      }
    }
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
  for (var i = 0; i < addressData.length; i++) {
    var item = addressData[i];

    Params['GUBUN'] = item.name;
    Params['ADDR'] = item.data;
    Params['PASS'] = pass;
    COIN_ADDR = await sqlHelper.callProcedure('SP_COIN_ADDR_CREATE', Params);
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
    if (req.sessionID == sessionKeys[i]) {
      alreadyLoginedUserSocket = userInfo.socket;
      if (userInfo.socket == undefined) {
        break;
      }
      if (userInfo['D_UID'] == userId) {
        returnValue = 4;
        break;
      }
      returnValue = 5;
      break;
    } else {
      if (userInfo['D_UID'] == userId) {
        alreadyLoginedUserSocket = userInfo.socket;
        if (userInfo.socket == undefined) {
          sessionStore.destroy(sessionKeys[i], function(err) {

          });
          break;
        }
        io.sockets.in(alreadyLoginedUserSocket).emit('duplicate-login-detection', {
          message: 'duplicate-login-detection'
        });
        returnValue = 6;
        break;
      }
    }
  } // for
  return returnValue;

}



async function getExchangeRate(operation) {
  var url = '';
  var returnValue;
  var options = {
    verbose: 1,
    raw: 1,
    timeout: 5000 //5초
  }

  if (operation == 'USD/KRW') {
    var cachedData = myCache.get(operation);
    if (cachedData != undefined) {
      return cachedData;
    }

    url = 'https://api.manana.kr/exchange/rate/KRW/KRW,USD,JPY.json';
    try {
      var data = await getJSON(url, options);

    } catch (err) {
      logger.error('failed getJSON getExchangeRate data : ' + err);
      returnValue = await getConfig('EXCHANGE_RATE', 'USD/KRW');
      myCache.set('USD/KRW', returnValue, 100);
      return returnValue;
    }
    for (var i = 0; i < data.length; i++) {
      for (var property in data[i]) {
        if (property == 'name') {
          if (data[i][property] == 'USDKRW=X') {
            returnValue = data[i]['rate'];
            myCache.set('USD/KRW', returnValue, _options.EXCHANGE_RATE_JSON);
            await setConfig('EXCHANGE_RATE', 'USD/KRW', returnValue);
            break;

          }
        }
      }
    }
  }

  return returnValue;
}
var getCoinTicker = async function(operation) {

  var cachedData = myCache.get(operation);

  if (cachedData != undefined) {
    logger.debug(operation + ' - Pre Cached');
    return cachedData;
  }
  var returnValue;
  var url = '';

  url = 'https://api.coinmarketcap.com/v1/ticker/?limit=50';

  var options = {
    verbose: 1,
    raw: 1,
    timeout: 8000 //2초
  }
  var coinTickerData = null;
  coinTickerData = myCache.get('COIN_TICKER');
  if (coinTickerData == undefined) {
    try {
      coinTickerData = await getJSON(url, options);
      myCache.set('COIN_TICKER', coinTickerData, _options.EXCHANGE_RATE_JSON);
    } catch (err) {
      logger.error('failed getJSON COIN_TICKER data : ' + err);
    }
  } else {
    data = coinTickerData;
  }

  var usdKrw = await getExchangeRate('USD/KRW');
  if (operation == 'USD/KRW') {
    return usdKrw;
  }
  var returnValue;
  if (operation == 'BTC/USD') {
    var item = coinTickerData.find(function(item) {
      return item.symbol == 'BTC';
    });
    returnValue = parseFloat(item.price_usd);
  }
  if (operation == 'BTC/KRW') {
    var item = coinTickerData.find(function(item) {
      return item.symbol == 'BTC';
    });
    returnValue = parseFloat(item.price_usd) * usdKrw;
  }
  if (operation == 'ETH/USD') {
    var item = coinTickerData.find(function(item) {
      return item.symbol == 'ETH';
    });
    returnValue = parseFloat(item.price_usd);
  }
  if (operation == 'ETH/KRW') {
    var item = coinTickerData.find(function(item) {
      return item.symbol == 'ETH';
    });
    returnValue = parseFloat(item.price_usd) * usdKrw;
  }
  if (operation == 'LTC/USD') {
    var item = coinTickerData.find(function(item) {
      return item.symbol == 'LTC';
    });
    returnValue = parseFloat(item.price_usd);
  }
  if (operation == 'LTC/KRW') {
    var item = coinTickerData.find(function(item) {
      return item.symbol == 'LTC';
    });
    returnValue = parseFloat(item.price_usd) * usdKrw;
  }

  //DB DATA
  if (operation == 'ALT/USD') {
    var Params = {};
    Params['COIN'] = serverInfo['ALT_COIN_UNIT'];
    Params['GUBUN'] = 'USD';
    var data = await sqlHelper.callProcedure('SP_COIN_RATE', Params);
    if (data == null) {
      logger.error('faild SP_COIN_RATE - ' + operation);
      returnValue = 0;
    }
    returnValue = data.recordset[0]['RATE'];
  }

  if (operation == 'ALT/KRW') {
    var Params = {};
    Params['COIN'] = serverInfo['ALT_COIN_UNIT'];
    Params['GUBUN'] = 'KRW';
    var data = await sqlHelper.callProcedure('SP_COIN_RATE', Params);
    if (data == null) {
      logger.error('faild SP_COIN_RATE - ' + operation);
      returnValue = 0;
    }
    returnValue = data.recordset[0]['RATE'];
  }

  if (operation == 'BTC/DAY_BEFORE') {
    var item = coinTickerData.find(function(item) {
      return item.symbol == 'BTC';
    });
    returnValue = item.percent_change_24h;
  }

  if (operation == 'ETH/DAY_BEFORE') {
    var item = coinTickerData.find(function(item) {
      return item.symbol == 'ETH';
    });
    returnValue = item.percent_change_24h;
  }

  if (operation == 'LTC/DAY_BEFORE') {
    var item = coinTickerData.find(function(item) {
      return item.symbol == 'LTC';
    });

    returnValue = item.percent_change_24h;
  }
  logger.info('operation : ' + operation + returnValue);
  myCache.set(operation, returnValue, _options.EXCHANGE_RATE_JSON);
  await setConfig('EXCHANGE_RATE', operation, returnValue);
  return returnValue;
}


var setRunning = false;
var toMoneyFormat = function(value) {
  value = value + '';
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

exports.toMoneyFormat = toMoneyFormat;
var getConfig = async function(type, subType) {

  return new Promise(function(resolve, reject) {
    var returnValue;
    fs.readFile(_options.CONFIG_FILE_PATH, function(err, data) {
      if (err) {
        logger.error('getConfig - readFile failed : ' + err);
        reject(err);
      } else {
        var parseJson = null;
        try {
          parseJson = JSON.parse(data);
        } catch (err) {
          logger.error('getConfig - parseJson failed : ' + err);
          reject(err);
        }
        returnValue = parseJson[type][subType];
        resolve(returnValue);
      }
    });
  });


}


var setConfig = async function(type, subType, value) {

  return new Promise(function(resolve, reject) {

    var configFile = fs.readFile(_options.CONFIG_FILE_PATH, function(err, data) {
      if (err) {
        logger.error('getConfig : ' + err);
        reject(err);
      } else {
        var parseJson = null;
        try {
          parseJson = JSON.parse(data);
        } catch (err) {
          logger.error('getConfig - parseJson failed : ' + err);
          reject(err);
        } finally {

        }
        parseJson[type][subType] = value;

        fs.writeFile(_options.CONFIG_FILE_PATH, JSON.stringify(parseJson), function(err, data) {

          if (err) {
            logger.error('setConfig - writeFile failed : ' + err);
            reject(err);
          } else {
            resolve(null);
          }
        });

      }
    });
  });

}
var qrcode = require('qrcode');
const { Console } = require('console');
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
exports.getJSON = getJSON;
exports.callApi = callApi;
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
  console.log('modua--coinmining --test Were is find undfind ??');
  console.table(data);
  console.log(data);
  
  var category
  var address
  var fromaddress
  var amount
  var fee
  //var urls = app.serverInfo.COIN_RATE
  //var btcPrice = await commonLib.getJSON(urls.BTC, apiOptions)

  //for (var i = 0; i < data['details'].length / 2; i++) {
   // category = data['details'][0]['category']
    category ="mining";
    fromaddress = data['details'][0]['address'];
    address = data['details'][0]['address'];
    amount = data['details'][0]['amount'];
    //fee = data['details'][0]['fee'];

   fee = (category!='send')?"0":data['details'][i]['fee'];
  //}
    var Params = {};
    Params['SENDADDR'] = fromaddress;
    Params['RECEIVEADDR'] = address;
    Params['QTY'] = amount * 1;
    Params['RATE'] = 1.0;//(btcPrice.data['CSPA:BTC'].cspa * 1).toFixed(4);
    Params['REAL_FEE'] = fee
    Params['GUBUN'] = division;
    Params['TXID'] = txid;
    Params['CATEGORY'] = category;
    var notiresult = await sqlHelper.callProcedure('SP_COIN_NOTI_MINING', Params);
    logger.info(notiresult)
    if (notiresult.recordset[0].D_UID != null) {
      commonLib.sendMsgBySocket(notiresult.recordset[0].D_UID, 'INSERTCOIN', JSON.stringify(notiresult.recordset[0]))
    }
  
}

exports.getMachingData = async () => {
  var now = new Date()
  var nowHours = now.getHours()
  var nowMinutes = now.getMinutes()
  var nowTime = (nowHours + "") + ((nowMinutes < 10) ? "0" + nowMinutes : nowMinutes + "")
  var MACHING = await sqlHelper.callProcedure('SP_MACHING_TIME');
  MACHING = MACHING.recordsets[0];
  var MACTIME = -1
  var NEXTMAT = 1
  for (var i = 0; i < MACHING.length; i++) {
    if ((nowTime * 1) > ((MACHING[i].S_SHOUR + "") + (MACHING[i].S_SMINUTE))) {
      NEXTMAT++
    }
    if ((nowTime * 1) >= ((MACHING[i].S_SHOUR + "") + (MACHING[i].S_SMINUTE)) && (nowTime * 1) <= ((MACHING[i].S_EHOUR + "") + (MACHING[i].S_EMINUTE))) {
      MACTIME = i
    }
  }
  return {
    MATLEV: MACTIME,
    NEXTMAT: (NEXTMAT == (MACHING.length + 1)) ? 1 : NEXTMAT,
    EHOUR: (MACTIME != -1) ? MACHING[MACTIME].S_EHOUR : "",
    S_ALLCNT: (MACTIME != -1) ? MACHING[MACTIME].S_ALLCNT : MACHING[(NEXTMAT == (MACHING.length + 1)) ? 0 : NEXTMAT-1].S_ALLCNT,
    EMINUT: (MACTIME != -1) ? MACHING[MACTIME].S_EMINUTE : ""
  }
}

function dataFormat(val, returnData) {
  var result = {}
  var child = []
  var data = returnData
  result["text"] = data[val].D_UID + " - " + data[val].D_JICNAME
  if (isNaN(data[val].D_CONTRY * 1) || data[val].D_CONTRY == null || data[val].D_CONTRY == 0) {
    result["icon"] = 'https://www.countryflags.io/KR/shiny/64.png'
  } else {
    result["icon"] = 'https://www.countryflags.io/' + countryCode[data[val].D_CONTRY].alpha2Code + '/shiny/64.png'
  }
  for (var i = val; i < data.length - 1; i++) {
    if (data[val].id == data[i + 1].pid) {
      child.push(dataFormat(i + 1, data))
    }
  }
  result["children"] = child
  return result
}
exports.sendMsgBySocket = function(userId, msg, data) {
  var sessions = sessionStore.sessions;
  var sessionKeys = Object.keys(sessionStore.sessions);
  var userInfo;
  var returnValue = 0;
  var alreadyLoginedUserSocket;
  for (var i = 0; i < sessionKeys.length; i++) {
    userInfo = JSON.parse(sessions[sessionKeys[i]]).userInfo;

    console.log(userInfo);
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
    }
  } // for
  return returnValue;

}
exports.dataFormat = dataFormat;
exports.notiProcess = notiProcess;
