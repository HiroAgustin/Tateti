(function ()
{
  'use strict';

  var app = module.exports = require('express')();

  // Set default node environment to development
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  app.server = require('http').Server(app);

  app.use(require('express-session')({
    secret: 'tateti'
  , resave: true
  , saveUninitialized: true
  }));

  require('./config')(app);

  require('./controllers/start')(app);

  require('./controllers/landing')(app);

  app.server.listen(process.env.PORT || 8080);

}());
