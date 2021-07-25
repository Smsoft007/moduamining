var Options={};
var flag=true;


function changeInfo(){
  var Params = {};
  if($("#USERNAME").val()==""){
    commonLib.alertMsg(LANG['SIGNUP_VALID10'][NUM])
    return
  }
  if($("#D_EMAIL").val()==""){
    commonLib.alertMsg(LANG['RECOVER1'][NUM])
    return
  }
  if($("#D_HP").val()==""){
    commonLib.alertMsg(LANG['RECOVER13'][NUM])
    return
  }
  return;
  Params['D_NAME'] = $("#USERNAME").val();
  Params['D_EMAIL'] = commonLib.RSAEncrypt($("#D_E43MAIL").val());
  Params['D_HP'] = commonLib.RSAEncrypt($("#D_HP").val());
  commonLib.doAjax('/setting/changeInfo', Params, true, true, function(err, data) {uuuuuuuuuuu
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
function secGetMainInfo(){
  commonLib.doAjax('getMyInfo', null, true, true, function(err, data) {
    if (err) {
      return;
    }

    $("#SEC_SMS").attr('checked',((Options['SEC_SMS']=data.data.SEC_SMS)=='Y')?true:false);
    $("#D_SECURE").attr('checked',((Options['D_SECURE']=data.data.D_SECURE)=='Y')?true:false);
    $("#D_PUSH").attr('checked',((Options['D_PUSH']=data.data.D_PUSH)=='Y')?true:false);
    $("#D_MARKETING").attr('checked',((Options['D_MARKETING']=data.data.D_MARKETING)=='Y')?true:false);
    $("#D_ALARM").attr('checked',((Options['D_ALARM']=data.data.D_ALARM)=='Y')?true:false);

    changeOptions();
  });
}
function changeOptions(){
  //console.log($('.hlc_switch').lcs_on());
  $('.hlc_switch').lc_switch();
  if(flag){
    $('body').delegate('.lcs_check', 'lcs-statuschange', function() {
      var status = ($(this).is(':checked')) ? 'Y' : 'N';
      Options[$(this).attr('id')]=status
      commonLib.doAjax('setting/update_option', Options, true, true, function(err, data) {
        if (err) {
          return;
        }
      });
    });
    flag=false;
  }

}
