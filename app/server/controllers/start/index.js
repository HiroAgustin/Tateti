(function ()
{
  'use strict';

  var shortId = require('shortid')
    , Game = require(__dirname + '/../../lib/game');

  module.exports = function (app)
  {
    var io = require('socket.io')(app.server);

    app.matches = {};

    app.get('/start', function (req, res)
    {
      var id = shortId.generate();

      app.matches[id] = new Game({
        id: id
      , server: io.of('/' + id)
      });

      res.redirect('/play?id=' + id);
    });
  };

}());
