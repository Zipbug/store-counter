$(function () {
  $('#room').submit(function(){
    var $url_rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    var $pass_rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    var $total = $('.total').val();
    var $new_url =  window.location + "room/?i=" +$url_rand;
    var $max = $('.max-oc').val();
    if(!$total){
      $total = 0;
    }
    if(!$max){
      $max = 0;
    }
    document.cookie = "room_data=" + JSON.stringify({"room": $url_rand, "total": $total, "max": $max, "password": $pass_rand});
    window.location.href = $new_url;
    return false;
  });

  $('#addPassword').click(function(){
    $('#password-group').removeClass("d-none");
    $('#removePassword').removeClass("d-none");
    $('#addPassword').addClass("d-none");
  });

  $('#removePassword').click(function(){
    $('#password-group').addClass("d-none");
    $('#removePassword').addClass("d-none");
    $('#addPassword').removeClass("d-none");
  });

  $('.nav-links a').click(function(){
    $('#nav-drawer').removeClass("bmd-drawer-in");
  });

});
