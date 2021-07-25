'use strict';
var bitcoin = require('bitcoin');
var cmd = bitcoin.Client.prototype.cmd;
var serverInfo;
var keythereum = require("keythereum-pure-js");
var contractJsons = {}
var abiDecoder = require('abi-decoder');
var Logger = require('./logger');
var logger = Logger('lib/coinHelper');
var MDAToken = require('../info/MDAToken.json');
var commonLib = require('./commonLib');
var sqlHelper = require('./mssql-helper')
var Web3 = require('web3');
var web3 = new Web3();
const Tx = require('ethereumjs-tx').Transaction
var web3_ETH = new Web3();
var app;
const npUrl = 'https://user-api.eoseoul.io:443'
var Client = require('bitcoin-core');
var contranctAddrs = {
  USDTE: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  BIZ: "0x5c942bbd8C2548cf85b0828c63A2000589F04793"
}
let Eos = require('eosjs');
const {
  Api,
  JsonRpc
} = require('eosjs');
const {
  JsSignatureProvider
} = require('eosjs/dist/eosjs-jssig'); // development only
const fetch = require('node-fetch'); //node only
const {
  TextDecoder,
  TextEncoder
} = require('util'); //node only
const privateKeys = ['5JDaqY9gY8847aQanZYpEMLwMaNMbXchFKr2Y5csHtppjgkhfdp', '5J1iwK1EK8GMD6USxNMWJM44yi7MnRA2jVsKGQjoLoRAf2VW3Xn'];
const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc(npUrl, {
  fetch
});
var apiOptions = {
  verbose: 1,
  raw: 1,
  timeout: 50000 //5초
}
const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder()
}); //required to submit transactions

