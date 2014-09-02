'use strict';

module.exports = function (grunt)
{
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

	,	yeoman: {
			// configurable paths
			client: 'client'
		,	dist: 'dist'
		}

	,	express: {
			options: {
				port: process.env.PORT || 9000
			}
		,	dev: {
				options: {
					script: 'server'
				,	delay: 5
				}
			}
		,	prod: {
				options: {
					script: 'dist/server'
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

			jsTest: {
				files: []
			,	tasks: ['newer:jshint:all']
			}

		,	sass: {
				files: ['<%= yeoman.client %>/{styles}/**/*.{scss,sass}']
			,	tasks: ['sass', 'autoprefixer']
			}

		,	gruntfile: {
				files: ['Gruntfile.js']
			}

		,	livereload: {
				files: [
					'{.tmp,<%= yeoman.client %>}/**/*.html'
				,	'{.tmp,<%= yeoman.client %>}/{styles}/**/*.css'
				,	'{.tmp,<%= yeoman.client %>}/{scripts}/**/*.js'
				,	'<%= yeoman.client %>/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			,	options: {
					livereload: true
				}
			}

		,	express: {
				files: ['server/**/*.{js,json}']
			,	tasks: ['express:dev', 'wait']
			,	options: {
					livereload: true
					// Without this option specified express won't be reloaded
				,	spawn: false
				}
			}
		}

		// Make sure code styles are up to par and there are no obvious mistakes
	,	jshint: {
			options: {
				jshintrc: '<%= yeoman.client %>/.jshintrc'
			,	reporter: require('jshint-stylish')
			}
		,	server: {
				options: {
					jshintrc: 'server/.jshintrc'
				}
			,	src: [
					'server/**/*.js'
				]
			}
		,	all: [
				'<%= yeoman.client %>/{scripts}/**/*.js'
			]
		}


		// Empties folders to start fresh
	,	clean: {
			dist: {
				files: [{
					dot: true
				,	src: [
						'.tmp'
					,	'<%= yeoman.dist %>/*'
					,	'!<%= yeoman.dist %>/.git*'
					,	'!<%= yeoman.dist %>/Procfile'
					]
				}]
			}
		,	server: '.tmp'
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

		// Debugging with node inspector
	,	'node-inspector': {
			custom: {
				options: {
					'web-host': 'localhost'
				}
			}
		}

		// Use nodemon to run server in debug mode with an initial breakpoint
	,	nodemon: {
			debug: {
				script: 'server'
			,	options: {
					nodeArgs: ['--debug-brk']
				,	env: {
						PORT: process.env.PORT || 9000
					}
				,	callback: function (nodemon)
					{
						nodemon.on('log', function (event)
						{
							console.log(event.colour);
						});

						// opens browser on initial server start
						nodemon.on('config:update', function ()
						{
							setTimeout(function ()
							{
								require('open')('http://localhost:8080/debug?port=5858');
							}, 500);
						});
					}
				}
			}
		}

		// Automatically inject Bower components into the app
	,	wiredep: {
			target: {
				src: '<%= yeoman.client %>/index.html'
			,	ignorePath: '<%= yeoman.client %>/'
			,	exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap.css/, /font-awesome.css/ ]
			}
		}

		// Renames files for browser caching purposes
	,	rev: {
			dist: {
				files: {
					src: [
						'<%= yeoman.dist %>/public/{,*/}*.js'
					,	'<%= yeoman.dist %>/public/{,*/}*.css'
					,	'<%= yeoman.dist %>/public/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
					,	'<%= yeoman.dist %>/public/assets/fonts/*'
					]
				}
			}
		}

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
	,	useminPrepare: {
			options: {
				dest: '<%= yeoman.dist %>/public'
			}
		,	html: ['<%= yeoman.client %>/index.html']
		}

		// Performs rewrites based on rev and the useminPrepare configuration
	,	usemin: {
			html: ['<%= yeoman.dist %>/public/{,*/}*.html']
		,	css: ['<%= yeoman.dist %>/public/styles/{,*/}*.css']
		,	js: ['<%= yeoman.dist %>/public/scripts/{,*/}*.js']
		,	options: {
				assetsDirs: [
					'<%= yeoman.dist %>/public'
				,	'<%= yeoman.dist %>/public/assets/images'
				]
				// This is so we update image references in our ng-templates
			,	patterns: {
					js: [
						[/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
					]
				}
			}
		}

		// The following *-min tasks produce minified files in the dist folder
	,	imagemin: {
			dist: {
				files: [{
					expand: true
				,	cwd: '<%= yeoman.client %>/assets/images'
				,	src: '{,*/}*.{png,jpg,jpeg,gif}'
				,	dest: '<%= yeoman.dist %>/public/assets/images'
				}]
			}
		}

	,	svgmin: {
			dist: {
				files: [{
					expand: true
				,	cwd: '<%= yeoman.client %>/assets/images'
				,	src: '{,*/}*.svg'
				,	dest: '<%= yeoman.dist %>/public/assets/images'
				}]
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
				,	cwd: '<%= yeoman.dist %>/public'
				,	src: '{,*/}*.html'
				,	dest: '<%= yeoman.dist %>/public'
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
					,	cwd: '<%= yeoman.client %>'
					,	dest: '<%= yeoman.dist %>/public'
					,	src: [
							'*.{ico,png,txt}'
						// ,	'bower_components/**/*'
						,	'assets/images/{,*/}*.{webp}'
						,	'assets/fonts/**/*'
						,	'index.html'
						]
					}
				,	{
						expand: true
					,	cwd: '.tmp/images'
					,	dest: '<%= yeoman.dist %>/public/assets/images'
					,	src: ['generated/*']
					}
				,	{
						expand: true
					,	dest: '<%= yeoman.dist %>'
					,	src: [
							'package.json'
						,	'server/**/*'
						]
					}
				]
			}
		,	styles: {
				expand: true
			,	cwd: '<%= yeoman.client %>/styles'
			,	dest: '.tmp/styles/'
			,	src: '{,*/}*.css'
			}
		}

	,	buildcontrol: {
			options: {
				dir: 'dist'
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

		// Run some tasks in parallel to speed up the build process
	,	concurrent: {
			server: ['sass']
		,	test: ['sass']
		,	debug: {
				tasks: [
					'nodemon'
				,	'node-inspector'
				]
			,	options: {
					logConcurrentOutput: true
				}
			}
		,	dist: [
				'sass'
			,	'imagemin'
			,	'svgmin'
			]
		}

	,	env: {
			test: {
				NODE_ENV: 'test'
			}
		,	prod: {
				NODE_ENV: 'production'
			}
		,	all: {
				DOMAIN: 'http://localhost:9000'
			}
		}

		// Compiles Sass to CSS
	,	sass: {
			server: {
				options: {
					loadPath: [
						'<%= yeoman.client %>/bower_components'
					,	'<%= yeoman.client %>/styles'
					]
				,	compass: false
				}
			,	files: {
					'.tmp/styles/styles.css': '<%= yeoman.client %>/styles/styles.scss'
				}
			}
		}
	});

	// Used for delaying livereload until after server has restarted
	grunt.registerTask('wait', function ()
	{
		grunt.log.ok('Waiting for server reload...');

		var done = this.async();

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

	grunt.registerTask('serve', function (target)
	{
		if (target === 'dist')
		{
			return grunt.task.run([
				'build'
			,	'env:all'
			,	'env:prod'
			,	'express:prod'
			,	'wait'
			,	'open'
			,	'express-keepalive'
			]);
		}

		if (target === 'debug')
		{
			return grunt.task.run([
				'clean:server'
			,	'env:all'
			,	'concurrent:server'
			// ,	'wiredep'
			,	'autoprefixer'
			,	'concurrent:debug'
			]);
		}

		grunt.task.run([
			'clean:server'
		,	'env:all'
		,	'concurrent:server'
		// ,	'wiredep'
		,	'autoprefixer'
		,	'express:dev'
		,	'wait'
		,	'open'
		,	'watch'
		]);
	});

	grunt.registerTask('build', [
		'clean:dist'
	,	'concurrent:dist'
	// ,	'wiredep'
	,	'useminPrepare'
	,	'concat'
  ,	'uglify'
  ,	'cssmin'
	,	'autoprefixer'
	,	'copy:dist'
	,	'rev'
	,	'usemin'
	,	'htmlmin'
	]);

	grunt.registerTask('default', [
		'newer:jshint',
		'build'
	]);
};
