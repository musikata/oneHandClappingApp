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

var _ = require('lodash');

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
          'build/tmp/app.css': 'bower_components/musikata.theme/scss/app.scss'
        }
      }
    },

    concat: {
      css: {
        src: [
          'build/tmp/app.css',
          'src/local.css'
        ],
        dest: 'build/css/app.css',
      }
    },

    autoprefixer: {
      compiledTheme: {
        src: 'build/css/app.css',
        dest: 'build/css/app.css'
      }
    },

    cssmin: {
      theme: {
        files: {
          'build/css/app.css': ['build/css/app.css']
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
      },

    },

    uglify: {
      modernizr: {
        files: {
          'build/js/modernizr.min.js': ['bower_components/modernizr/modernizr.js']
        }
      },
    },

    requirejs: {
      app: {
        options: _.merge({}, commonRequireConfig, {
          out: 'build/js/app.js',
          name: 'almond',
          include: ['app/feelTheBeat_main'],
          insertRequire: ['app/feelTheBeat_main'],
        })
      },
      unsupported: {
        options: _.merge({}, commonRequireConfig, {
          paths: {
            jquery: 'bower_components' + '/jquery-1.9.1/index',
          },
          out: 'build/js/unsupported.js',
          name: 'almond',
          include: ['app/unsupported_main'],
          insertRequire: ['app/unsupported_main'],
        })
      }
    },

    clean: {
      tmp: ['build/tmp']
    }

  });

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('buildTheme', [
    'sass',
    'concat',
    'autoprefixer',
    'copy:theme',
  ]);

  grunt.registerTask('build', [
    'buildTheme',
    'copy:samples',
    'copy:index',
    'requirejs',
    'uglify',
    'cssmin',
    'clean:tmp'
  ]);
}
