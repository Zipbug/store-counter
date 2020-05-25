$(function () {
  /*
    * Global Variables/ functions.
    * Worker Helper functions.
    * Form Submission.
    * Page Render
  */

  /*----- Global Variables -----*/
  var roomCheck = null;

  /*----- Worker Helper functions -----*/
  function callWorker(url, put, callback){
    const Http = new XMLHttpRequest();
    Http.open(put, url);

    Http.send();
    Http.onreadystatechange = (e) => {
      if (Http.readyState === 4) {
          var resp = JSON.parse(Http.response);
          if(resp.error){
            window.alert(resp.error);
            return false;
          }else{
            callback(resp);
          }
      }
    }
  }

  function processURL(){
    var $location = new URL(window.location).searchParams.get("i");
    if($location){
      var $url = "https://65f34f5dz4.execute-api.us-east-1.amazonaws.com/dev/space/"  + $location;

      callWorker($url, "GET", updateRoom);
      roomCheck = setTimeout(function(){ processURL() }, 2000);
    }
  }

  /*----- Form Submission -----*/
  $('#room').submit(function(e){
    e.preventDefault();

    var $total = $('#starting_oc').val();
    var $max = $('#max_oc').val();
    if(!$total){
      $total = 0;
    }
    if(!$max){
      $max = 0;
    }
    var $url= "https://65f34f5dz4.execute-api.us-east-1.amazonaws.com/dev/space/new/occupancy/current/"+$total+"/max/" + $max;


    callWorker($url, "PUT", function(returnData){
      var getUrl = window.location;
      var $new_url =  getUrl .protocol + "//" + getUrl.host + "/" + "room/?i=" +returnData.space_id;
      window.location.href = $new_url;
    });
    return false;
  });

  $('#m').submit(function(e){
    e.preventDefault();

    var $location = new URL(window.location).searchParams.get("i");
    var $url = "https://65f34f5dz4.execute-api.us-east-1.amazonaws.com/dev/space/"+$location+"/decrement";


    roomCheck = null;
    callWorker($url,"PUT", updateRoom);
    return false;
  });

  $('#p').submit(function(e){
    e.preventDefault();

    var $location = new URL(window.location).searchParams.get("i");
    var $url = "https://65f34f5dz4.execute-api.us-east-1.amazonaws.com/dev/space/"+$location+"/increment";


    roomCheck = null;
    callWorker($url,"PUT", updateRoom);
    return false;
  });

  $('#max-value-form').submit(function(){
    var $max = parseInt($('#max-value').val());
    var $location = new URL(window.location).searchParams.get("i");
    var $url = "https://65f34f5dz4.execute-api.us-east-1.amazonaws.com/dev/space/"+$location+"/max/" + $max;

   callWorker($url,"PUT", updateRoom);
   $('#max-change').toggleClass('hidden');
   return false;
  });


  $('#contact').submit(function(){
    var $obj = {
     "call": 'contact',
     "email ": $('#email').val(),
     'message': $('#message').val(),
   };
   const Http = new XMLHttpRequest();
   Http.open("POST", 'https://api.occupancyapp.com');
   Http.setRequestHeader('Accept', 'application/json');
   Http.setRequestHeader('Content-Type', 'application/json');
   Http.send(JSON.stringify($obj));

   Http.onreadystatechange = (e) => {

     if (Http.readyState === 4) {
         var resp = JSON.parse(Http.response);
         if(resp.error){
           window.alert(resp.error);
           return false;
         }else{
            $('#contact').html(resp.message);
         }
     }
   }

    return false;
  });

  /*----- Page Render Functions -----*/

  function updateRoom(data){
    $('#current').text(parseInt(data.occupancy.current));
    $('#max').text(parseInt(data.occupancy.maximum));
    calulateGraph();
    $('.room-count.hidden').removeClass('hidden');
    clearTimeout(roomCheck);
    roomCheck = setTimeout(function(){ processURL() }, 2000);
  }


  // Calculate Percentage for graph
  function calulateGraph(){
    var current = $('#current').text();
    var maximum = $('#max').text();
    if(maximum !== 0){
      var percentage = (current*100/maximum);
        $('#progress-bar').css('width', percentage +"%");
      if (percentage >= 100) {
        overCapacity();
      } else if (percentage >= 80 && percentage <= 99.9) {
        yellowWarning();
      } else {
        normalize();
      }
    }
  }

  //almost at capacity
  function yellowWarning(){
    $('#progress-bar').removeClass("red");
    $('#current').removeClass("red-text");
    $('#nav-color').removeClass("red");
    $('#over-capacity').addClass("d-none");
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

  $('.nav-links a').click(function(){
    $('#nav-drawer').removeClass("bmd-drawer-in");
  });
  if($("#qrcode").length){
    var $location = new URL(window.location).searchParams.get("i");
    new QRCode(document.getElementById("qrcode"),  'https://www.occupancyapp.com/room/?i=' + $location);
  }

  $('#copy').click(function(){
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(window.location).select();
    document.execCommand("copy");
    $temp.remove()
    alert('copied to clipboard');
  });

  processURL();
});
