// set up the voices and sounds
var voiceSet = {
  'meow0' : '../sounds/meow01.mp3',
  'meow1' : '../sounds/meow02.mp3',
  'meow2' : '../sounds/meow03.mp3',
  'meow3' : '../sounds/meow04.mp3',
  'voice0': '../sounds/voice01.mp3',
  'voice1': '../sounds/voice02.mp3',
  'voice2': '../sounds/voice03.mp3',
  'voice3': '../sounds/voice04.mp3',
  'drum0' : '../sounds/drum01.mp3',
  'drum1' : '../sounds/drum02.mp3',
  'drum2' : '../sounds/drum03.mp3',
  'drum3' : '../sounds/drum04.mp3',
  'd'     : '../sounds/click.mp3'
};

// plyaback object, default entries are the metronome
var playback = [
  {position: 0,  sensor: 'd'},
  {position: 1,  sensor: 'd'},
  {position: 2,  sensor: 'd'},
  {position: 3,  sensor: 'd'},
  {position: 4,  sensor: 'd'},
  {position: 5,  sensor: 'd'},
  {position: 6,  sensor: 'd'},
  {position: 7,  sensor: 'd'},
  {position: 8,  sensor: 'd'},
  {position: 9,  sensor: 'd'},
  {position: 10, sensor: 'd'},
  {position: 11, sensor: 'd'},
  {position: 12, sensor: 'd'},
  {position: 13, sensor: 'd'},
  {position: 14, sensor: 'd'},
  {position: 15, sensor: 'd'}
]

// set up the defaults
var freestyle    = false,
    currentVoice = 'meow',
    bar          = 16,
    tempo        = 120,
    context      = new webkitAudioContext(),
    bopper       = require('bopper')(context),
    browWidth    = $(window).width(),
    browHeight   = $(window).height(),
    source,
    socket;

// we need to figure out when to restart the loop!
// bpm / 60 = beats per second
// amount of beats / beats per second = duration of loop in seconds
// duration of loop * 1000 = duration in milliseconds
var barLength = (bar / (tempo / 60)) * 1000;

// load all of the sounds and then when ready kick off the meow shoes setup and bindings
var assets = new AbbeyLoad([voiceSet], function (buffers) {setupMeowShoes(buffers)});

// play that sound! Make a new buffer each time -___-
function playSound(buffer, time) {
  source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(time);
}

// pretty pictures appearing in random places!
function playVisual(image) {
  // create node string
  var vish = $('<img class="vish" src="/imgs/'+image+'"/>');
  // add the image node in the body
  $('body').append(vish);

  // place it on the page at random, animate in and out
  vish.css({
            'top': Math.floor((Math.random() * browHeight) + 1 ) + 'px', 
            'left': Math.floor((Math.random() * browWidth) + 1 ) + 'px' })
      .animate({'opacity':1}, 500)
      .animate({'opacity':0}, 500, function() {
        // remove so we don't be a dick with memory
        vish.remove();
      });

}

function bindClicks() {
  // stop button
  $('#stopMusic').click(function() {
      bopper.stop();
      clearInterval(restartLoop);
  });

  // let's go freestyle! This button is a toggle
  // TODO: make the button change state to show if freestyle is on or off
  $('#freeStyle').click(function() {
      if(!freestyle) {freestyle = true} else {freestyle = false};
  });

  // change voices!!
  $('.changeMode').click(function(e) {
    // should I change this to current target?
    var newMode = e.target.id.substr(0, e.target.id.length - 4);
    currentVoice = newMode;
  });
  
};

// set up the shoezzz
function setupMeowShoes(buffers) {

  // whut even is in the buffer
  console.log('buffs: ' + buffers.meow02);

  // set up the socket connection
  socket = io.connect('http://localhost');

  socket.on('sp', function (data) {
    var sensorNum = parseInt(data, 10) || null,
        sound = currentVoice + sensorNum;

    // testing...
    console.log(sound);
    console.log(data);

    // make sure the data is in the format we expect, then play that sound immediately
    if (sensorNum >= 0 && sensorNum <= 3) {
      playSound(buffers[sound], 0);

      // if it's not freestyle queue the sound up
      if (!freestyle) {
        // find the closest beat that the user tapped at
        curPos = Math.floor(bopper.getCurrentPosition());

        // push the note to the queue 
        playback.push({'position': curPos, 'sensor': sound})
      }
    }

  });

  // set the tempo of bopper
  bopper.setTempo(tempo);

  bopper.on('data', function(schedule) {
    // play the sound in sync with the 16 bar rhythm and tempo
    playback.forEach(function(note){
      if (note.position >= schedule.from && note.position < schedule.to){
        var delta = note.position - schedule.from,
            time = schedule.time + delta;

        // play the sound
        playSound(buffers[note.sensor], 0);

        // TODO: swap the file out for a currentVoice + note.sensor mapped filename - perhaps store in object similar to abbey load?
        playVisual(note.sensor+'.png');
      }
    });
  });

  // read to kick this stuff off
  init();

}; // end setupMeowShoes

function init() {
  // start bopper playing the loop
  setTimeout(function(){
    bopper.start();
    console.log('bopperstart');

    bindClicks();

  }, 500);

  // restart bopper based on total time of the playback
  var restartLoop = setInterval(function(){
    bopper.restart();
    console.log('restarting!', playback);
  }, barLength);
}
