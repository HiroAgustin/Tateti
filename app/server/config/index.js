(function (path, ejs, express, favicon, bodyParser, compression, errorHandler)
{
	'use strict';

	var root = path.normalize(__dirname + '/../..');

	module.exports = function (app)
	{
		app.set('view engine', 'ejs');
		app.engine('html', ejs.renderFile);
		app.set('views', root + '/server/views');

		app.use(compression());
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({
			extended: false
		}));

		app.use(favicon(path.join(root, 'public', 'favicon.ico')));

		if (app.get('env') === 'development')
			app.use(express.static(path.join(root, '../.tmp')));

		app.use(express.static(path.join(root, 'public')));

		app.use(errorHandler());
	};

}(require('path'), require('ejs'), require('express'), require('serve-favicon'), require('body-parser'), require('compression'), require('errorhandler')));
