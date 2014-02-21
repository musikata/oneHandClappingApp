/* 
 * Goal of grunt build is to produce a standalone directory like this:
 * /app
 * - static/
 *   - index.html
 *   - js/
 *    - build_xxx.js
 *   - sounds/
 *    - high.mp3
 *   - ...
 *   - img/
 *    - bg.png
 *    - drum.png
 *   - ...
 *   - css/
 *    - app.css
 *   - font/
 *    - font.otf
 *   - ...
 *
 * Steps to do this include:
 * - compiling CSS, copying
 * - building js, copying
 * - copying assets
 */

var _ = require('lodash');
var path = require('path');

module.exports = function(grunt){

  var buildDir = 'build';
  var outputDir = path.join(buildDir, 'app');
  var tmpDir = path.join(buildDir, 'tmp');
  var staticDir = path.join(outputDir, 'static');
  var staticDirs = {root: staticDir};
  _.each(['js', 'css', 'img', 'font', 'samples'], function(subdir){
    staticDirs[subdir] = path.join(staticDir, subdir);
    grunt.file.mkdir(staticDirs[subdir]);
  });

  var appCssFile = path.join(staticDirs.css, 'app.css');

  var commonRequireConfig = {
    findNestedDependencies: true,
    generateSourceMaps: false,
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
        files: [{
          src: ['bower_components/musikata.theme/scss/app.scss'],
          dest: tmpDir + '/app.css'
        }]
      }
    },

    concat: {
      css: {
        src: [
          tmpDir + '/app.css',
          'src/local.css'
        ],
        dest: appCssFile
      }
    },

    imagemin: {
      options: {
        cache: false,
      },
      theme: {
        files: [{
          expand: true,
          cwd: 'bower_components/musikata.theme/img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: staticDirs.img,
        }],
        pngquant: true
      }
    },

    autoprefixer: {
      compiledTheme: {
        src: appCssFile,
        dest: appCssFile
      }
    },

    imageEmbed: {
      theme: {
        src: appCssFile,
        dest: appCssFile,
        options: {
          deleteAfterEncoding : false
        }
      }
    },

    cssmin: {
      theme: {
        files: [{
          src: appCssFile,
          dest: appCssFile
        }]
      }
    },

    copy: {
      theme: {
        cwd: 'bower_components/musikata.theme/font',
        src: ['**/*'],
        expand: true,
        dest: staticDirs.font,
        flatten: false
      },

      samples: {
        cwd: 'samples',
        src: '**/*',
        expand: true,
        dest: staticDirs.samples,
      },

      index: {
        cwd: 'src',
        src: [
          'index.html', 
          'feedback.html'
        ],
        expand: true,
        dest: staticDirs.root,
      },

    },

    uglify: {
      modernizr: {
        files: [{
          src: 'bower_components/modernizr/modernizr.js',
          dest: staticDirs.js + '/modernizr.min.js',
        }]
      },
    },

    requirejs: {
      app: {
        options: _.merge({}, commonRequireConfig, {
          out: staticDirs.js + '/app.js',
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
          out: staticDirs.js + '/unsupported.js',
          name: 'almond',
          include: ['app/unsupported_main'],
          insertRequire: ['app/unsupported_main'],
        })
      }
    },

    clean: {
      tmp: ['build/tmp']
    },

    watch: {
      theme: {
        files: 'bower_components/musikata.theme/**/*.scss',
        tasks: ['buildTheme'],
        options: {
          livereload: true,
        }
      }
    },

  });

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-image-embed");
  grunt.loadNpmTasks("grunt-contrib-imagemin");


  grunt.registerTask('buildTheme', [
    'sass',
    'concat',
    'imagemin',
    'autoprefixer',
    'copy:theme',
    'imageEmbed',
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
