$(document).ready(init());

function signup1() {
  var agree = commonLib.getParameterByName("agree");

  if (agree == "use") {
    $("a[name=ch_use]").addClass('active');
  } else if (agree == "info") {
    $("a[name=ch_info]").addClass('active');
  }
}
$("#lang").change(function() {
  if ($("#lang").val() != "언어변경") {
    location.href = '?lang=' + $("#lang").val();
    location.reload
  }
});

function init() {
  // if(LOGIN){
  //   commonLib.movePage('main');
  // }
  $('#signinX').click(() => {
    location.href = '/'
  });
  $("a[name=ch_all]").click(function() {
    if ($("a[name=ch_all]").hasClass("active")) {
      $("a[name=ch_all]").removeClass('active');
      $("a[name=ch_M]").removeClass('active');
      $("a[name=ch_P]").removeClass('active');
    } else {
      $("a[name=ch_all]").addClass('active');
      $("a[name=ch_M]").addClass('active');
      $("a[name=ch_P]").addClass('active');
      $("a[name=ch_notM]").removeClass('active');
      $("a[name=ch_notP]").removeClass('active');
    }
  });
  $("a[name=ch_M]").click(function() {
    if ($("a[name=ch_M]").hasClass("active")) {
      $("a[name=ch_M]").removeClass('active');
      $("a[name=ch_notM]").addClass('active');
    } else {
      $("a[name=ch_M]").addClass('active');
      $("a[name=ch_notM]").removeClass('active');
    }
  });
  $("a[name=ch_P]").click(function() {
    if ($("a[name=ch_P]").hasClass("active")) {
      $("a[name=ch_P]").removeClass('active');
      $("a[name=ch_notP]").addClass('active');
    } else {
      $("a[name=ch_notP]").removeClass('active');
      $("a[name=ch_P]").addClass('active');
    }
  });
  $("a[name=ch_notM]").click(function() {
    if ($("a[name=ch_notM]").hasClass("active")) {
      $("a[name=ch_notM]").removeClass('active');
      $("a[name=ch_M]").addClass('active');
    } else {
      $("a[name=ch_all]").removeClass('active');
      $("a[name=ch_notM]").addClass('active');
      $("a[name=ch_M]").removeClass('active');
    }
  });
  $("a[name=ch_notP]").click(function() {
    if ($("a[name=ch_notP]").hasClass("active")) {
      $("a[name=ch_notP]").removeClass('active');
      $("a[name=ch_P]").addClass('active');
    } else {
      $("a[name=ch_all]").removeClass('active');
      $("a[name=ch_P]").removeClass('active');
      $("a[name=ch_notP]").addClass('active');
    }
  });

  $("a[name=ch_all1]").click(function() {
    if ($("a[name=ch_all1]").hasClass("active")) {
      $("a[name=ch_all1]").removeClass('active');
      $("a[name=ch_info]").removeClass('active');
      $("a[name=ch_use]").removeClass('active');
    } else {
      $("a[name=ch_all1]").addClass('active');
      $("a[name=ch_info]").addClass('active');
      $("a[name=ch_use]").addClass('active');
    }
  });
  $("a[name=ch_use]").click(function() {
    if ($("a[name=ch_use]").hasClass("active")) {
      $("a[name=ch_use]").removeClass('active');
      $("a[name=ch_all1]").removeClass('active');
    } else {
      $("a[name=ch_use]").addClass('active');
    }
  });
  $("a[name=ch_info]").click(function() {
    if ($("a[name=ch_info]").hasClass("active")) {
      $("a[name=ch_info]").removeClass('active');
      $("a[name=ch_all1]").removeClass('active');
    } else {
      $("a[name=ch_info]").addClass('active');
    }
  });


  $("#lang").change(function() {
    if ($("#lang").val() != "언어선택") {
      location.href = '?lang=' + $("#lang").val();
    }
  });
  // $("#lang").change(function(){
  //   if($("#lang").val()!="언어선택"){
  //     commonLib.moveBarba('?lang=' + $("#lang").val());
  //   }
  // });

  $("#loginForm").keyup(function() {
    if (window.event.keyCode == 13) signIn();
  });
  $("#btnLogin").click(function() {
    signIn();
  });
  if ($("#PW_SAVE").is(":checked")) {
    signIn();
  }
  $("#confirmEmail").keyup(function() {
    if (window.event.keyCode == 13)
      Confirm();
  });
  $("#confirmEmail").click(function() {
    Confirm();
  });

  $(function() {
    $("#signupForm").validate({
      rules: {
        // D_EMAIL: {
        //   required: true
        // },
        D_UID: {
          required: true
        },
        D_PASS: {
          required: true
        },
        D_NAME: {
          required: true
        },
        D_HP: {
          required: true
        },
        D_PASS_CONFIRM: {
          required: true
        }
      },
      messages: {
        // D_EMAIL: {
        //   required: LANG.SIGNUP_VALID1[NUM]
        // },
        D_UID: {
          required: LANG.LOGIN_VALID1[NUM]
        },
        D_PASS: {
          required: LANG.LOGIN_VALID2[NUM]
        },
        D_NAME: {
          required: "이름을 입력해주세요"
        },
        D_HP: {
          required: "전화번호를 입력해주세요"
        },
        D_PASS_CONFIRM: {
          required: LANG.SIGNUP_VALID2[NUM]
        }
      }
    });
  });

  $("#signupForm").keyup(function() {
    if (window.event.keyCode == 13) signup();
  });
  $("#btnSignup").click(function() {
    signup();
  });
}

