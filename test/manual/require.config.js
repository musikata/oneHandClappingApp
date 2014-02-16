require.config({
  paths: {
    text: 'bower_components' + '/requirejs-text/text',
    jquery: 'bower_components' + '/jquery/dist/jquery',
    backbone: 'bower_components' + '/backbone/backbone',
    underscore: 'bower_components' + '/underscore/underscore',
    marionette: 'bower_components' + '/marionette/lib/core/amd/backbone.marionette',
    'backbone.wreqr': 'bower_components' + '/backbone.wreqr/lib/amd/backbone.wreqr',
    'backbone.babysitter': 'bower_components' + '/backbone.babysitter/lib/amd/backbone.babysitter',
    handlebars: 'bower_components' + '/handlebars/handlebars',
  },
  packages: [
    {name: 'app', location: 'src'},
    {name: 'deck', location: 'bower_components' + '/musikata.deck/src'},
  ],

  shim: {
    'handlebars': {
      exports: 'Handlebars'
    },
  }
});
