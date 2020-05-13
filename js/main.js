$(function () {
  /*
    * Global Variables/ functions.
    * Worker Helper functions.
    * Form Submission.
    * Page Render
  */

  /*----- Global Variables -----*/
  var roomCheck = null;
  var addedTotal = 0;


  /*----- Worker Helper functions -----*/
  function callWorker(data, callback){
    console.log('call worker', data);
    const Http = new XMLHttpRequest();
    Http.open("POST", 'https://api.occupancyapp.com');
    Http.setRequestHeader('Accept', 'application/json');
    Http.setRequestHeader('Content-Type', 'application/json');
    Http.send(JSON.stringify(data));

    Http.onreadystatechange = (e) => {

      if (Http.readyState === 4) {
          var resp = JSON.parse(Http.response);
          console.log("response: ", resp);
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
      var $pass = new URL(window.location).searchParams.get("p");
      var $unencryptPass = false;
      if($pass){
        $unencryptPass = atob($pass);
      };
      var data = {
        "call": "get",
        "id": $location,
        "password": $unencryptPass
      }

      callWorker(data, updateRoom);
      roomCheck = setTimeout(function(){ processURL() }, 2000);
    }
  }

  function onSpaceUpdate(){
    var $location = new URL(window.location).searchParams.get("i");
    var $pass = new URL(window.location).searchParams.get("p");
    var $unencryptPass = false;
    if($pass){
      $unencryptPass = atob($pass);
    };
    var $obj = {
      "call": 'update',
      'id': $location,
      'new_val': addedTotal,
      'max': null,
      'password': $unencryptPass
    };
    $('#current-total').text("").addClass("hidden");
    addedTotal = 0;
    roomCheck = null;
    callWorker($obj, updateRoom);
  }

  /*----- Form Submission -----*/
  $('#room').submit(function(e){
    e.preventDefault();

    var $total = $('#starting_oc').val();
    var $max = $('#max_oc').val();
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
    var data = {
      "call": 'generate',
      "total": $total,
      "max": $max,
      "password": $pass
    };

    callWorker(data, function(returnData){
      var getUrl = window.location;
      var passURL = returnData.password ? "&p=" + btoa(returnData.password): "";
      var $new_url =  getUrl .protocol + "//" + getUrl.host + "/" + "room/?i=" +returnData.key + passURL;
      window.location.href = $new_url;
    });
    return false;
  });

  $('#join').submit(function(){
    e.preventDefault();
    var $id = $('#spaceid').val();
    var $pass = $('#password').val();
    if(!$pass){
      $pass = false;
    }
    var data = {
      "call": "get",
      "id": $id,
      "password": $unencryptPass
    }
    callWorker(data, function(returnData){
      var getUrl = window.location;
      var passURL = returnData.password ? "&p=" + btoa(returnData.password): "";
      var $new_url =  getUrl .protocol + "//" + getUrl.host + "/" + "room/?i=" +returnData.key + passURL;
      window.location.href = $new_url;
    });
    return false;
  });

  $('#m').submit(function(e){
    e.preventDefault();
    addedTotal--;
    $('#current-total').text(addedTotal).removeClass("hidden");
    if(roomCheck){
      clearTimeout(roomCheck);
      roomCheck = null;
    }
    roomCheck = setTimeout(function(){ onSpaceUpdate() }, 2000);
    return false;
  });

  $('#p').submit(function(e){
    e.preventDefault();
    addedTotal++;

    $('#current-total').text(addedTotal).removeClass("hidden");
    if(roomCheck){
      clearTimeout(roomCheck);
      roomCheck = null;
    }
    roomCheck = setTimeout(function(){ onSpaceUpdate() }, 2000);
    return false;
  });

  $('#max-value-form').submit(function(){
    var $max = parseInt($('#max-value').val());
    var $location = new URL(window.location).searchParams.get("i");
    var $pass = new URL(window.location).searchParams.get("p");
    var $unencryptPass = false;
    if($pass){
      $unencryptPass = atob($pass);
    };
    var $obj = {
     "call": 'update',
     "new_val": 0,
     'id': $location,
     'max': $max,
     'password': $unencryptPass
   };
   callWorker($obj, updateRoom);
   $('#max-change').toggleClass('hidden');
   return false;
  });


  $('#contact').submit(function(){
    var $obj = {
     "call": 'contact',
     "email ": $('#email').val(),
     'message': $('#message').val(),
   };
    callWorker($obj, function(returnData){
      $('#contact').html(returnData.message);
    });
    return false;
  });

  /*----- Page Render Functions -----*/

  function updateRoom(data){
    $('#current').text(parseInt(data.total));
    $('#max').text(parseInt(data.max));
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
  $('.toggle_qr').click(function(){
    QRCode(document.getElementById("qrcode"), window.location);
    $('#qrcode').toggleClass('hidden');
  });

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
