var path = require('path')
	,	express = require('express')
	,	favicon = require('serve-favicon')
	,	bodyParser = require('body-parser')
	,	compression = require('compression')
	,	errorHandler = require('errorhandler')
	,	root = path.normalize(__dirname + '/../..');

module.exports = function (app)
{
	'use strict';

	var env = app.get('env');

	app.set('view engine', 'ejs');
	app.engine('html', require('ejs').renderFile);
	app.set('views', root + '/server/views');

	app.use(compression());

	app.use(bodyParser.json());

	app.use(bodyParser.urlencoded({
		extended: false
	}));

	app.use(favicon(path.join(root, 'public', 'favicon.ico')));

	if (env === 'development')
	{
		app.use(express.static(path.join(root, '../.tmp')));
	}

	app.use(express.static(path.join(root, 'public')));

	app.use(errorHandler());
};
