define(function(require){
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var Handlebars = require('handlebars');

  var ModelFactory = require('deck/ModelFactory');
  var ViewFactory = require('deck/ViewFactory');
  var HtmlView = require('deck/HtmlView');
  var SelectorView = require('deck/SelectorView');
  var CompositeModel = require('deck/CompositeModel');
  var CompositeView = require('deck/CompositeView');
  var DeckModel = require('deck/DeckModel');
  var SlideModel = require('deck/SlideModel');
  var ExerciseSlideModel = require('deck/ExerciseSlideModel');
  var MusikataExerciseRunnerModel = require('deck/MusikataExerciseRunnerModel');
  var MusikataExerciseRunnerView = require('deck/MusikataExerciseRunnerView');

  var FeelTheBeatExerciseSlideView = require('./FeelTheBeatExerciseSlideView');

  var AudioManager = require('audioManager/AudioManager');
  var AudioContext = require('audioManager/AudioContext');

  var FeelTheBeatApp = function(options){
    this.options = options;

    var appConfig = options.appConfig;

    /*
     * Setup audioManager.
     */
    this.audioManager = new AudioManager({
      audioContext: AudioContext
    });

    // Load samples.
    var samples = [
      {id: 'FeelTheBeat:beat', url: 'samples/med.mp3'},
      {id: 'FeelTheBeat:tap', url: 'samples/high.mp3'}
    ];
    _.each(samples, _.bind(function(sample){
      this.audioManager.loadSample(sample);
    }, this));

    // Start audio timer.
    AudioContext.createGain();

    /*
     * Setup factories.
     */

    // Model factory.
    this.modelFactory = new ModelFactory();
    this.modelFactory.addHandler('html', SlideModel);
    this.modelFactory.addHandler('selector', SlideModel);
    this.modelFactory.addHandler('composite', CompositeModel);
    this.modelFactory.addHandler('feelTheBeat', ExerciseSlideModel);

    // View factory.
    this.viewFactory = new ViewFactory();
    this.viewFactory.addHandler('html', function(options){
      return new HtmlView(options);
    });
    this.viewFactory.addHandler('selector', function(options){
      return new SelectorView(options);
    });
    this.viewFactory.addHandler('composite', _.bind(function(options){
      return new CompositeView(
        _.extend({viewFactory: this.viewFactory}, options));
    }, this));

    this.viewFactory.addHandler('feelTheBeat', _.bind(function(options){
      mergedOptions = _.extend({}, options);
      mergedOptions.exerciseOptions = _.extend({
        audioManager: this.audioManager,
      }, mergedOptions.exerciseOptions);
      return new FeelTheBeatExerciseSlideView(mergedOptions);
    }, this));

    /* 
     * Setup models.
     */
    var deckModelOptions = {
      parse: true,
      modelFactory: this.modelFactory
    };
    var introDeckModel = new DeckModel(
      { slides: appConfig.introSlides }, 
      deckModelOptions
    );

    var exerciseDeckModel = new DeckModel(
      { slides: appConfig.exerciseSlides },
      deckModelOptions
    );

    this.runnerModel = new MusikataExerciseRunnerModel({
      introDeck: introDeckModel,
      exerciseDeck: exerciseDeckModel,
      destination: options.destination
    });

    this.runnerView = new MusikataExerciseRunnerView({
      el: options.el,
      model: this.runnerModel,
      viewFactory: this.viewFactory
    });
    this.runnerView.render();
  };

  return FeelTheBeatApp;
});
