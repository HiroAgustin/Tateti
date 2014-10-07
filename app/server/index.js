'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express')
  , app = module.exports = express()

  , server = require('http').Server(app)
  , io = require('socket.io')(server)

  , Game = require('./lib/game')
  , current = null
  , counter = 0;

  // ,  shortId = require('shortid');

require('./config')(app);

// console.log(shortId.generate());

app.get('/', function (req, res)
{
	res.render('home');
});

app.get('/start', function (req, res)
{
  res.render('start');
});

app.get('/join', function (req, res)
{
  res.render('join');
});

io.on('connection', function (socket)
{
  if (!current || current.isFull())
    current = new Game({
      id: counter++
    , server: io
    });

  current.addPlayer(socket);
});

server.listen(process.env.PORT || 8080);
