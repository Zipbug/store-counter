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
    $('.main').html('<form id="pass"><label for="password">Password</label><input type="text" class="password" placeholder="password"></input><button type="submit">Join</button></form>');
    addCheck();
    $('body').addClass('loaded');
  }else{
    $('.main').html('<form id="room"><input type="text" class="total" placeholder="Starting Occupency"></input><input type="text" class="max-oc" placeholder="Max Occupency"></input><button type="submit">Let\'s Go!</button></form>');
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
      $('.main').html('<form id="pass"><label for="password">Password</label><input type="text" class="password" placeholder="password" value="'+$pass_rand+'"></input><button type="submit">Join</button></form>');
      addCheck();
      return false;
    });
  }

  var JoinRoom = function(room, data){
      $('.main').html('<h4 ><span id="total">'+data.total+'</span><span>- Current Occupency</span></h4>'+
                        '<form id="p" >'+
                        '<button type="submit">+1</button>'+
                        '</form>'+
                        '<form id="m" >'+
                          '<button type="submit">-1</button>'+
                        '</form>'+
                        '<form id="max">'+
                        '<label for="max-oc">Max Occupency</label>'+
                        '<input id="max-oc" type="number" value="'+data.max+'"></input>'+
                        '<button type="submit">Update</button>'+
                        '</form>'+
                        '<div class="room-data">'+
                          '<div class="room-id">Room Name: <a href="/?i='+room+'">'+room+'</a></div>'+
                          '<div class="room-pass">Room Password: '+data.pass+'</div>'+
                        '</div>');
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
});