function sendEmail() {
  var Params = {};
  if ($("#D_EMAIL").val() == "") {
    commonLib.alertMsg(LANG['RECOVER1'][NUM])
    return
  }
  if ($("#D_UID").val() == "") {
    commonLib.alertMsg(LANG['LOGIN_VALID1'][NUM])
    return
  }
  Params['D_EMAIL'] = commonLib.RSAEncrypt($("#D_EMAIL").val());
  Params['D_UID'] = commonLib.RSAEncrypt($("#D_UID").val());
  commonLib.doAjax('/sendEmail', Params, true, true, function(err, data) {
    if (err) {
      return;
    }
    alert(data.message)
  });
}

function signIn(val, val1) {

  commonLib.movePage('main');
  return

  
  var publicKey = $("meta[name='_publicKey']").attr("content");
  if (publicKey == '') {
    commonLib.alertMsg(LANG['LOGIN_LANG9'][NUM]);
    return;
  }
  if ($("#D_UID").val() == '') {
    commonLib.alertMsg(LANG['LOGIN_VALID1'][NUM]);
    return
  }
  if ($("#D_PASS").val() == '') {
    commonLib.alertMsg(LANG['LOGIN_VALID2'][NUM]);
    return
  }
  if (!$('#loginForm').valid()) {
    return;
  }
  var params = {};
  params['D_UID'] = commonLib.RSAEncrypt($("#D_UID").val());
  params['D_PASS'] = commonLib.RSAEncrypt($("#D_PASS").val());
  //params['ID_SAVE'] = $("#ID_SAVE").is(":checked");
  //params['PW_SAVE'] = $("#PW_SAVE").is(":checked");
  $("#btnLogin").attr("disabled", true);
  commonLib.doAjax('signin', params, true, true, function(err, data) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data.returnValue);
    if (data.returnValue == 0) {
      commonLib.movePage('main');
      // commonLib.alertMsg(data.message, function() {
      //   commonLib.movePage('main');
      // });
      // if(false){
      //   DAMDA.insertAutoLogin($("#D_UID").val(),$("#D_PASS").val());
      // }
      //commonLib.movePage('main');
      //commonLib.moveBarba('/main');
    } else if (data.returnValue == 1) {
      commonLib.alertMsg(data.message, function() {
        commonLib.movePage('/email-confirm');
      });
    } else if (data.returnValue == 4) {
      commonLib.alertMsg(data.message, function() {
        commonLib.movePage('main');
      });
      //이미 로그인되어있으면 메인페이지로 이동한다~
      // if(commonLib.isAppClient()){
      // 	commonLib.movePage('main');
      // }else{
      // 	commonLib.alertMsg(data.message, function() {
      // 		commonLib.movePage('main');
      // 	});
      // }
    } else {
      commonLib.alertMsg(data.message, function() {});
    }

  });
}

