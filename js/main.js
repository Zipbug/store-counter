$(function () {
  var roomCheck = null;
  var rootURL = 'https://ocupancy_app.occupancyapp.workers.dev/v1/';
  var settings = {
    "url": "",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Authorization": "Bearer 9f8268e721971ef61ddbafa393d46ac5ab501",
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    "data": "",
  };

  $('#room').submit(function(e){
    e.preventDefault();
    console.log('submited');
    var $total = $('.total').val();
    var $max = $('.max-oc').val();
    var $pass = $('#password').val();
    var $encryptPass = btoa($pass);
    if(!$total){
      $total = 0;
    }
    if(!$max){
      $max = 0;
    }
    if(!$pass){
      $pass = false;
    }
    var room = createRoom({
      "total": $total,
      "max": $max,
      "password": $pass
    });
    console.log('room', room);
    var getUrl = window.location;
    var passURL = $pass ? "&p=" + $encryptPass: "";
    var $new_url =  getUrl .protocol + "//" + getUrl.host + "/" + "room/?i=" +room.id + passURL;
    //window.location.href = $new_url;
    return false;
  });

  $('#join').submit(function(){
    var $id = $('#spaceid').val();
    var $pass = $('#password').val();
    if(!$pass){
      $pass = false;
    }
    var data = {
      "id": $id,
      "password": $pass
    }
    var room = getRoomData(data);
    console.log(room);
    var getUrl = window.location;
    var $encryptPass = btoa($pass);
    var passURL = $pass ? "&p=" + $encryptPass : "";
    var $new_url =  getUrl .protocol + "//" + getUrl.host + "/" + "room/?i=" + $id + passURL;
    window.location.href = $new_url;
  });

  function processURL(){
    var $location = new URL(window.location).searchParams.get("i");
    var $pass = new URL(window.location).searchParams.get("p");
    var $unencryptPass = atob($pass);
    var data = {
      "id": location,
      "password": $unencryptPass
    }
    var room = getRoomData(data);
    console.log(room);
  }

  function updateRoom(data){
    $('#total').text(parseInt(data.total));
    $('#max-oc').val(parseInt(data.max));
    $('.room-count').removeClass('hidden');
  }

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
  function yellowWarning(){
    $('#progress-bar').addClass("yellow");
  }

  //over capacity
  function overCapacity(){
    $('#progress-bar').addClass("red");
    $('#current').addClass("red-text");
    $('#nav-color').addClass("red");
    $('#over-capacity').removeClass("d-none");
  }

  //back to normal
  function normalize(){
    $('#progress-bar').removeClass("red").removeClass("yellow");
    $('#current').removeClass("red-text");
    $('#nav-color').removeClass("red");
    $('#over-capacity').addClass("d-none");
  }

  $('#m').submit(function(){
    var $total = parseInt($('#total').text()) - 1;
    if($total >= 0){
      var $obj = {'room': $location, 'total': $total};

      socket.emit('count', $obj);
    }
    return false;
  });

  $('#p').submit(function(){
    var $total = parseInt($('#total').text()) + 1;
    var $obj = {'room': $location, 'total': $total};

    socket.emit('count', $obj);
    return false;
  });

  $('#max').submit(function(){
    var $total = parseInt($('#total').text());
    var $max = parseInt($('#max-oc').val());
    var $obj = {'room': $location, 'total': $total, 'max': $max};

    socket.emit('change_max', $obj);
    return false;
  });

  $("#max-oc").keyup(function(){
    $('.max-submit').removeClass('hidden');
  });
  $('.toggle_qr').click(function(){
    $('#qrcode').toggleClass('hidden');
  });
  $('.copy-link').click(function(){
    copy(window.location);
  });

  function copy(data){
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(data).select();
    document.execCommand("copy");
    $temp.remove()
    alert('copied to clipboard');
  }
  function getRoomData(data){
    settings.url = rootURL + 'space/';
    settings.data =  JSON.stringify();
    $.ajax(settings).done(function (response) {
      return response;
    });
  }

  function updateRoomData(data){
    settings.url = rootURL + 'update/';
    settings.data =  JSON.stringify();
    $.ajax(settings).done(function (response) {
      return response;
    });
  }

  function createRoom(data){
    settings.url = rootURL + 'generate/';
    settings.data =  JSON.stringify();
    $.ajax(settings).done(function (response) {
      return response;
    });
  }

});
