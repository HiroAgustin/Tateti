(function (express, http, session)
{
  'use strict';

  var app = module.exports = express();

  // Set default node environment to development
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  app.server = http.Server(app);

  app.use(session({
    secret: 'tateti'
  , resave: true
  , saveUninitialized: true
  }));

  require('./config')(app);

  require('./controllers/start')(app);

  require('./controllers/landing')(app);

  app.server.listen(process.env.PORT || 8080);

}(require('express'), require('http'), require('express-session')));
