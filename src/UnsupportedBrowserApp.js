define(function(require){
  var $ = require('jquery');
  var Backbone = require('backbone');
  var UnsupportedBrowserView = require('./UnsupportedBrowserView');
  var NavigationView = require('deck/NavigationView');

  var UnsupportedBrowserApp = function(options){
    var view = new UnsupportedBrowserView({
      className: 'unsupported-browser-view',
    }).render();
    $('.app-body').html('');
    $('.app-body').append(view.el);

    var navView = new NavigationView({
      collection: new Backbone.Collection([
        new Backbone.Model({
        eventId: 'feedback',
        label: 'give feedback'
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
        options.onGoToFeedback();
      }
      else if (eventId === 'home'){
        options.onGoToHome();
      }
    });

    $('.app-footer').append(navView.el);
  };

  return UnsupportedBrowserApp;
});
