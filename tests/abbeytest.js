
// and the abbey load and all that should be in init() or something
var mybuff;
context = new webkitAudioContext();

var assets = new AbbeyLoad( [{
                 'meow0': 'sounds/meow01.mp3',
                 'meow1': 'sounds/meow02.mp3',
                 'meow2': 'sounds/meow03.mp3',
                 'meow3': 'sounds/meow04.mp3',
                 'voice0': 'sounds/voice01.mp3',
                 'voice1': 'sounds/voice02.mp3',
                 'voice2': 'sounds/voice03.mp3',
                 'voice3': 'sounds/voice04.mp3',
                 'drum0': 'sounds/drum01.mp3',
                 'drum1': 'sounds/drum02.mp3',
                 'drum2': 'sounds/drum03.mp3',
                 'drum3': 'sounds/drum04.mp3',
                 'd': 'sounds/click.mp3'
             }], function (buffers) {
                console.log(buffers.meow0);
              // instead of getbuffer it should be setupMeowShoes or something
               getbuffer(buffers);


            });

function getbuffer(buffs) {
  var source = context.createBufferSource();
  source.buffer = buffs.meow1;
  source.connect(context.destination);
  source.start(0);
}