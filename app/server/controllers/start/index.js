(function (shortId, socketIO)
{
  'use strict';

  var Game = require(__dirname + '/../../lib/game');

  module.exports = function (app)
  {
    var io = socketIO(app.server);

    app.matches = {};

    app.get('/start', function (req, res)
    {
      var session = req.session
        , id = shortId.generate()
        , matches = app.matches;

      session.flow = '/start';

      if (!session.name)
        return res.redirect('/name');

      while (~id.indexOf('-') || matches[id])
        id = shortId.generate();

      matches[id] = new Game({
        server: io.of('/' + id)
      , size: 3
      });

      res.redirect('/play/' + id);
    });
  };

}(require('shortid'), require('socket.io')));
