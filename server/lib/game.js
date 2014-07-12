var Player = require('./player')

,   Game = function Game (options)
    {
        this.id = options.id;
        this.server = options.server;

        this.init();
    };

Game.prototype = {

    init: function ()
    {
        this.players = [];

        return this;
    }

,   broadcast: function (key, message)
    {
        this.server.to(this.id).emit(key, message);

        return this;
    }

,   isFull: function ()
    {
        return this.players.length >= 2;
    }

,   addPlayer: function (socket)
    {
        var players = this.players
        ,   player = new Player(socket, this.id);

        players.push(player);

        player.setPlayerNumber(players.length);

        if (players.length === 2)
            this.broadcast('ready');

        return this;
    }
};

module.exports = Game;