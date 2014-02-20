define(function(require){
  var $ = require('jquery');
  var Backbone = require('backbone');
  var UnsupportedBrowserView = require('./UnsupportedBrowserView');
  var NavigationView = require('deck/NavigationView');

  var UnsupportedBrowserApp = function(options){

    var appConfig = options.appConfig;

    var view = new UnsupportedBrowserView({
      className: 'unsupported-browser-view',
    }).render();
    $('.app-body').html('');
    $('.app-body').append(view.el);

    var navView = new NavigationView({
      collection: new Backbone.Collection([
        new Backbone.Model({
        eventId: 'feedback',
        label: 'leave feedback'
      }),
      new Backbone.Model({
        eventId: 'home',
        label: 'return home'
      })
      ])
    });
    navView.render();
    navView.on('button:clicked', function(buttonView, eventId){
      if (eventId === 'feedback'){
        appConfig.goToFeedback();
      }
      else if (eventId === 'home'){
        appConfig.goToHome();
      }
    });

    $('.app-footer').append(navView.el);
  };

  return UnsupportedBrowserApp;
});
