var serverInfo = {};
serverInfo['WALLET_NAME'] = 'Tagie Wallet';
serverInfo['CN_UPPER'] = 'TAGIE';
serverInfo['CN_PASCAL'] = 'Tagie';
serverInfo['ALT_COIN_TITLE'] = 'Tagiecoin';
serverInfo['ALT_COIN_UNIT'] = 'TIC'
serverInfo['REDIS_ON'] = false;

serverInfo['REDIS'] = {
  address: 'localhost',
  port: 6379
}
serverInfo.initialize = function() {
  app = require('../app');
  serverInfo['ROOT_PATH'] = app.rootPath;
  serverInfo['MAIL_FORM_FILE_PATH'] = app.rootPath + '/views/';
}
// serverInfo['BTC'] = {
//   host: 'localhost',
//   port: 8332,
//   user: 'bit_0427',
//   pass: 'bit_0427',
//   timeout: 15000
// }
serverInfo['NEC_BTC'] = {
  host: '138.68.50.214',
  port: 8332,
  username: 'USER',
  password: 'PASS',
  timeout: 15000
}
serverInfo['BTC'] = {
  host: '138.68.50.214',
  port: 8332,
  user: 'USER',
  pass: 'PASS',
  timeout: 15000
}
// serverInfo['ADMIN_BTC'] = {
//   host: '167.99.7.146',
//   port: 8332,
//   username: 'bit_wallet',
//   password: 'bit_0220wallet',
//   timeout: 30000
// }
//
// serverInfo['MSSQL'] = {
//   user: 'GOLDENEGG_ADMIN_USER',
//   password: 'GOLDENEGG_ADMIN_PW_0805',
//   server: '106.240.242.154',
//   port: '1433',
//   database: 'GOLDDUCK'
// };
serverInfo['MSSQL'] = {
  user: 'ICK_ADMIN_USER',
  password: 'ICK_ADMIN_PW_1028',
  server: 'localhost',
  port: '1430',
  database: 'ICK_WALLET'
};
var CoinType = require('../lib/coinHelper').CoinType;

serverInfo['COIN-INFO'] = [
  //{name: 'ALT', type: CoinType.BIT}
  // {name: 'USDTB', type: CoinType.BIT},
  // {name: 'USDTE', type: CoinType.ETH},
];

serverInfo['JSONRPC'] = {
  pendingTime: 1000 * 60 * 2
};

serverInfo['UPLOADIMAGEPATH']='/home/jeak/server/views/img/receipt/'
serverInfo['MAILPATH']='/home/jeak/server/views/'
serverInfo['KEYDIR']='/home/jeak/server'
serverInfo['CLIENTDIR']='/home/jeak/bitlamp'
serverInfo['ADMINADDR']='0xEEA05b83765808430153AD3eA6B46032Af5742f8'
serverInfo['OUTADDR']='0xc60044aA25c6f23fd6fA687Cd1370Bc816FCc264'
serverInfo['OUTPWD']='2K$*ixMYX6zI'
// serverInfo['UPLOADIMAGEPATH'] = 'D:/BitLamp/devServer/views/img/receipt/'
// serverInfo['MAILPATH'] = 'D:/BitLamp/devServer/views/'
// serverInfo['KEYDIR'] = 'D:/BitLamp/devServer'
// serverInfo['CLIENTDIR'] = 'D:/BitLamp/devClient/client'
// serverInfo['ADMINADDR'] = '0xfdE8751138821a0f6eb040E4BEc7DD05265f9C19'
// serverInfo['OUTADDR'] = '0xc60044aA25c6f23fd6fA687Cd1370Bc816FCc264'
// serverInfo['OUTPWD'] = '2K$*ixMYX6zI'

// serverInfo['adminAddr']='/home/jeak/server/views/img/receipt/'
// serverInfo['COIN_RATE'] = {
//   BIZ:"https://api.coinhills.com/v1/cspa/biz/",
//   ETH:"https://api.coinmarketcap.com/v1/ticker/ethereum/"
// };
serverInfo['COIN_RATE'] = {
  BTC: "https://api.coinhills.com/v1/cspa/btc/",
  ETH: "https://api.coinhills.com/v1/cspa/eth/"
};
module.exports = serverInfo;
