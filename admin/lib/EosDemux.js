exports.initialize = function(startBlock, enpUrl) {

  const {
    BaseActionWatcher,
    AbstractActionHandler
  } = require("demux")
  const {
    NodeosActionReader
  } = require("demux-eos") // eslint-disable-line
  var Logger = require('../lib/logger');
  const procedureNamse = require('../lib/procedure-info').procedureNames
  var logger = Logger('lib/EOsAction');
  var sqlHelper = require('./mssql-helper')
  var coinHelper = require('./coinHelper')
  logger.info("start Block watching....")
  const actionReader = new NodeosActionReader({
    startAtBlock: startBlock,
    onlyIrreversible: false,
    nodeosEndpoint: enpUrl
  })
  let state = {
    volumeBySymbol: {},
    totalTransfers: 0,
    indexState: {
      blockNumber: 0,
      blockHash: "",
      isReplay: false,
      handlerVersionName: "v1",
    },
  }
  const stateHistory = {}
  const stateHistoryMaxLength = 300
  class ObjectActionHandler extends AbstractActionHandler {
    async handleWithState(handle) {
      await handle(state)
      const {
        blockNumber
      } = state.indexState
      stateHistory[blockNumber] = JSON.parse(JSON.stringify(state))
      if (blockNumber > stateHistoryMaxLength && stateHistory[blockNumber - stateHistoryMaxLength]) {
        delete stateHistory[blockNumber - stateHistoryMaxLength]
      }
    }
    async loadIndexState() {
      return state.indexState
    }
    async updateIndexState(stateObj, block, isReplay, handlerVersionName) {
      stateObj.indexState.blockNumber = block.blockInfo.blockNumber
      stateObj.indexState.blockHash = block.blockInfo.blockHash
      stateObj.indexState.isReplay = isReplay
      stateObj.indexState.handlerVersionName = handlerVersionName
    }
    async rollbackTo(blockNumber) {
      const latestBlockNumber = state.indexState.blockNumber
      const toDelete = [...Array(latestBlockNumber - (blockNumber)).keys()].map(n => n + blockNumber + 1)
      for (const n of toDelete) {
        delete stateHistory[n]
      }
      state = stateHistory[blockNumber]
    }
    async setup() {}
  }

  function parseTokenString(tokenString) {
    const [amountString, symbol] = tokenString.split(" ")
    const amount = parseFloat(amountString)
    return {
      amount,
      symbol
    }
  }

  function updateTransferData(state, payload, blockInfo, context) {
    const {
      amount,
      symbol
    } = parseTokenString(payload.data.quantity)
    if (!state.volumeBySymbol[symbol]) {
      state.volumeBySymbol[symbol] = amount
    } else {
      state.volumeBySymbol[symbol] += amount
    }
    state.totalTransfers += 1
    context.stateCopy = JSON.parse(JSON.stringify(state)) // Deep copy state to de-reference
  }

  const updaters = [{
    actionType: "eosio.token::transfer",
    apply: updateTransferData,
  }, ]

  async function logUpdate(payload, blockInfo, context) {
    // if(payload.data.to=='eosiopowcoin'){
    // }
    if (payload.data.to == 'eosblockteam') {
      logger.info("get CoinAmount!!!")
      logger.info(payload)
      var Params = {}
      //   { transactionId:
      //  'd28e7d3839526d16a20182260de8ea0d27f24d6dab467154b1c2e72fc0bb0842',
      // actionIndex: 14,
      // account: 'eosio.token',
      // name: 'transfer',
      // authorization: [ { actor: 'heytonjxhage', permission: 'active' } ],
      // data:
      //  { from: 'heytonjxhage',
      //    to: 'eosiopowcoin',
      //    quantity: '0.0001 EOS',
      //    memo: '' } }
      Params['D_TXID'] = payload.transactionId
      Params['GUBUN'] = 'EOS'
      Params['D_ADDRESS'] = payload.data.from
      Params['D_MEMO'] = payload.data.memo
      Params['D_QTY'] = payload.data.D_QTY
      Params['D_DATE'] = blockInfo.blockInfo.timestamp
      var result = await sqlHelper.callProcedure('SP_COIN_NOTY', Params);

    }
  }

  const effects = [{
    actionType: "eosio.token::transfer",
    run: logUpdate,
  }, ]
  const handlerVersion = {
    versionName: "v1",
    updaters,
    effects,
  }
  const actionWatcher = new BaseActionWatcher(
    actionReader,
    new ObjectActionHandler([handlerVersion]),
    250,
  )


  Object.defineProperty(actionWatcher, 'running', {
    set: function(y) {
      console.log(y);
      console.log("watchFaild");
    }
  });

  actionWatcher.watch()
}
