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
    $('.main').html('<form id="room"><input type="text" class="total" placeholder="Starting Occupancy"></input><input type="text" class="max-oc" placeholder="Max Occupancy"></input><button type="submit">Let\'s Go!</button></form>');
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
    var clipboard = '<div class="clipboard"><svg class="room-data" data-room="'+room+'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="clipboard" x="0px" y="0px" width="780.974px" height="780.975px" viewBox="0 0 780.974 780.975" style="enable-background:new 0 0 780.974 780.975;" xml:space="preserve"><path d="M615.062,780.975h-449.16c-30.167,0-54.709-24.543-54.709-54.709V116.704c0-30.167,24.542-54.709,54.709-54.709h147.482     v42.362h153.205V61.995h148.473c30.171,0,54.719,24.542,54.72,54.708v609.563C669.782,756.432,645.235,780.975,615.062,780.975z      M165.902,81.79c-19.252,0-34.915,15.662-34.915,34.914v609.562c0,19.252,15.663,34.914,34.915,34.914h449.16     c19.258,0,34.925-15.662,34.925-34.914V116.704c-0.001-19.251-15.668-34.914-34.925-34.914H486.385v42.362H293.59V81.79H165.902z     "/><path d="M458.665,92.139H321.309V28.937h40.981v-1.135C362.291,12.472,374.763,0,390.094,0h0.359     c15.33,0,27.803,12.472,27.803,27.802v1.135h40.407L458.665,92.139L458.665,92.139z M341.104,72.344h97.766V48.732h-40.407     v-20.93c0-4.415-3.592-8.007-8.008-8.007h-0.359c-4.416,0-8.009,3.592-8.009,8.007v20.93h-40.981L341.104,72.344L341.104,72.344z"/></svg></div>';
      $('.main').html('<h4 class="center-card"><span id="total">'+data.total+'</span><sub>Current Occupancy</sub></h4>'+
                        '<div class=pm_container>' + '<form id="p" >'+
                        '<button class="plus" type="submit">+1</button>'+
                        '</form>'+
                        '<form id="m" >'+
                          '<button class="minus" type="submit">-1</button>'+
                        '</form>'+
                        '</div>'+ '<div class="clearfix"></div>' +
                        '<form id="max">'+
                        '<input id="max-oc" value="'+data.max+'"></input>'+
                        '<sub class="center-card">Max Occupancy</sub>'+
                        '<button type="submit" class="max-submit hidden">Update</button>'+
                        '</form>'+
                        '<div class="room-row">'+
                        clipboard+
                        '<div class="room-info">'+
                      '<div class="room-id">'+
                      'Room Name: <span id="room-link"><a  href="/?i='+room+'">'+room+'</a></span>'
                       +'</div>'+
                      '<div class="room-pass">Room Password: '+data.pass+'</div>'+
                      '</div>'+
                      '</div><br>');
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
        $('.max-submit').addClass('hidden');
      });
      $('.room-data').click(function(){
        var $base_url = window.location.origin;
        var $room_link = '<a href="'+$base_url + '/?i='+ $(this).data('room') + '">Join Room</a>';
        var $room_pass = $('.room-pass').text();
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($room_link + $room_pass).select();
        document.execCommand("copy");
        $temp.remove()
        alert('copied to clipboard');
      });
      $("#max-oc").keyup(function(){
        $('.max-submit').removeClass('hidden');
      });
  }
});
