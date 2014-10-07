module.exports = function (grunt)
{
  'use strict';

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server'
  ,	useminPrepare: 'grunt-usemin'
  ,	buildcontrol: 'grunt-build-control'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    pkg: grunt.file.readJSON('package.json')

  , config: {
      app: {
        client: 'app/public'
      , server: 'app/server'
      }
    , dist: 'dist'
    }

    // Add vendor prefixed styles
  ,	autoprefixer: {
      options: {
        browsers: ['last 1 version']
      }
    ,	dist: {
        files: [{
          expand: true
        ,	cwd: '.tmp/'
        ,	src: '{,*/}*.css'
        ,	dest: '.tmp/'
        }]
      }
    }

    // Empties folders to start fresh
  ,	clean: {
      dist: {
        files: [{
          dot: true
        ,	src: [
            '.tmp'
          ,	'<%= config.dist %>/*'
          ,	'!<%= config.dist %>/.git*'
          ]
        }]
      }
    ,	server: '.tmp'
    }


    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
  ,	useminPrepare: {
      options: {
        dest: '<%= config.dist %>/public'
      }
    ,	html: ['<%= config.app.client %>/{,*/}*.html']
    }

  , filerev: {
      options: {
        algorithm: 'md5'
      , length: 8
      }
    , dist: {
        src: '<%= config.dist %>/public/**/*.{css,js}'
      }
    }

    // Performs rewrites based on rev and the useminPrepare configuration
  ,	usemin: {
      html: ['<%= config.dist %>/public/{,*/}*.html']
    ,	css: ['<%= config.dist %>/public/styles/{,*/}*.css']
    ,	js: ['<%= config.dist %>/public/scripts/{,*/}*.js']
    ,	options: {
        assetsDirs: [
          '<%= config.dist %>/public'
        ,	'<%= config.dist %>/public/images'
        ]
        // This is so we update image references in our ng-templates
      ,	patterns: {
          js: [
            [/(images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    }

  ,	htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true
        ,	collapseWhitespace: true
        ,	removeAttributeQuotes: true
        ,	removeCommentsFromCDATA: true
        ,	removeEmptyAttributes: true
        ,	removeOptionalTags: true
        ,	removeRedundantAttributes: true
        ,	useShortDoctype: true
        }
      ,	files: [{
          expand: true
        ,	cwd: '<%= config.dist %>/public'
        ,	src: '{,*/}*.html'
        ,	dest: '<%= config.dist %>/public'
        }]
      }
    }

    // Copies remaining files to places other tasks can use
  ,	copy: {
      dist: {
        files: [
          {
            expand: true
          ,	dot: true
          ,	cwd: '<%= config.app.client %>'
          ,	dest: '<%= config.dist %>/public'
          ,	src: [
              '*.{ico,png,txt}'
            ,	'images/{,*/}*.{webp}'
            ,	'styles/fonts/**/*'
            ,	'index.html'
            ]
          }
        ,	{
            expand: true
          ,	cwd: '.tmp/images'
          ,	dest: '<%= config.dist %>/public/images'
          ,	src: ['generated/*']
          }
        ,	{
            expand: true
          ,	cwd: '<%= config.app.server %>'
          ,	dest: '<%= config.dist %>/server/'
          , src: ['**']
          }
        ,	{
            expand: true
          ,	dest: '<%= config.dist %>'
          ,	src: [
              'package.json'
            ,	'Procfile'
            ]
          }
        ]
      }
    }

    // Renames files for browser caching purposes
  ,	rev: {
      dist: {
        files: {
          src: [
            '<%= config.dist %>/public/{,*/}*.js'
          ,	'<%= config.dist %>/public/{,*/}*.css'
          ,	'<%= config.dist %>/public/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          ,	'<%= config.dist %>/public/styles/fonts/*'
          ]
        }
      }
    }

    // Make sure code styles are up to par and there are no obvious mistakes
  ,	jshint: {
      options: {
        jshintrc: true
      ,	reporter: require('jshint-stylish')
      }
    ,	all: [
        'Gruntfile.js', '<%= config.app.client %>/scripts/*.js', '<%= config.app.server %>/**/*.js'
      ]
    }

  ,	express: {
      options: {
        port: 9000
      }
    ,	dev: {
        options: {
          script: '<%= config.app.server %>'
        ,	delay: 5
        }
      }
    }

  ,	open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    }

  ,	watch: {

      compass: {
        files: ['<%= config.app.client %>/styles/{,*/}*.{scss,sass}']
      ,	tasks: ['compass', 'autoprefixer']
      }

    , gruntfile: {
        files: ['Gruntfile.js']
      }

    ,	livereload: {
        options: {
          livereload: true
        }
      ,	files: [
          '<%= config.app.client %>/{,*/}*.html'
        ,	'.tmp/styles/{,*/}*.css'
        ,	'<%= config.app.client %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }

    ,	express: {
        files: ['<%= config.app.server %>/**/*.{js,json}']
      ,	tasks: ['express:dev', 'wait']
      ,	options: {
          livereload: true
          // Without this option specified express won't be reloaded
        ,	spawn: false
        }
      }
    }

    // Compiles Sass to CSS and generates necessary files if requested
  ,	compass: {

      options: {
        sassDir: '<%= config.app.client %>/styles'
      ,	cssDir: '.tmp/styles'
      ,	generatedImagesDir: '.tmp/images/generated'
      ,	imagesDir: '<%= config.app.client %>/images'
      ,	javascriptsDir: '<%= config.app.client %>/scripts'
      ,	fontsDir: '<%= config.app.client %>/styles/fonts'
      ,	importPath: '<%= config.app.client %>/bower_components'
      ,	httpImagesPath: '<%= config.app.client %>/images'
      ,	httpGeneratedImagesPath: '<%= config.app.client %>/images/generated'
      ,	httpFontsPath: '<%= config.app.client %>/styles/fonts'
      ,	relativeAssets: false
      ,	assetCacheBuster: false
      ,	raw: 'Sass::Script::Number.precision = 10\n'
      }

    , server: {
        options: {
          debugInfo: true
        }
      }
    }

  , uncss: {
      dist: {
        files: {
          '<%= config.dist %>/public/styles/main.css': ['<%= config.dist %>/public/index.html', '<%= config.dist %>/public/sample.html']
        }
      }
    }

  ,	buildcontrol: {

      options: {
        dir: '<%= config.dist %>'
      ,	commit: true
      ,	push: true
      ,	connectCommits: false
      ,	message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      }

    ,	heroku: {
        options: {
          remote: 'git@heroku.com:tatetito.git'
        ,	branch: 'master'
        }
      }
    }
  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function ()
  {
    var done = this.async();

    grunt.log.ok('Waiting for server reload...');

    setTimeout(function ()
    {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function ()
  {
    this.async();
  });

  grunt.registerTask('serve', function ()
  {
    grunt.task.run([
      'clean:server'
    , 'compass'
    ,	'autoprefixer'
    , 'express:dev'
    ,	'wait'
    ,	'open'
    ,	'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist'
  , 'useminPrepare'
  , 'compass'
  , 'autoprefixer'
  ,	'copy:dist'
  , 'concat:generated'
  , 'cssmin:generated'
  , 'uglify:generated'
  , 'uncss'
  , 'filerev'
  , 'usemin'
  ,	'htmlmin'
  ]);

  grunt.registerTask('deploy', [
    'build'
  ,	'buildcontrol'
  ]);
};
