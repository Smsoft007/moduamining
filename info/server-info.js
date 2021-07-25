var serverInfo = {};

serverInfo['WALLET_NAME'] = 'ModuaBit Wallet';
serverInfo['CN_UPPER'] = 'Modua';
serverInfo['CN_PASCAL'] = 'Moduabit';
serverInfo['ALT_COIN_TITLE'] = 'Moduabit';
serverInfo['ALT_COIN_UNIT'] = 'MDb'
serverInfo['REDIS_ON'] = false;

serverInfo['REDIS'] = {
  address: 'localhost',
  port: 6379
}
serverInfo.initialize = function() {
  app = require('../app');
  serverInfo['ROOT_PATH'] = app.rootDir;
  serverInfo['MAIL_FORM_FILE_PATH'] = app.rootDir + '/views/';
}


serverInfo['ETH'] = {
  host: '138.197.161.211',
  port: 2332,
  user: 'moduabitrpc',
  pass: '6gXT3VSjfgFw8Cn6Ftkw79CdrPhjgLTiVuwmYdsgASJY',
  timeout: 3000
}

serverInfo['MDB'] = {
  host: '138.197.161.211',
  port: 2332,
  user: 'moduabitrpc',
  pass: '6gXT3VSjfgFw8Cn6Ftkw79CdrPhjgLTiVuwmYdsgASJY',
  timeout: 3000
}

serverInfo['BTC'] = {
  host: '138.197.161.211',
  port: 2332,
  user: 'moduabitrpc',
  pass: '6gXT3VSjfgFw8Cn6Ftkw79CdrPhjgLTiVuwmYdsgASJY',
  timeout: 3000
}

serverInfo['ALT'] = {
  host: '138.197.161.211',
  port: 2332,
  user: 'moduabitrpc',
  pass: '6gXT3VSjfgFw8Cn6Ftkw79CdrPhjgLTiVuwmYdsgASJY',
  timeout: 3000
}

serverInfo['LTC'] = {
  host: '138.197.161.211',
  port: 2332,
  user: 'moduabitrpc',
  pass: '6gXT3VSjfgFw8Cn6Ftkw79CdrPhjgLTiVuwmYdsgASJY',
  timeout: 3000
}

serverInfo['MSSQL'] = {
  user: 'WALLET_NEW_USER',
  password: 'WALLET_NEW_PW_0401',
  server: '113.35.179.31',
  port: '1433',
  database: 'WALLET_NEW'
};
// serverInfo['MSSQL'] = {
//   user: 'GOLD_NODE_USER',
//   password: 'GOLD_NODE_PW_0721',
//   server: '106.240.242.154',
//   port: '1433',
//   database: 'GOLDDUCK'
// };
var CoinType = require('../lib/coinHelper').CoinType;

serverInfo['COIN-INFO'] = [
  {name: 'ETH', type: CoinType.ETH},
  {name: 'MDB', type: CoinType.BIT},
  {name: 'LTC', type: CoinType.BIT},
  {name: 'ALT', type: CoinType.BIT},
  
  // {name: 'ETH', type: CoinType.ETH}
];


serverInfo['JSONRPC'] = {
  pendingTime: 1000 * 60 * 2
};
serverInfo['KEYDIR'] = 'D:/icknodejs'
// serverInfo['KEYDIR'] = appRoot
serverInfo['UPLOADIMAGEPATH'] = 'D:/goldduckCopy/views/images/products/'
serverInfo['ADMINADDR'] = '0xEfF4CbAfD4a1eD9BD7C9E91FE4fd51fA2389f8b3'
serverInfo['COIN_RATE'] = {
  BTC: "https://api.coinhills.com/v1/cspa/btc/",
  ETH: "https://api.coinhills.com/v1/cspa/eth/",
  MDB : 10.0
};

module.exports = serverInfo;
