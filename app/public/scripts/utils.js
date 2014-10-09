;(function (win, doc, undefined)
{
  'use strict';

  var utils = win.utils = {

    $: function $ (selector, context)
    {
      // Should check if context DOM Element
      return (context || doc).querySelectorAll(selector);
    }

  ,	forEach: function forEach (collection, callback)
    {
      return Array.prototype.forEach.call(collection, callback);
    }

  ,	on: function on (event, selector, callback)
    {
      var elements = null;

      if (selector === 'string')
        elements = utils.$(selector);
      // Should check if selector is nodeList or HTML Collection
      else if (selector.length)
        elements = selector;
      // Should check if selector is Dom Element
      else
        elements = [selector];

      return utils.forEach(elements, function (element)
      {
        element.addEventListener(event, callback);
      });
    }

  ,	listen: function listen (selector, events)
    {
      var evnt = '';

      for (evnt in events)
        utils.on(evnt, selector, events[evnt]);
    }
  };

}(window, document));
