class DATATag extends HTMLElement {
  constructor() {
    super();
    // console.log(this);
    // this.innerHTML="test"
  }
  static get observedAttributes() {
    // 모니터링 할 속성 이름
    return ['data-tag'];
  }
  connectedCallback() {
    this.id = this.getAttribute('id')
  }
  disconnectedCallback() {}
  attributeChangedCallback(attrName, oldVal, newVal) {
    this[attrName] = newVal;
  }
  adoptedCallback(oldDoc, newDoc) {}
}
customElements.define('data-tag', DATATag);
String.prototype.string = function(len) {
  var s = '',
    i = 0;
  while (i++ < len) {
    s += this;
  }
  return s;
};
String.prototype.zf = function(len) {
  return "0".string(len - this.length) + this;
};
Number.prototype.zf = function(len) {
  return this.toString().zf(len);
};

const commonLib = {
  jsInit: (url, callback) => {
    $.getScript(url, (data, textStatus, jqxhr) => {
      if (callback != null) callback()
    })
  },
  doPost: async (url, param, showLoading, callBack) => {
    const token = $("meta[name='_csrf']").attr("content");
    showLoading = (showLoading == null) ? true : false;
    if (showLoading) commonLib.showLoadingBar()
    var returnData = await axios({
      method: 'POST',
      url: url,
      data: param,
      headers: {
        'Csrf-Token': token
      },
      transformResponse: [data => {
        return data;
      }],
      error: (req, status, error) => {
        console.log("ERROR");
      }
    })
    if (showLoading) commonLib.hideLoadingBar()
    if (JSON.parse(returnData.data).error) {
      alert("Your session has expired. Please log in again.");
      location.href = '/'
      return
    }
    if (JSON.parse(returnData.data).success == false) {
      alert("system error")
      location.href = '/'
      return null
    } else {
      return JSON.parse(returnData.data)
    }

  },
  copyText(val) {
    var tempElem = document.createElement('textarea');
    tempElem.value = val;
    console.log(val);
    document.body.appendChild(tempElem);
    tempElem.select();
    document.execCommand("copy");
    document.body.removeChild(tempElem);
    alert("Copied")
  },
  copyTextInModal(val) {
    var dummyLink = val
    var dummy = $('<input>').val(dummyLink).appendTo('body').select();
    dummy.focus();
    document.execCommand('copy');
    alert("Copied")
  },
  getEthList:async(contract,addr)=>{
    var returnValue = {};
    var decimal = 18;
    var url = (contract) ? "https://api.etherscan.io/api?module=account&action=tokentx&contractaddress="+contract+"&address="+addr+"&page=1&offset=100&sort=desc&apikey=K2FEEGIVRR9JT4RRQSI664JQMHKJJCXQ94" : "https://api.etherscan.io/api?module=account&action=txlist&address="+addr+"&startblock=0&endblock=99999999&sort=desc&apikey=K2FEEGIVRR9JT4RRQSI664JQMHKJJCXQ94"
    var returnData = await axios({
      method: 'GET',
      url: url,
      error: (req, status, error) => {
        console.log("APIERROR");
      }
    })
    return returnData.data.result;
  },
  getCoinAmount: async (contract, addr) => {
    var returnValue = {};
    var decimal = 18;
    var url = (contract) ? "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" + contract + "&address=" + addr + "&tag=latest&apikey=K2FEEGIVRR9JT4RRQSI664JQMHKJJCXQ94" : "https://api.etherscan.io/api?module=account&action=balance&address=" + addr + "&tag=latest&apikey=K2FEEGIVRR9JT4RRQSI664JQMHKJJCXQ94"
    var returnData = await axios({
      method: 'GET',
      url: url,
      error: (req, status, error) => {
        console.log("APIERROR");
      }
    })
    if (returnData.data.message == "OK") {
      if (contract) {
        //   var TokenInfo = await axios({
        //     method: 'GET',
        //     url: "https://api.etherscan.io/api?module=token&action=tokeninfo&contractaddress=" + contract + "&apikey=K2FEEGIVRR9JT4RRQSI664JQMHKJJCXQ94",
        //     error: (req, status, error) => {
        //       console.log("APIERROR");
        //     }
        //   })
        //   if (TokenInfo.data.message == "OK") {
        //     decimal=(TokenInfo.result[0].divisor*1)
        //     console.log(TokenInfo);
        //   } else {
        //     console.log("get tokeninfo error!!!!");
        //   }
        decimal = 8
        returnValue['AMOUNT'] = (returnData.data.result / Math.pow(10, decimal)) + ""
        returnValue['RATE'] = 100
      } else {
        var CoinPrice = await axios({
          method: 'GET',
          url: "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=K2FEEGIVRR9JT4RRQSI664JQMHKJJCXQ94",
          error: (req, status, error) => {
            console.log("APIERROR");
          }
        })
        returnValue['AMOUNT'] = (returnData.data.result / Math.pow(10, decimal)) + ""
        returnValue['RATE'] = CoinPrice.data.result.ethusd + ""
        returnValue['AMOUNT'] = returnValue['AMOUNT'].substr(0, returnValue['AMOUNT'].indexOf('.') + 7)
      }
    }
    return returnValue
  },
  showLoadingBar: function() {
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
    loadingBoxHtml += '		<h2>Data is being processed It will take 5-10 seconds.</h2>';
    loadingBoxHtml += '	</div>';
    loadingBoxHtml += '</div>';
    $('body').append($(loadingBgDivHtml));
    $('body').append($(loadingBoxHtml));
  },
  hideLoadingBar: function() {
    $('.loding-bg').remove();
    $('.loding-box').remove();
  },
  RSAEncrypt: (value) => {
    const publickey = $("meta[name='_publicKey']").attr("content");
    const encrypted = cryptico.encrypt(value, publickey);
    if (encrypted.status == 'success') {
      return encrypted.cipher;
    } else {
      console.error('Failed encryptyKey');
      return '';
    }
  },
  bindData: (obj, data) => {
    var names = Object.keys(data)
    for (var name in names) {
      var key = names[name]
      if (obj[key] != undefined) {
        obj[key] = data[key]
      }
    }
  },
  convertMS: (milliseconds) => {
    var hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    return {
      hour: (hour < 10) ? '0' + hour : hour,
      minute: (minute < 10) ? '0' + minute : minute,
      seconds: (seconds < 10) ? '0' + seconds : seconds
    };
  },
  formatCate: (A, B, val) => {
    var arrays = {}
    var topArray = []
    var midArray = []
    var botArray = []
    var adminFormArray = []
    var returnData = {}
    for (var i = 0; i < val.length; i++) {
      if (val[i][A] == B) {
        topArray.push(val[i])
      }
    }
    arrays['TOP'] = topArray
    for (var i = 0; i < val.length; i++) {
      for (var a = 0; a < topArray.length; a++) {
        if (val[i].P_UPCODE == topArray[a].CATE_CODE) {
          midArray.push({
            code: topArray[a].CATE_CODE + val[i].CATE_CODE,
            val: val[i]
          })
        }
      }
    }
    arrays['MID'] = midArray
    for (var i = 0; i < val.length; i++) {
      for (var a = 0; a < midArray.length; a++) {
        if (val[i].P_UPCODE == midArray[a].code) {
          botArray.push({
            code: midArray[a].code + val[i].CATE_CODE,
            val: val[i]
          })
        }
      }
    }
    arrays['BOT'] = botArray
    for (var i = 0; i < arrays['TOP'].length; i++) {
      var adminData = {}
      adminData['name'] = arrays['TOP'][i].CATE_NAME
      adminData['id'] = i
      adminData['pid'] = 0
      adminData['code'] = arrays['TOP'][i].CATE_CODE
      for (var a = 0; a < arrays['MID'].length; a++) {
        if (arrays['MID'][a].val.P_UPCODE == arrays['TOP'][i].CATE_CODE) {
          if (adminData['children'] == null) adminData['children'] = []
          var childData = {}
          childData['name'] = arrays['MID'][a].val.CATE_NAME
          childData['id'] = a
          childData['pid'] = 1
          childData['isLeaf'] = true
          childData['code'] = arrays['MID'][a].val.CATE_CODE
          adminData['children'].push(childData)
        }
      }
      adminFormArray.push(adminData)
    }
    returnData['CATEM'] = adminFormArray
    returnData['CATE'] = arrays
    return returnData
  },
  EncSerializeObjectFromObj: (obj) => {
    try {
      var restulobj = {}
      Object.keys(obj).map(function(key) {
        restulobj[key] = (key.indexOf("UN_E") == -1) ?
          commonLib.RSAEncrypt(obj[key]) : obj[key]
      })
    } catch (e) {
      console.log(e.message);
    }
    return restulobj;
  },
  dataError: (data) => {
    if (data.resultValue != 0) {
      alert("system error!");
      location.href = "/"
      return;
    }
  },
  nullCheck() {
    var keys = Object.keys(arguments[0])
    for (var key in keys) {
      if (arguments[0][keys[key]] == null || arguments[0][keys[key]] == "" || arguments[0][keys[key]] == undefined || arguments[0][keys[key]] == 0 || arguments[0][keys[key]] == "0") {
        console.log(keys[key] + " is null");
        return true;
      }
    }
    return false
  },
  inserProdNullCheck() {
    var keys = Object.keys(arguments[0])
    for (var key in keys) {
      if (arguments[0][keys[key]] == null || arguments[0][keys[key]] == "" || arguments[0][keys[key]] == undefined) {
        console.log(keys[key] + " is null");
        return true;
      }
    }
    return false
  },
  getBrowserInfo: function() {
    var ua = this.windows.navigator.userAgent;
    var browerName = '';
    if (ua.indexOf('MSIE') > 0 || ua.indexOf('Trident') > 0)
      browerName = "Internet Explorer";
    else if (ua.indexOf('Opera') > 0 || ua.indexOf('OPR') > 0)
      browerName = "Opera";
    else if (ua.indexOf('Firefox') > 0)
      browerName = "Firefox";
    else if (ua.indexOf('Safari') > 0) {
      if (ua.indexOf('Chrome') > 0)
        browerName = "Chrome";
      else
        browerName = "Safari";
    }
    return browerName;
  },
  getParameter: function(param) {
    var returnValue;
    var url = location.href;
    var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');
    for (var i = 0; i < parameters.length; i++) {
      var varName = parameters[i].split('=')[0];
      if (varName.toUpperCase() == param.toUpperCase()) {
        returnValue = parameters[i].split('=')[1];
        return decodeURIComponent(returnValue);
      }
    }
  },
  getOSInfo: function() {
    var ua = navigator.userAgent;
    var strOs = '';
    if (ua.indexOf("NT 6.0") != -1) strOs = "Windows Vista/Server 2008";
    else if (ua.indexOf("NT 6.1") != -1) strOs = "Windows 7";
    else if (ua.indexOf("NT 5.2") != -1) strOs = "Windows Server 2003";
    else if (ua.indexOf("NT 5.1") != -1) strOs = "Windows XP";
    else if (ua.indexOf("NT 5.0") != -1) strOs = "Windows 2000";
    else if (ua.indexOf("NT") != -1) strOs = "Windows NT";
    else if (ua.indexOf("9x 4.90") != -1) strOs = "Windows Me";
    else if (ua.indexOf("98") != -1) strOs = "Windows 98";
    else if (ua.indexOf("95") != -1) strOs = "Windows 95";
    else if (ua.indexOf("Win16") != -1) strOs = "Windows 3.x";
    else if (ua.indexOf("Windows") != -1) strOs = "Windows";
    else if (ua.indexOf("Linux") != -1) strOs = "Linux";
    else if (ua.indexOf("Mac") != -1) strOs = "Mac OS";
    else if (ua.indexOf("Macintosh") != -1) strOs = "Macintosh";
    else if (ua.indexOf("iOS") != -1) strOs = "iphone Os";
    else if (ua.indexOf("iPhone") != -1) strOs = "iPhone";
    else if (ua.indexOf("iPad") != -1) strOs = "iPad";
    else strOs = "not defined";
    return strOs;
  },
  isApp: function() {
    var ua = navigator.userAgent;
    var strOs = '';
    if (ua.indexOf("iPhone") != -1) strOs = "iPhone";
    else if (ua.indexOf("Android") != -1) strOs = "Android";
    else if (ua.indexOf("Mac") != -1) strOs = "Mac";
    else if (ua.indexOf("Version") != -1) strOs = "NativApp";
    else if (ua.indexOf("Chrome") != -1) strOs = "Chrome";
    else strOs = "not defined";
    return strOs;
  },
  getCountry: function() {
    var country = navigator.language || navigator.browserLanguage;
    return country;
  },
  objValidate(obj) {
    var nullPram = false
    var keys = Object.keys(obj)
    for (var i = 0; i < keys.length; i++) {
      if (!obj[keys[i]]) {
        return keys[i]
      }
    }
    return nullPram
  },
  bindValue: (obj) => {
    var keys = Object.keys(obj)
    for (var i = 0; i < keys.length; i++) {
      try {
        if ($("#" + keys[i])[0] != undefined) {
          var tagName = $('#' + keys[i]).prop('tagName')
          if (tagName == "SPAN") {
            $("#" + keys[i]).html(obj[keys[i]])
          } else if (tagName == "INPUT" || tagName == "SELECT") {
            $("#" + keys[i]).val(obj[keys[i]])
          } else if (tagName == "DATA-TAG") {
            $("#" + keys[i]).text(obj[keys[i]])
          } else {
            $("#" + keys[i]).text(obj[keys[i]])
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  bindValueNameData: (obj) => {
    var keys = Object.keys(obj)
    for (var i = 0; i < keys.length; i++) {
      try {
        var tagName = document.getElementsByName(keys[i])[0]
        if (tagName != undefined) {
          tagName = tagName.tagName
          var grpl = $(tagName + "[name=" + keys[i] + "]").length;
          if (tagName == "SPAN") {
            for (var a = 0; a < grpl; a++) {
              $(tagName + "[name=" + keys[i] + "]").eq(a).html(obj[keys[i]])
            }
          } else if (tagName == "INPUT" || tagName == "SELECT") {
            for (var a = 0; a < grpl; a++) {
              $(tagName + "[name=" + keys[i] + "]").eq(a).val(obj[keys[i]])
            }
          } else if (tagName == "DATA-TAG") {
            for (var a = 0; a < grpl; a++) {
              $(tagName + "[name=" + keys[i] + "]").eq(a).text(obj[keys[i]])
            }
          } else {
            for (var a = 0; a < grpl; a++) {
              $(tagName + "[name=" + keys[i] + "]").eq(a).text(obj[keys[i]])
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  bindValueByName: (Name, obj) => {
    var keys = Object.keys(obj)
    for (var i = 0; i < keys.length; i++) {
      try {
        if ($(Name + "[name=" + keys[i] + "]") != undefined) {
          $(Name + "[name=" + keys[i] + "]").html(obj[keys[i]])
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  comma: (x) => {
    if (!commonLib.nullCheck(x)) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return 0
    }

  }
}
var reqApi = async (payload) => {
  var Params = {}
  if (payload.PARAM != null) {
    if (commonLib.objValidate(payload.PARAM)) {
      alert("값을 모두 입력해주세요")
      return
    }
    Params = commonLib.EncSerializeObjectFromObj(payload.PARAM)
  }
  var data = await commonLib.doPost("/api/" + payload.URL, Params, payload.LOADING, null)
  if (data.notLogined) {
    alert("세션이 만료되어 로그인 페이지로 이동합니다")
  } else {
    return data
  }
}
var menu = $('.menu');
var headerAndContent = $('.header, .page-content, #footer-bar');
var menuInit = () => {
  //Adding Menu Hider
  if (!$('.menu-hider').length) {
    $('#page').append('<div class="menu-hider"><div>');
  }
  //Defining Function Variables
  var menuHider = $('.menu-hider');
  var menuDeployer = $('[data-menu]');
  //Appling settings to each menu based on user preferences.
  menu.each(function() {
    var menuHeight = $(this).data('menu-height');
    var menuWidth = $(this).data('menu-width');
    var menuActive = $(this).data('menu-active');
    if ($(this).hasClass('menu-box-right')) {
      $(this).css("width", menuWidth);
    }
    if ($(this).hasClass('menu-box-left')) {
      $(this).css("width", menuWidth);
    }
    if ($(this).hasClass('menu-box-bottom')) {
      $(this).css("height", menuHeight);
    }
    if ($(this).hasClass('menu-box-top')) {
      $(this).css("height", menuHeight);
    }
    if ($(this).hasClass('menu-box-modal')) {
      $(this).css({
        "height": menuHeight,
        "width": menuWidth
      });
    }
  });

  $('.menu a').on('click', function() {
    $('body').removeClass('modal-open');
  })

  //Menu Deploy Click
  menuDeployer.on('click', function() {
    menu.removeClass('menu-active');
    menuHider.addClass('menu-active');
    var menuData = $(this).data('menu');
    var menuID = $('#' + menuData);
    var menuEffect = $('#' + menuData).data('menu-effect');
    var menuWidth = menuID.data('menu-width');
    var menuHeight = menuID.data('menu-height');
    $('body').addClass('modal-open');
    if (menuID.hasClass('menu-header-clear')) {
      menuHider.addClass('menu-active-clear');
    }

    function menuActivate() {
      menuID = 'menu-active' ? menuID.addClass('menu-active') : menuID.removeClass('menu-active');
    }
    if (menuID.hasClass('menu-box-bottom')) {
      $('#footer-bar').addClass('footer-menu-hidden');
    }
    if (menuEffect === "menu-parallax") {
      if (menuID.hasClass('menu-box-bottom')) {
        headerAndContent.css("transform", "translateY(" + (menuHeight / 5) * (-1) + "px)");
      }
      if (menuID.hasClass('menu-box-top')) {
        headerAndContent.css("transform", "translateY(" + (menuHeight / 5) + "px)");
      }
      if (menuID.hasClass('menu-box-left')) {
        headerAndContent.css("transform", "translateX(" + (menuWidth / 5) + "px)");
      }
      if (menuID.hasClass('menu-box-right')) {
        headerAndContent.css("transform", "translateX(" + (menuWidth / 5) * (-1) + "px)");
      }
    }
    if (menuEffect === "menu-push") {
      if (menuID.hasClass('menu-box-bottom')) {
        headerAndContent.css("transform", "translateY(" + (menuHeight) * (-1) + "px)");
      }
      if (menuID.hasClass('menu-box-top')) {
        headerAndContent.css("transform", "translateY(" + (menuHeight) + "px)");
      }
      if (menuID.hasClass('menu-box-left')) {
        headerAndContent.css("transform", "translateX(" + (menuWidth) + "px)");
      }
      if (menuID.hasClass('menu-box-right')) {
        headerAndContent.css("transform", "translateX(" + (menuWidth) * (-1) + "px)");
      }
    }
    if (menuEffect === "menu-push-full") {
      if (menuID.hasClass('menu-box-left')) {
        headerAndContent.css("transform", "translateX(100%)");
      }
      if (menuID.hasClass('menu-box-right')) {
        headerAndContent.css("transform", "translateX(-100%)");
      }
    }

    if (menuID.data('menu-hide')) {
      $(this).addClass('no-click')
      $('.menu-hider').addClass('no-click')
      var menuHideTime = menuID.data('menu-hide');
      $(this).addClass('menu-active');
      menuHider.addClass('menu-active');
      setTimeout(function() {
        menuDeployer.removeClass('no-click')
        menu.removeClass('menu-active');
        menuHider.removeClass('menu-active menu-active-clear no-click');
        headerAndContent.css('transform', 'translate(0,0)');
        menuHider.css('transform', 'translate(0,0)');
        $('#footer-bar').removeClass('footer-menu-hidden');
        $('body').removeClass('modal-open');
      }, menuHideTime)
    }

    menuActivate();
    return false;
  });

  var autoActivateMenu = $('[data-auto-activate]');
  if (autoActivateMenu.length) {
    var autoActivateTimeout = (autoActivateMenu.data('auto-activate')) * 1000
    if (autoActivateTimeout) {
      setTimeout(function() {
        autoActivateMenu.addClass('menu-active');
        menuHider.addClass('menu-active');
      }, autoActivateTimeout);
    } else {
      autoActivateMenu.addClass('menu-active');
      menuHider.addClass('menu-active');
    }
  }

  //Allows clicking even if menu is loaded externally.
  $('.menu-hider, .close-menu, .menu-close').on('click', function() {
    menu.removeClass('menu-active');
    menuHider.removeClass('menu-active menu-active-clear');
    headerAndContent.css('transform', 'translate(0,0)');
    menuHider.css('transform', 'translate(0,0)');
    $('#footer-bar').removeClass('footer-menu-hidden');
    $('body').removeClass('modal-open');
    return false;
  });
  closeMenu = () => {
    menu.removeClass('menu-active');
    menuHider.removeClass('menu-active menu-active-clear');
    headerAndContent.css('transform', 'translate(0,0)');
    menuHider.css('transform', 'translate(0,0)');
    $('#footer-bar').removeClass('footer-menu-hidden');
    $('body').removeClass('modal-open');
    return false;
  }

  //Setting Active Menu
  if ($('#menu-main').length) {
    var menuActive = $('#menu-main').data('menu-active');
    $('#' + menuActive).addClass('menu-active');
  }

  //Detecting and Selecting Active Submenu.
  setTimeout(function() {
    var menuActive = $('#menu-main').data('menu-active');
    $('#' + menuActive).addClass('nav-item-active');
    $('[data-submenu]').on('click', function() {
      $(this).toggleClass('nav-item-active');
      $(this).find('.fa-chevron-right').toggleClass('rotate-90');
      var subID = $(this).data('submenu');
      $('#' + subID).slideToggle(250);
      return false;
    });
    $('[data-submenu]').each(function() {
      var subID = $(this).data('submenu');
      var subChildren = $('#' + subID).children().length;
      $(this).find('strong').html(subChildren);
    });
    if ($('.nav-item-active').data('submenu')) {
      $('.nav-item-active').find('.fa-chevron-right').toggleClass('rotate-90');
      var subID = $('.nav-item-active').data('submenu');
      $('#' + subID).slideDown(250);
    }
    if ($('.nav-item-active').parent().hasClass('submenu')) {
      $('.nav-item-active').parent().slideDown(250);
    }
  }, 250);
}
var reqApiList = async (payload) => {
  var Params = {}
  if (payload.PARAM != null) {
    if (commonLib.objValidate(payload.PARAM)) {
      alert("값을 모두 입력해주세요")
      return
    }
    Params = commonLib.EncSerializeObjectFromObj(payload.PARAM)
  }
  var data = await commonLib.doPost("/list/" + payload.URL, Params)
  if (data.notLogined) {
    alert("세션이 만료되어 로그인 페이지로 이동합니다")
    location.href = "/"
  } else {
    return data
  }
}
