define(function(require){
  var Marionette = require('marionette');
  var Handlebars = require('handlebars');
  var UnsupportedBrowserViewTemplate = require('text!./templates/UnsupportedBrowserView.html');

  var UnsupportedBrowserView = Marionette.ItemView.extend({
    attributes: {
      className: 'unsupported-browser-view',
    },
    template: Handlebars.compile(UnsupportedBrowserViewTemplate),
  });

  return UnsupportedBrowserView;
});
