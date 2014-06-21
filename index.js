var express = require('express')
,   app = module.exports = express()

,   http = require('http').Server(app)
,   io = require('socket.io')(http)

,   bodyParser = require('body-parser')
,   compression = require('compression');

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname));

io.on('connection', function (socket)
{
    console.log('a user connected');

    socket
        .on('disconnect', function ()
        {
            console.log('user disconnected');
        })
        .on('chat', function (msg)
        {
            console.log(msg);
        });
});

http.listen(process.env.PORT || 8080);