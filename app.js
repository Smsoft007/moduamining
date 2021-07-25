'use strict';
process.env.TZ = 'Asia/Seoul'
const express = require('express');
const path = require('path');
global.appRoot = path.resolve(__dirname);
process.env.UV_THREADPOOL_SIZE = 128;
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const session = require('express-session');
const lang = require('./config/lang');
const asyncify = require('express-asyncify');
const app = asyncify(express());
const sql = require('./lib/mssql-helper');
const coinHelper = require('./lib/coinHelper');
// logger setup
const Logger = require('./lib/logger');
const logger = Logger('app');
const cryptico = require('cryptico');
const commonLib = require('./lib/commonLib.js');
const sessionStore = commonLib.getSessionStore();
const sqlHelper = require('./lib/mssql-helper');
const OPTIONS = commonLib._options;
const compression = require('compression');
const serveIndex = require('serve-index')
app.use(compression());
const history = require('connect-history-api-fallback')

//setting session
app.use(session({
  secret: OPTIONS['SESSION_SECRET'],
  resave: false,
  store: sessionStore,
  key: 'express.sid',
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60*24 //유효기간 15분
  },
  saveUninitialized: true
}));
exports.sessionStore = sessionStore;

exports.rootDir = __dirname.replace(/\\/gi, '/')
var serverInfo = require('./info/server-info');
exports.serverInfo = serverInfo;
// app.get('/favico.ico' , function(req , res){/*code*/});
// app.use(favicon(path.join(__dirname, 'views/plugins/images', 'simbol.png')))
//var io = require('socket.io-client')('http://localhost');
//setting socket.io
var io = require('socket.io')();
var socketIoCookieParser = require('socket.io-cookie-parser');
app.io = io;
exports.io = io;
io.use(socketIoCookieParser());
var signature = require("cookie-signature");
var prefix = "s:";

io.use(function(socket, next) {
  var sid = socket.request.cookies['express.sid'];
  if (commonLib.isNull(sid)) {
    return;
  }
  var sessionID = sid.replace(prefix, "");
  sessionID = signature.unsign(sessionID, OPTIONS['SESSION_SECRET']);
  logger.debug('socket:sessionID : ' + sessionID);
  sessionStore.get(sessionID, function(err, session) {
    if (err) {
      logger.error('get sessionData failed..');
    } else {
      if (session == undefined) {
        return;
      }

      if (session.userInfo == undefined) {
        session.userInfo = {};
      }
      session.userInfo['socket'] = socket.id;
      socket.sessionID = sessionID;
      socket.session = session;
      sessionStore.set(sessionID, session, function(err) {
        if (err) {
          logger.error('socket - ssessionStore set failed');
        }
      });
    }
    next();
  });
});

io.sockets.on('connection', function(client) {
  client.emit('connection', {
    message: 'connected'
  });
  client.on('disconnect', function(socket, data) {
    sessionStore.get(client.sessionID, function(err, session) {
      if (err) {
        logger.error('socket delete failed');
        return;
      }

      if (session == undefined) {
        return;
      }

      if (session.userInfo == undefined) {
        return;
      }
      session.userInfo['socket'] = undefined;
      sessionStore.set(client.sessionID, session, function(err) {
        if (err) {
          logger.error('ssessionStore set failed : ' + err);
        }
      });
    });
  });
});

var checkUrlFilter = function(req, res, next) {

  if (req.url.indexOf('.html') > -1) {
    res.end();
    return;
  }

  if (req.url.indexOf('.php') > -1) {
    res.end();
    return;
  }


  if (req.url == '/RequestDenied') {
    res.end();
  } else {
    if (req.url.indexOf('.') == -1) {
      logger.debug('URL : ' + req.url);
      
      //URL 체크하장...해? 흠.. 디버그하는 유알엘 만 ....
    }
    next();
  }

}


// basic lang setup
var setupBasicInfo = function(req, res, next) {

  //기본언어 : 영어(세션이 만료 OR 서버 재시작)
  if (req.session.num == undefined) {
    req.session.num = '0';
  }
  next();
}


// check rsakey
var checkRSAKey = function(req, res, next) {

  if (req.session.rsakey == undefined || req.session.publickey == undefined) {
    console.log('url : ' + req.url);

    logger.info('Create a key attempt : ' + req.sessionID);
    var PassPhrase = req.sessionID;
    var Bits = 512;
    var RSAKey = cryptico.generateRSAKey(PassPhrase, Bits);
    var publicKeyString = cryptico.publicKeyString(RSAKey);

    req.session.rsakey = JSON.stringify(RSAKey.toJSON())
    req.session.publickey = publicKeyString;
    logger.info('Create a key success - sessionId : ' + req.sessionID);
  }

  next();
}

//csrf setup
var csrf = require('csurf');
var csrfProtection = csrf({
  cookie: true
});
//
// // //hide express info
// app.disable('x-powered-by');
// var helmet = require('helmet');
// // //xss Filter
// app.use(helmet.xssFilter());
//
// //session setup
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(createApiRouter())
var router = new express.Router()
function createApiRouter() {
  var router = new express.Router()
  router.post('/apiTest', function(req, res) {
    res.send('no csrf to get here')
  })

  return router
}

app.use(checkUrlFilter);
app.use(checkRSAKey);
app.use(csrfProtection);
app.use(setupBasicInfo);


