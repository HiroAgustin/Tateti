var express = require('express')
,   app = module.exports = express()

,   http = require('http').Server(app)
,   io = require('socket.io')(http)

,   bodyParser = require('body-parser')
,   compression = require('compression')

,   Game = require('./lib/game')
,   current = null
,   counter = 0;

app.use(compression());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/../'));

io.on('connection', function (socket)
{
    if (!current || current.isFull())
        current = new Game({
            id: counter++
        ,   server: io
        });

    current.addPlayer(socket);
});

http.listen(process.env.PORT || 8080);