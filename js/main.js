$(function () {
  var $location = new URL(window.location).searchParams.get("i");
  var socket = io();
  var addCheck = function(){
    $('#pass').submit(function(){
      var $pass = $('.password').val();
      var $obj = {'room': $location, 'password': $pass};

      socket.emit('join', $obj);
      socket.on('exception', function(message){
        $('.main').prepend('<div class="error-massage">'+message.errorMessage+'</div>');
      });
      socket.on('join', function(data){
        JoinRoom($location, data);
      });

      return false;
    });
  }

  if($location){
    $('.main').html('<form id="pass"><input type="text" class="password" placholder="password"></input><button type="submit">Join</button></form>');
    addCheck();
    $('body').addClass('loaded');
  }else{
    $('.main').html('<form id="room"><input type="number" class="max-oc" placholder="Max Occupency"></input><input type="number" class="total" placholder="Total current"></input><button type="submit">Generate</button></form>');
    $('body').addClass('loaded');
    $('#room').submit(function(){
      var $url_rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      var $pass_rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      var $total = $('.total').val();
      var $new_url =  window.location + "?i=" +$url_rand;
      var $max = $('.max-oc').val();
      if(!$total){
        $total = 0;
      }

      var dat = {"room": $url_rand, "total": $total, "max": $max, "password": $pass_rand};
      socket.emit('create', dat);
      $location = $url_rand;
      $('.main').html('<form id="pass"><input type="text" class="password" placholder="password" value="'+$pass_rand+'"></input><button type="submit">Join</button></form>');
      addCheck();
      return false;
    });
  }

  var JoinRoom = function(room, data){
      $('.main').html('<div id="total">'+data.total+'</div>'+
                        '<form id="m" >'+
                          '<button type="submit">-1</button>'+
                        '</form>'+
                        '<form id="p" >'+
                          '<button type="submit">+1</button>'+
                        '</form>'+
                        '<form id="max" >'+
                        '<input id="max-oc" type="number">'+data.max+'</input>'+
                        '<button type="submit">Update</button>'+
                        '</form>'+
                        '<div class="room-data">'+
                          '<div class="room-id">Room Name: <a href="/?i='+room+'">'+room+'</a></div>'+
                          '<div class="room-pass">Room Password: '+data.pass+'</div>'+
                        '</div>');
      $('#m').submit(function(){
        var $total = parseInt($('#total').text()) - 1;
        var $obj = {'room': $location, 'total': $total};

        socket.emit('count', $obj);
        return false;
      });
      $('#p').submit(function(){
        var $total = parseInt($('#total').text()) + 1;
        var $obj = {'room': $location, 'total': $total};

        socket.emit('count', $obj);
        return false;
      });
      $('#max').submit(function(){
        var $total = parseInt($('#total').text()) + 1;
        var $max = parseInt($('#max-oc').val());
        var $obj = {'room': $location, 'total': $total};

        socket.emit('change_max', $obj);
        return false;
      });
      socket.on('count', function(total){
        $('#total').text(total);
      });
      socket.on('change_max', function(max_obj){
        $('#total').text(max_obj.total);
        $('#max-oc').val(max_obj.max);
      });
      $('.room-data').click(function(){
        var $text = $(this).html();
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($text).select();
        document.execCommand("copy");
        $temp.remove()
        alert('copied to clipboard');
      })
  }
  $('#toggle-modal, .close').click(function(){
    $('.modal').toggleClass('visible');
    return false;
  });
});
