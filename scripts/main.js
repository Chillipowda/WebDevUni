window.onload = function() {
  //Implementation of a window.onload to log to the console that the page has loaded successfully - debug purposes
  console.log("load successful");
//get elements of file input and audio
  var file = document.getElementById("thefile");
  var audio = document.getElementById("audio");
  //grabs the rgb values from the colour picker in the popular.html page
  function update(picker){
    console.log(picker.rgb[0]);
    console.log(picker.rgb[1]);
    console.log(picker.rgb[2]);
};

//when a file is picked by the user, execute this
  file.onchange = function() {
    var files = this.files;
    //begin initialising and setting variables for the visualiser
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    //set canvas width and height
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth/2;
    canvas.height = window.innerHeight/3;
    var ctx = canvas.getContext("2d");
    //connect audio analyser to display frequency analysis to the web page
    src.connect(analyser);
    analyser.connect(context.destination);
    //determines the number of bars rendered on the web page - higher number = more bars, lower number = less but thicker
    analyser.fftSize = 4096;
    //bufferlength is logged to console for debug
    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);
    //grab width and height of canvas to manipulate during drawing
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;
    //using renderframe to draw to the canvas
    function renderFrame(r, g, b) {
      requestAnimationFrame(renderFrame);

      x = 0;

      analyser.getByteFrequencyData(dataArray);
      //fills the canvas to black
      ctx.fillStyle = "#000";
      //fill rectangle with the canvas width and height previously grabbed
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      //as long as i is below buffer length, continue through this loop
      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        //rgb is grabbed from the webpage (nerd stat is used in this scenario)
        var r = document.getElementById('rgb1').innerHTML;
        var g = document.getElementById('rgb2').innerHTML;
        var b = document.getElementById('rgb3').innerHTML;
        //fill the bars drawn to the canvas with user specified colour
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    audio.play();
    renderFrame();
  };
};
