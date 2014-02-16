(function () {
  // Feature test some stuff
  var features = {
    webAudio: window.AudioContext || window.webkitAudioContext
  };

  // If web audio support, load app.
  var mainScript = (features.webAudio) ? 'app.js' : 'unsupported.js';

  // The async script injection fanfare
  var script = document.createElement('script');
  var fScript = document.getElementsByTagName('script')[0];

  // Set the URL on the script
  script.src = 'js/' + mainScript;

  // Inject the script
  fScript.parentNode.insertBefore(script, fScript);

})();
