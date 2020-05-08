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

  // Calculate Percentage for graph
  $(function(){
    var current = 0
    var maximum = 25
    var percentage = (current*100/maximum);
    if (percentage >= 100) {
      overCapacity();
    } else if (percentage >= 80 && percentage <= 99.9) {
      console.log("yup, I was called");
      yellowWarning();
    } else {
      normalize();
    }
  });

  //almost at capacity
  $(function yellowWarning(){
    $('#progress-bar').addClass("yellow");
  });

  //over capacity
  $(function overCapacity(){
    $('#progress-bar').addClass("red");
    $('#current').addClass("red-text");
    $('#nav-color').addClass("red");
    $('#over-capacity').removeClass("d-none");
  });

  //back to normal
  $(function normalize(){
    $('#progress-bar').removeClass("red").removeClass("yellow");
    $('#current').removeClass("red-text");
    $('#nav-color').removeClass("red");
    $('#over-capacity').addClass("d-none");
  });


});
