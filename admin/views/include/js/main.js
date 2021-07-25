var sdata;
var division
var addCount = 0;

$(document).ready(function() {
  //init();
});

function init() {
  $(".btn-address").click(function() {
    $(".pop-bg").fadeIn(300, function() {
      $(".pop-box").animate({
        "bottom": "0"
      }, 500);
    });
  });

  $(".pop-box .pop-close").click(function() {
    $("#pop_cont").empty()
    $(".pop-bg").fadeOut(300, function() {
      $(".pop-box").animate({
        "bottom": "-100%"
      }, 500);
    });
  });
  initializeFnD();
}

function popClick(val) {
  var html = '';
  html += '<ul>';
  html += '<li><a href="/record?division=' + val + '">' + LANG['REVIE28'][NUM] + '</a></li>';
  html += '<li><a href="/withdrawal?division=' + val + '">' + LANG['WALLET_LANG10'][NUM] + '</a></li>';
  html += '<li><a href="/deposit?division=' + val + '">' + LANG['WALLET_LANG11'][NUM] + '</a></li>';
  html += '</ul>';
  $("#pop_cont").append(html)
  $(".pop-bg").fadeIn(500, function() {
    $(".pop-box").animate({
      "bottom": "0"
    }, 500);
  });
}

function withdrawalAddress() {
  var Params = {}
  Params['D_MEMO'] = "%%"
  commonLib.doAjax('/setting/getAddEthAddr', Params, true, true, function(err, data) {
    if (err) {
      return;
    }
    var result = data.ADDRESS.recordset;
    var division = commonLib.getParameterByName('division');
    var addrType = (division == "ETH") ? 'ETHEREUM' : (division == "ALT") ? 'REVIVECOIN' : 'REVIVECASH'
    var innerHtml = "";
    for (var i = 0; i < result.length; i++) {
      if (result[i].C_TYPE != addrType) continue;
      innerHtml += '<li onclick="addrSetter(\'' + result[i].ADDR + '\')"><a class="row"><span>' + result[i].MEMO + '</span><span>' + result[i].ADDR + '</span></a></li>';
    }
    $("#addressList").html(innerHtml);
  });
}

function addrSetter(val) {
  $("#address").val(val)
  $(".pop-bg").fadeOut(300, function() {
    $(".pop-box").animate({
      "bottom": "-100%"
    }, 500);
  });
}

function moveWallet(val) {
  try {
    division = commonLib.getParameterByName('division');
  } catch (e) {
    division = "ALT"
  }
  commonLib.moveBarba(val + "?division=" + division);
}

function withdrawInit() {

  commonLib.doAjax('withdrawal/getWalletInfo', null, true, true, function(err, data) {
    try {
      division = commonLib.getParameterByName('division');
    } catch (e) {
      division = "ALT"
    }
    if (division == "ETH") {
      $("#wTop").text("ETH " + LANG['WALLET_LANG10'][NUM]);
      $("#wAddress").text(data.ETHADDR);
      $("#wValue").text(commonLib.fromWei(data.ETHAMOUNT));
    } else {
      $("#wTop").text("REVIVE " + LANG['WALLET_LANG10'][NUM]);
      $("#wAddress").text((data.ALTADDR == null) ? '' : data.ALTADDR);
      $("#wValue").text((data.ALTAMOUNT == null) ? '' : data.ALTAMOUNT);
    }
    withdrawalAddress();
  })

}

function initializeFnD() {
  //getMainInfo();
}
$("#addList").click(function() {
  addCount += 30;
  //getMainInfo();
});

function ethWithdraw() {
  var params = {};
  if (($("#ETH_AMOUNT").val() * 1) > ($('#useVal').val() * 1)) {
    alert('출금 가능금액을 확인해 주세요');
    return;
  }
  params['TARGET'] = commonLib.RSAEncrypt($("#address").val());
  params['BALANCE'] = commonLib.RSAEncrypt($("#ETH_AMOUNT").val());
  params['DIVSION'] = division;
  commonLib.doAjax('withdrawal/altWithdraw', params, true, true, function(err, data) {
    alert(data.message);
    if (data.returnValue == 0) commonLib.movePage('/main');
  });
}

function getTxbyHash() {
  var Params = {};
  var myAddr = commonLib.getParameterByName('myaddr');
  Params['txid'] = commonLib.getParameterByName('txid');
  commonLib.doAjax('record/getTxbyHash', Params, true, true, function(err, data) {});
}

function listPop(val) {
  // var Params={};
  // Params['DIVISION']=val
  // commonLib.doAjax('setDivision', Params, true, true, function(err, data) {
  // });
  var innerHtml = '';
  innerHtml += '<li><a onclick="commonLib.moveBarba(\'/record?division=' + val + '\')">' + LANG['REVIE28'][NUM] + '</a></li>';
  innerHtml += '<li><a onclick="commonLib.moveBarba(\'/withdrawal?division=' + val + '\')">' + LANG['WALLET_LANG10'][NUM] + '</a></li>';
  innerHtml += '<li><a onclick="commonLib.moveBarba(\'/deposit?division=' + val + '\')">' + LANG['WALLET_LANG11'][NUM] + '</a></li>';
  $('#popUl').html(innerHtml);
}

