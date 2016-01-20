var canvas;
var ref;
var mode;
var leaderSync;
var followerSync;
var updateInterval = 175;
var tools = {
  "draw":null
}

$(document).ready(function(){
  $('#nav').hide();
  $('#nav').slideDown(); //Makes the nav bar slide down into view.

  /// Init. Firebase ///
  var ref = new Firebase("https://airpaint.firebaseio.com/");

  /// Init. Canvas! ///
  canvas = new fabric.Canvas('c');
  canvas.selection = false; // disable group selection
  canvas.renderOnAddRemove = false;

  updateCanvasSize(); //Canvas fills the window

  $(window).resize(updateCanvasSize); //Auto resizes the canvas


  function updateCanvasSize(){
    canvas.setHeight(window.innerHeight);
    canvas.setWidth(window.innerWidth);
    console.log("Canvas size updated.");
  }

  followerSync = function(){
    ref.once("value", function(snapshot) {
      canvas.loadFromJSON(snapshot.val());
      canvas.renderAll();
      console.log("Loaded: " + snapshot.val());
    }, function (errorObject) {
      alert("Sorry, The canvas couldn't be loaded");
      console.error("The read failed: " + errorObject.code);
    });
  }

  leaderSync = function(){
    ref.set(canvas.toJSON());
    console.log("Pushed");
  }

  ///Tools///
  tools.draw = function(){
    canvas.isDrawingMode = !canvas.isDrawingMode;
  }

  if(confirm("Are you the leader?")){
    mode = "leader";
    $("title").text("AirPaint - Leader");
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric['PencilBrush'](canvas);
    canvas.freeDrawingBrush.color = 'Black';
    canvas.freeDrawingBrush.width = 4;
  } else {
    alert("Now, in follower mode.");
    $("title").text("AirPaint - Follower");
    mode = "follower";
    followerSync();
  }


  var circle = new fabric.Circle({
    radius: 100,
    fill: '#eef',
    scaleY: 0.5,
    originX: 'center',
    originY: 'center'
  });
  if(mode == "leader") setInterval(leaderSync, updateInterval);
  if(mode == "follower") setInterval(followerSync, updateInterval);
});
