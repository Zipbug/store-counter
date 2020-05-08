$(function () {
  var $location = new URL(window.location).searchParams.get("i");
  var $pass = new URL(window.location).searchParams.get("p");
  var socket = io();

  checkCookie();


  /*--------- Form submission ----------*/
  $('#pass').submit(function(){
    var $pass = $('.password').val();
    var $obj = {'room': $location, 'password': $pass};
    document.cookie = "room_data=" + JSON.stringify($obj);
    loadRoom($obj);

    return false;
  });

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
  /*------------- Socket listeners ------------*/
  socket.on('count', function(total){
    $('#total').text(total);
    var $max = $('#max-oc').val();
    if($max > 0){
      if(total >= $max -5){
        $('#total').addClass('alert');
      }else{
        $('#total.alert').removeClass('alert');
      }
    }
  });
  socket.on('change_max', function(max_obj){
    $('#total').text(max_obj.total);
    $('#max-oc').val(max_obj.max);
    $('.max-submit').addClass('hidden');
  });



  /* room link generater*/
  function JoinRoom(room, data){
    console.log(data)
    $('#pass').addClass('hidden');
    $('#total').text(parseInt(data.total));
    $('#max-oc').val(parseInt(data.max));
    $('.room-count').removeClass('hidden');

  }

  $('.copy-link').click(function(){
    copy(window.location);
  });

  $('.copy-pass').click(function(){
    var cookie = getCookie('room_data');
    if(cookie){
      var room_data = JSON.parse(cookie);
      copy(room_data.password);
    }
  });

  function copy(data){
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(data).select();
    document.execCommand("copy");
    $temp.remove()
    alert('copied to clipboard');
  }


  function loadRoom($data){
    new QRCode(document.getElementById("qrcode"), 'http://occupancy.commandercoding.com/room/?i=' + $location);
    socket.emit('join', $data);
    socket.on('exception', function(message){
      $('.main').prepend('<div class="error-massage">'+message.errorMessage+'</div>');
    });
    socket.on('join', function($response){
      JoinRoom($location, $response);
    });
  }
  function checkCookie(){
    var $cookie = getCookie('room_data');
    var $p =  new URL(window.location).searchParams.get("p");
    if($cookie){
      var $room_data = JSON.parse($cookie);
      if($room_data){
        if($room_data.password){
          loadRoom($room_data);
        }
      }
    }else if(p){
      loadRoom({'room': $location, 'password': $p});
    }else if(!$location){
      window.location.href = "http://occupancy.commandercoding.com/";
    }
    console.log($location);
    $('body').addClass('loaded');
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
});
