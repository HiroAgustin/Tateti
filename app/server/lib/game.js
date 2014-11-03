;(function (_, Player)
{
  'use strict';

  var Game = function Game (options)
  {
    this.size = options.size;
    this.server = options.server;

    this.init();
  };

  _.extend(Game.prototype, {

    init: function ()
    {
      this.players = [];
      this.maxTiles = Math.pow(this.size, 2);

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

  , setTurnStatus: function (player)
    {
      var playing = this.playing;

      return playing === player ?
        'Your turn ' + player.name :
        playing.name + '\'s turn';
    }

  , setStatuses: function (callback)
    {
      this.players.forEach(function (player)
      {
        player.emit('setStatus', callback(player));
      });

      return this;
    }

  , emit: function (key, message)
    {
      this.server.emit(key, message);

      return this;
    }

  , start: function ()
    {
      this.playing = this.players[0];

      return this
        .emit('ready')
        .setStatuses(this.setTurnStatus.bind(this));
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
        .setStatuses(this.setTurnStatus.bind(this));
    }

  , setEndStatus: function (player)
    {
      var winner = this.winner
        , message = '';

      if (winner)
        message = winner === player ?
          'Congratulations! You won!' :
          'Too bad, ' + winner.name + ' defeated you.';

      else
        message = 'It\'s a tie!';

      return message;
    }

  , selectTile: function (tile)
    {
      this.playing.broadcast('select', tile);

      if (this.isGameOver())
      {
        this.setStatuses(this.setEndStatus.bind(this));
        this.emit('gameOver');
      }
      else
        this.togglePlayer();

      return this;
    }

    // Game Logic
  ,	isGameOver: function ()
    {
      return this.getWinner() || this.isATie();
    }

  , getWinner: function ()
    {
      this.winner = this.winner ||
        _.find(this.players, this.hasPlayerWon.bind(this));

      return this.winner;
    }

  , countTiles: function (memo, player)
    {
      return memo + player.tiles.length;
    }

  , isATie: function ()
    {
      this.isTied = this.isTied ||
        _.reduce(this.players, this.countTiles.bind(this), 0) === this.maxTiles;

      return this.isTied;
    }

  ,	hasPlayerWon: function (player)
    {
      var tiles = player.tiles;

      return tiles.length >= this.size && (
        this.hasRow(tiles) || this.hasColumn(tiles) ||
        this.hasLeftDiagonal(tiles) || this.hasRightDiagonal(tiles)
      );
    }

    // TODO Couldn't all of this be on the player?
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

      for (i; i < size && valid; i++)
        valid = this.hasTile(tiles, i, inverse ? size - i - 1 : i);

      return valid;
    }

  ,	hasTile: function (tiles, row, column)
    {
      return _.findWhere(tiles, {
        row: row + ''
      , column: column + ''
      });
    }
  });

  module.exports = Game;

}(require('underscore'), require('./player')));
