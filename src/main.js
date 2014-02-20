var appConfig = {
  introSlides: [
    {type: 'selector', selector: '#introSlide-1'},
  ],
  exerciseSlides: [
    {type: 'feelTheBeat', bpm: 90, length: 4, threshold: .4, maxFailedBeats: 1},
    {type: 'feelTheBeat', bpm: 60, length: 4, threshold: .2, maxFailedBeats: 2},
    {type: 'feelTheBeat', bpm: 120, length: 8, threshold: .3, maxFailedBeats: 4},
    {type: 'feelTheBeat', bpm: 90, length: 6, threshold: .1, maxFailedBeats: 0}
  ],
  goToFeedback: function(){
    window.open('https://docs.google.com/a/musikata.com/forms/d/1tpVhCC6WDwYvE-HdOhrDCM4wetivLsJcwg8p3OxeJCo/viewform');
  },
  goToHome: function(){
    window.location.href = 'http://musikata.com';
  }
};

// Feature test some stuff
var features = {
  webAudio: window.AudioContext || window.webkitAudioContext,
  flexbox: Modernizr.flexbox || Modernizr.flexboxlegacy
};

// If web audio support, load app.
var mainScript = (features.webAudio && features.flexbox) ? 'app.js' : 'unsupported.js';

// The async script injection fanfare
var script = document.createElement('script');
var fScript = document.getElementsByTagName('script')[0];

// Set the URL on the script
script.src = 'js/' + mainScript;

// Inject the script
fScript.parentNode.insertBefore(script, fScript);

