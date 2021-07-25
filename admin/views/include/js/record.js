var addr;
var division;
$(document).ready(() => {
  //getMainInfo();
});

function getMainInfo() {
  var Param = {}
  division=commonLib.getParameterByName('division')
  Param['division'] = division
  commonLib.doAjax('getMyInfo', Param, true, true, function(err, data) {
    if (err) {
      return;
    }
    $("#division").text(division)
    $("#amount").append("<span data-id='"+division+"AMOUNT'></span> " + division)
    $("#recodeHead").append(division + " " + LANG['REVIE28'][NUM])
    var formatAmount = (division == "ETH") ? data.data.ETHUSDAMOUNT : data.data.BWWUSDAMOUNT;
    //data.data.ERC2AMOUNT = commonLib.comma(data.data.ERC2AMOUNT * 1);
    console.log(data.data.ERC20ADDR);
    commonLib.bindData(data.data);
    addr = data.data.ERC20ADDR
    //console.log(data.data.ERC20ADDR);

    makeList();
    $("#coinToPrice").text(formatAmount)
  });
}

function gotoRecode(url) {
  location.href = url + division
}

function makeList() {
  var Params = {};
  // Params['addCount'] = addCount;
  Params['DIVSION'] = division;
  commonLib.doAjax('withdrawal/getTransactionHistory', Params, true, true, function(err, data) {
    if (data.data == null) return;
    var txList = data.data.result
    var innerHtml = '';
    var dayofweek = [LANG['DAY7'][NUM], LANG['DAY1'][NUM], LANG['DAY2'][NUM], LANG['DAY3'][NUM], LANG['DAY4'][NUM], LANG['DAY5'][NUM], LANG['DAY6'][NUM]];
    if (data.pendingData) {
      for (var a = 0; a < data.pendingData.length; a++) {
        if(data.pendingData[a].D_GUBUN==division){
          innerHtml += '<li class="record-with">';
          innerHtml += '<a>';
          innerHtml += '<p>' + data.pendingData[a].MS_DATE + '<span>Pending..</span></p>';
          innerHtml += '<h4><span>- ' + commonLib.comma(data.pendingData[a].D_AMOUNT) + '</span> '+division+'</h4>';
          innerHtml += '<h6><span>' + data.pendingData[a].MS_TXID + '</span></h6>';
          innerHtml += '</a>';
          innerHtml += '</li>';
        }
      }
    }
    for (var i = 0; i < txList.length; i++) {
      var datecheck = new Date((txList[i].timeStamp * 1000));
      var withdrawal = (txList[i].from == addr);
      txList[i].value = Params['DIVSION'] == 'ETH' ? (txList[i].value * 0.000000000000000001) : commonLib.comma(txList[i].value)
      if (txList[i].input == 'deprecated' || txList[i].input == '0x') {
        if (withdrawal) {
          innerHtml += '<li class="record-with">';
        } else {
          innerHtml += '<li class="record-dep">';
        }
        // innerHtml += '<a>';req.query.idx
        innerHtml += '<a href="/record-cont?address=' +addr + '&type='+division+'&idx='+i+'">';
        innerHtml += '<p>' + datecheck + '<span>Completed</span></p>';
        if (withdrawal) innerHtml += '<h4><span>- ' + txList[i].value + '</span>' + Params['DIVSION'] + '</h4>';
        else innerHtml += '<h4><span>+ ' + txList[i].value + '</span>' + Params['DIVSION'] + '</h4>';
        innerHtml += '<h6><span>' + txList[i].hash + '</span></h6>';
        if (withdrawal)   innerHtml += '<h6><span>Receiver :' + txList[i].from + '</span></h6>';
        else   innerHtml += '<h6><span>Sender :' + txList[i].to + '</span></h6>';

        innerHtml += '</a>';
        innerHtml += '</li>';
      }
    }
    $('#transactionList').html(innerHtml)
  });
}
