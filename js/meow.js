

// play that sound! Make a new buffer each time -___-
function playSound(buffer, time) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(time);
}

// pretty pictures appearing in random places!
// this is rather awfully written also because hackathon whatevs
function playVisual(image) {
  var vish = $('<img src="/imgs/'+image+'"/>');
  // put it in the body and style
  $('body').append(vish)
    .css({'position': 'absolute', 
          'top': Math.floor((Math.random()*800)+1)+'px', 
          'left': Math.floor((Math.random()*1000)+1)+'px', 
          // put these two props in the actual css, k
          'width': '400px', 
          'opacity': 1
    });
  // to callback, or not to callback, do I want spaceship code even?
  vish.animate({'opacity':1}, 500);
  vish.animate({'opacity':0}, 500, function() {
    // remove so we don't be a dick with memory
    vish.remove();
  });
  
}

// I don't quite have the hang of how to return buffers out of this, so it's all lumped into the abbey load object right now
// ya I know how awful
// I WILL FIX IT MMMKAY
var assets = new AbbeyLoad( [{
                 'meow0': '../sounds/meow01.mp3',
                 'meow1': '../sounds/meow02.mp3',
                 'meow2': '../sounds/meow03.mp3',
                 'meow3': '../sounds/meow04.mp3',
                 'voice0': '../sounds/voice01.mp3',
                 'voice1': '../sounds/voice02.mp3',
                 'voice2': '../sounds/voice03.mp3',
                 'voice3': '../sounds/voice04.mp3',
                 'drum0': '../sounds/drum01.mp3',
                 'drum1': '../sounds/drum02.mp3',
                 'drum2': '../sounds/drum03.mp3',
                 'drum3': '../sounds/drum04.mp3',
                 'd': '../sounds/click.mp3'
             }], function (buffers) {

                // I mean really all we should need in here is to return the buffer as an arguement for the main fuction, 
                // or use assets as the object that it is in the main function elsewhere. Need to find out how to.
                // IT'S JUST A CALLBACK, WHY IS THIS SO HARD 

                // whut even is in the buffer
                console.log('buffs: ' + buffers.meow02);

                 // set up the socket connection
                var socket = io.connect('http://localhost'),

                socket.on('sp', function (data) {
                  var sound = currentVoice+parseInt(data, 10);
                  console.log(sound);

                  // this would look nicer as case/switch format eh.
                  // store the darn data parsing int in a var too man.
                  if (parseInt(data, 10) === 0) {
                    playSound(buffers[sound], 0);
                  }

                  else if (parseInt(data, 10) === 1) {
                    playSound(buffers[sound], 0);
                  }

                   else if (parseInt(data, 10) === 2) {
                    playSound(buffers[sound], 0);
                  }

                   else if (parseInt(data, 10) === 3) {
                    playSound(buffers[sound], 0);
                  }

                  // if it's not freestyle queue the sound up
                  if (!freestyle) {
                    // find the closest beat that the user tapped at
                    curPos = Math.floor(bopper.getCurrentPosition());
                    // push the note to the queue (remove length when it's deprecated)
                    playback.push({'position': curPos, 'length':1, 'sensor': sound})
                  }
                 
                  // what's happening
                  console.log(data);

                });


                bopper.on('data', function(schedule) {
                // play the sound in sync with the 16 bar rhythm and tempo
                playback.forEach(function(note){
                  if (note.position >= schedule.from && note.position < schedule.to){
                    var delta = note.position - schedule.from
                    // make this time var below global so the pressure 'click' event can access where to put the new noise
                    var time = schedule.time + delta;
                    var duration = note.length * schedule.beatDuration;
                    // TODO: swap out note.sensor for currentVoice + note.sensor
                    playSound(buffers[note.sensor], 0);
                    // TODO: swap the file out for a currentVoice + note.sensor mapped filename - perhaps store in object similar to abbey load?
                    playVisual(note.sensor+'.png');
                  }
                });

              })
         });


  
// let's not get too crazy too fast
var freestyle = false;
// set the default voice
var currentVoice = 'meow';

// this was the death of me arghadksjdnksadjk657%^%&^$%
var bopper = require('bopper')(audioContext);
context = new webkitAudioContext();

// 16 beats in a bar
var bar = 16;
// 120 beats per minute
var tempo = 120;
 
function init() {

// this playback object will need to become dynamic
// perhaps I can fill it with a metronome to help people? METRONOME INSTALLED YOU'RE WELCOME
// remove the length as it's not needed.
var playback = [
  {position: 0, length: 1, sensor: 'd'},
  {position: 1, length: 0.1, sensor: 'd'},
  {position: 2, length: 0.1, sensor: 'd'},
  {position: 3, length: 0.1, sensor: 'd'},
  {position: 4, length: 0.1, sensor: 'd'},
  {position: 5, length: 0.1, sensor: 'd'},
  {position: 6, length: 0.1, sensor: 'd'},
  {position: 7, length: 0.1, sensor: 'd'},
  {position: 8, length: 0.1, sensor: 'd'},
  {position: 9, length: 0.1, sensor: 'd'},
  {position: 10, length: 0.1, sensor: 'd'},
  {position: 11, length: 0.1, sensor: 'd'},
  {position: 12, length: 0.1, sensor: 'd'},
  {position: 13, length: 0.1, sensor: 'd'},
  {position: 14, length: 0.1, sensor: 'd'},
  {position: 15, length: 0.1, sensor: 'd'},
  {position: 16, length: 0.1, sensor: 'd'},
]

bopper.setTempo(tempo);

}

// I mean really put all of this into an init() function ok
setTimeout(function(){
  bopper.start();
  console.log('bopperstart');
  $('#stopMusic').click(function() {
      bopper.stop();
      clearInterval(restartLoop);
  });

  $('#getPos').click(function() {
      console.log('curPos: ' + bopper.getCurrentPosition());
  });

  $('#playSound').click(function() {
      //playSound(assets[0], 0);
      console.log(assets);
  });

  // let's go freestyle!
  $('#freeStyle').click(function() {
      if(!freestyle) {
        freestyle = true;
      } else {
        freestyle = false;
      }
      console.log('freestyle: ' + freestyle);
  });

  // change voices!!
  $('.changeMode').click(function(e) {
    var newMode = e.target.id.substr(0, e.target.id.length-4);
    console.log('newMode'+newMode);
    currentVoice = newMode;
  });

}, 500);

// we need to figure out when to restart the loop!
// bpm / 60 = beats per second
// amount of beats / beats per second = duration of loop in seconds
// duration of loop * 1000 = duration in milliseconds
barLength = (bar / (tempo / 60)) * 1000;

var restartLoop = setInterval(function(){
  bopper.restart();
  console.log('restarting!', playback);
}, barLength);
