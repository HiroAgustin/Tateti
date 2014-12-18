;(function (win, doc, s, js, fjs, inc, ga)
{
  'use strict';

  fjs = doc.getElementsByTagName(s)[0];

  inc = function (src)
  {
    js = doc.createElement(s);
    js.src = src;
    js.async = 1;
    fjs.parentNode.insertBefore(js, fjs);
  };

  // <!-- Google Analytics -->
  inc('//www.google-analytics.com/analytics.js');

  win.GoogleAnalyticsObject = 'ga';

  ga = win.ga = function ()
  {
    (win.ga.q = win.ga.q || []).push(arguments);
  };

  ga.l = 1 * new Date();

  ga('create', 'UA-57791447-1', 'auto');
  ga('send', 'pageview');
  // <!-- End Google Analytics -->

}(window, document, 'script'));
