(function ()
{
  'use strict';

  module.exports = function (app)
  {
    app.get('/', function (req, res)
    {
      res.render('pages/home');
    });

    app.get('/name', function (req, res)
    {
      res.render('pages/name', {
        name: req.session.name
      });
    });

    app.post('/name', function (req, res)
    {
      var session = req.session;

      session.name = req.body.name;

      res.redirect(session.flow);
    });

    app.get('/join', function (req, res)
    {
      var session = req.session;

      session.flow = '/join';

      if (session.name)
        res.render('pages/join');
      else
        res.redirect('/name');
    });

    app.post('/play', function (req, res)
    {
      res.redirect('/play/' + req.body.id);
    });

    app.param('game', function (req, res, next, game)
    {
      if (app.matches[game])
        req.game = game;

      next();
    });

    app.get('/play/:game', function (req, res)
    {
      var session = req.session
        , name = session.name;

      if (name)
        return res.render('pages/play', {
          id: req.game
        , name: name
        });

      if (!session.flow)
        session.flow = req.path;

      res.redirect('/name');
    });
  };

}());
