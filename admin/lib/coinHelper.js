'use strict';
var bitcoin = require('bitcoin');
var cmd = bitcoin.Client.prototype.cmd;
var serverInfo;
var contranc = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
var tetherABI = require('../info/tetherABI.json')
var EosDemux = require('./EosDemux')
var abiDecoder = require('abi-decoder');
var Logger = require('./logger');
var logger = Logger('lib/coinHelper');
var commonLib = require('./commonLib');
var sqlHelper = require('./mssql-helper')
var Web3 = require('web3');
var web3js = new Web3();
var app;
const Tx = require('ethereumjs-tx').Transaction
var keythereum = require("keythereum-pure-js");
const npUrl = 'https://user-api.eoseoul.io:443'
var Client = require('bitcoin-core');
let Eos = require('eosjs');
const {
  Api,
  JsonRpc
} = require('eosjs');
const {
  JsSignatureProvider
} = require('eosjs/dist/eosjs-jssig');
const fetch = require('node-fetch');
const {
  TextDecoder,
  TextEncoder
} = require('util');
const privateKeys = ['5JDaqY9gY8847aQanZYpEMLwMaNMbXchFKr2Y5csHtppjgkhfdp', '5J1iwK1EK8GMD6USxNMWJM44yi7MnRA2jVsKGQjoLoRAf2VW3Xn'];
// let web3js = new Web3(
//   new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/c902745585b94487b6c342419a074213")
// );
web3js.setProvider(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/c902745585b94487b6c342419a074213'));
// web3.setProvider(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/eb3947d95b7442e7a3605404047034ea'));
// let web3js = new Web3(
//   new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws/v3/c902745585b94487b6c342419a074213")
// );
var contractInstace;
// var contractInstace = new web3js.eth.Contract(tetherABI, contranc);
var a = 0
// var subscription = web3js.eth.subscribe('logs', {
//   address: ["0xEfF4CbAfD4a1eD9BD7C9E91FE4fd51fA2389f8b3", "0xC9bD837eEdfF11C0CeCBBBe7180aD6186a22E1e9"]
// }, function(error, result) {
//   if (!error) {
//     console.log("----------------------");
//     console.log(result.address);
//     console.log(result.transactionHash);
//     console.log("----------------------");
//   }
// });
async function getBalancefromAllAddress(addressList) {
  var apiOptions = {
    verbose: 1,
    raw: 1,
    timeout: 5000 //5초
  }
  var start = new Date().getTime()
  var accountUrlStr = ""
  var accountUrlStrs = []
  var count = 0
  var addresies = []
  for (var i = 0; i < addressList.length; i++) {
    // addresies.push(addressList[i].ETH_ADDRESS)
    addresies.push(addressList[i])
  }
  for (var i = 0; i < addresies.length; i++) {
    accountUrlStr += addresies[i] + ","
    if (i % 19 == 0) {
      accountUrlStr = accountUrlStr.substr(0, accountUrlStr.length - 1);
      accountUrlStrs.push(accountUrlStr)
      accountUrlStr = ""
    } else if ((addresies.length - 1) == i) {
      accountUrlStr = accountUrlStr.substr(0, accountUrlStr.length - 1);
      accountUrlStrs.push(accountUrlStr)
    }
  }
  for (var a = 0; a < accountUrlStrs.length; a++) {
    var url = "https://api.etherscan.io/api?module=account&action=balancemulti&address=" + accountUrlStrs[a] + "&tag=latest&apikey=EJ2K9KPN6M5YSVFRIBX2RC1HR2C2KQRRJ9"
    var r = await commonLib.getJSON(url, apiOptions, false)
    r = r.result
    for (var i = 0; i < r.length; i++) {
      //console.log(web3.fromWei(r[i].balance, 'ether'));
      // count++
      // console.log(r[i]);
      if (web3js.fromWei(r[i].balance, 'ether') > 0) {
        // var Param = {}
        console.log("@@@@@@@@@@@@@@@@@");
        // console.log(r[i].account);
        // console.log(web3.fromWei(r[i].balance, 'ether'));
        // Param['D_ADDR'] = r[i].account
        // Param['AMOUNT'] = web3.fromWei(r[i].balance, 'ether')
        // await sqlHelper.callProcedure('SP_ETH_AMOUNT_UPDATE', Param);
      }
    }
  }
  var elapsed = new Date().getTime() - start;
  console.log("prosession Time : " + elapsed / 1000 + " sec");
  console.log("account Length : " + addressList.length + " ea");
}
var sendETHAmount = async (target, address, balance, ethPass, token) => {
  logger.info("start sendRawTransacstion")
  var apiOptions = {
    verbose: 1,
    raw: 1,
    timeout: 5000 //5초
  }
  //var dataDir = "D:/BitLamp/devServer"
  var dataDir = serverInfo.KEYDIR
  var keyObject = keythereum.importFromFile(address, dataDir);
  const privateKey = new Buffer(keythereum.recover(ethPass, keyObject).toString('hex'), 'hex')
  //amount - (gasPrice * 21000) 전부 보내기
  var gasVal = "35"
  var gasUrl = "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken"
  var r = await commonLib.getJSON(gasUrl, apiOptions, false)
  if (r.status == "1") {
    gasVal = r.result.ProposeGasPrice
  }
  var gasPrice = web3js.toWei(gasVal, 'gwei')
  console.log(web3js.toWei(balance * 1, 'ether') - (gasPrice * 21000));
  console.log(gasPrice);
  const txData = {
    gasLimit: web3js.toHex(21000),
    gasPrice: web3js.toHex(gasPrice), // 10 Gwei
    to: target,
    from: address,
    value: web3js.toHex(web3js.toWei(balance * 1, 'ether') - (gasPrice * 21000)) // Thanks @abel30567
  }
  var txCount = web3js.eth.getTransactionCount(address)
  const newNonce = web3js.toHex(txCount)
  const transaction = new Tx({
    ...txData,
    nonce: newNonce
  }, {
    chain: 'mainnet'
  }) // or 'rinkeby'
  transaction.sign(privateKey)
  const serializedTx = transaction.serialize().toString('hex')
  return web3js.eth.sendRawTransaction('0x' + serializedTx)
}
// var sendETHAmount = async (target, address, balance, ethPass, token) => {
//   logger.info("start sendRawTransacstion")
//   var dataDir = "D:/BitLamp/devServer"
//   // var dataDir = "/home/jeak/server"
//   var keyObject = keythereum.importFromFile(address, dataDir);
//   const privateKey = new Buffer(keythereum.recover(ethPass, keyObject).toString('hex'), 'hex')
//   const txData = {
//     gasLimit: web3js.utils.toHex(21000),
//     gasPrice: web3js.utils.toHex(web3js.utils.toWei('12', 'gwei')), // 10 Gwei
//     to: (token)?contranc: target,
//     from: address,
//   }
//   if (token) {
//     txData['data'] = contractInstace.methods.transfer(target, balance).encodeABI()
//   } else {
//     txData['value'] = web3js.utils.toHex(web3js.utils.toWei(balance+"", 'ether') - (21000*web3js.utils.toWei('12', 'gwei')))
//   }
//   var txCount = web3js.eth.getTransactionCount(address)
//   const newNonce = web3js.utils.toHex(txCount)
//   const transaction = new Tx({
//     ...txData,
//     nonce: newNonce
//   }, {
//     chain: 'mainnet'
//   }) // or 'rinkeby'
//   transaction.sign(privateKey)
//   const serializedTx = transaction.serialize().toString('hex')
//   return web3js.eth.sendSignedTransaction('0x' + serializedTx)
// }
var getETHTranscation = (txid) => {
  return web3js.eth.getTransaction(txid)
}
async function getETHAmount(address, token) {
  var result = await web3js.eth.getBalance(address)
  // var result = (token) ? await contractInstace.methods.balanceOf(address).call() : await web3js.eth.getBalance(address)
  return result.toString();
}
exports.getETHTranscation = getETHTranscation
exports.sendETHAmount = sendETHAmount
exports.getETHAmount = getETHAmount

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc(npUrl, {
  fetch
}); //required to read blockchain state
// const rpc = new JsonRpc('http://167.71.119.246:8888', { fetch }); //required to read blockchain state
const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder()
}); //required to submit transactions
setTimeout(async () => {}, 1000)
exports.getBTCBalance = async () => {
  var client;
  client = new Client(serverInfo.NEC_BTC);
  return await client.getBalance("*");
}
exports.sendBTCAmount = async (reqAmount, target) => {
  var client
  client = new Client(serverInfo.NEC_BTC);
  var rpcData = await client.getBalance("*");
  if (rpcData < reqAmount) {
    logger.info('notEnought Balance');
    return null
  }

  rpcData = await client.validateAddress(target);
  if (!rpcData.isvalid) {
    logger.info('invalid address');
    return null
  }
  rpcData = await client.sendToAddress(target, reqAmount * 1);
  return rpcData
}
exports.validateAddress = async (target, type) => {
  var client
  if (type == 'BTC') {
    client = new Client(serverInfo.NEC_BTC);
    var rpcData = await client.validateAddress(target);
    if (!rpcData.isvalid) {
      return 1
    }
    return 0
  } else if (type == 'ETH') {
    var rpcData = await web3js.isAddress(target)
    // var rpcData = await web3js.utils.isAddress(target)
    if (!rpcData) {
      return 1
    }
    return 0
  }
}
exports.sendEOS = async (taget, balance, memo) => {
  balance = balance + '.0000 EOS'
  console.log("startTransfer");
  var txid;
  try {
    var r = await api.transact({
      actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: 'eosgtgloball',
          permission: 'active',
        }],
        data: {
          from: 'eosgtgloball',
          to: taget,
          quantity: balance,
          memo: memo + ""
        }
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    txid = r.transaction_id
  } catch (e) {
    console.log(e);
    txid = null
  }
  return txid
}

