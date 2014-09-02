// Server configuration

'use strict';

var path = require('path')
	,	express = require('express')
	,	favicon = require('serve-favicon')
	,	bodyParser = require('body-parser')
	,	compression = require('compression')
	,	errorHandler = require('errorhandler')
	,	root = path.normalize(__dirname + '/../..');

module.exports = function (app)
{
	var env = app.get('env');

	app.set('views', root + '/server/views');
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');

	app.use(compression());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: false
	}));

	if ('production' === env)
	{
		app.use(favicon(path.join(root, 'public', 'favicon.ico')));
		app.use(express.static(path.join(root, 'public')));
		app.set('appPath', root + '/public');
	}

	if ('development' === env || 'test' === env)
	{
		app.use(require('connect-livereload')());
		app.use(express.static(path.join(root, '.tmp')));
		app.use(express.static(path.join(root, 'client')));
		app.set('appPath', 'client');
		// Error handler - has to be last
		app.use(errorHandler());
	}
};