app.use('/config', express.static(__dirname + "/config"));
app.use('/.well-known/pki-validation/', express.static(__dirname + "/config"));
app.use('/less', express.static(__dirname + "/views/less/", {
  maxAge: 1 * 24 * 60 * 60 * 1000
}));
app.use('/app', express.static(__dirname + "/views/app/", {
  maxAge: 1 * 24 * 60 * 60 * 1000
}));
app.use('/css/', express.static(__dirname + "/views/css/", {
  maxAge: 1 * 24 * 60 * 60 * 1000
}));
app.use('/js/', express.static(__dirname + "/views/js/", {
  maxAge: 1 * 24 * 60 * 60 * 1000
}));
app.use('/views/', express.static(__dirname + "/views/", {
  maxAge: 1 * 24 * 60 * 60 * 1000
}));
app.use('/', express.static(__dirname + "/views/", {
  maxAge: 1 * 24 * 60 * 60 * 1000
}));
app.use('/fonts/', express.static(__dirname + "/views/fonts/", {
  maxAge: 1 * 24 * 60 * 60 * 1000
}));
app.use('/images/', express.static(__dirname + "/views/images/", {
  maxAge: 1 * 24 * 60 * 60 * 1000
}));
app.use('/styles/', express.static(__dirname + "/views/styles/", {
  maxAge: 1 * 24 * 60 * 60 * 1000
}));
app.use('/scripts/', express.static(__dirname + "/views/scripts/", {
  maxAge: 1 * 24 * 60 * 60 * 1000
}));
app.use('/bootstrap/', express.static(__dirname + "/views/bootstrap/", {
  maxAge: 1 * 24 * 60 * 60 * 1000
}));
// express.static(__dirname, 'views/plugins/images/simbol.png'), {
//   maxAge: 1 * 24 * 60 * 60 * 1000
// })
// app.use('/', express.static(__dirname + "/views/vendor/", {maxAge : 1 * 24 * 60 * 60 * 1000}));
// app.use('/', express.static("D:/client" + "/dist/assets", {maxAge : 1 * 24 * 60 * 60 * 1000}));
app.use('/plugins/', express.static(__dirname + "/views/plugins/", {
  maxAge: 1 * 24 * 60 * 60 * 1000
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// router setup
var commonApi = require('./routes/commonApi');
var list = require('./routes/list');
var api = require('./routes/btcApi');
var index = require('./routes/index');


app.use('/api', commonApi);
app.use('/api1', api);
app.use('/', index);
app.use('/list', list);


/*
  history 모드 설정방법
  console.log(path.join("C:/www_node/",'/Admin','dist'));
*/
// app.use(history())
// app.use(express.static(path.join("D:",'/client','dist')));
var render = express.response.render
express.response.render = async function(view, options, callback) {
  var options;
  var req = this.req;
  if (commonLib.isNull(options)) {
    options = {};
  }
  options['csrfToken'] = req.csrfToken();
  //if (options['D_COUNTRY'] == null) req.session['D_COUNTRY'] = await commonLib.getCountryCode(req)
  if (req.session.publickey == undefined) {
    options['publicKey'] = '';
  } else {
    options['publicKey'] = req.session.publickey;
  }

  var isApp = req.session.isApp;
  if (isApp) {
    options['IS_APP'] = true;
  } else {
    options['IS_APP'] = false;
  }


  options['LANG'] = lang;
  if (!req.session.num) {
    req.session.num = 0
  }

  options['NUM'] = req.session.num;
  
  if (req.session.userInfo == undefined) {
    options['LOGIN'] = false;
  } else {
    options['LOGIN'] = req.session.userInfo['LOGIN'];
    options['BTCADDR'] = req.session.userInfo['BTCADDR'];
    options['MDBADDR'] = req.session.userInfo['BDBADDR'];
    options['ETHADDR'] = req.session.userInfo['ETHADDR'];
    options['ETHADDRQR'] = req.session.userInfo['ETHADDRQR'];
    options['BTCADDRQR'] = req.session.userInfo['BTCADDRQR'];
    options['MDBADDR'] = req.session.userInfo['MDBADDR'];
    options['MDBADDRQR'] = req.session.userInfo['MDBADDRQR'];
    
    options['MDBADDRQRQR'] = req.session.userInfo['MOBADDRQR'];
    options['MY_INFO'] = req.session.userInfo['MY_INFO'];
  
  }
  //코인 구분 (ex: BTC, ETH, ALT)
  if (options['DIVISION'] == undefined) {
    options['DIVISION'] = '';
  }
  if (options['DIVISION'] == 'BTC')  {
    options['COIN_TITLE'] = 'Bitcoin';
  } else if (options['DIVISION'] == 'ETH') {
    options['COIN_TITLE'] = 'Ethereum';
  } else if (options['DIVISION'] == 'ALT') {
    options['COIN_TITLE'] = serverInfo['ALT_COIN_TITLE'];
  } else {
    options['COIN_TITLE'] = '';
  }
  render.call(this, view, options, callback);
};
process.on('uncaughtException', function(err) {
  console.log(" UNCAUGHT EXCEPTION ");
  console.log("[Inside 'uncaughtException' event] " + err.stack || err.message);
  logger.error(err);
});
sql.initialize();
serverInfo.initialize();
commonLib.initialize();
coinHelper.initialize();
module.exports = app;
