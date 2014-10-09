(function ()
{
  'use strict';

  var _ = require('underscore')

    , Player = require('./player')

    , Game = function Game (options)
      {
        var size = this.size = options.size;

        this.maxTiles = Math.pow(size, 2);

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
      // TODO Handle Error

      return this;
    }

  , isFull: function ()
    {
      return this.players.length >= 2;
    }

  , emit: function (key, message)
    {
      this.server.emit(key, message);

      return this;
    }

  , setStatus: function (player)
    {
      player.emit('setStatus', this.playing === player ?
        'Your turn ' + player.name :
        this.playing.name + '\'s turn'
      );

      return this;
    }

  , setStatuses: function ()
    {
      this.players.forEach(this.setStatus.bind(this));

      return this;
    }

  , start: function ()
    {
      this.playing = this.players[0];

      return this.emit('ready').setStatuses();
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
        this.start();

      return this;
    }

  , togglePlayer: function ()
    {
      var players = this.players
        , index = players.indexOf(this.playing) + 1;

      this.playing = players[
        index >= players.length ? 0 : index
      ];

      return this
        .emit('togglePlayer', this.playing.id)
        .setStatuses();
    }

  , selectTile: function (tile)
    {
      this.playing.broadcast('select', tile);

      if (this.isGameOver())
        console.log('Game Over');

      else
        this.togglePlayer();

      return this;
    }

    // Game Logic
  ,	isGameOver: function ()
    {
      var winner = _.find(this.players, this.hasPlayerWon.bind(this));

      return winner || this.isTie();
    }

  , countTiles: function (memo, player)
    {
      return memo + player.tiles.length;
    }

  , isTie: function ()
    {
      console.log(_.reduce(this.players, this.countTiles.bind(this), 0));

      return _.reduce(this.players, this.countTiles.bind(this), 0) === this.maxTiles;
    }

  ,	hasPlayerWon: function (player)
    {
      var tiles = player.tiles;

      return tiles.length >= this.size && (
        this.hasRow(tiles) || this.hasColumn(tiles) ||
        this.hasLeftDiagonal(tiles) || this.hasRightDiagonal(tiles)
      );
    }

  ,	hasRow: function (tiles)
    {
      return this.hasStraight(tiles, 'row');
    }

  ,	hasColumn: function (tiles)
    {
      return this.hasStraight(tiles, 'column');
    }

  ,	hasLeftDiagonal: function (tiles)
    {
      return this.hasDiagonal(tiles);
    }

  ,	hasRightDiagonal: function (tiles)
    {
      return this.hasDiagonal(tiles, true);
    }

  ,	hasStraight: function (tiles, data)
    {
      var size = this.size
        ,	valid = false
        ,	grouped = {}
        ,	attr = null;

      tiles.forEach(function (tile)
      {
        grouped[tile[data]] = ++grouped[tile[data]] || 1;
      });

      for (attr in grouped)
        valid = valid || grouped[attr] === size;

      return valid;
    }

  ,	hasDiagonal: function (tiles, inverse)
    {
      var size = this.size
        ,	valid = true
        ,	i = 0;

      // while (i++ < size && valid)

      if (inverse)
        for (i = 0; i < size && valid; i++)
          valid = this.hasTile(tiles, i, size - i - 1);

      else
        for (i = 0; i < size && valid; i++)
          valid = this.hasTile(tiles, i, i);

      return valid;
    }

  ,	hasTile: function (tiles, row, column)
    {
      var valid = false;

      tiles.forEach(function (tile)
      {
        if (tile.row === row && tile.column === column)
          valid = true;
      });

      return valid;
    }
  });

  module.exports = Game;

}());
