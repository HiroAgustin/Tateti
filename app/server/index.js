'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express')
  , app = module.exports = express()

  , server = require('http').Server(app)
  , io = require('socket.io')(server)

  , Game = require('./lib/game')

  , shortId = require('shortid')

  , matches = {};

require('./config')(app);

app.get('/', function (req, res)
{
	res.render('pages/home');
});

app.get('/start', function (req, res)
{
  var id = shortId.generate();

  matches[id] = new Game({
    id: id
  , server: io.of('/' + id)
  });

  res.redirect('/play?id=' + id);
});

app.get('/play', function (req, res)
{
  res.render('pages/play', {
    id: req.query.id
  });
});

app.get('/join', function (req, res)
{
  res.render('pages/join');
});

server.listen(process.env.PORT || 8080);
