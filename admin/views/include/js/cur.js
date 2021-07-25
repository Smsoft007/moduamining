$(document).ready(function(){

  var fileTarget = $('.upload-box .upload-hidden'); fileTarget.on('change', function(){ // 값이 변경되면
    if(window.FileReader){
      // modern browser
      var filename = $(this)[0].files[0].name;
    }
    else {
        // old IE
      var filename = $(this).val().split('/').pop().split('\\').pop();
        // 파일명만 추출
    }
        // 추출한 파일명 삽입
    $(this).siblings('.upload-name').val(filename);
  });


  $(".productinfo").css("display", "none");
  productinfoVal = $("select.select-productinfo option:selected").val();
  $(".productinfo").fadeOut(0, function(){
    $(".productinfo"+productinfoVal).fadeIn(300);
  });
  $("select.select-productinfo").change(function(){
    productinfoVal = $("select.select-productinfo option:selected").val();
    $(".productinfo").fadeOut(0, function(){
      $(".productinfo"+productinfoVal).fadeIn(300);
    });
  });



});
