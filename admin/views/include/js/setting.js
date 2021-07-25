var serch="%%"
$("#searchAddrList").click(function(){
  serch="%"+$("#sValue").val()+"%";
  //$("#addList").html(innerHtml);
  getAddressList(false);
});
function getAddressList(listReload){

  var Params={}
  try {
    Params['NO']=commonLib.getParameterByName('no')
  } catch (e) {

  }
  Params['D_MEMO']=serch
  commonLib.doAjax('/setting/getAddEthAddr', Params, true, true, function(err, data) {
    if (err) {
      return;
    }
    var result=data.ADDRESS.recordset;
    if(Params['NO']==undefined){
      var innerHtml="";
      for(var i=0;i<result.length;i++){
        innerHtml+="<li>"
        innerHtml+="<a onclick=\"commonLib.moveBarba('/add-cont?no="+result[i].ADDR_NO+"');\">"+result[i].MEMO+" <span>"+result[i].C_TYPE+"</span></a>"
        innerHtml+="</li>"
        if(listReload!=false)$("#defaultADDs").append("<option value="+result[i].MEMO+" label="+result[i].C_TYPE+">")
      }
      $("#addList").html(innerHtml);
    }else{
      commonLib.bindData(result[0])
    }
  });
}
function editAddr(){
  if($("#addr").val()==""||$("#memo").val()==""){

    alert(LANG['REVIE72'][NUM]);
    return
  }
  var Params={}
  Params['TYPE'] = $("#type").val();
  Params['ADDR']=$("#addr").val();
  Params['MEMO'] = $("#memo").val();
  try {
    Params['NO']=commonLib.getParameterByName("no")
  } catch (e) {
  }

  commonLib.doAjax('/setting/insertAddr', Params, true, true, function(err, data) {
    if (err) {
      return;
    }
    alert(data.message);
    if(data.returnValue==0){
      commonLib.moveBarba('/add-list');
    }

  });
}
function reqInquiry(){
  var Params={}
  if(!$("#inquiry-check").is(":checked")){
    alert(LANG['REVIE73'][NUM]);
  }
  Params['D_AGREE'] = "Y";
  Params['R_EMAIL']=$("#R_EMAIL").val();
  Params['Q_CONTENT'] = $("#Q_CONTENT").val();
  Params['Q_TYPE'] = $("#Q_TYPE").val();
  Params['FILE'] = " ";
  commonLib.doAjax('/setting/reqInquiry', Params, true, true, function(err, data) {
    if (err) {
      return;
    }
    alert(data.message);
    if(data.returnValue==0){
      commonLib.moveBarba('/main');
    }

  });
}
function getInfomations(GUBUN,VALNUM){
  var Params={};
  if(VALNUM!=undefined)Params["VALNUM"]=VALNUM;
  Params["GUBUN"]=GUBUN;
  commonLib.doAjax('setting/getInfomations', Params, true, true, function(err, data) {
    if (err) {
      return;
    }
    var innerHtml="";
    switch (GUBUN) {
      case "C":
      //commonLib.bindData(data.result[0]);
      break;
      case "I":
      case "U":
      $("#content").html(data.result[0].CONTENT)
      break;
      case "N":
      for(var i=0;i<data.result.length;i++){
        innerHtml+='<li>';
        innerHtml+='<a onclick="commonLib.moveBarba(\'/notice-cont?notiid='+data.result[i].N_NO+'\')"><span class="notice-day">'+commonLib.parseDate(data.result[i].N_DATE)+'</span>'+data.result[i].N_SUBJECT;
        innerHtml+='<span>'+data.result[i].N_CONTENT.substring(0,20)+'.....</span>';
        innerHtml+='</a>';
        innerHtml+='</li>'
      }
      $("#noticeList").html(innerHtml);
      break;
      case "Q":
      if(data.result.length==0){
        innerHtml+='<ul class="list-no">'
        innerHtml+='<li>'+LANG['REVIE75'][NUM]+'</li>'

      }else{
        innerHtml='<ul class="list-yes">';
        for(var i=0;i<data.result.length;i++){
          innerHtml+='<li>';
          innerHtml+='<a class="cta" onclick="commonLib.moveBarba(\'/inquiry-answer?inquid='+data.result[i].PK+'\')">';
          innerHtml+='<span>문의등록일 : '+commonLib.parseDate(data.result[i].Q_DATE)+'</span>';
          innerHtml+='<span>'+data.result[i].Q_CONTENT.substring(0,20)+'</span>';
          innerHtml+=(data.result[i].A_ANS==null)?'<span>답변이 아직 등록되지 않았습니다.</span>':'<span>'+data.result[i].A_ANS.substring(0,20)+'</span>';
          innerHtml+='</a>';
          innerHtml+='</li>'
        }
      }
      innerHtml+='</ul>'
      $("#inquiryList").html(innerHtml);
      break;
      case "ND":
      $("#content").html(data.result[0].CONTENT)
      break;
    }
  });
}
function checkInquiry(){

}
