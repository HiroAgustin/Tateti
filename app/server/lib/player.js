(function ()
{
  'use strict';

  var _ = require('underscore')

    , Player = function Player (options)
      {
        this.socket = options.socket;
        this.game = options.game;
        this.id = options.id;

        this.init();
      };

  _.extend(Player.prototype, {

    init: function ()
    {
      return this.addListeners().setPlayerId();
    }

  , addListeners: function ()
    {
      var socket = this.socket;

      socket.on('select', this.select.bind(this));

      return this;
    }

  , setPlayerId: function ()
    {
      this.socket.emit('setPlayerId', this.id);
    }

  , select: function (tile)
    {
      this.game.selectTile({
        player: this
      , tile: tile
      });

      return this;
    }
  });

  module.exports = Player;

}());
