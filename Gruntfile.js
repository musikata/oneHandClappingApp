/* 
 * Goal of grunt build is to produce a standalone directory like this:
 * /app
 * - index.html
 * - build_xxx.js
 * - sounds/
 * -- high.mp3
 * -- ...
 * - img/
 * -- bg.png
 * -- drum.png
 * -- ...
 * - app.css
 * - font/
 * -- font.otf
 * -- ...
 *
 * Steps to do this include:
 * - compiling CSS, copying
 * - building js, copying
 * - copying assets
 */

var _ = require('underscore');

module.exports = function(grunt){

  grunt.file.mkdir('build/js');

  var commonRequireConfig = {
    findNestedDependencies: true,
    generateSourceMaps: true,
    preserveLicenseComments: false,
    optimize: "none",
    paths: {
      almond: 'bower_components' + '/almond/almond',
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
      {name: 'feelTheBeat', location: 'bower_components' + '/musikata.feelTheBeat/src'},
      {name: 'audioManager', location: 'bower_components' + '/musikata.audioManager/src'},
    ],

    shim: {
      'handlebars': {
        exports: 'Handlebars'
      },
    },
  };

  grunt.initConfig({

    sass: {
      theme: {
        options: {
          loadPath: [
            'bower_components/foundation/scss',
            'bower_components/musikata.theme/scss'
          ],
          style: 'compressed'
        },
        files: {
          'build/css/app.css': 'bower_components/musikata.theme/scss/app.scss'
        }
      }
    },

    copy: {
      theme: {
        cwd: 'bower_components/musikata.theme',
        src: [
          'img/**',
          'font/**'
        ],
        expand: true,
        dest: 'build/',
        flatten: false
      },

      samples: {
        src: 'samples/**',
        expand: true,
        dest: 'build/'
      },

      index: {
        cwd: 'src',
        src: [
          'index.html', 
          'main.js'
        ],
        expand: true,
        dest: 'build/'
      }
    },

    requirejs: {
      app: {
        options: _.extend({}, commonRequireConfig, {
          out: 'build/js/app.js',
          name: 'almond',
          include: ['app/feelTheBeat_main'],
          insertRequire: ['app/feelTheBeat_main'],
        })
      },
      unsupported: {
        options: _.extend({}, commonRequireConfig, {
          out: 'build/js/unsupported.js',
          name: 'almond',
          include: ['app/unsupported_main'],
          insertRequire: ['app/unsupported_main'],
        })
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('build', [
    'sass',
    'copy',
    'requirejs'
  ]);
}
