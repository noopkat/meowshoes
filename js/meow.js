// playback object, will contain all sequenced sounds
var playback = []

// set up the defaults
var freestyle    = false,
    currentVoice = 'meow',
    bar          = 16,
    tempo        = 120,
    context      = new webkitAudioContext(),
    // bopper       = require('bopper')(context),
    temporal     = require('temporal'),
    browWidth    = $(window).width(),
    browHeight   = $(window).height(),
    source,
    socket,
    restartLoop;

// to work out millisecond loop delay for tempo which is bpm:
var beat = 60 / tempo * 1000;
var curBeat = 0;

// we need to figure out when to restart the loop!
// bpm / 60 = beats per second
// amount of beats / beats per second = duration of loop in seconds
// duration of loop * 1000 = duration in milliseconds

// don't need this anymore
//var barLength = (bar / (tempo / 60)) * 1000;

// load all of the sounds and then when ready kick off the meow shoes setup and bindings
var assets = new AbbeyLoad([voiceSet], function (buffers) {setupMeowShoes(buffers)});

// this will push a short sound for each beat to the playback object to help the user time their foot taps
function createMetronome() {
  for (i = 0; i < bar; i++) {
    // fix this to match new voice structure
    playback.push({position: i, sensor: 'd'});
  }
}

// play that sound! 
function playSound(buffer, time) {
  source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(time);
}

// pretty pictures appearing in random places!
function playVisual(image) {
  // create node string
  var picture = $('<img class="vish" src="/imgs/' + image + '"/>');
  // add the image node in the body
  $('body').append(picture);

  // place it on the page at random, animate in and out
  picture.css({
            'top': Math.floor((Math.random() * browHeight) + 1 ) + 'px', 
            'left': Math.floor((Math.random() * browWidth) + 1 ) + 'px' 
      })
      .animate({'opacity':1}, 500)
      .animate({'opacity':0}, 500, function() {
        picture.remove();
      });
} // end playVisual

function bindClicks() {
  // stop button
  $('#stopMusic').click(function() {
      // old way
      //bopper.stop();
      // temporal way
      sequencer.stop();
      // old way
      //clearInterval(restartLoop);
  });

  // let's go freestyle! This button is a toggle
  // TODO: make the button change state to show if freestyle is on or off
  // also a giant "FREESTYLE!" text block appearing momentarily on the screen would be awesome
  $('#freeStyle').click(function() {
      freestyle ? false : true;
  });

  // change voices!!
  $('.changeMode').click(function(e) {
    // should I change this to current target?
    var newMode = e.target.id.substr(0, e.target.id.length - 4);
    currentVoice = newMode;
  });
}; // end bindClicks

// set up the shoezzz
function setupMeowShoes(buffers) {

  // add metronome to bopper
  createMetronome();

  // set the tempo of bopper
  //bopper.setTempo(tempo);

  // replace this here with temporal which brings dev back to using johnny-five/rwaldron related things for consistency in book
  // bopper.on('data', function(schedule) {
  //   // play the sound in sync with the 16 bar rhythm and tempo
  //   playback.forEach(function(note){
  //     if (note.position >= schedule.from && note.position < schedule.to) {
  //       // play the sound
  //       playSound(buffers[note.sensor], 0);

  //       // play a visual
  //       playVisual(visualSet[note.sensor]);
  //     }
  //   });
  // });

  // example of temporal
  // Loop every n milliseconds, executing a task each time
  var sequencer = temporal.loop(beat, function() {
    console.log('beat!');

    playback.forEach(function(note){

      if (note.position === curBeat) {
        // play the sound
        playSound(buffers[note.sensor], 0);
        // play a visual
        playVisual(visualSet[note.sensor]);
      }

    });

    // reset beat back to 0
    curBeat = (curBeat === bar - 1) ? 0 : += 1;

  });

  // set up the socket connection
  socket = io.connect('http://localhost');

  socket.on('tap', function (data) {
    // sensorNum is no longer an accurately descriptive variable name
    var sensorNum = data,
        sound = currentVoice + '_' + sensorNum;

    // testing...
    // console.log(sound);
    // console.log(data);

    // make sure the data is in the format we expect, then play that sound immediately
    //if (sensorNum >= 0 && sensorNum <= 3) {
      playSound(buffers[sound], 0);

      // play a visual also
      playVisual(visualSet[sound]);

      // if it's not freestyle queue the sound up
      if (!freestyle) {
        // find the closest beat that the user tapped at
        // commented this out because of temporal
        //curPos = Math.floor(bopper.getCurrentPosition());

        // push the note to the queue 
        //playback.push({'position': curPos, 'sensor': sound});

        // push the note to the queue, the temporal way
        playback.push({'position': curBeat, 'sensor': sound})
      }
   // }

  }); // end socket.on

  // ready to kick this stuff off
  init();

}; // end setupMeowShoes

function init() {
  // start bopper playing the loop
  setTimeout(function(){
    //do not start bopper anymore
    //bopper.start();
    bindClicks();
  }, 500);

  // restart bopper based on total time of the playback
  // restartLoop = setInterval(function(){
  //   bopper.restart();
  //   //console.log('restarting!', playback);
  // }, barLength);
}