exports.initialize = function() {
  app = require('../app');
  serverInfo = app.serverInfo;
  init();
  EosDemux.initialize(100147758, npUrl)
}
var CoinType = {
  BIT: 0,
  ETH: 1,
  POINT: 3
}
exports.CoinType = CoinType;

async function init() {
  var apiOptions = {
    verbose: 1,
    raw: 1,
    timeout: 30000 //5초
  }

}

var bitBasedCmd = function() {
  var args = Array.from(arguments);
  var operation = arguments['0'];
  if (typeof(operation) == 'object') {
    operation = operation['method']
  }
  logger.info('operation : ' + operation + ', Params : ' + JSON.stringify(args));
  var promise = new Promise((resolve, reject) => {

    var callback = function(err, data) {
      logger.debug('=========operation data==========');
      logger.debug(data);
      logger.debug('=================================');
      if (err) {
        logger.error(' bitBasedCmd err - ' + operation + ', err : ' + err);
        reject(err);
      } else {
        logger.info(arguments['0'] + ' success');
        resolve(data);
      }
    };
    args[new String(args.length)] = callback;
    cmd.apply(this, args);
  });
  promise.catch(err => {
    logger.error('bitBasedCmd catch - ' + operation + ', err : ' + err);
  });
  return promise;
}