//web3.setProvider(new Web3.providers.HttpProvider('http://165.227.3.29/', 0, 'nginx', 'akstnfl12'));
web3.setProvider(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/aca3dc74cdfd471f912bafa23cd7f573'));
var MyContract = web3.eth.contract(MDAToken);
// var contract = web3.eth.contract(contractJsons[type]);
// var contractInstace = contract.at(contranctAddrs[type]);
var contractAddress="0x8177EF6A05ADBa53CB78ca4Da6f4A66766bcF69D"
var contractInstance = MyContract.at(contractAddress);

exports.getToEth = val => web3.fromWei(val, 'ether')
exports.initialize = function() {
  app = require('../app');
  serverInfo = app.serverInfo;
}
var CoinType = {
  BIT: 0,
  ETH: 1,
  POINT: 3
}
exports.CoinType = CoinType;

exports.getEosAmount = async (addr) => {
  return await rpc.get_currency_balance('eosio.token', addr, 'EOS')
}
exports.sendEOS = async (taget, balance, memo) => {
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
var createEthAddress = (pass, uid) => {
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
  keythereum.exportToFile(keyObject,serverInfo['KEYDIR']+"/keystore");
  return "0x" + keyObject.address
}
exports.createEthAddress = createEthAddress
var sendEth = (target, address, balance, p_Key, ethPass) => {
  logger.info("start sendRawTransacstion")
  const privateKey = new Buffer(p_Key, 'hex')
  //amount - (gasPrice * 21000) 전부 보내기
  const txData = {
    gasLimit: web3.toHex(21000),
    gasPrice: web3.toHex(6e9), // 10 Gwei
    to: target,
    from: address,
    value: web3.toHex(web3.toWei(balance * 1, 'ether') - (6e9 * 21000)) // Thanks @abel30567
  }
  var txCount = web3.eth.getTransactionCount(address)
  const newNonce = web3.toHex(txCount)
  const transaction = new Tx({
    ...txData,
    nonce: newNonce
  }, {
    chain: 'mainnet'
  }) // or 'rinkeby'
  transaction.sign(privateKey)
  const serializedTx = transaction.serialize().toString('hex')
  return web3.eth.sendRawTransaction('0x' + serializedTx)

}
exports.sendEth = sendEth
async function getBalancefromAllAddress(addressList) {
  var accountUrlStr = ""
  var accountUrlStrs = []
  var count = 0
  var addresies = []
  for (var i = 0; i < addressList.length; i++) {
    addresies.push(addressList[i].ETH_ADDRESS)
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
      count++
      if (web3.fromWei(r[i].balance, 'ether') > 0.5) {
        var Param = {}
        Param['D_ADDR'] = r[i].account
        Param['AMOUNT'] = web3.fromWei(r[i].balance, 'ether')
        await sqlHelper.callProcedure('SP_ETH_AMOUNT_UPDATE', Param);
      }
    }
  }
}
exports.getBalancefromAllAddress = getBalancefromAllAddress;
var createAltCoin = async function(pwd) {
  return await web3.personal.newAccount(pwd, function(data, err) {
    console.log(data);
    console.log(err);
  });
}
var sendETHAmount = async (target, address, balance, ethPass, token,fee) => {
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
  var gasVal = "70"
  var gasUrl = "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=K2FEEGIVRR9JT4RRQSI664JQMHKJJCXQ94"
  var r = await commonLib.getJSON(gasUrl, apiOptions, false)
  if (r.status == "1") {
    if((r.result.ProposeGasPrice*1)>50){
      gasVal = r.result.ProposeGasPrice
    }
  }
  var gasPrice = web3.toWei(gasVal, 'gwei')
  console.log(balance);
  console.log(address);
  console.log(target);
  console.log(web3.toWei(balance * 1, 'ether') - (gasPrice * 21000));
  console.log(gasPrice);
  const txData = {
    gasLimit: web3.toHex(21000),
    gasPrice: web3.toHex(gasPrice), // 10 Gwei
    to: target,
    from: address,
    value: (fee)?web3.toHex(web3.toWei(balance * 1, 'ether') - (gasPrice * 21000)):web3.toHex(web3.toWei(balance * 1, 'ether')) // Thanks @abel30567
  }
  console.log(txData);
  var txCount = web3.eth.getTransactionCount(address)
  const newNonce = web3.toHex(txCount)
  const transaction = new Tx({
    ...txData,
    nonce: newNonce
    
  }, {
    chain: 'mainnet'
  }) // or 'rinkeby'
  transaction.sign(privateKey)
  const serializedTx = transaction.serialize().toString('hex')
  return web3.eth.sendRawTransaction('0x' + serializedTx)
}

var sendEthereum = async (target, address, balance, ethPass, token, fee) => {
  logger.info("start sendRawTransacstion")
  var dataDir = serverInfo.KEYDIR
  var keyObject = keythereum.importFromFile(address, dataDir);
  const privateKey = new Buffer(keythereum.recover(ethPass, keyObject).toString('hex'), 'hex')
  var gasVal = "70"
  var gasUrl = "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=K2FEEGIVRR9JT4RRQSI664JQMHKJJCXQ94"
  var r = await commonLib.getJSON(gasUrl, apiOptions, false)
  if (r.status == "1") {
    if((r.result.ProposeGasPrice*1)>10){
      gasVal = r.result.ProposeGasPrice
    }
  }
  logger.info("reqGas => " + gasVal)
  var gasPrice = web3.toWei(gasVal, 'gwei')
  const txData = {
    gasLimit: (token) ? web3.toHex(21000 * 3) : web3.toHex(21000),
    gasPrice: web3.toHex(gasPrice), // 10 Gwei
    to: (token) ? contractAddress : target,
    from: address
  }
  if (token) {
    txData['data'] = contractInstance.transfer.getData(target, balance * 100000000);
  } else {
    txData['value'] = (fee) ? web3.toHex(web3.toWei(balance * 1, 'ether') - (gasPrice * 21000)) : web3js.toHex(web3js.toWei(balance * 1, 'ether'))
  }
  console.log(txData);
  const transactionCount = await web3.eth.getTransactionCount(address, 'pending');
  const newNonce = web3.toHex(transactionCount)
  const transaction = new Tx({
    ...txData,
    nonce: newNonce
  }, {
    chain: 'mainnet'
  }) // or 'rinkeby'
  transaction.sign(privateKey)
  const serializedTx = transaction.serialize().toString('hex')
  return web3.eth.sendRawTransaction('0x' + serializedTx)
}

var createETHCoin = async function(pwd) {
  return await web3_ETH.personal.newAccount(pwd);
}
exports.getBTCAmount = async (target) => {
  var client
  client = new Client(serverInfo.ADMIN_BTC);
  var rpcData = await client.getBalance(target);
  return rpcData
}
exports.sendBTCAmount = async (reqAmount, target) => {
  var client

  client = new Client(serverInfo.ADMIN_BTC);
  var rpcData = await client.getBalance("*");
  if (rpcData < reqAmount) {
    logger.info('notEnought Balance');
    console.log("1");
    return null
  }

  rpcData = await client.validateAddress(target);
  if (!rpcData.isvalid) {
    logger.info('invalid address');
    console.log("2");
    return null
  }
  rpcData = await client.sendToAddress(target, reqAmount * 1);
  console.log("3");
  return rpcData
}
exports.isBTCAddr = async (addr) => {
  var client
  var rpcData;
  client = new Client(serverInfo.ADMIN_BTC);
  rpcData = await client.validateAddress(addr);
  return (rpcData.isvalid) ? "1" : "0"
}
var getETHcoinSMC = {
  getBalance: async function(address) {
    web3.eth.defaultAccount = address;
    var result = web3.eth.getBalance(address);
    return JSON.parse(result);
  },
  isAddress: function(address) {
    return web3.isAddress(address);
  },
  ERTransfer: async function(address, pass, target, balance) {
    var returnCodes = [];
    var result = "";
    var transactionObject = {
      from: address,
      to: target,
      value: web3.toWei(balance * 1, 'ether')
    };
    try {
      result = await web3.personal.unlockAccount(address, pass);
      returnCodes["returnCode"] = (result) ? 0 : 1;
      logger.info(returnCodes["returnCode"] + "=====  0");
    } catch (err) {
      logger.info(err + " unlockAccount Failed...")
      return returnCodes;
    }
    if (returnCodes["returnCode"] == 0) {
      try {
        var txid = web3.eth.sendTransaction(transactionObject);
        returnCodes["D_TXID"] = txid;
      } catch (err) {
        logger.info(err + " transfer Failed...")
        returnCodes["D_TXID"] = 0;
      }
    }
    return returnCodes;

  },
  transfer: async function(address, pass, target, balance, type) {
    var returnCodes = [];
    var result = "";
    var transactionObject = {
      from: address,
      to: target,
      value: web3.toWei(balance * 1, 'ether')
    };
    try {
      web3.eth.defaultAccount = address;
      result = await web3.personal.unlockAccount(address, pass);
      returnCodes["returnCode"] = (result) ? 0 : 1;
      logger.info(returnCodes["returnCode"] + "=====  0");
    } catch (err) {
      logger.info(err + " unlockAccount Failed...")
      return returnCodes;
    }
    if (returnCodes["returnCode"] == 0) {
      try {
        var txid = web3.eth.sendTransaction(transactionObject);
        returnCodes["D_TXID"] = txid;
      } catch (err) {
        logger.info(err + " transfer Failed...")
        returnCodes["D_TXID"] = 0;
      }
    }
    return returnCodes;
  }
}
var getAltcoinMDB = {
  getBalance: async function(address) {
    web3.eth.defaultAccount = address;
    var result = await contractInstace.balanceOf(address);
    logger.info(result);
    return result.toString();
  },
  transfer: async function(address, pass, target, balance, type) {
    var contract = web3.eth.contract(contractJsons[type]);
    var contractInstace = contract.at(contranctAddrs[type]);
    web3.eth.defaultAccount = address;
    var returnCodes = [];
    var result = "";
    try {
      result = await web3.personal.unlockAccount(address, pass);
      returnCodes["returnCode"] = (result) ? 0 : 1;
      logger.info(returnCodes["returnCode"] + "=====  0");
    } catch (err) {
      logger.info(err + " unlockAccount Failed...");
    }
    if (returnCodes["returnCode"] == 0) {
      try {
        logger.info("BALANCE : " + balance);
        if (balance == null) {
          returnCodes["ERROR"] = "Please enter the correct value";
          return returnCodes;
        }
        var txid = await contractInstace.transfer(target, balance);
        returnCodes["D_TXID"] = txid;
        returnCodes["D_FEE"] = 0;
      } catch (err) {
        logger.info(err + " transfer Failed...")
        returnCodes["ERROR"] = err + "transfer Failed...";
      }
    }
    return returnCodes;
  }
}
exports.createAltCoin = createAltCoin;
exports.getAltcoinMDB = getAltcoinMDB;
exports.createETHCoin = createETHCoin;
exports.getETHcoinSMC = getETHcoinSMC;

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
    } else if (clientName == 'MDB') {
      client = new bitcoin.Client(serverInfo.MDB);
    } else if (clientName == 'ALT') {
      client = new bitcoin.Client(serverInfo.ALT);
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
async function getETHAmount(address, token) {
  var result = await web3.eth.getBalance(address)
  // var result = (token) ? await contractInstace.methods.balanceOf(address).call() : await web3.eth.getBalance(address)
  return result.toString();
}
var getETHTranscation = (txid) => {
  return web3.eth.getTransaction(txid)
}
exports.getETHTranscation = getETHTranscation
exports.sendEthereum = sendEthereum
exports.getETHAmount = getETHAmount
exports.sendETHAmount = sendETHAmount
