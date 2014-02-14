(function () {
  // Feature test some stuff
  var features = {
    //webAudio: window.AudioContext || window.webkitAudioContext
    webAudio: false
  };

  // If web audio support, load app.
  if (features.webAudio){
    console.log('spoon!');

    // The async script injection fanfare
    var script = document.createElement('script');
    var fScript = document.getElementsByTagName('script')[0];

    // Set the URL on the script
    script.src = 'js/app.js';

    // Inject the script
    fScript.parentNode.insertBefore(script, fScript);
  }

  // Otherwise if no web audio support, show message.
  else{
    // show message.
    console.log('No go, Joe.');
  }
})();