bitcoin.Client.prototype.bitBasedCmd = bitBasedCmd;

exports.getCoinClient = function(clientName) {
  logger.info('getCoinClient - ' + clientName);
  var client;
  try {
    if (clientName == 'BTC') {
      client = new bitcoin.Client(serverInfo.BTC);
    } else if (clientName == 'RVN') {
      client = new bitcoin.Client(serverInfo.RVN);
    } else if (clientName == 'USDTB') {
      client = new bitcoin.Client(serverInfo.USDTB);
    } else if (clientName == 'ETH') {
      client = web3;
    } else if (clientName == 'USDTE') {
      client = web3;
    } else if (clientName == 'BIZ') {
      client = web3;
    }
  } catch (err) {
    logger.error('getCoinClient failed - ' + clientName + 'err : ' + err);
  }
  if (commonLib.isNull(client)) {
    return null;
  }
  logger.debug('success ' + clientName + ' getCoinClient');
  return client;
}
exports.doTransation = async function(type, target, amount) {
  var resultItem = {}
  var coinServerInfo = serverInfo[type + "_ADMIN"]
  logger.info(type + ' bitCoinNoty START');
  var client;
  try {
    client = new Client(coinServerInfo);
  } catch (err) {
    if (typeof(err) == 'string') {
      logger.error(type + ' coinTransferCheck get client fail err : ' + err);
    } else {
      logger.error(type + ' coinTransferCheck get client fail err : ');
      logger.error(err);
    }
    return false;
  }
  var rpcData;
  var workingOn = true;
  try {
    logger.info('getBalance start');
    rpcData = await client.getBalance("*");
    logger.info('exchange balance : ' + rpcData);
  } catch (err) {
    resultItem['returnValue'] = 9;
    resultItem['message'] = 'coinTransferCheck getBalance fail error : ' + err;
    logger.error(resultItem.message);
    workingOn = false;
    return resultItem
  }

  if (rpcData < amount) {
    resultItem['returnValue'] = 9;
    resultItem['message'] = 'not enough exchange balance';
    workingOn = false;
    return resultItem
  }
  try {
    if (workingOn) {
      logger.info('validateAddress start');
      rpcData = await client.validateAddress(target);
      logger.info('isValid : ' + rpcData.isvalid);
    } else {
      logger.info('validateAddress passing');
    }

  } catch (err) {
    logger.error('validateAddress fail error : ' + err);
    resultItem['returnValue'] = 9;
    resultItem['message'] = 'coinTransferCheck validateAddress fail error : ' + err;
    workingOn = false;
    return resultItem
  }
  if (workingOn) {
    if (!rpcData.isvalid) {
      logger.info('invalid address');
      resultItem['returnValue'] = 9;
      resultItem['message'] = 'invalid address';
      workingOn = false;
      return resultItem
    }
  }
  var txid;
  try {
    if (workingOn) {
      logger.info('sendToAddress start');
      rpcData = await client.sendToAddress(target, amount * 1);
      txid = rpcData;
    } else {
      logger.info('sendToAddress passing');
    }
  } catch (err) {
    resultItem['returnValue'] = 9;
    resultItem['message'] = 'coinTransferCheck sendToAddress fail error : ' + err;
    logger.error(resultItem.message);
    workingOn = false;
    return resultItem
  }

  var fee = 0;
  try {
    if (workingOn) {
      logger.info('getTransaction start');
      rpcData = await client.getTransaction(txid);
      fee = rpcData['details'][0]['fee'];
    } else {
      logger.info('getTransaction passing');
    }
  } catch (err) {
    resultItem['returnValue'] = 9;
    resultItem['message'] = 'coinTransferCheck getTransaction fail error : ' + err;
    logger.error(resultItem.message);
    workingOn = false;
    return resultItem
  }

  resultItem['txid'] = txid
  resultItem['fee'] = fee
  resultItem['returnValue'] = 0;
  resultItem['message'] = "Successfully processed.";
  return resultItem
}
