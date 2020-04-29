$(function () {
  var $location = new URL(window.location).searchParams.get("i");
  var JoinRoom = function(room){
    var socket = io();
    socket.emit('join',room);
      $('.main').html('<div id="total">0</div><form id="m" ><button type="submit">-1</button></form><form id="p" ><button type="submit">+1</button></form><div class="room-id">Room Name: '+room+'</div>');
      $('body').addClass('loaded');
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
      socket.on('count', function(total){
        $('#total').text(total);
      });

  }

  if($location){
    JoinRoom($location);
  }else{
    $('.main').html('<form id="room"><button type="submit">Generate</button></form>');
    $('body').addClass('loaded');
    $('#room').submit(function(){
      var $url_rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      JoinRoom($url_rand);
      var $new_url =  window.location + "/?i=" +$url_rand;
      console.log('url',  $new_url);
      window.location.href = $new_url;
    });
  }


});
