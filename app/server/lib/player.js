(function ()
{
  'use strict';

  var _ = require('underscore')

    , Player = function Player (options)
      {
        this.socket = options.socket;
        this.game = options.game;
        this.id = options.id;
        this.tiles = [];

        this.init();
      };

  _.extend(Player.prototype, {

    init: function ()
    {
      return this.addListeners().setPlayerId();
    }

  , addListeners: function ()
    {
      this.socket
        .on('select', this.select.bind(this))
        .on('setName', this.setName.bind(this));

      return this;
    }

  , setPlayerId: function ()
    {
      return this.emit('setPlayerId', this.id);
    }

  , emit: function (key, message)
    {
      this.socket.emit(key, message);

      return this;
    }

  , broadcast: function (key, message)
    {
      this.socket.broadcast.emit(key, message);

      return this;
    }

  , setName: function (name)
    {
      this.name = name;

      return this;
    }

  , select: function (tile)
    {
      this.tiles.push(tile);
      this.game.selectTile(tile);

      return this;
    }
  });

  module.exports = Player;

}());
