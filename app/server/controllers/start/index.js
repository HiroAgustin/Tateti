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
      var session = req.session
        , id = shortId.generate()
        , matches = app.matches;

      session.flow = '/start';

      if (!session.name)
      {
        return res.redirect('/name');
      }

      while (~id.indexOf('-') || matches[id])
        id = shortId.generate();

      matches[id] = new Game({
        server: io.of('/' + id)
      , size: 3
      });

      res.redirect('/play/' + id);
    });
  };

}());
