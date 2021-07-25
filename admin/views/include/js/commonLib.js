
var _ERROR_ALERT_ON = false;
var broswerInfo = navigator.userAgent;

const commonLib={
  doAjax:(url,params,isAsync,showLoadingOn,callback)=>{
    _ERROR_ALERT_ON = false;
    if(isAsync==undefined)isAsync=true;
    const token= $("meta[name='_csrf']").attr("content");
    $.ajax({
      url:url,
      type:'POST',
      dataType:'json',
      data:params,
      async:isAsync,
      beforeSend:(xhr)=>{
        xhr.setRequestHeader('Csrf-Token',token);
        if (showLoadingOn) {
          commonLib.showLoadingBar();
          $('html').css('cursor', 'wait');
        }
      },
      error:(req,status,error)=>{
        console.error('request : '+JSON.stringify(req)+', status : '+JSON.stringift(status)+', error : '+JSON.stringify(error));
        callback('error',null);
      },complete:()=>{
        if (showLoadingOn) {
          $('html').css('cursor', 'auto');
          commonLib.hideLoadingBar();
        }
      },success:(data)=>{
        if(data.returnValue==100){
          alert(LANG['SESSION_EXIT2'][NUM]);
          location.href='/'
          return;
        }else{
          callback(null,data);
        }

      }
    });
  },hideLoadingBar: function() {
    $('.loding-bg').remove();
    $('.loding-box').remove();
  },
  RSAEncrypt:(value)=>{
    const publickey= $("meta[name='_publicKey']").attr("content");
    const encrypted=cryptico.encrypt(value,publickey);
    if(encrypted.status == 'success'){
      return encrypted.cipher;
    }else{
      console.error('Failed encryptyKey');
      return '';
    }
  },alertMsg:(message, callback)=>{
    //DAMDA.Alert(message)
    alert(message)
    if (typeof(callback) == 'function') {
      callback.apply();
    }
  },  showLoadingBar: function() {
    var loadingBgDivHtml = '<div class="loding-bg"></div>';
    var loadingBoxHtml = '<div class="loding-box">';
    loadingBoxHtml += '	<div class="loding-img-box">';
    loadingBoxHtml += '		<div class="sk-circle">';
    loadingBoxHtml += '			<div class="sk-circle1 sk-child"></div>';
    loadingBoxHtml += '			<div class="sk-circle2 sk-child"></div>';
    loadingBoxHtml += '			<div class="sk-circle3 sk-child"></div>';
    loadingBoxHtml += '			<div class="sk-circle4 sk-child"></div>';
    loadingBoxHtml += '			<div class="sk-circle5 sk-child"></div>';
    loadingBoxHtml += '			<div class="sk-circle6 sk-child"></div>';
    loadingBoxHtml += '			<div class="sk-circle7 sk-child"></div>';
    loadingBoxHtml += '			<div class="sk-circle8 sk-child"></div>';
    loadingBoxHtml += '			<div class="sk-circle9 sk-child"></div>';
    loadingBoxHtml += '			<div class="sk-circle10 sk-child"></div>';
    loadingBoxHtml += '			<div class="sk-circle11 sk-child"></div>';
    loadingBoxHtml += '			<div class="sk-circle12 sk-child"></div>';
    loadingBoxHtml += '		</div>';
    loadingBoxHtml += '		<h2>'+LANG['LOGIN_LANG10'][NUM]+'</h2>';
    //    loadingBoxHtml += '		<h6>'+LANG['LOGIN_LANG11'][NUM]+'</h6>';
    loadingBoxHtml += '	</div>';
    loadingBoxHtml += '</div>';

    $('body').append($(loadingBgDivHtml));
    $('body').append($(loadingBoxHtml));
  },  checkPasswordSecurity: function(value) {
    //8자 이상, 하나 이상의 숫자 및 대문자와 특수 문자
    var regExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/;

    if (!regExp.test(value)) {
      return false;
    } else {
      return true;
    }
  },
  isNull: function(value) {
    if (value===0){
      return false;
    }
    if (value == '' || value == undefined || value == null || value == false) {
      return true;
    } else {
      return false;
    }
  },bindData: function(objData) {
    var keys = Object.keys(objData);
    var dataId = '';
    for (var i = 0; i < keys.length; i++) {
      dataId = keys[i];
      var elements = $("[data-id='" + dataId + "']");
      if (elements.length == 0) {
        continue;
      }
      for (var j = 0; j < elements.length; j++) {
        var item = elements[j];
        tagName = item.tagName;
        value = objData[dataId];

        if (value == null) {
          value = '';
        }
        //&&DIVISION!='ETH'
        if (tagName == 'COIN') {
          value = parseFloat(value);
          if (isNaN(value)) {
            value = 0;
          }
          if(DIVISION=='ETH'){
            value=fromWei(objData.BALANCE+"");
          }else value = value.toFixed(8);
        }
        if (tagName == 'MONEY') {
          value = parseInt(value);
          value = value + '';
          value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        if (tagName == 'TEXT') {

        }
        item.innerHTML = value;
      }
    }
  },dates:{
    convert:function(d) {
      return (
        d.constructor === Date ? d :
        d.constructor === Array ? new Date(d[0],d[1],d[2]) :
        d.constructor === Number ? new Date(d) :
        d.constructor === String ? new Date(d) :
        typeof d === "object" ? new Date(d.year,d.month,d.date) :
        NaN
      );
    },
    compare:function(a,b) {
      return (
        isFinite(a=this.convert(a).valueOf()) &&
        isFinite(b=this.convert(b).valueOf()) ?
        (a>b)-(a<b) :
        NaN
      );
    },
    inRange:function(d,start,end) {
      return (
        isFinite(d=this.convert(d).valueOf()) &&
        isFinite(start=this.convert(start).valueOf()) &&
        isFinite(end=this.convert(end).valueOf()) ?
        start <= d && d <= end :
        NaN
      );
    }
  },movePage:function(urlString){
    var Token=$("meta[name='_csrf']").attr("content");
    var arrUrl = urlString.split('?');
    var url = arrUrl[0];
    console.log("url = "+url);
    var Params = {};
    if (arrUrl.length > 1) {
      var arrParams = arrUrl[1].split('&');
      var strItem = null;
      for (var i = 0; i < arrParams.length; i++) {
        strItem = arrParams[i].split('=');
        Params[strItem[0]] = strItem[1];
      }
    }

    var form = $('<form></form>');

    form.attr('action', url);
    form.attr('method', 'post');
    form.appendTo('body');

    var keys = Object.keys(Params);
    for (var i=0; i< keys.length; i++) {
      form.append($('<input type="hidden" ' + 'name="' + keys[i] + '"' + 'value="' + Params[keys[i]] + '">'));
    }
    form.append($('<input type="hidden" name="_csrf" value="' + Token + '">'));
    form.submit();
  },moveBarba:function(urlString){
    Barba.Pjax.goTo(urlString)
  },isApp: function() {
    if (broswerInfo.indexOf("Android") > -1) {
      return true;
    } else {
      return false;
    }
  },
  isAppClient: function() {
    if (broswerInfo.indexOf("Version") > -1) {
      return true;
    } else {
      return false;
    }iPhone
  },
  isClient: function() {
    if (broswerInfo.indexOf("Chrome")> -1) {
      return true;
    } else {
      return false;
    }
  },
  isiPhone: function() {
    if (broswerInfo.indexOf("iPhone")> -1||broswerInfo.indexOf("Mac")>-1) {
      return true;
    } else {
      return false;
    }
  },getParameterByName:function (name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    return results[2];
  },parseDate:function (date) {
    var result="";
    var formetDate=new Date(date);
    result=formetDate.getFullYear()+"."+(formetDate.getMonth()+1)+"."+formetDate.getDate();
    return result;
  },fromWei :function(value) {
    if(value=="0"){
      value='0.000000000000000000'
    }else{
      value=value+""
      var dec = 18-value.length;
      var v = value+'';

      for(var i = 0; i<= dec; i++){
        v = "0" + v;
      }
      value=v.splice(-18,0,'.');
    }
    var comma=value.split('.');
    comma[0]=comma[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if(comma[0]=="")comma[0]='0';
    var ether=comma[0]+"."+comma[1];
    return ether;
  }, comma:(x)=> {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