function Confirm() {
  var random = $("#D_RANDOM").val();
  if (commonLib.isNull(random)) {
    alert(LANG['EMAIL_CONFIRM_VALID1'][NUM]);
    $("#D_RANDOM").focus();
    return;
  }
  var Params = {};
  Params['D_RANDOM'] = commonLib.RSAEncrypt(random);
  commonLib.doAjax('email-confirm', Params, true, true, function(err, data) {
    if (err) {
      return;
    }
    console.log(data);
    if (data.returnValue == 0) {
      alert(data.message);
      commonLib.movePage('/main');
    } else {
      alert(data.message);
    }
  });
}

function signup() {
  if (!$('#signupForm').valid()) {
    return;
  }
  if (SetAlphaNum($("#D_UID").val())) {
    alert(LANG['SIGNUP_VALID13'][NUM])
    return;
  }
  if ($("#D_PASS").val() != $("#D_PASS_CONFIRM").val()) {
    alert(LANG['SIGNUP_VALID3'][NUM]);
    return;
  }
  // if (!commonLib.checkPasswordSecurity($("#D_PASS").val())) {
  //   alert(LANG['SIGNUP_VALID9'][NUM]);
  //   return;
  // }
  if ($("#D_UID").val().indexOf(" ") != -1 || $("#D_PASS").val().indexOf(" ") != -1) {
    alert(LANG['SIGNUP_VALID11'][NUM]);
    return;
  }
  var params = {};
  if (commonLib.isNull($("#D_EMAIL").val())) {
    params['D_EMAIL'] = commonLib.RSAEncrypt('X');
  } else {
    params['D_EMAIL'] = commonLib.RSAEncrypt($("#D_EMAIL").val());
  }

  params['D_UID'] = commonLib.RSAEncrypt($("#D_UID").val());
  params['D_PASS'] = commonLib.RSAEncrypt($("#D_PASS").val());
  params['D_SMSNO'] = commonLib.RSAEncrypt($("#D_SMSNO").val());
  params['D_NAME'] = $("#D_NAME").val();
  params['D_HP'] = commonLib.RSAEncrypt($("#D_HP").val());
  params['D_PUSH'] = (commonLib.getParameterByName("push") == "true") ? "Y" : "N";
  params['D_MARKETING'] = (commonLib.getParameterByName("marketing") == "true") ? "Y" : "N";
  $("#btnSignup").attr("disabled", true);
  commonLib.doAjax('signup', params, true, true, function(err, data) {
    if (err) {
      return;
    }
    if (data.returnValue == 0) {
      alert(data.message);
      location.replace('/');
    } else {
      $("#btnSignup").attr("disabled", false);
      alert(data.message);
    }
  });
}

function resend() {
  commonLib.doAjax('email-confirm-resend', null, true, true, function(err, data) {
    if (err) {
      return;
    }
    if (data.returnValue == 0) {
      alert(data.message);
    } else {
      alert(data.message);
    }
  });
}

function SetAlphaNum(value) {
  var regExp = /[a-z0-9]/;
  if (regExp.test(value)) {

    return false;
  } else {
    return true;
  }
}
$('#D_HP').keypress(function(event) {
  if (event.which && (event.which <= 47 || event.which >= 58) && event.which != 8) {
    event.preventDefault();
  }
});

function nextSign1() {
  if (!($("a[name=ch_info]").hasClass("active")) || !($("a[name=ch_use]").hasClass("active"))) {
    alert("약관에 모두 동의하셔야 이용가능합니다.");
  } else {
    location.href = '/signup2'
  }
}

function nextSign() {
  var push = $("a[name=ch_P]").hasClass("active");
  var marketing = $("a[name=ch_M]").hasClass("active");

  if (($("a[name=ch_P]").hasClass("active") || $("a[name=ch_notP]").hasClass("active")) && ($("a[name=ch_M]").hasClass("active") || $("a[name=ch_notM]").hasClass("active"))) {
    location.href = "/signup3?push=" + push + "&marketing=" + marketing;
  } else {
    alert("수신를 선택하여주세요")
  }
}
