(function ()
{
  'use strict';

  var _ = require('underscore')

    , Player = require('./player')

    , Game = function Game (options)
      {
        this.server = options.server;

        this.init();
      };

  _.extend(Game.prototype, {

    init: function ()
    {
      this.players = [];

      return this.addListeners();
    }

  , addListeners: function ()
    {
      this.server.on('connection', this.connectionHandler.bind(this));

      return this;
    }

  , connectionHandler: function (socket)
    {
      if (!this.isFull())
        this.addPlayer(socket);
      // Handle Error
    }

  , isFull: function ()
    {
      return this.players.length >= 2;
    }

  , addPlayer: function (socket)
    {
      var players = this.players;

      players.push(
        new Player({
          id: players.length + 1
        , socket: socket
        , game: this
        })
      );

      if (this.isFull())
        this.server.emit('ready');

      return this;
    }

  , selectTile: function (options)
    {
      var tile = options.tile
        , player = options.player;

      player.socket.broadcast.emit('select', {
        row: tile.row
      , column: tile.column
      , player: player.id
      });

      return this;
    }
  });

  module.exports = Game;

}());
