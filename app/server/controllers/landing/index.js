(function ()
{
  'use strict';

  module.exports = function (app)
  {
    app.get('/', function (req, res)
    {
      res.render('pages/home');
    });

    app.get('/join', function (req, res)
    {
      res.render('pages/join');
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
      res.render('pages/play', {
        id: req.game
      });
    });
  };

}());
