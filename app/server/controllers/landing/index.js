(function ()
{
  'use strict';

  module.exports = function (app)
  {
    app.get('/', function (req, res)
    {
      res.render('pages/home');
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
  };

}());