function getMainInfo() {
  var formatAmount = 0;
  var usableAmount= 0;
  commonLib.doAjax('getMyInfo', null, true, true, function(err, data) {
    if (err) {
      return;
    }
    var useVal = 0;
    try {
      division = commonLib.getParameterByName('division')
    } catch (e) {}

    $("#division").text(division)
    $("#amount").append("<span data-id='" + division + "AMOUNT'></span> " + division)
    $("#recodeHead").append(division + " " + LANG['REVIE28'][NUM])
    formatAmount = (division == "ETH") ? data.data.ETHUSDAMOUNT : data.data.BWWUSDAMOUNT;
    usableAmount = (division == "ETH") ? data.data.ETHAMOUNT : data.data.BWWAMOUNT;
    if (division) {
      for (var i = 0; i < data.pendingData.length; i++) {
        console.log(data.pendingData[i].D_GUBUN);
        console.log(division);
        console.log(data.pendingData[i]);
        if (data.pendingData[i].D_GUBUN == division) useVal += data.pendingData[i].D_AMOUNT*1;
      }
    }
    commonLib.bindData(data.data);
    console.log(useVal);
    $("#useVal").val(usableAmount - useVal)
    sdata = data.data;
    $("#coinToPrice").text(formatAmount)

  });
}

function copyAddress(val) {
  var t = document.createElement("input");
  document.body.appendChild(t);
  //선택된 화면의 addr;;;ㅠㅠ
  t.value = $(val).text();
  t.select();
  document.execCommand('copy');
  document.body.removeChild(t);
  alert(LANG['WALLET_LANG5'][NUM])
}
String.prototype.splice = function(idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};
// function fromWei(value){
// 	if(value=="0"){
// 		value='0.000000'
// 	}else{
// 		var dec = 6-value.length;
// 		var v = value+'';
// 		for(var i = 0; i<= dec; i++){
// 			v = "0" + v;
// 		}
// 		value=v.splice(-6,0,'.');
// 	}
// 	var comma=value.split('.');
// 	comma[0]=comma[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// 	if(comma[0]=="")comma[0]='0';
// 	var ether=comma[0]+"."+comma[1];
// 	return ether;
// }
function changeInfo() {
  var Params = {};
  if ($("#USERNAME").val() == "") {
    commonLib.alertMsg(LANG['SIGNUP_VALID10'][NUM])
    return
  }
  if ($("#D_EMAIL").val() == "") {
    commonLib.alertMsg(LANG['RECOVER1'][NUM])
    return
  }
  if ($("#D_HP").val() == "") {
    commonLib.alertMsg(LANG['RECOVER13'][NUM])
    return
  }
  Params['D_NAME'] = $("#USERNAME").val();
  Params['D_EMAIL'] = commonLib.RSAEncrypt($("#D_EMAIL").val());
  Params['D_HP'] = commonLib.RSAEncrypt($("#D_HP").val());
  commonLib.doAjax('/setting/changeInfo', Params, true, true, function(err, data) {
    if (err) {
      return;
    }
    var returnValue = data.returnValue;
    if (returnValue == 0) {
      alert(LANG['WORK_COMPLETE'][NUM]);
      commonLib.moveBarba('myinfo');
    } else {
      alert(data.message)
    }
  });
}

function changePassword() {
  if (!$('#changePasswordForm').valid()) {
    return;
  }
  if ($("#D_NEWPASS").val() != $("#D_NEWPASS_CONFIRM").val()) {
    alert(LANG['PASS_CHANGE_POP_VALID4'][NUM])
    return;
  }
  var Params = {};
  // if (!commonLib.checkPasswordSecurity($("#D_NEWPASS").val())) {
  //   $(".modal in").show();
  //   alert(LANG['SIGNUP_VALID9'][NUM])
  //   return;
  // }
  Params['D_NEWPASS'] = commonLib.RSAEncrypt($("#D_NEWPASS").val());
  Params['D_OLDPASS'] = commonLib.RSAEncrypt($("#D_OLDPASS").val());
  commonLib.doAjax('/setting/changePassword', Params, true, true, function(err, data) {
    if (err) {
      return;
    }
    var returnValue = data.returnValue;
    if (returnValue == 0) {
      alert(LANG['WORK_COMPLETE'][NUM]);
      commonLib.movePage('main');
    } else {
      alert(data.message)
    }

  });
}

function setRanNum() {
  var result = {}
  var resultSet = new Set()
  while (true) {
    if (resultSet.size == 10) break;
    resultSet.add(Math.floor(Math.random() * 10));
  }
  var array = Array.from(resultSet)
  for (var i = 0; i < array.length; i++) {
    $("#num" + i).html(array[i]);
  }
}
var pass2 = new Array();

function gotoRecode(url) {
  //location.href = url + commonLib.getParameterByName('division')
  location.href = url + "BWW"
}

function numClick(selectNum) {
  $("#pass2_input").val($("#pass2_input").val() + $(selectNum).html())
  pass2.push($(selectNum).html())
  if (pass2.length == 6 || pass2.length == 12) {
    var securityNum = encodeURIComponent(commonLib.RSAEncrypt($("#pass2_input").val()));
    if ($("#secNum").val() != 0) {
      if ($("#secNum").val() != $("#pass2_input").val()) {
        alert("2차비밀번호가 일치하지않습니다.")
        pass2.splice(0, pass2.length)
        $("#pass2_input").val('');
      } else {
        //TODO do setSecurity and goto main
        var params = {};
        params['D_SECURITY'] = commonLib.RSAEncrypt($("#pass2_input").val());

        commonLib.doAjax('/setting/setSecure', params, true, true, function(err, data) {
          alert(data.message);
          if (data.returnValue == 0) {
            pass2.splice(0, pass2.length)
            commonLib.moveBarba('/main')
          } else {
            location.reload();
          }
        });
      }
    } else {
      commonLib.moveBarba('/pass2-set?secNum=' + securityNum);
    }


  }
}

function removeNum() {
  $("#pass2_input").val($("#pass2_input").val().slice(0, -1));
  pass2.pop()
}

function setMessage(address) {
  var Str_value = address;
  console.log(address);
  alert(address)
  $("#address").val(Str_value);
  $("#ETH_AMOUNT").focus();
}

function qrCodeScan() {
  window.SM.callQrReader()
}
